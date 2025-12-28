// database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Log rapide pour vérifier ce que voit le code
console.log('DB config utilisée:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  nodeEnv: process.env.NODE_ENV,
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'formapro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: true } // Aiven impose SSL
      : undefined,
  connectTimeout: 10000, // 10s
});

// Fonction d'initialisation de la base de données
async function initDatabase() {
  try {
    console.log('🔄 Tentative de connexion à la base...');
    const connection = await pool.getConnection();
    console.log('✅ Connexion MySQL Aiven OK');

    // Exemple simple pour le test : juste un SELECT 1
    const [rows] = await connection.query('SELECT 1 AS test');
    console.log('✅ Test query OK:', rows);

    // Ici tu peux laisser TON code de création de tables si tu veux tester tout le schéma
    // ...

    connection.release();
    console.log('Base de données initialisée avec succès');
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation de la base de données:", error);
    throw error;
  }
}

module.exports = { pool, initDatabase };
