const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// As notificações são geralmente vinculadas a um usuário
// Então, uma rota como /users/:userId/notifications é comum
// Mas para simplificar a agregação, vamos usar /notifications/:notificationId para PUT
// E para GET, vamos manter /users/:userId/notifications (que será definido em userRoutes ou um novo router)

// Se quiser manter /api/users/:userId/notifications:
// Esta rota deve estar em userRoutes.js ou um novo router combinado.
// Por simplicidade, vamos criar uma rota base /notifications para a ação de marcar como lida.

router.put('/:notificationId/read', notificationController.markNotificationAsRead);

module.exports = router;

// Nota: Para GET /users/:userId/notifications, essa rota já está
// implicitamente coberta por userController.getNotificationsByUserId.
// Vamos criar uma rota específica para ela em userRoutes.js ou em index.js para maior clareza.