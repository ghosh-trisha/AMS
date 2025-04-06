const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({ 
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    // teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('Schedule', scheduleSchema);
