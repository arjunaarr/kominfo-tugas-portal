
// API controller handles the logic for API routes

/**
 * GET /api/hello
 * Returns a simple hello message
 */
exports.getHello = (req, res) => {
  res.json({ message: "Hello from backend" });
};

/**
 * GET /api/info
 * Returns information about the application
 */
exports.getInfo = (req, res) => {
  const info = {
    name: process.env.APP_NAME || "Kominfo Intern Task Management",
    version: process.env.APP_VERSION || "1.0.0",
    serverTime: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  };
  
  res.json(info);
};

/**
 * GET /api/status
 * Endpoint to check server status
 */
exports.getStatus = (req, res) => {
  res.json({
    status: 'online',
    serverTime: new Date().toISOString(),
    uptime: process.uptime() + ' seconds',
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || "development"
  });
};
