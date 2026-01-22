import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: Number,
    default: 0
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;
