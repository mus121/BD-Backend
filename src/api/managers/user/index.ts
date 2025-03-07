import { QueryTypes } from 'sequelize';
import { sequelize } from '../../../../database/index';
import { User } from '../../../interfaces/models/users';
import { HttpStatusCode, BDError, ErrorCode } from '../../../utils/bdError';

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const rows = await sequelize.query<User>(
      'SELECT id, email FROM "user" WHERE id = :userId',
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      },
    );

    console.log('User Query Result:', rows);

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
