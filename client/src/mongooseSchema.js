const mongoose = require('mongoose');

const wasteSchema = new mongoose.Schema({
    wasteType: String,
    quantity: Number,
    hazardLevel: String,
    status: { type: String, default: 'Pending' },
    blockchainMetadata: Array,  // Metadata for NFT
    nftId: String,  // Token ID from blockchain
});

const Waste = mongoose.model('Waste', wasteSchema);

export default Waste;