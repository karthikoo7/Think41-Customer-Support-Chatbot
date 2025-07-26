const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const Session = require('../models/Session');
const Message = require('../models/Message');

// Mock AI response function (replace with real LLM later)
const getAIResponse = async (userMessage) => {
  return `Echo: ${userMessage}`;
};

router.post('/chat', async (req, res) => {
  try {
    const { userId, message, conversationId, title } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    let sessionId = conversationId;

    // Create a new session if no conversation ID is provided
    if (!sessionId) {
      sessionId = uuidv4();
      await Session.create({
        sessionId,
        userId,
        title: title || 'New Chat Session',
      });
    }

    // Save user message
    await Message.create({
      sessionId,
      role: 'user',
      content: message,
    });

    // Generate AI response
    const aiResponse = await getAIResponse(message);

    // Save AI response
    await Message.create({
      sessionId,
      role: 'assistant',
      content: aiResponse,
    });

    res.json({
      sessionId,
      response: aiResponse,
    });

  } catch (err) {
    console.error('❌ Chat error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
