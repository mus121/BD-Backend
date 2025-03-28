import { QueryTypes } from 'sequelize';
import { sequelize } from '../../../../database/index';
import { UserAttributes } from '../../../interfaces/auth';

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
