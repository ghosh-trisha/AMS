const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/
  },
  phone: {
    type: String,
    required: true,
    match: /^\d{10}$/
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  sessionId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true }],
  promote_flag: { type: Boolean, default: false },
  isVerified: { 
    type: Number, 
    enum: [0, 1, 2],  // 0 = Pending, 1 = Verified, 2 = Rejected
    default: 0 
  }
}, {
  timestamps: true
});

// Mongoose Hook to Hash Password Before Saving
studentSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Custom Method to Compare Password
studentSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
