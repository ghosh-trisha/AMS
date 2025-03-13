const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Admin', adminSchema);
