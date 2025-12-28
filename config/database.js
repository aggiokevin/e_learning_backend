const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('DB config utilisée:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  nodeEnv: process.env.NODE_ENV,
  hasCa: !!process.env.DB_CA_CERT,
});

const isProd = process.env.NODE_ENV === 'production';

const sslConfig = isProd
  ? {
      // Aiven fournit un CA à utiliser pour valider le certificat
      ca: process.env.DB_CA_CERT
        ? process.env.DB_CA_CERT.replace(/\\n/g, '\n')
        : undefined,
    }
  : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'formapro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: sslConfig,
  connectTimeout: 10000,
});

async function initDatabase() {
  try {
    console.log('🔄 Tentative de connexion à la base...');
    const connection = await pool.getConnection();
    console.log('✅ Connexion MySQL OK');
    const [rows] = await connection.query('SELECT 1 AS test');
    console.log('✅ Test query OK:', rows);
    connection.release();
    console.log('Base de données initialisée avec succès');
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation de la base de données:", error);
    throw error;
  }
}

module.exports = { pool, initDatabase };
