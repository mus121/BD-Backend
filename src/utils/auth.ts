import axios, { HttpStatusCode } from 'axios';
import dotenv from 'dotenv';
import { googleAuthConfig } from '../../database/auth';
import { TokenPayload } from '../interfaces/models/users';
import { BDError, ErrorCode } from './bdError';

dotenv.config();

export const generateAuthUrl = (state: string): string => {
  return googleAuthConfig.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      process.env.GOOGLE_EMAIL_INFO!,
      process.env.GOOGLE_PROFILE_INFO!,
      process.env.GOOGLE_CONTACTS_INFO!,
    ],
    state,
  });
};

export const fetchGoogleUserInfo = async (
  token: string,
): Promise<TokenPayload> => {
  if (!process.env.GOOGLE_USERINFO_API) {
    throw new Error('GOOGLE_AUTH_API is not defined');
  }
  const { data } = await axios.get(process.env.GOOGLE_USERINFO_API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const generateState = (): string => {
  return (
    process.env.GOOGLE_AUTH_STATE || Math.random().toString(36).substring(7)
  );
};

export const exchangeToken = async (code: string) => {
  try {
    const { tokens } = await googleAuthConfig.getToken(code);
    return tokens;
  } catch (error) {
    console.error('Error exchanging Google token:', error);
    throw new BDError(
      'Failed to exchange token',
      HttpStatusCode.Unauthorized,
      ErrorCode.AuthServiceError,
    );
  }
};
