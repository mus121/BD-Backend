import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = async (
  req: Request,
  res: Response & { locals: { userId?: string } },
  next: NextFunction,
): Promise<void> => {
  try {
    // Retrieve token from cookies or headers
    const token = req.cookies?.session_token;

    if (!token) {
      res.status(401).json({ message: 'Unauthorized: No token provided' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing in environment variables');
      res.status(500).json({ message: 'Server misconfiguration' });
      return;
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      console.log('Decoded Token:', decoded);
    } catch (error) {
      console.error('JWT Verification Failed:', error);
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    // Ensure decoded token contains the user ID
    if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
      res.status(401).json({ message: 'Invalid token structure' });
      return;
    }

    // Attach decoded user ID to response locals
    Object.assign(res.locals, { userId: decoded.id });
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
