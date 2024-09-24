const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Initialize dotenv for environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');  // Authentication routes
const bookingRoutes = require('./routes/bookedLeads');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());

app.use(cors({
    origin: '*',  // Allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
}));

// Routes
app.use('/api/auth', authRoutes);  // Add auth routes here
app.use('/api/bookings', bookingRoutes);

// Health Check Route
app.get('/', (req, res) => {
    res.send('App is running');
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
