const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({ 
    // academicYear: { type: String, required: true, unique: true },
    academicYear: { 
        type: String, 
        required: true,
        match: /^\d{4}-\d{4}$/
      },
    syllabusId: { type: mongoose.Schema.Types.ObjectId, ref: 'Syllabus', required: true },
    semesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Session', sessionSchema);
