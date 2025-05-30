const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser); // Rota para criar usuário
router.get('/search', userController.searchUsersByName);
router.get('/:userId', userController.getUserById);
router.put('/:userId/admin', userController.updateUserAdminStatus);

module.exports = router;