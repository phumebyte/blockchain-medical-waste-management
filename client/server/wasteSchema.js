import mongoose from 'mongoose';

const wasteSchema = new mongoose.Schema({
  wasteType: { type: String, required: true },
  quantity: { type: Number, required: true },
  hazardLevel: { type: String, required: true },
  certifications: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  nftId: String,  // Token ID for the NFT
});

const Waste = mongoose.model('Waste', wasteSchema);

export default Waste;
