const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

router.post('/contact', async (req, res) => {
  try {
    const { name, email, userType, subject, message } = req.body;

    await ContactMessage.create({ name, email, userType, subject, message });

    res.status(200).json({ success: true, message: 'Message received successfully.' });
  } catch (err) {
    console.error('Error saving contact message:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
