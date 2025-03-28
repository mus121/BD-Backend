import dotenv from 'dotenv';
import { Response } from 'express';
import { COOKIE_NAME } from '../../../constants';

dotenv.config();

export const getCookiesOptions = () => ({
  httpOnly: true,
  secure: true,
  ...(process.env.NODE_ENV !== 'development' && {
    domain: process.env.COOKIE_DOMAIN,
  }),
});

export const getSessionTokenExpiry = () => 1 * 60 * 60 * 1000; // 1 hour

export const getSessionCookieExpiry = () => 7 * 24 * getSessionTokenExpiry(); // 7 days

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
  options: SessionCookieOptions,
) => {
  const {
    sessionCookie,
    httpOnly = true,
    secure = true,
    domain,
    cookieExpiration: maxAge,
    expires,
  } = options;

  res.cookie(COOKIE_NAME.sessionCookieName, sessionCookie, {
    httpOnly,
    secure,
    domain,
    maxAge,
    expires,
  });

  return res;
};

export const clearSessionCookie = (res: Response) => {
  const options = getCookiesOptions();
  res.clearCookie(COOKIE_NAME.sessionCookieName, options);
  return res;
};
