const router = require('express').Router();
const Application = require('../models/Application');
const User = require('../models/User');

// Get Apps
router.get('/', async (req, res) => {
  const { userId, role } = req.query;
  try {
    let apps;
    if (role === 'student') apps = await Application.find({ studentId: userId });
    else apps = await Application.find({ toTeacherId: userId }).populate('studentId');
    res.json(apps);
  } catch (err) { res.status(500).json(err.message); }
});

// Create App
router.post('/', async (req, res) => {
  try {
    const app = await Application.create(req.body);
    res.status(201).json(app);
  } catch (err) { res.status(400).json(err.message); }
});

// Update Status (Approve/Reject)
router.patch('/:id', async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(app);
  } catch (err) { res.status(500).json(err.message); }
});

// Get Teachers (for dropdown)
router.get('/teachers/list', async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher', branch: req.query.branch });
    res.json(teachers);
  } catch (err) { res.status(500).json(err.message); }
});

module.exports = router;