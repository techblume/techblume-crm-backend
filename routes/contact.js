const express = require('express');
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new contact (No authentication required)
router.post('/create', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        const contact = new Contact({ name, email, message });
        await contact.save();
        res.status(201).json({ message: 'Contact created successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error creating contact', error: err });
    }
});

// Get a list of all contacts (Authentication required)
router.get('/list', authMiddleware, async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching contacts', error: err });
    }
});

// Delete a contact by ID (Authentication required)
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting contact', error: err });
    }
});

module.exports = router;
