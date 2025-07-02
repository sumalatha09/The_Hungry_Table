// routes/Subscription.js
const express = require('express');
const router = express.Router();
const Subscribe = require('../models/subscribe');

// POST /api/subscribe
router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const existing = await Subscribe.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Already subscribed" });
    }

    const newSubscriber = new Subscribe({ email });
    await newSubscriber.save();

    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error("❌ Subscription error:", err);
    res.status(500).json({ message: "Subscription failed", error: err.message });
  }
});

module.exports = router;
