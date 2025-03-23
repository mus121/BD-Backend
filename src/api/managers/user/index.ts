import { QueryTypes } from 'sequelize';
import { sequelize } from '../../../../database/index';
import { User } from '../../../interfaces/models/users';
import { HttpStatusCode, BDError, ErrorCode } from '../../../utils/bdError';
import { UserAttributes } from '../../../interfaces/auth';

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const rows = await sequelize.query<User>(
      'SELECT id, email FROM "user" WHERE id = :userId',
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      },
    );

    if (!rows || rows.length === 0) {
      console.log('Returning null because user not found');
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error('Database error in getUserById:', error);
    throw new BDError(
      'Failed to fetch user',
      HttpStatusCode.InternalServerError,
      ErrorCode.DBError,
    );
  }
};

/**
 *
 * @param id: primary key of the user
 * @return: User
 */
export const getUserByKey = async (
  id: number,
): Promise<Pick<
  UserAttributes,
  'id' | 'name' | 'email' | 'onboarded' | 'is_blocked'
> | null> => {
  try {
    const replacements = {
      id,
    };

    const user = await sequelize.query<
      Pick<UserAttributes, 'id' | 'name' | 'email' | 'onboarded' | 'is_blocked'>
    >(
      `SELECT id, name, email, onboarded, is_blocked
       FROM user u 
       WHERE u.id = :id`,
      {
        replacements,
        type: QueryTypes.SELECT,
      },
    );
    if (user && user.length === 1) return user[0];
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
