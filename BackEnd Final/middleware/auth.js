const jwt = require('jsonwebtoken');
const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;


// Middleware to verify JWT token for authenticated routes
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // expecting "Bearer <token>"
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded data includes user id and role
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Middleware to restrict access to admins only
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admins only.' });
  }
};

module.exports = { verifyToken, isAdmin };
