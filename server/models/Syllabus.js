const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    semesterId: { type: String, ref: 'Semester', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Syllabus', syllabusSchema);
