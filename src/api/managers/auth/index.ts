import { Request, Response } from 'express';
import { QueryTypes, Transaction } from 'sequelize';
import { ulid } from 'ulid';
import { FetchUser, UserAttributes } from '../../../interfaces/models/users';
import { sequelize } from '../../../../database';
import { BDError, ErrorCode, HttpStatusCode } from '../../../utils/bdError';
import { fetchGoogleUserInfo, exchangeToken } from '../../../utils/auth';
import { generateJWT } from '../../../utils/jwtUtils';
import { BD_CONFIG } from '../../../constants';

// Fetch user by email
export const getUserByEmail = async ({
  email,
}: {
  email: string;
}): Promise<UserAttributes | null> => {
  const user = await sequelize.query<UserAttributes>(
    'SELECT * FROM "user" WHERE email = :email LIMIT 1;',
    {
      replacements: { email },
      type: QueryTypes.SELECT,
    },
  );
  return user.length > 0 ? user[0] : null;
};

// Create a new user
export const createUser = async ({
  email,
  sessionToken,
  refreshToken,
  transaction,
}: FetchUser): Promise<string> => {
  const userId = ulid();
  await sequelize.query(
    `INSERT INTO "user" (id, email, session_token, refresh_token, created_at, updated_at)
     VALUES (:id, :email, :sessionToken, :refreshToken, NOW(), NOW());`,
    {
      replacements: { id: userId, email, sessionToken, refreshToken },
      type: QueryTypes.INSERT,
      transaction,
    },
  );
  return userId;
};

// Link authentication provider
export const createAuthProvider = async (
  userId: string,
  authProvider: 'google' | 'microsoft',
  transaction: Transaction,
) => {
  const authProviderId = ulid();
  await sequelize.query(
    `INSERT INTO auth_provider (id, user_id, provider, created_at, updated_at)
     VALUES (:authId, :userId, :provider, NOW(), NOW());`,
    {
      replacements: { authId: authProviderId, userId, provider: authProvider },
      type: QueryTypes.INSERT,
      transaction,
    },
  );
};

export const findOrCreateUser = async (
  authProvider: 'google' | 'microsoft',
  sessionToken: string,
  refreshToken: string,
  email: string,
): Promise<string> => {
  const transaction = await sequelize.transaction();
  try {
    const existingUser = await getUserByEmail({ email });

    if (existingUser) {
      await transaction.commit();
      return existingUser.id;
    }

    // Create user & auth provider inside transaction
    const newUserId = await createUser({
      email,
      sessionToken,
      refreshToken,
      transaction,
    });
    await createAuthProvider(newUserId, authProvider, transaction);

    await transaction.commit();
    return newUserId;
  } catch (error) {
    await transaction.rollback();
    console.error('Error in findOrCreateUser:', error);
    throw new BDError(
      HttpStatusCode.InternalServerError.toString(),
      HttpStatusCode.InternalServerError,
      ErrorCode.DBError,
    );
  }
};

const setCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
  userInfo: { email: string; id: string },
) => {
  res.cookie('session_token', accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie('user_email', userInfo.email, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie('user_id', userInfo.id, { httpOnly: true, secure: true });
};

export const handleGoogleAuth = async (
  code: string,
  req: Request,
  res: Response,
) => {
  try {
    const token = await exchangeToken(code);
    if (!token.access_token) throw new Error('Failed to get Access Token');

    const userInfo = await fetchGoogleUserInfo(token.access_token);

    if (!token.refresh_token || !userInfo.email) {
      throw new Error('Missing required token or user information');
    }

    const userId = await findOrCreateUser(
      'google',
      token.access_token,
      token.refresh_token,
      userInfo.email,
    );

    // Generate JWT tokens
    const accessToken = generateJWT({ id: userId }, 15 * 60);
    const refreshToken = generateJWT({ id: userId }, 7 * 24 * 60 * 60);

    // Set cookies
    setCookies(res, accessToken, refreshToken, {
      email: userInfo.email,
      id: userId,
    });

    return res.redirect(BD_CONFIG.homePage ?? '/');
  } catch (error) {
    console.error('Error during Google authentication:', error);
    if (!res.headersSent) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'Authentication failed' });
    }
  }
};
