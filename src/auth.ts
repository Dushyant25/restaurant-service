import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
