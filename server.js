// backend/server.js
require('dotenv').config(); // Carrega variáveis de .env para process.env (instale com: npm install dotenv)

const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Importa para iniciar a conexão com DB
const apiRoutes = require('./routes/index'); // Importa o agregador de rotas da API
const { notFound, globalErrorHandler } = require('./middleware/errorHandler'); // Importa os handlers de erro

const app = express();
const port = process.env.PORT || 3001;

// Middlewares Globais
app.use(cors()); // Habilita CORS para todas as origens (ajuste em produção se necessário)
app.use(express.json()); // Para parsear JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // Para parsear corpos de requisição URL-encoded

// Rota de "saúde" ou status do servidor (opcional)
app.get('/status', (req, res) => {
    res.json({ status: 'Servidor Art Gallery Backend está no ar!', timestamp: new Date().toISOString() });
});

// Monta todas as rotas da API sob o prefixo /api
// Ex: /api/users, /api/artworks
app.use('/api', apiRoutes);

// Middlewares de tratamento de erro (devem ser os últimos a serem registrados com app.use)
app.use(notFound);          // Para rotas não encontradas (404)
app.use(globalErrorHandler); // Para todos os outros erros (500, etc.)

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor backend rodando em http://localhost:${port}`);
    // A conexão com o DB é iniciada quando './config/db' é importado.
    // Você pode adicionar um log aqui para confirmar a conexão se db.js exportar um status.
});