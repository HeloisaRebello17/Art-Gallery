// models/User.js
const pool = require('../config/db');

class User {
  // Busca usuário por ID
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  // Verifica se é admin
  static async isAdmin(id) {
    const user = await this.findById(id);
    return user ? user.is_admin === 1 : false;
  }

  // Busca usuário por email
  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }
}

module.exports = User;