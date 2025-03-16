const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
    name: { type: Number, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Semester', semesterSchema);
