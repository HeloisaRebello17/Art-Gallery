// art-gallery-backend-novo/server.js
require('dotenv').config(); // Carrega as variáveis de ambiente do .env no início

const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Importar db aqui para garantir que o pool seja inicializado e o teste de conexão rode

// Vamos criar esses arquivos nos próximos passos
const apiRoutes = require('./routes/index'); // Nosso futuro agregador de rotas
const { notFound, globalErrorHandler } = require('./middleware/errorHandler'); // Nossos futuros error handlers

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares Essenciais
app.use(cors()); // Habilita o CORS para permitir requisições do frontend
app.use(express.json()); // Permite que o servidor entenda requisições com corpo em JSON
app.use(express.urlencoded({ extended: true })); // Permite que o servidor entenda requisições com corpo URL-encoded

// Rota de status básica (para testar se o servidor está no ar)
app.get('/', (req, res) => {
    res.json({
        message: 'Bem-vindo à API da Art Gallery!',
        status: 'Online',
        timestamp: new Date().toISOString()
    });
});

// Montar as rotas da API (ex: /api/users, /api/artworks)
// Faremos isso de forma mais completa em breve
app.use('/api', apiRoutes); // Todas as rotas começarão com /api

// Middlewares de Tratamento de Erro (devem ser os últimos)
// Faremos o conteúdo desses arquivos em breve
app.use(notFound);
app.use(globalErrorHandler);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    // Teste de conexão com o banco de dados (o teste já está no db.js quando ele é importado)
    // Se quiser, pode adicionar um console.log aqui após confirmar que o `db.js` fez o log de sucesso.
});