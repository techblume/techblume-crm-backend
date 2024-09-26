const express = require('express');
const router = express.Router();
const Lead = require('../models/bookedLeads'); // Ensure you are importing the model correctly

// Create a new booked lead
router.post('/add', async (req, res) => {
    const {
        leadId,
        name,
        email,
        phone,
        date,
        time,
        zone,
        message,
        leadSource,
        status,
        remarks,
        updatedBy
    } = req.body;

    // Validate mandatory fields
    if (!leadId || !name || !email) {
        return res.status(400).json({ message: 'Lead ID, Name, and Email are mandatory fields.' });
    }

    try {
        const newLead = new Lead({
            leadId,
            name,
            email,
            phone: phone || null,
            date: date || null,
            time: time || null,
            zone: zone || 'UTC', // Default to UTC if not provided
            message: message || '',
            leadSource: leadSource || 'Unknown', // Default value
            status: status || 'Booked', // Default value
            remarks: remarks || 'Not yet contacted', // Default value
            updatedBy: updatedBy || 'No update' // Default value
        });

        await newLead.save();
        res.status(201).json({ message: 'Lead created successfully', lead: newLead });
    } catch (error) {
        console.error('Error creating booked lead:', error);
        res.status(500).json({ error: 'Error creating booked lead' });
    }
});

// Update a booked lead by ID
router.put('/update/:id', async (req, res) => {
    const { status, remarks, updatedBy, ...otherFields } = req.body;

    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        lead.status = status ?? lead.status;
        lead.remarks = remarks ?? lead.remarks;
        lead.updatedBy = updatedBy ?? lead.updatedBy;
        lead.updatedAt = new Date(); // Update the timestamp

        Object.assign(lead, otherFields); // Update any other fields

        await lead.save();
        res.status(200).json({ message: 'Lead updated successfully', lead });
    } catch (error) {
        console.error('Error updating booked lead:', error);
        res.status(500).json({ error: 'Error updating booked lead' });
    }
});

// Delete a booked lead by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.status(200).json({ message: 'Lead deleted successfully' });
    } catch (error) {
        console.error('Error deleting booked lead:', error);
        res.status(500).json({ error: 'Error deleting booked lead' });
    }
});

// Get all booked leads
router.get('/all', async (req, res) => {
    try {
        const leads = await Lead.find();
        if (leads.length === 0) {
            return res.status(404).json({ message: 'No leads found' });
        }
        res.status(200).json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Error fetching leads' });
    }
});

// Get a specific booked lead by ID
router.get('/:id', async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.status(200).json(lead);
    } catch (error) {
        console.error('Error fetching lead:', error);
        res.status(500).json({ error: 'Error fetching lead' });
    }
});

module.exports = router;
