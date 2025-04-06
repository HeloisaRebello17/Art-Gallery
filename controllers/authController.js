const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const authController = {
  showLogin: (req, res) => {
    res.render('login', { error: null });
  },

  showRegister: (req, res) => {
    res.render('register', { error: null });
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    
    try {
      // 1. Verifica se usuário existe
      const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      const user = users[0];
      
      if (!user) {
        return res.render('login', { error: 'Email não cadastrado' });
      }

      // 2. Verifica senha
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.render('login', { error: 'Senha incorreta' });
      }

      // 3. Login bem-sucedido - Aqui você pode criar uma sessão
      req.session.userId = user.id; // Requer express-session configurado
      res.redirect('/dashboard'); // Redireciona para área logada

    } catch (err) {
      console.error(err);
      res.render('login', { error: 'Erro no servidor' });
    }
  },

  register: async (req, res) => {
    const { email, password } = req.body;
    
    try {
      // 1. Validação simples
      if (password.length < 8) {
        return res.render('register', { error: 'Senha deve ter no mínimo 8 caracteres' });
      }

      // 2. Verifica se email já existe
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.render('register', { error: 'Email já cadastrado' });
      }

      // 3. Criptografa senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // 4. Insere no banco
      await pool.query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword]
      );

      // 5. Redireciona para login
      res.redirect('/login');

    } catch (err) {
      console.error(err);
      res.render('register', { error: 'Erro ao registrar usuário' });
    }
  }
};

module.exports = authController;