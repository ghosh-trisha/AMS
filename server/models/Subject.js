const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({ 
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    syllabusId: { type: mongoose.Schema.Types.ObjectId, ref: 'Syllabus', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema);
