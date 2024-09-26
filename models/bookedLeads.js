const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  leadId: {
    type: Number,
    unique: true,
    required: true // Ensure leadId is mandatory
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v), // Basic email validation
      message: (props) => `${props.value} is not a valid email!`
    }
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
    default: Date.now // Default to current time on creation
  },
  updatedBy: {
    type: String,
    default: 'No update' // Default value if no updates have been made
  }
});

// Middleware to update the updatedAt field before saving
leadSchema.pre('save', function (next) {
  this.updatedAt = Date.now(); // Update updatedAt field on every save
  next();
});

const Lead = mongoose.model('Lead', leadSchema);
module.exports = Lead;
