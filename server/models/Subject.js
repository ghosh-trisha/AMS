const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    syllabusId: { type: String, ref: 'Syllabus', required: true },
    categoryId: { type: String, ref: 'Category', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema);
