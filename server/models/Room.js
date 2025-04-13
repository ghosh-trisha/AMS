const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    buildingId: {
        type: String,
        required: true,
        ref: 'Building',
    },
    buildingName: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
