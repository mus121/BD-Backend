import { HttpStatusCode, isAxiosError } from 'axios';
import { NextFunction, Request, Response } from 'express';
import setCookieParser from 'set-cookie-parser';
import { IGetCurrentUserResponse } from '../../interfaces/managers/qlu2';
import { ErrorCode, BDError } from '../../utils/bdError';
import retry from '../../utils/retry';
import { setSessionCookie } from '../managers/auth/cookies';
import qlu2AxiosInstance from '../managers/qlu2';
import { COOKIE_NAME } from '../../constants';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { [COOKIE_NAME.sessionCookieName]: session } = req.cookies;

    if (!session) {
      throw new BDError(
        'Invalid access token',
        HttpStatusCode.Unauthorized,
        ErrorCode.ValidationFailed,
      );
    } else {
      try {
        const response = await retry(
          () =>
            qlu2AxiosInstance.get<IGetCurrentUserResponse>(
              `/public/auth/current`,
              {
                headers: {
                  cookie: `${COOKIE_NAME.sessionCookieName}=${session};`,
                },
              },
            ),
          3,
          1 * 1000,
        );

        if (!response.data?.response) {
          throw new BDError(
            'Invalid access token',
            HttpStatusCode.Unauthorized,
            ErrorCode.ValidationFailed,
          );
        }

        res.locals.user = response.data.response;
        response.headers['set-cookie']?.forEach((cookie) => {
          const parsedCookie = setCookieParser.parseString(cookie, {
            decodeValues: true,
          });

          if (parsedCookie.name === COOKIE_NAME.sessionCookieName) {
            setSessionCookie(res, {
              sessionCookie: parsedCookie.value,
              domain: parsedCookie.domain,
              httpOnly: parsedCookie.httpOnly,
              secure: parsedCookie.secure,
              expires: parsedCookie.expires,
            });
          }
        });

        return next();
      } catch (error) {
        if (isAxiosError(error)) {
          error.response?.headers['set-cookie']?.forEach((cookie) => {
            const parsedCookie = setCookieParser.parseString(cookie, {
              decodeValues: true,
            });

            if (parsedCookie.name === COOKIE_NAME.sessionCookieName) {
              setSessionCookie(res, {
                sessionCookie: parsedCookie.value,
                domain: parsedCookie.domain,
                httpOnly: parsedCookie.httpOnly,
                secure: parsedCookie.secure,
                expires: parsedCookie.expires,
              });
            }
          });
        }
        throw error;
      }
    }
  } catch (e) {
    console.log('Error in auth middleware', { e });
    const error = new BDError(
      'unauthenticated',
      HttpStatusCode.Unauthorized,
      ErrorCode.ValidationFailed,
    );
  }
};
