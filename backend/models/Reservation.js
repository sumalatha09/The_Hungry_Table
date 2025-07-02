const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  tableNumber: Number,
  date: String,
  time: String,
  request: String
});

module.exports = mongoose.model('Reservation', ReservationSchema);
