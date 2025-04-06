// app.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'segredo-temporario',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Rotas
app.use('/', require('./routes/authRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes')); 

// Rota de fallback
app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});