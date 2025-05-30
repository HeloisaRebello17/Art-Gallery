// art-gallery-backend-novo/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para registrar um novo usuário
// POST /api/auth/register
router.post('/register', authController.registerUser);

// ---- NOVA ROTA DE LOGIN ----
// POST /api/auth/login
router.post('/login', authController.loginUser); // Adicione esta linha

module.exports = router;