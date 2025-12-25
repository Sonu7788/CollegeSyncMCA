const router = require('express').Router();
const Session = require('../models/Session');

// Create a Session (Teacher starts class)
router.post('/', async (req, res) => {
  try {
    const session = await Session.create(req.body);
    res.status(201).json(session);
  } catch (err) { res.status(400).json(err.message); }
});

// Join Session (Student gives attendance)
router.post('/join', async (req, res) => {
  const { sessionId, code, studentId } = req.body;
  try {
    const session = await Session.findById(sessionId);
    if (!session || session.code !== code) return res.status(400).json({ message: 'Invalid Code' });
    if (session.attendedBy.includes(studentId)) return res.status(400).json({ message: 'Already Marked' });

    session.attendedBy.push(studentId);
    await session.save();
    res.json({ message: 'Attendance Marked' });
  } catch (err) { res.status(500).json(err.message); }
});

// Get Attendance History for a class
router.get('/class/:classId', async (req, res) => {
  try {
    const sessions = await Session.find({ classroomId: req.params.classId }).sort({ date: -1 });
    res.json(sessions);
  } catch (err) { res.status(500).json(err.message); }
});

module.exports = router; 