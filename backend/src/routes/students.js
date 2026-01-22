import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single student
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Không tìm thấy học sinh' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new student
router.post('/', async (req, res) => {
  const student = new Student({
    name: req.body.name,
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender,
    parentName: req.body.parentName,
    parentPhone: req.body.parentPhone,
    address: req.body.address,
    class: req.body.class,
    enrollmentDate: req.body.enrollmentDate
  });

  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a student
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Không tìm thấy học sinh' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        student[key] = req.body[key];
      }
    });

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Không tìm thấy học sinh' });
    }
    await student.deleteOne();
    res.json({ message: 'Đã xóa học sinh' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
