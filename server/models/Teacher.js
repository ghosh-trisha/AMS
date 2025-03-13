const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Teacher', teacherSchema);
