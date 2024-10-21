import jwt from 'jsonwebtoken';

export function validateToken(token: string) {
  const SECRET_KEY = process.env.JWT_SECRET_KEY || '';

  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.log(error);
    return null;
  }
}