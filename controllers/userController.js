const db = require('../config/db');
const bcrypt = require('bcryptjs'); // Lembre-se de instalar: npm install bcryptjs

// Listar todos os usuários
exports.getAllUsers = (req, res, next) => {
    const sql = 'SELECT UserID, Name, Email, IsAdmin, CreatedAt, UpdatedAt FROM Users';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return next(err); // Passa o erro para o middleware de erro
        }
        res.json(results);
    });
};

// Buscar usuários por nome
exports.searchUsersByName = (req, res, next) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: 'Parâmetro de busca "name" é obrigatório.' });
    }
    const searchTerm = `%${name}%`;
    const sql = 'SELECT UserID, Name, Email, IsAdmin FROM Users WHERE Name LIKE ?';
    db.query(sql, [searchTerm], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários por nome:', err);
            return next(err);
        }
        res.json(results);
    });
};

// Obter um usuário específico
exports.getUserById = (req, res, next) => {
    const { userId } = req.params;
    const sql = 'SELECT UserID, Name, Email, IsAdmin, CreatedAt, UpdatedAt FROM Users WHERE UserID = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error(`Erro ao buscar usuário ${userId}:`, err);
            return next(err);
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.json(results[0]);
    });
};

// Atualizar status de administrador de um usuário
exports.updateUserAdminStatus = (req, res, next) => {
    const { userId } = req.params;
    const { isAdmin } = req.body;

    if (typeof isAdmin !== 'boolean') {
        return res.status(400).json({ error: 'O campo "isAdmin" deve ser um booleano.' });
    }

    const sql = 'UPDATE Users SET IsAdmin = ? WHERE UserID = ?';
    db.query(sql, [isAdmin, userId], (err, result) => {
        if (err) {
            console.error(`Erro ao atualizar permissão do usuário ${userId}:`, err);
            return next(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.json({ message: `Permissão do usuário ${userId} atualizada com sucesso.`, affectedRows: result.affectedRows });
    });
};

// Criar um novo usuário
exports.createUser = async (req, res, next) => { // Adicionado async para bcrypt
    const { Name, Email, Password, IsAdmin = false } = req.body;

    if (!Name || !Email || !Password) {
        return res.status(400).json({ error: 'Nome, Email e Senha são obrigatórios.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const sql = 'INSERT INTO Users (Name, Email, Password, IsAdmin) VALUES (?, ?, ?, ?)';
        db.query(sql, [Name, Email, hashedPassword, IsAdmin], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'Email já cadastrado.' });
                }
                console.error('Erro ao criar usuário:', err);
                return next(err);
            }
            res.status(201).json({ message: 'Usuário criado com sucesso!', userId: result.insertId });
        });
    } catch (hashError) {
        console.error('Erro ao gerar hash da senha:', hashError);
        return next(hashError);
    }
};