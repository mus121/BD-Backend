import { google } from 'googleapis';
import { BD_AUTH, BD_CONFIG } from '../src/constants';
import { BDError, HttpStatusCode, ErrorCode } from '../src/utils/bdError';

if (
  !BD_AUTH.googleClientId ||
  !BD_AUTH.googleClientSecret ||
  !BD_CONFIG.serverUrl
) {
  throw new BDError(
    'Missing required environment variables for Google OAuth2 configuration',
    HttpStatusCode.InternalServerError,
    ErrorCode.AuthServiceError,
  );
}

export const googleAuthConfig = new google.auth.OAuth2(
  BD_AUTH.googleClientId,
  BD_AUTH.googleClientSecret,
  `${BD_CONFIG.serverUrl}/public/auth/google/callback`,
);
