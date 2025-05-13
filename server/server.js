
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Import routes
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode - serving static files from dist directory');
  
  // Check if dist directory exists relative to the server directory (one level up)
  const distPath = path.join(__dirname, '../dist');
  if (fs.existsSync(distPath)) {
    console.log(`Found dist directory at: ${distPath}`);
    console.log(`Contents of dist directory: ${fs.readdirSync(distPath)}`);
  } else {
    console.error(`ERROR: dist directory not found at: ${distPath}`);
    // List parent directory contents to help debug
    const parentDir = path.join(__dirname, '../');
    console.log(`Contents of parent directory: ${fs.readdirSync(parentDir)}`);
  }
  
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    console.log('Serving React app for path:', req.path);
    const indexPath = path.join(__dirname, '../dist/index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error(`ERROR: index.html not found at: ${indexPath}`);
      res.status(404).send('Build files not found. Make sure the React app is built properly.');
    }
  });
}

// API-specific 404 handler (only for /api/* routes)
app.use('/api/*', (req, res) => {
  console.log('API route not found:', req.originalUrl);
  res.status(404).json({
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`API available at: http://localhost:${PORT}/api`);
});

module.exports = app; // For testing
