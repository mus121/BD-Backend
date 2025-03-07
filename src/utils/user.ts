import { Request } from 'express';
import { QueryTypes } from 'sequelize';
import { sequelize } from '../../database';

export const getUserIdFromDb = async (req: Request): Promise<number | null> => {
  const sessionToken = req.cookies.session_token;
  if (!sessionToken) return null;

  const user = await sequelize.query<{ id: number }>(
    'SELECT id FROM user WHERE "sessionToken" = :sessionToken;',
    {
      type: QueryTypes.SELECT,
      replacements: { sessionToken },
    },
  );

  return user.length > 0 ? (user[0] as { id: number }).id : null;
};
