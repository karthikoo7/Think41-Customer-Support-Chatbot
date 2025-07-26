const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const Session = require('../models/Session');
const Message = require('../models/Message');
const { askGroq } = require('../services/groq');
const Product = require('../models/Product'); // if querying product data

router.post('/chat', async (req, res) => {
  try {
    const { userId, message, conversationId, title } = req.body;
    if (!userId || !message) return res.status(400).json({ error: 'Missing userId or message' });

    let sessionId = conversationId;
    if (!sessionId) {
      sessionId = uuidv4();
      await Session.create({ sessionId, userId, title: title || 'New Chat Session' });
    }

    // Save user message
    await Message.create({ sessionId, role: 'user', content: message });

    // Get previous messages
    const prevMessages = await Message.find({ sessionId }).sort({ timestamp: 1 });

    const chatHistory = prevMessages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    // Add latest message to the prompt
    chatHistory.push({ role: 'user', content: message });

    // Get AI response
    let aiResponse = await askGroq(chatHistory);

    // [Optional] Check if response indicates database query is needed
    if (aiResponse.includes('[QUERY_PRODUCTS]')) {
      const products = await Product.find().limit(5); // Example query
      const productList = products.map(p => `- ${p.name} ($${p.price})`).join('\n');
      aiResponse = `Here are some products you might like:\n\n${productList}`;
    }

    // Save AI response
    await Message.create({ sessionId, role: 'assistant', content: aiResponse });

    res.json({ sessionId, response: aiResponse });

  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
