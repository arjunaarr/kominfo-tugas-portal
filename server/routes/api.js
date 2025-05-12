
const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Public routes
router.get('/hello', apiController.getHello);
router.get('/info', apiController.getInfo);
router.get('/status', apiController.getStatus);

module.exports = router;
