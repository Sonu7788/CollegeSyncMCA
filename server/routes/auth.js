const router = require('express').Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username, password: req.body.password });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;