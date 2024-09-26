const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  leadId: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: null
  },
  date: {
    type: Date,
    default: Date.now
  },
  time: {
    type: String,
    default: null
  },
  zone: {
    type: String,
    default: 'UTC'
  },
  message: {
    type: String,
    default: ''
  },
  leadSource: {
    type: String,
    default: 'Unknown'
  },
  status: {
    type: String,
    default: 'Booked'
  },
  remarks: {
    type: String,
    default: 'Not yet contacted'
  },
  bookedDate: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: function() {
      return this.bookedDate;
    }
  },
  updatedBy: {
    type: String,
    default: 'No update' // Default value if no updates have been made
  }
});

const Lead = mongoose.model('Lead', leadSchema);
module.exports = Lead;
