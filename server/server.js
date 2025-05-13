
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

// Log the current directory structure to help with debugging
console.log('Current directory:', __dirname);
console.log('Parent directory:', path.resolve(__dirname, '..'));
try {
  console.log('Parent directory contents:', fs.readdirSync(path.resolve(__dirname, '..')));
} catch (err) {
  console.error('Cannot read parent directory:', err.message);
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// API-specific 404 handler (only for /api/* routes)
app.use('/api/*', (req, res) => {
  console.log('API route not found:', req.originalUrl);
  res.status(404).json({
    message: 'Route not found'
  });
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode - looking for static files');
  
  // Railway-specific check for build files
  const possibleDistPaths = [
    path.join(__dirname, '../dist'),                 // Standard Vite output
    path.join(__dirname, 'dist'),                    // If dist is in server folder
    path.join(__dirname, '../build'),                // Create React App output
    path.resolve(__dirname, '../'),                  // Root directory
    path.resolve(__dirname)                          // Server directory itself
  ];
  
  // Check if this is Railway deployment
  if (process.env.RAILWAY_SERVICE_NAME) {
    console.log('Detected Railway deployment environment');
    
    // Try to find a build folder in the /app directory which is Railway's default
    if (fs.existsSync('/app')) {
      console.log('Found /app directory, checking contents');
      let appDirContents = fs.readdirSync('/app');
      console.log('/app contents:', appDirContents);
      
      // Check if dist or build exists in /app
      if (appDirContents.includes('dist')) {
        console.log('Found dist directory in /app');
        possibleDistPaths.unshift('/app/dist');
      }
      if (appDirContents.includes('build')) {
        console.log('Found build directory in /app');
        possibleDistPaths.unshift('/app/build');
      }
    }
  }
  
  let distPath = null;
  
  // Find the first valid dist/build directory
  for (const potentialPath of possibleDistPaths) {
    console.log(`Checking for static files at: ${potentialPath}`);
    try {
      if (fs.existsSync(potentialPath)) {
        console.log(`Found directory at: ${potentialPath}`);
        console.log(`Contents: ${fs.readdirSync(potentialPath).join(', ')}`);
        
        // Check if this directory has index.html or looks like a build directory
        const hasIndexHtml = fs.existsSync(path.join(potentialPath, 'index.html'));
        const hasAssets = fs.existsSync(path.join(potentialPath, 'assets')) || 
                         fs.existsSync(path.join(potentialPath, 'static'));
        
        if (hasIndexHtml || hasAssets) {
          distPath = potentialPath;
          console.log(`Selected static files path: ${distPath}`);
          break;
        }
      }
    } catch (err) {
      console.error(`Error checking path ${potentialPath}:`, err.message);
    }
  }
  
  if (distPath) {
    // Serve static files from the located directory
    console.log(`Serving static files from: ${distPath}`);
    app.use(express.static(distPath));
    
    // Handle React routing by sending index.html for non-API routes
    app.get('*', (req, res) => {
      console.log('Serving React app for path:', req.path);
      const indexPath = path.join(distPath, 'index.html');
      
      if (fs.existsSync(indexPath)) {
        console.log(`Found index.html at: ${indexPath}`);
        res.sendFile(indexPath);
      } else {
        console.error(`ERROR: index.html not found at: ${indexPath}`);
        res.status(404).send('Build files not found. Make sure the React app is built properly.');
      }
    });
  } else {
    console.error('ERROR: Could not find any valid build directory');
    // Provide a simple fallback when no build directory is found
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.status(200).send(`
          <html>
            <head><title>Kominfo Intern Task Management</title></head>
            <body style="font-family: system-ui, sans-serif; padding: 2rem; max-width: 600px; margin: 0 auto;">
              <h1>Kominfo Intern Task Management</h1>
              <p>The application is running, but build files were not found.</p>
              <p>Please make sure the React app is built properly before deploying.</p>
              <p><small>Server is running in ${process.env.NODE_ENV || 'development'} mode.</small></p>
            </body>
          </html>
        `);
      }
    });
  }
}

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
