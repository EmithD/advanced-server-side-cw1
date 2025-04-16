import getTokenFromHeader from '../utils/jwtUtils.js';

export const authenticateUser = (req, res, next) => {
    const token = getTokenFromHeader(req);
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  
    req.user = decoded;
    next();
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};