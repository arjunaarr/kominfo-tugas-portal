
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../config/auth');

// Protected routes
router.get('/', authenticateToken, userController.getAllUsers);
router.get('/:userId', authenticateToken, userController.getUserById);

module.exports = router;
