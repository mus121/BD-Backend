import dotenv from 'dotenv';

dotenv.config();

export const BD_CONFIG = {
  port: process.env.PORT,
  allowedOrigin: process.env.ALLOWED_ORIGIN,
  homePage: process.env.HOME_PAGE_URL,
  serverUrl: process.env.SERVER_URL,
  googleSuccessPage: process.env.GOOGLE_SUCCESS,
};

export const BD_AUTH = {
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

export const COOKIE_NAME = {
  sessionCookieName: process.env.SESSION_COOKIE_NAME!,
};
