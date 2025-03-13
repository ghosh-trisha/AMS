const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    academicYear: { type: String, required: true },
    syllabusId: { type: String, ref: 'Syllabus', required: true },
    semesterId: { type: String, ref: 'Semester', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Session', sessionSchema);
