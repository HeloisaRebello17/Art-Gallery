const db = require('../config/db');

exports.getNotificationsByUserId = (req, res, next) => {
    const { userId } = req.params;
    const sql = 'SELECT NotificationID, Type, Message, IsRead, Link, CreatedAt FROM Notifications WHERE UserID = ? ORDER BY CreatedAt DESC';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error(`Erro ao buscar notificações para o usuário ${userId}:`, err);
            return next(err);
        }
        res.json(results);
    });
};

exports.markNotificationAsRead = (req, res, next) => {
    const { notificationId } = req.params;
    const { isRead } = req.body;

    if (typeof isRead !== 'boolean') {
        return res.status(400).json({ error: 'O campo "isRead" deve ser um booleano.' });
    }

    const sql = 'UPDATE Notifications SET IsRead = ? WHERE NotificationID = ?';
    db.query(sql, [isRead, notificationId], (err, result) => {
        if (err) {
            console.error(`Erro ao marcar notificação ${notificationId} como lida:`, err);
            return next(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Notificação não encontrada.' });
        }
        res.json({ message: `Notificação ${notificationId} marcada como ${isRead ? 'lida' : 'não lida'}.`});
    });
};