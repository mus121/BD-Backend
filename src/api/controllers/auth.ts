import { ParsedQs } from 'qs';
import { validationCode } from '../../validators/auth';
import { handleGoogleAuth } from '../managers/auth';
import { generateAuthUrl, generateState } from '../../utils/auth';
import { TokenPayload } from '../../interfaces/models/users';

interface AuthDataType {
  accessToken: string;
  refreshToken: string;
  userInfo: TokenPayload;
}

export class AuthController {
  public async googleLogin(): Promise<string> {
    const state = generateState();
    return generateAuthUrl(state);
  }

  public async googleCallback(
    query: ParsedQs,
  ): Promise<AuthDataType | undefined> {
    try {
      const validationResult = validationCode.safeParse(query);

      if (!validationResult.success) {
        console.log('Vadiation error');
      }

      if (!validationResult.success || !validationResult.data) {
        throw new Error('Validation error');
      }
      const { code } = validationResult.data;
      const authData = await handleGoogleAuth(code);

      return authData;
    } catch (error) {
      console.error('Error during Google authentication:', error);
      throw new Error('Google authentication failed');
    }
  }
}
