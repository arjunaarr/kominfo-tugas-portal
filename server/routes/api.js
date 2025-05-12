
const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Define routes
router.get('/hello', apiController.getHello);
router.get('/info', apiController.getInfo);

module.exports = router;
