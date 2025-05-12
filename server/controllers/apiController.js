
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
    name: process.env.APP_NAME || "Backend API",
    version: process.env.APP_VERSION || "1.0.0",
    serverTime: new Date().toISOString()
  };
  
  res.json(info);
};
