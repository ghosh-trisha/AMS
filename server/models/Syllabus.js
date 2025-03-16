const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({ 
    name: { type: Number, required: true, unique: true },
    semesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Syllabus', syllabusSchema);
