const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sessionId: { type: String, ref: 'Session', required: true },
    day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    teacherId: { type: String, ref: 'Teacher', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Routine', routineSchema);
