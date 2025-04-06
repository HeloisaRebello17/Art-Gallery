// middlewares/auth.js
const User = require('../models/User');

module.exports = {
  // Middleware de autenticação básica
  isLoggedIn: (req, res, next) => {
    if (!req.session.userId) {
      return res.redirect('/login');
    }
    next();
  },

  // Middleware para verificar admin
  checkAdmin: async (req, res, next) => {
    try {
      if (!req.session.userId) {
        return res.redirect('/login');
      }

      const isAdmin = await User.isAdmin(req.session.userId);
      if (!isAdmin) {
        return res.status(403).render('error', {
          message: 'Acesso permitido apenas para administradores'
        });
      }

      req.session.isAdmin = true; // Armazena na sessão
      next();
    } catch (err) {
      console.error('Erro na verificação de admin:', err);
      res.status(500).render('error', {
        message: 'Erro ao verificar permissões'
      });
    }
  }
};