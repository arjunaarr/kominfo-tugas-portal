
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../config/auth');
const upload = require('../config/multer');

// Public routes
router.post('/login', authController.login);
router.post('/register', authController.register);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, upload.single('photo'), authController.updateProfile);
router.put('/password', authenticateToken, authController.updatePassword);

module.exports = router;
