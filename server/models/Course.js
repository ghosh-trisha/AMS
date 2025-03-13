const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    programId: { type: String, ref: 'Program', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
