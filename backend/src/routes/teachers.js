import express from 'express';
import Teacher from '../models/Teacher.js';

const router = express.Router();

// Get all teachers
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single teacher
router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Không tìm thấy giáo viên' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new teacher
router.post('/', async (req, res) => {
  const teacher = new Teacher({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    dateOfBirth: req.body.dateOfBirth,
    subject: req.body.subject,
    experience: req.body.experience,
    joinDate: req.body.joinDate
  });

  try {
    const newTeacher = await teacher.save();
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a teacher
router.put('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Không tìm thấy giáo viên' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        teacher[key] = req.body[key];
      }
    });

    const updatedTeacher = await teacher.save();
    res.json(updatedTeacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a teacher
router.delete('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Không tìm thấy giáo viên' });
    }
    await teacher.deleteOne();
    res.json({ message: 'Đã xóa giáo viên' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
