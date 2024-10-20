import express from 'express';
import mongoose from 'mongoose';
import { Alchemy, Network } from 'alchemy-sdk';
import dotenv from 'dotenv';
import metadata from '../public/metadata.json';  // Import metadata.json
dotenv.config();

// Initialize Express App
const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// Define the Medical Waste Schema
const wasteSchema = new mongoose.Schema({
  wasteType: String,
  quantity: Number,
  hazardLevel: String,
  status: { type: String, default: 'Pending' },
  nftId: String,  // Token ID for the NFT
  blockchainMetadata: Array,
});

const Waste = mongoose.model('Waste', wasteSchema);

// Initialize Alchemy API
const alchemySettings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};
const alchemy = new Alchemy(alchemySettings);

// Route to Add New Waste Listing
app.post('/addWaste', async (req, res) => {
  const { wasteType, quantity, hazardLevel } = req.body;

  try {
    const newWaste = new Waste({
      wasteType,
      quantity,
      hazardLevel,
    });
    await newWaste.save();
    res.status(201).json({ message: 'Waste listed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error listing waste', error });
  }
});

// Route to Mint an NFT for the Waste
app.post('/mintNFT', async (req, res) => {
  const { wasteId } = req.body;

  try {
    // Find the waste entry by ID
    const waste = await Waste.findById(wasteId);

    // Use metadata from metadata.json
    const metadataForNFT = {
      ...metadata,  // Use data from metadata.json
      attributes: [
        { trait_type: 'Waste Type', value: waste.wasteType },
        { trait_type: 'Quantity (kg)', value: waste.quantity },
        { trait_type: 'Hazard Level', value: waste.hazardLevel },
        { trait_type: 'Status', value: waste.status },
      ],
    };

    // Mint NFT using Alchemy
    const response = await alchemy.nft.mintNft({
      chain: 'matic',
      recipient: '0xRecipientAddress',  // Replace with actual wallet address
      metadata: metadataForNFT,
    });

    // Save NFT ID to the waste entry
    waste.nftId = response.data.tokenId;
    waste.blockchainMetadata = metadataForNFT.attributes;
    await waste.save();

    res.status(200).json({ message: 'NFT minted successfully', nftId: waste.nftId });
  } catch (error) {
    res.status(500).json({ message: 'Error minting NFT', error });
  }
});

// Start Server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
