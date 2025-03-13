const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    courseId: { type: String, ref: 'Course', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Semester', semesterSchema);
