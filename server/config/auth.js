
const jwt = require('jsonwebtoken');

// Kunci rahasia untuk JWT
const JWT_SECRET = process.env.JWT_SECRET || 'kominfo-intern-secret-key';
const JWT_EXPIRES_IN = '24h';

// Middleware untuk memeriksa token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware untuk memeriksa peran admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin privileges required' });
  }
  next();
};

// Buat token JWT
const createToken = (user) => {
  // Jangan sertakan password dalam token
  const { password, ...userWithoutPassword } = user;
  
  return jwt.sign(userWithoutPassword, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

module.exports = {
  authenticateToken,
  isAdmin,
  createToken
};
