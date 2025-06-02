import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export function signToken(payload: object){
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: '7d', // Token expires in 7 days
    algorithm: 'HS256', // Using HMAC SHA-256 algorithm
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY, {
      algorithms: ['HS256'],
    });
    return typeof decoded === 'string' ? null : decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}