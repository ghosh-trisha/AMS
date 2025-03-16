const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    promote_flag: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
