import Waste from './mongooseSchema';

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const axios = require('axios');
const Waste = require('./models/Waste');

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => console.log(error));

app.listen(5000, () => {
    console.log('Server running on port 5000');
});

//VerbWire API integration
app.post('/mintNFT', async (req, res) => {
    const { wasteId } = req.body;

    try {
        // Find the waste entry by ID
        const waste = await Waste.findById(wasteId);

        // Create metadata JSON in OpenSea-friendly format
        const metadata = [
            { trait_type: 'Waste Type', value: waste.wasteType },
            { trait_type: 'Quantity (kg)', value: waste.quantity },
            { trait_type: 'Hazard Level', value: waste.hazardLevel }
        ];

        // Prepare Verbwire API request for minting the NFT
        const response = await axios.post('https://api.verbwire.com/v1/nft/mint', {
            chain: 'ethereum',  // You can change this to a different blockchain
            name: `Medical Waste: ${waste.wasteType}`,
            description: `Disposal of ${waste.quantity} kg of ${waste.wasteType}`,
            metadata,
            recipientAddress: '0xRecipientAddress',  // Replace with actual wallet address
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.VERBWIRE_API_KEY}`
            }
        });

        // Save the minted NFT token ID to the waste entry
        waste.nftId = response.data.tokenId;
        waste.blockchainMetadata = metadata;
        await waste.save();

        res.status(200).json({ message: 'NFT minted successfully', nftId: waste.nftId });
    } catch (error) {
        res.status(500).json({ message: 'Error minting NFT', error });
    }
});