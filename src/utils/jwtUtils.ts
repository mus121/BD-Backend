import { sign, SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export const generateJWT = (payload: object, expiresIn: number): string => {
  const options: SignOptions = { expiresIn };
  return sign(payload, JWT_SECRET as string, options);
};
