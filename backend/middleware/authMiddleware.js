import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
export const authMiddleware = (req, res, next) => {
  // console.log(req.header);
  const token = req.header('Authorization')?.replace('Bearer ', '');
  // console.log(token);
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    // console.log(req.user);
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};