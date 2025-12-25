const router = require('express').Router();
const Event = require('../models/Event');

// Get Events
router.get('/', async (req, res) => {
  const { role, branch, userId } = req.query;
  try {
    let events;
    if (role === 'teacher') events = await Event.find({ createdBy: userId });
    else events = await Event.find({ branches: branch });
    res.json(events);
  } catch (err) { res.status(500).json(err.message); }
});

// Create Event
router.post('/', async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) { res.status(400).json(err.message); }
});

// Join Event (Attendance)
router.post('/join', async (req, res) => {
  const { eventId, code, studentId } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event || event.attendanceCode !== code) return res.status(400).json({ message: 'Invalid Code' });
    if (event.attendedBy.includes(studentId)) return res.status(400).json({ message: 'Already Joined' });
    
    event.attendedBy.push(studentId);
    await event.save();
    res.json({ message: 'Attendance Marked' });
  } catch (err) { res.status(500).json(err.message); }
});

module.exports = router;