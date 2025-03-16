const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
