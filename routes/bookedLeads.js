const express = require('express');
const router = express.Router();
const { BookedLead } = require('../models/bookedLeads'); // Ensure you destructure to get the model

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
            phone: phone || null, // Set to null if not provided
            date: date || null,
            time: time || null,
            zone: zone || null,
            message: message || null,
            leadSource: leadSource || 'Unknown' // Default value
        });
        await newLead.save();
        res.status(201).json(newLead);
    } catch (error) {
        console.error('Error creating booked lead:', error); // Log the error for debugging
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

        // Use nullish coalescing to preserve existing values if not provided
        lead.status = status ?? lead.status;
        lead.remarks = remarks ?? lead.remarks;
        Object.assign(lead, otherFields);  // Update any other fields
        await lead.save();
        res.status(200).json({ message: 'Lead updated', lead });
    } catch (error) {
        console.error('Error updating booked lead:', error); // Log the error for debugging
        res.status(500).json({ error: 'Error updating booked lead' });
    }
});

// Delete a booked lead by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const lead = await BookedLead.findByIdAndDelete(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.status(200).json({ message: 'Lead deleted successfully' });
    } catch (error) {
        console.error('Error deleting booked lead:', error); // Log the error for debugging
        res.status(500).json({ error: 'Error deleting booked lead' });
    }
});

// Get all booked leads
router.get('/all', async (req, res) => {
    try {
        const leads = await BookedLead.find();
        res.status(200).json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error); // Log the error for debugging
        res.status(500).json({ error: 'Error fetching leads' });
    }
});

module.exports = router;
