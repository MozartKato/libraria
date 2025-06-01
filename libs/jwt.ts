import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(payload: object, expiresIn:  string = '7h'): string {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string){
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Invalid token');
    }
}