import { TokenPayload } from './models/users';

export type AuthDataType = {
  accessToken: string;
  refreshToken: string;
  userInfo: TokenPayload;
};
export type UserAttributes = {
  name?: string;
  email: string;
  id: number;
  external_uid: string;
  password: string;
  is_blocked: boolean;
  is_verified: boolean;
  refresh_token: string;
  last_login_at: string;
  deletedAt?: Date | null;
  onboarded: boolean;
};

export type ICurrentUser = {
  email: string;
  name: string | null;
  id: number;
  isBlocked: boolean;
  isOnboarded: boolean;
};
