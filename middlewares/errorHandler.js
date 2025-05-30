// backend/middleware/errorHandler.js

// Middleware para lidar com rotas não encontradas (404)
const notFound = (req, res, next) => {
    res.status(404).json({ error: 'Rota não encontrada no servidor.' });
};

// Middleware de tratamento de erro global
const globalErrorHandler = (err, req, res, next) => {
    console.error('ERRO DETECTADO:', err.stack); // Log detalhado do erro no console do servidor

    const statusCode = err.statusCode || 500; // Usa o statusCode do erro, se existir, senão 500
    const message = err.message || 'Ocorreu um erro inesperado no servidor.';

    res.status(statusCode).json({ error: message });
};

module.exports = { notFound, globalErrorHandler };