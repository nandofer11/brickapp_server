// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {loginUser} = require('../controllers/authController');

// Ruta Login
router.post('/login', loginUser);

module.exports = router;
