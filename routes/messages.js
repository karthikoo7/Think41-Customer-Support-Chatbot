const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Add message to session
router.post('/', async (req, res) => {
  const { sessionId, role, content } = req.body;
  try {
    const message = await Message.create({ sessionId, role, content });
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all messages for a session (chronological)
router.get('/session/:sessionId', async (req, res) => {
  try {
    const messages = await Message.find({ sessionId: req.params.sessionId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
