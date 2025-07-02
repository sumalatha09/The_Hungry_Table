const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // ✅ Place a new order
  router.post('/', async (req, res) => {
    const { name, email, phone, items, total } = req.body;

    if (!name || !email || !phone || !items || !total) {
      return res.status(400).json({ error: 'Missing order data' });
    }

    const order = {
      name,
      email,
      phone,
      items,
      total,
      createdAt: new Date()
    };

    try {
      const result = await db.collection('orders').insertOne(order);
      res.status(201).json({ message: 'Order placed successfully', orderId: result.insertedId });
    } catch (err) {
      console.error('Error placing order:', err);
      res.status(500).json({ error: 'Failed to place order' });
    }
  });

  // ✅ Get all orders (for admin)
  router.get('/', async (req, res) => {
    try {
      const orders = await db.collection('orders').find().toArray();
      res.json(orders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // ✅ Get orders for a specific email (user)
  router.get('/user/:email', async (req, res) => {
    const { email } = req.params;

    try {
      const orders = await db.collection('orders').find({ email }).toArray();
      res.json(orders);
    } catch (err) {
      console.error('Error fetching user orders:', err);
      res.status(500).json({ error: 'Failed to fetch user orders' });
    }
  });

  return router;
};
