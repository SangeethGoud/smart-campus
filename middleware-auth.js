const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const COOKIE_NAME = 'sc_token';

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const token = req.cookies[COOKIE_NAME] || req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'access token required' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'invalid token' });
  }
}

// Middleware to check if user has admin role
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'admin access required' });
  }
  next();
}

// Middleware to check if user has admin or faculty role
function requireAdminOrFaculty(req, res, next) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'faculty')) {
    return res.status(403).json({ error: 'admin or faculty access required' });
  }
  next();
}

// Middleware to check if user has specific role
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: `${role} access required` });
    }
    next();
  };
}

// Middleware to check if user has any of the specified roles
function requireAnyRole(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'insufficient permissions' });
    }
    next();
  };
}

// Optional authentication - doesn't fail if no token
function optionalAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME] || req.header('Authorization')?.replace('Bearer ', '');
  
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
    } catch (error) {
      // Token is invalid, but we don't fail the request
      req.user = null;
    }
  }
  
  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireAdminOrFaculty,
  requireRole,
  requireAnyRole,
  optionalAuth
};
