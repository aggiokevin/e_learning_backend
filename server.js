const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase } = require('./config/database');

// Routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const progressRoutes = require('./routes/progress');
const quizRoutes = require('./routes/quiz');
const chatbotRoutes = require('./routes/chatbot');
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', enrollmentRoutes);
app.use('/api', progressRoutes);
app.use('/api', quizRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API FormaPro en ligne' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 10000;

async function startServer() {
  // 1) Démarrer le serveur d'abord
  app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
  });

  // 2) Initialiser la DB en parallèle, sans tuer le process
  try {
    await initDatabase();
    console.log('✅ Base de données initialisée avec succès');
  } catch (error) {
    console.error("⚠️ Erreur lors de l'initialisation de la base de données:", error);
    // NE PAS faire process.exit(1) ici
  }
}

startServer();
