const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Signup route (only for admin)
router.post('/signup', async (req, res) => {
    const { email, password, role } = req.body;

    if (role !== 'Techblume_Admin') {
        return res.status(403).json({ message: 'Only admins can sign up.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        const user = new User({ email, password, role });
        await user.save();
        res.status(201).json({ message: 'Admin user created successfully!', role });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Error creating user', error: err.message });
    }
});

// Signin route for both admin and user
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Middleware to verify token and role for admin routes
const adminAuth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'No token provided.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token.' });

        if (decoded.role !== 'Techblume_Admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }

        req.userId = decoded._id;
        next();
    });
};

// Route to create new users (admin only)
router.post('/users', adminAuth, async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        const user = new User({ email, password, role: 'Techblume_User' });
        await user.save();
        res.status(201).json({ message: 'User created successfully!' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Error creating user', error: err.message });
    }
});

module.exports = router;
