// art-gallery-backend-novo/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware'); // Importe os middlewares

// Rota para obter o perfil do usuário logado
// GET /api/users/profile
router.get('/profile', protect, userController.getUserProfile);

// ---- NOVAS ROTAS DE ADMIN ----

// Rota para listar todos os usuários (somente admins)
// GET /api/users
router.get('/', protect, isAdmin, userController.getAllUsers);

// Rota para atualizar o status de admin de um usuário (somente admins)
// PUT /api/users/:userId/admin
router.put('/:userId/admin', protect, isAdmin, userController.updateUserAdminStatus);

module.exports = router;