const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// Create a new session for a user
router.post('/', async (req, res) => {
  const { sessionId, userId, title } = req.body;
  try {
    const session = await Session.create({ sessionId, userId, title });
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all sessions for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.params.userId });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
