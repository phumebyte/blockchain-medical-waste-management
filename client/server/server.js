import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Waste from './wasteSchema.js';  // Import Mongoose schema

dotenv.config();

// Initialize Express App
const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')
).catch(err => console.log(err));

// Route to Add New Waste Listing
app.post('/addWaste', async (req, res) => {
  const { wasteType, quantity, hazardLevel, certifications } = req.body;

  try {
    const newWaste = new Waste({
      wasteType,
      quantity,
      hazardLevel,
      certifications,
      status: 'Pending'
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
    const waste = await Waste.findById(wasteId);
    // Mock logic to mint NFT (You would integrate the blockchain call here)
    const nftData = { tokenId: 'nft-1234' };
    waste.nftId = nftData.tokenId;
    await waste.save();
    res.status(200).json({ message: 'NFT minted successfully', nftId: waste.nftId });
  } catch (error) {
    res.status(500).json({ message: 'Error minting NFT', error });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
