const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    levelId: { type: String, ref: 'Level', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Program', programSchema);
