const mongoose = require('mongoose');

const wasteSchema = new mongoose.Schema({
    wasteType: String,
    quantity: Number,
    hazardLevel: String,
    status: { type: String, default: 'Pending' },
    blockchainMetadata: Array,
    nftId: String,
    certificateIssued: { type: Boolean, default: false }  // Flag to indicate certificate issuance
});

const Waste = mongoose.model('Waste', wasteSchema);

module.exports = Waste;
