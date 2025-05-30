// art-gallery-backend-novo/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Para acessar JWT_SECRET

const protect = async (req, res, next) => {
    let token;

    // O token JWT geralmente é enviado no cabeçalho Authorization assim: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Extrair o token do cabeçalho (remove "Bearer ")
            token = req.headers.authorization.split(' ')[1];

            // 2. Verificar o token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Adicionar o payload do usuário decodificado ao objeto req
            // Isso tornará req.user acessível nas rotas protegidas
            // O payload é o que definimos ao assinar o token no authController (userId, name, email, isAdmin)
            req.user = decoded; // decoded conterá { userId, name, email, isAdmin, iat, exp }

            next(); // Continua para o próximo middleware ou controller da rota

        } catch (error) {
            console.error('Erro na autenticação do token:', error.message);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Token inválido. Acesso não autorizado.' });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expirado. Por favor, faça login novamente.' });
            }
            // Outros erros
            return res.status(401).json({ error: 'Não autorizado. Problema com o token.' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Não autorizado. Nenhum token fornecido.' });
    }
};

// Middleware opcional para verificar se o usuário é Admin
const isAdmin = (req, res, next) => {
    // Este middleware deve ser usado DEPOIS do middleware 'protect',
    // pois ele depende de req.user ter sido populado.
    if (req.user && req.user.isAdmin) {
        next(); // Usuário é admin, pode continuar
    } else {
        res.status(403).json({ error: 'Acesso negado. Requer privilégios de administrador.' }); // 403 Forbidden
    }
};


module.exports = { protect, isAdmin };