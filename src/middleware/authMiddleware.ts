import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

interface CustomRequest extends Request {
  user?: { userId: string; role: string; mobileNo: string }; // Add user property
}

const generateToken = (userId: string, role: string, mobileNo: string): string => {
  return jwt.sign({ userId, role, mobileNo }, process.env.JWT_SECRET!, { expiresIn: '20d' });
};



const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};



const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};



const authenticateUser = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token not provided' });
    }

    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decodedToken;
    next();

  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};



export { generateToken, hashPassword, comparePasswords, authenticateUser };
