const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 5000;
const MONGO_URI = 'mongodb://127.0.0.1:27017/restaurant_auth'; // No .env file

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS, images) from /public
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Failed:', err));

// MongoDB Models
const User = require('./models/User');
const Reservation = require('./models/Reservation');
const Order = require('./models/Order');
const Subscribe = require('./models/subscribe');


// =======================
// ✅ User Registration
// =======================
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

// =======================
// ✅ User Login
// =======================
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

// =======================
// ✅ Table Reservation
// =======================
app.post('/api/reserve', async (req, res) => {
  try {
    const { name, email, phone, tableNumber, date, time, request } = req.body;

    if (!name || !email || !phone || !tableNumber || !date || !time) {
      return res.status(400).json({ message: "All fields except 'request' are required." });
    }

    const existing = await Reservation.findOne({ tableNumber, date, time });
    if (existing) {
      return res.status(409).json({ message: `Table ${tableNumber} is already reserved at ${time} on ${date}` });
    }

    const newReservation = new Reservation({ name, email, phone, tableNumber, date, time, request });
    await newReservation.save();

    // Optional: Email confirmation
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'yourgmail@gmail.com',        // Replace with your Gmail
        pass: 'yourapppasswordhere'         // Use App Password
      }
    });

    const mailOptions = {
      from: 'yourgmail@gmail.com',
      to: email,
      subject: 'Reservation Confirmed ✔️',
      text: `Hi ${name}, your table ${tableNumber} has been booked for ${date} at ${time}.`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("❌ Email sending failed:", err);
      } else {
        console.log("✅ Email sent:", info.response);
      }
    });

    res.status(201).json({ message: "Reservation successful and confirmation email sent!" });

  } catch (err) {
    console.error("❌ Error during reservation:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// =======================
// ✅ Order Placement
// =======================
// =======================
// ✅ Order Placement
// =======================
app.post('/api/orders', async (req, res) => {
  const { name, email, phone, items, total } = req.body;

  if (!name || !email || !phone || !items || !total) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newOrder = new Order({ name, email, phone, items, total });
    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error("❌ Error saving order:", err);
    res.status(500).json({ message: 'Server error while placing order', error: err.message });
  }
});
// =======================
// ✅ Newsletter Subscription
// =======================
app.post('/api/subscribe', async (req, res) => {
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
    console.error("❌ Error during subscription:", err);
    res.status(500).json({ message: "Subscription failed", error: err.message });
  }
});



// =======================
// Default Route
// =======================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// =======================
// Start Server
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
