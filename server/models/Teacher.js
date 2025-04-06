const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const teacherSchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: {
        type: String,
        required: true,
      }
}, {
    timestamps: true
});

// Mongoose Hook to Hash Password Before Saving
teacherSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });
  
  // Custom Method to Compare Password
  teacherSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

module.exports = mongoose.model('Teacher', teacherSchema);
