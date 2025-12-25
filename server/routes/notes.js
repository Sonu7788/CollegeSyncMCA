const router = require('express').Router();
const Note = require('../models/Note');

router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ branches: req.query.branch });
    res.json(notes);
  } catch (err) { res.status(500).json(err.message); }
});

router.post('/', async (req, res) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) { res.status(400).json(err.message); }
});

module.exports = router;