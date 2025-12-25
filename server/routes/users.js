const router = require('express').Router();
const User = require('../models/User');

router.patch('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (err) { res.status(500).json(err.message); }
});

module.exports = router; 