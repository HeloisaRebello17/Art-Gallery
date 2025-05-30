const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/auth'); // Importação correta

// Rota corrigida
router.get('/', isLoggedIn, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard',
    user: req.session.user
  });
});

module.exports = router;


0