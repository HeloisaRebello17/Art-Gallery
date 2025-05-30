const db = require('../config/db');

exports.getAllActivities = (req, res, next) => {
    const sql = `
        SELECT a.ActivityID, a.UserID, u.Name as UserName, a.ActionType, a.Details, a.Timestamp 
        FROM Activities a
        LEFT JOIN Users u ON a.UserID = u.UserID
        ORDER BY a.Timestamp DESC
        LIMIT 50;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar atividades:', err);
            return next(err);
        }
        res.json(results);
    });
};