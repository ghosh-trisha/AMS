const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  acceptedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher'
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending', 
    required: true 
  },
  sessionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Session', 
    required: true 
  },
  scheduleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Schedule', 
    required: true 
  },  
  subjectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject', 
    required: true 
  },
  classDate: { 
    type: Date, 
    required: true 
  },
  classAttendanceId: {
    type: String,
    ref: 'ClassAttendance',
    required: true
  }
}, { 
  timestamps: true // This will add createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Attendance', attendanceSchema);
