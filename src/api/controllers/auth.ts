import { Request, Response } from 'express';
import { validationCode } from '../../validators/auth';
import { handleGoogleAuth } from '../managers/auth';
import { generateAuthUrl, generateState } from '../../utils/auth';
import { HttpStatusCode } from '../../utils/bdError';

export class AuthController {
  public async googleLogin(): Promise<string> {
    const state = generateState();
    return generateAuthUrl(state);
  }

  public async googleCallback(req: Request, res: Response): Promise<void> {
    const validationResult = validationCode.safeParse(req.query);

    if (!validationResult.success) {
      res.status(HttpStatusCode.BadRequest).json({
        error: 'Invalid request parameters',
        details: validationResult.error.errors,
      });
      return;
    }

    const { code } = validationResult.data;
    await handleGoogleAuth(code, req, res);
  }

  public async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie('session_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      res.clearCookie('user_email', { secure: true, sameSite: 'strict' });

      res.status(HttpStatusCode.Ok).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout Error:', { error });
      throw new Error('Logout failed');
    }
  }
}
