const mongoose = require("mongoose");

const classAttendanceSchema = new mongoose.Schema({
  startedBy: {
    type: String,
    ref: "Teacher",
    required: true,
  },
  subjectId: {
    type: String,
    ref: "Subject",
    required: true,
  },
  scheduleId: {
    type: String,
    ref: "Schedule",
    required: true,
  },
  sessionId: {
    type: String,
    ref: "Session",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  }
}, {
  timestamps: true  
});

module.exports = mongoose.model("ClassAttendance", classAttendanceSchema);
