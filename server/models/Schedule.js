const mongoose = require('mongoose');
const ScheduleTeacherMapper = require('./ScheduleTeacherMapper');

const scheduleSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
}, {
  timestamps: true
});


scheduleSchema.pre('findOneAndDelete', async function (next) {
  const doc = await this.model.findOne(this.getFilter());
  if (doc) {
    await ScheduleTeacherMapper.deleteMany({ scheduleId: doc._id });
  }
  next();
});

module.exports = mongoose.model('Schedule', scheduleSchema);
