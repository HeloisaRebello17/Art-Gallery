// art-gallery-backend-novo/controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Importe o jsonwebtoken
require('dotenv').config(); // Para acessar JWT_SECRET do .env

// Função para registrar um novo usuário (você já tem esta)
exports.registerUser = async (req, res, next) => {
    // ... seu código de registerUser existente aqui ...
    // (Não precisa copiar de novo, só para mostrar onde a nova função entra)
    const { Name, Email, Password, IsAdmin = false } = req.body;

    if (!Name || !Email || !Password) {
        return res.status(400).json({ error: 'Nome, Email e Senha são obrigatórios.' });
    }
    if (Password.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
    }
    try {
        const [users] = await db.query('SELECT UserID FROM Users WHERE Email = ?', [Email]);
        if (users.length > 0) {
            return res.status(409).json({ error: 'Este email já está cadastrado.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);
        const newUser = { Name, Email, Password: hashedPassword, IsAdmin };
        const [result] = await db.query('INSERT INTO Users SET ?', newUser);
        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            userId: result.insertId,
            name: Name,
            email: Email,
            isAdmin: IsAdmin
        });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        error.statusCode = error.statusCode || 500;
        error.message = error.message || 'Erro interno do servidor ao registrar usuário.';
        next(error);
    }
};


// ---- NOVA FUNÇÃO DE LOGIN ----
exports.loginUser = async (req, res, next) => {
    const { Email, Password } = req.body;

    // Validação básica de entrada
    if (!Email || !Password) {
        return res.status(400).json({ error: 'Email e Senha são obrigatórios.' });
    }

    try {
        // 1. Verificar se o usuário (email) existe no banco
        const [users] = await db.query('SELECT * FROM Users WHERE Email = ?', [Email]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas.' }); // Usuário não encontrado
        }

        const user = users[0]; // Pega o primeiro usuário encontrado (deve ser único pelo email)

        // 2. Comparar a senha fornecida com a senha hasheada no banco
        const isMatch = await bcrypt.compare(Password, user.Password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas.' }); // Senha incorreta
        }

        // 3. Se as credenciais estiverem corretas, gerar um token JWT
        const payload = {
            userId: user.UserID,
            name: user.Name,
            email: user.Email,
            isAdmin: user.IsAdmin
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Pega do .env ou default de 1 hora
        );

        // 4. Enviar o token e alguns dados do usuário como resposta
        // (Não envie a senha hasheada de volta!)
        res.status(200).json({
            message: 'Login bem-sucedido!',
            token: token,
            user: {
                userId: user.UserID,
                name: user.Name,
                email: user.Email,
                isAdmin: user.IsAdmin
            }
        });

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        error.statusCode = error.statusCode || 500;
        error.message = error.message || 'Erro interno do servidor ao fazer login.';
        next(error);
    }
};