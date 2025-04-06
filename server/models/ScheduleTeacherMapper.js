const mongoose = require('mongoose');

const scheduleTeacherMapperSchema = new mongoose.Schema({
  scheduleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Schedule', 
    required: true 
  },
  teacherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher', 
    required: true 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ScheduleTeacherMapper', scheduleTeacherMapperSchema);
