const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Message = require('../models/Message');
const router = express.Router();


// Create a new message (no authentication required)
router.post('/create', async (req, res) => {
    const { name, email, phone } = req.body;

    try {
        const message = new Message({ name, email, phone });
        await message.save();
        res.status(201).json({ message: 'Message created successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error creating message', error: err });
    }
});


// Get a list of all messages
router.get('/list', authMiddleware, async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching messages', error: err });
    }
});

// Delete a message by ID
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting message', error: err });
    }
});

module.exports = router;
