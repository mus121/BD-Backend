import { Get, Inject, Route, Tags } from 'tsoa';
import { ICurrentUser } from '../../interfaces/auth';
import { auth } from '../../lib/firebase';
import { getUserById } from '../managers/user';
import { User } from '../../interfaces/models/users';
import { BDError, ErrorCode, HttpStatusCode } from '../../utils/bdError';

// @Tags('users')
// @Route('users')
// export class UserController {
//   @Get('/user')
//   public async getUserById(
//     userId: string,
//   ): Promise<Pick<User, 'id' | 'email'>> {
//     const user = await getUserById(userId);
//     if (!user) {
//       throw new BDError(
//         'User not found',
//         HttpStatusCode.NotFound,
//         ErrorCode.ControllerError,
//       );
//     }
//     return user;
//   }
// }

// @Tags('users')
// @Route('users')
// export class UserController {
//   @Get('/user')
//   @Get('/current')
//   public async currentUser(
//     @Inject() id: number,
//     @Inject() firebaseUId: string,
//   ): Promise<ICurrentUser | null> {
//     const [dbUser] = await Promise.all([getUserByKey(id)]);

//     console.log('Db USER', dbUser);
//     if (dbUser) {
//       const userToReturn = {
//         email: dbUser.email,
//         name: dbUser.name || null,
//         id: dbUser.id,
//         isBlocked: dbUser.is_blocked,
//         isOnboarded: dbUser.onboarded,
//       };
//       return userToReturn;
//     }
//     return null;
//   }
// }
