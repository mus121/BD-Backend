import dotenv from 'dotenv';
import { Response } from 'express';
import { COOKIE_NAME } from '../../../constants';

dotenv.config();

export const getCookiesoptions = () => ({
  httpOnly: true,
  secure: true,
  ...(process.env.NODE_ENV !== 'development' && {
    domain: process.env.COOKIE_DOMAIN,
  }),
});

export const getSessionTokenExpiry = () => 1 * 60 * 60 * 1000;

export const getSessionCookieExpiry = () => 7 * 24 * getSessionTokenExpiry();

type SessionCookieOptions = {
  sessionCookie: string;
  httpOnly?: boolean;
  secure?: boolean;
  domain?: string;
  expires?: Date;
  cookieExpiration?: number;
};
export const setSessionCookie = (
  res: Response,
  {
    sessionCookie,
    httpOnly,
    secure,
    domain,
    cookieExpiration,
    expires,
  }: SessionCookieOptions,
) => {
  res.cookie(COOKIE_NAME.sessionCookieName, sessionCookie, {
    httpOnly,
    secure,
    domain,
    maxAge: cookieExpiration,
    expires,
  });
  return res;
};

export const clearSessionCookie = (res: Response) => {
  const options = getCookiesoptions();
  res.clearCookie(COOKIE_NAME.sessionCookieName, options);
  return res;
};
