import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'orbitx-secret-key-2024';

export const generateToken = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
