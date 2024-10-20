import Waste from './mongooseSchema';

const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => console.log(error));

// Mint NFT Endpoint
app.post('/mintNFT', async (req, res) => {
    const { wasteId } = req.body;

    try {
        const waste = await Waste.findById(wasteId);
        const metadata = [
            { trait_type: 'Waste Type', value: waste.wasteType },
            { trait_type: 'Quantity (kg)', value: waste.quantity },
            { trait_type: 'Hazard Level', value: waste.hazardLevel }
        ];

        const response = await axios.post('https://api.verbwire.com/v1/nft/mint', {
            chain: 'ethereum',
            name: `Medical Waste: ${waste.wasteType}`,
            description: `Disposal of ${waste.quantity} kg of ${waste.wasteType}`,
            metadata,
            recipientAddress: '0xRecipientAddress',
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.VERBWIRE_API_KEY}`
            }
        });

        waste.nftId = response.data.tokenId;
        waste.blockchainMetadata = metadata;
        await waste.save();

        res.status(200).json({ message: 'NFT minted successfully', nftId: waste.nftId });
    } catch (error) {
        res.status(500).json({ message: 'Error minting NFT', error });
    }
});

// Burn NFT and Send Certificate
app.post('/burnNFT', async (req, res) => {
    const { wasteId } = req.body;

    try {
        const waste = await Waste.findById(wasteId);

        // Burn NFT on blockchain
        const response = await axios.post('https://api.verbwire.com/v1/nft/burn', {
            chain: 'ethereum',
            tokenId: waste.nftId,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.VERBWIRE_API_KEY}`
            }
        });

        // Mark waste as recycled and issue certificate
        waste.status = 'Recycled';
        waste.certificateIssued = true;
        await waste.save();

        res.status(200).json({ message: 'NFT burned and recycling certificate issued.' });
    } catch (error) {
        res.status(500).json({ message: 'Error burning NFT', error });
    }
});

// Server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
