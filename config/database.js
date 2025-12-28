// database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Log pour vérifier ce que voit le code (sera visible dans les logs Render)
console.log('DB config utilisée:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  nodeEnv: process.env.NODE_ENV,
});

const isProd = process.env.NODE_ENV === 'production';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'formapro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Aiven impose SSL mais avec un certificat auto-signé,
  // donc on désactive juste la vérification en production.
  ssl: isProd
    ? {
        rejectUnauthorized: false,
      }
    : undefined,
  connectTimeout: 10000,
});

// Fonction d'initialisation de la base de données
async function initDatabase() {
  try {
    console.log('🔄 Tentative de connexion à la base...');
    const connection = await pool.getConnection();
    console.log('✅ Connexion MySQL OK');

    // Test simple
    const [rows] = await connection.query('SELECT 1 AS test');
    console.log('✅ Test query OK:', rows);

    // Tu peux remettre ici tes CREATE TABLE si tu veux:
    // await connection.query(`CREATE TABLE IF NOT EXISTS ...`);

    connection.release();
    console.log('Base de données initialisée avec succès');
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation de la base de données:", error);
    throw error;
  }
}

module.exports = { pool, initDatabase };
