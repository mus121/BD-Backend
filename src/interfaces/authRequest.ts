import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export type AuthRequest = Request & {
  user?: (JwtPayload & { id: string }) | string;
};
