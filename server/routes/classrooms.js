const router = require('express').Router();
const Classroom = require('../models/Classroom');
const User = require('../models/User');

// Create Classroom
router.post('/', async (req, res) => {
  try {
    const classroom = await Classroom.create(req.body);
    res.status(201).json(classroom);
  } catch (err) { res.status(400).json(err.message); }
});

// Get Classrooms
router.get('/', async (req, res) => {
  try {
    if (req.query.role === 'teacher') {
      const classrooms = await Classroom.find({ teacherId: req.query.userId }).populate('studentIds', 'fullName username');
      res.json(classrooms);
    } else {
      // Student sees classes they are enrolled in
      const classrooms = await Classroom.find({ studentIds: req.query.userId });
      res.json(classrooms);
    }
  } catch (err) { res.status(500).json(err.message); }
});

// Add Student to Classroom (By Username)
router.post('/:id/add-student', async (req, res) => {
  try {
    const { username } = req.body;
    const student = await User.findOne({ username, role: 'student' });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const classroom = await Classroom.findById(req.params.id);
    if (classroom.studentIds.includes(student._id)) return res.status(400).json({ message: 'Already in class' });

    classroom.studentIds.push(student._id);
    await classroom.save();
    res.json(classroom);
  } catch (err) { res.status(500).json(err.message); }
});

module.exports = router;