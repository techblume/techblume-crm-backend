const express = require('express');
const router = express.Router();
const BookedLead = require('../models/bookedLeads');

// Create a new booked lead
router.post('/add', async (req, res) => {
    const { name, email, phone, date, time, zone, message, leadSource } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and Email are mandatory fields.' });
    }

    try {
        const newLead = new BookedLead({
            name,
            email,
            phone,
            date,
            time,
            zone,
            message,
            leadSource
        });
        await newLead.save();
        res.status(201).json(newLead);
    } catch (error) {
        res.status(500).json({ error: 'Error creating booked lead' });
    }
});

// Update a booked lead by ID
router.put('/update/:id', async (req, res) => {
    const { status, remarks, ...otherFields } = req.body;

    try {
        const lead = await BookedLead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        lead.status = status || lead.status;
        lead.remarks = remarks || lead.remarks;
        Object.assign(lead, otherFields);  // Update any other fields
        await lead.save();
        res.status(200).json({ message: 'Lead updated', lead });
    } catch (error) {
        res.status(500).json({ error: 'Error updating booked lead' });
    }
});

// Delete a booked lead by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        await BookedLead.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Lead deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting booked lead' });
    }
});

// Get all booked leads
router.get('/all', async (req, res) => {
    try {
        const leads = await BookedLead.find();
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching leads' });
    }
});

module.exports = router;
