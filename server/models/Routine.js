const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({ 
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Routine', routineSchema);
