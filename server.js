// --- Imports ---
const express = require('express');
const path = require('path');

// Security & Utility
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Project Specific
const dbManager = require('./src/config/database');
const profileRoutes = require('./src/routes/profileRoutes');
const globalErrorHandler = require('./src/middleware/errorHandler');

// --- Configuration ---
const app = express();
const PORT_NUMBER = process.env.PORT || 3000;

// Rate limiting setup
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // 100 requests per IP per window
  message: 'Too many requests from this IP, please try again after 15 minutes.'
});


// --- Middleware Setup ---
app.use(helmet());           // Basic security headers
app.use(cors());             // Enable CORS for all routes
app.use(apiLimiter);         // Apply rate limiting

// Body parsing (larger limit for JSON just in case)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false })); // Use 'false' for simpler body parsing

// Static assets
app.use(express.static(path.join(__dirname, 'src/public')));

// Attach DB to request object for convenience in routes/middleware
app.use((req, res, next) => {
  req.db = dbManager;
  next();
});

// --- Routes ---

// Main API routes
app.use('/api/profiles', profileRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Database status endpoint - more direct error handling
app.get('/api/status', async (req, res) => {
  try {
    const stats = await dbManager.getStats();
    res.json({
      server: 'Up and running',
      dbConnection: dbManager.getStatus(),
      stats: stats,
      currentTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to retrieve DB stats:', error.message);
    res.status(503).json({ error: 'Service Unavailable', details: 'Database connection issue.' });
  }
});

// Root route - serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Final Middleware ---

// Catch-all for 404 Not Found
app.use((req, res) => {
  res.status(404).json({ message: `Resource not found: ${req.originalUrl}` });
});

// Global Error Handler (must be the last app.use())
app.use(globalErrorHandler);


// --- Server Initialization Logic ---

/**
 * Connects to the database and ensures essential data exists.
 */
const setupDatabase = async () => {
  try {
    await dbManager.connect();
    console.log('Database connected.');

    // Conditionally seed data
    const Profile = require('./src/models/Profile');
    if (await Profile.count() === 0) {
      console.log('Database empty, running seed script...');
      const seedDatabase = require('./src/utils/seedData');
      await seedDatabase();
      console.log('Seeding complete.');
    }
  } catch (err) {
    console.error('FATAL: Could not initialize database.');
    console.error(err);
    process.exit(1); // Exit process if DB setup fails
  }
};

/**
 * Initializes the DB and starts the Express server.
 */
const startServer = async () => {
  await setupDatabase(); // Initialize DB first

  app.listen(PORT_NUMBER, () => {
    console.log(`🚀 Server online on port ${PORT_NUMBER}`);
    console.log(`Local URL: http://localhost:${PORT_NUMBER}`);
  });
};

// Start the application
startServer();


// --- Graceful Shutdown ---
process.on('SIGINT', async () => {
  console.log('\nServer received SIGINT. Disconnecting DB...');
  try {
    await dbManager.disconnect();
    console.log('Database disconnected. Shutting down.');
    process.exit(0);
  } catch (err) {
    console.error('Error during DB disconnect on shutdown:', err);
    process.exit(1);
  }
});