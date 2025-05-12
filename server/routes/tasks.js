
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateToken, isAdmin } = require('../config/auth');
const upload = require('../config/multer');

// Protected routes
router.get('/', authenticateToken, taskController.getAllTasks);
router.post('/', authenticateToken, upload.array('files'), taskController.uploadTask);
router.put('/:taskId/status', authenticateToken, taskController.updateTaskStatus);
router.delete('/:taskId', authenticateToken, taskController.deleteTask);
router.get('/download/:filename', authenticateToken, taskController.downloadFile);

module.exports = router;
