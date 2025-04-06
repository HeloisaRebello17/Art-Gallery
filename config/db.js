const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuração da conexão com o banco de dados
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'art_gallery',
  waitForConnections: true,
  connectionLimit: 10
});

// Teste da conexão
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexão com o MySQL estabelecida com sucesso!');
    connection.release();
  } catch (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  }
}

testConnection();

module.exports = pool;