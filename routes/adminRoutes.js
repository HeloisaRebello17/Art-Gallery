const express = require('express');
const router = express.Router();
const { checkAdmin } = require('../middlewares/auth');

// Rota principal do admin
router.get('/', checkAdmin, (req, res) => {
  res.render('admin/dashboard', {
    title: 'Painel Administrativo',
    user: req.session.user
  });
});

// Rota para gerenciar usuários
router.get('/users', checkAdmin, (req, res) => {
  res.render('admin/users', {
    title: 'Gerenciar Usuários',
    users: [] // Array de usuários virá do banco de dados
  });
});

module.exports = router;