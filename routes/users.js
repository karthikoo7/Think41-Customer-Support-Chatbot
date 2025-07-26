
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create new user
router.post('/', async (req, res) => {
  const { userId, name, email } = req.body;
  try {
    const user = await User.create({ userId, name, email });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
