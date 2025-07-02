const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");

router.post("/reserve", async (req, res) => {
    try {
        const newReservation = new Reservation(req.body);
        await newReservation.save();
        res.status(200).json({ message: "Reservation successful!" });
    } catch (error) {
        res.status(500).json({ error: "Reservation failed!" });
    }
});

module.exports = router;
