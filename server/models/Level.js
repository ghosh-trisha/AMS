const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Level', levelSchema);