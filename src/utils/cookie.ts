import { Response, Request } from 'express';

export const setCookies = (req: Request, res: Response) => {
  if (res.locals.authData) {
    const { accessToken, refreshToken, userInfo } = res.locals.authData;

    res.cookie('access_token', accessToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'none',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('user_id', userInfo.id, {
      httpOnly: false,
      secure: false,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('user_email', userInfo.email, {
      httpOnly: false,
      secure: false,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.locals.userInfo = userInfo;
  }
};
