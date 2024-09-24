const mongoose = require('mongoose');

// Define a counter schema for auto-incrementing leadId
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1000 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Define the schema for the Booked_Leads
const bookedLeadSchema = new mongoose.Schema({
    leadId: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: null,  // Default to null if not provided
    },
    date: {
        type: Date,
        default: Date.now, // Default to current date if not provided
    },
    time: {
        type: String,
        default: null,  // Default to null if not provided
    },
    zone: {
        type: String,
        default: 'UTC', // Default to UTC if not provided
    },
    message: {
        type: String,
        default: '', // Default to empty string if not provided
    },
    leadSource: {
        type: String,
        default: 'Unknown', // Default to 'Unknown' if not provided
    },
    status: {
        type: String,
        default: 'booked',
    },
    remarks: {
        type: String,
        default: 'Not yet contacted',
    },
    bookedDate: {
        type: Date,
        default: Date.now,  // Capture when the lead is first created
    },
    updatedAt: {
        type: Date,
        default: null,  // Default to null if not updated
    }
});

// Pre-save hook for auto-incrementing leadId and updating the updatedAt field on status change
bookedLeadSchema.pre('save', async function(next) {
    let doc = this;
    // If this is a new document, increment the leadId
    if (this.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'leadId' }, 
            { $inc: { seq: 1 } }, 
            { new: true, upsert: true }
        );
        doc.leadId = counter.seq;
    }
    
    // Update the updatedAt field if the status is modified
    if (this.isModified('status')) {
        this.updatedAt = new Date();
    }
    
    next();
});

const BookedLead = mongoose.model('BookedLead', bookedLeadSchema);

module.exports = { BookedLead, Counter };
