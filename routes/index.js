// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();

// Rota simplificada sem middleware externo
router.get('/', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  
  res.render('dashboard', {
    title: 'Dashboard',
    user: req.session.user
  });
});

module.exports = router;