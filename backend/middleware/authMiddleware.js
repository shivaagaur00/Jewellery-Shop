import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Owner from './../Models/Owner.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-key';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get owner from the token
      req.owner = await Owner.findById(decoded.id).select('-owners.password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});