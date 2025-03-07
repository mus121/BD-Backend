import { Get, Route, Tags } from 'tsoa';
import { getUserById } from '../managers/user';
import { User } from '../../interfaces/models/users';
import { BDError, ErrorCode, HttpStatusCode } from '../../utils/bdError';

@Tags('users')
@Route('users')
export class UserController {
  @Get('/user')
  public async getUserById(
    userId: string,
  ): Promise<Pick<User, 'id' | 'email'>> {
    const user = await getUserById(userId);
    if (!user) {
      throw new BDError(
        'User not found',
        HttpStatusCode.NotFound,
        ErrorCode.ControllerError,
      );
    }
    return user;
  }
}
