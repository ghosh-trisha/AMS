const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    departmentId: { type: String, ref: 'Department', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Level', levelSchema);