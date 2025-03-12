import { TokenPayload } from './models/users';

export type AuthDataType = {
  accessToken: string;
  refreshToken: string;
  userInfo: TokenPayload;
};
