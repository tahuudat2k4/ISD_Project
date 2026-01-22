import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Nam', 'Nữ'],
    required: true
  },
  parentName: {
    type: String,
    required: true,
    trim: true
  },
  parentPhone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: String,
    required: true,
    trim: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
