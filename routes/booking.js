const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Booking = require('../models/Booking');
const router = express.Router();

// No authentication required for /create route
router.post('/create', async (req, res) => {
    const { name, email, phone, zone, time, date } = req.body;
    try {
        const booking = new Booking({ name, email, phone, zone, time, date });
        await booking.save();
        res.status(201).json({ message: 'Booking created successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error creating booking', error: err });
    }
});

// Authentication required for /list route
router.get('/list', authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching bookings', error: err });
    }
});

// Authentication required for /delete route
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: 'Booking deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting booking', error: err });
    }
});

module.exports = router;
