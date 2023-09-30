// routes/index.js
const express = require('express');
const authRoutes = require('./authRoutes');
const roomRoutes = require('./roomRoutes');
const userRoutes = require('./userRoutes');

// const eventsRouter = require('./events');
// const newAndUpdatesRoutes = require('./newAndUpdates');
// Import other route modules as needed

const router = express.Router();

// Configure routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/room', roomRoutes);

// Use other routes here

module.exports = router;
