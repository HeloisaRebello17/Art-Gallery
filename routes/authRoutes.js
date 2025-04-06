// routes/authRoutes.js
const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', (req, res) => {
  // Lógica simplificada de login
  req.session.userId = 1; // ID fictício
  res.redirect('/dashboard');
});

module.exports = router;