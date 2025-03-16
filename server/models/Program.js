const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    levelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Level', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Program', programSchema);
