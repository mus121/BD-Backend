import { QueryTypes, Transaction } from 'sequelize';
import { ulid } from 'ulid';
import { sequelize } from '../../../../../database';
import { HttpStatusCode, BDError, ErrorCode } from '../../../../utils/bdError';
import {
  FollowProfileResult,
  ExistingFollow,
  FollowProfileData,
  InsertNewFollow,
  UpdateFollow,
  FetchExistingFollow,
} from '../../../../interfaces/followProfile';

/**
 * Fetch an existing follow request by es_id
 */
const fetchExistingFollow = async ({
  esId,
}: FetchExistingFollow): Promise<ExistingFollow | null> => {
  if (!esId) {
    console.error('fetchExistingFollow Error: esId is undefined or null');
    throw new Error('fetchExistingFollow Error: esId is required');
  }

  console.log('Executing fetchExistingFollow with esId:', esId);

  const result = await sequelize.query<ExistingFollow>(
    `SELECT id, es_id AS "esId", connection_status AS "connectionStatus"
     FROM "follow_profile"
     WHERE es_id = :esId`,
    {
      type: QueryTypes.SELECT,
      replacements: { esId },
    },
  );

  return result.length > 0 ? result[0] : null;
};

/**
 * Update only the timestamp of an existing follow request
 */
const updateFollowTimestamp = async (id: string, transaction: Transaction) => {
  await sequelize.query(
    `UPDATE "follow_profile"
     SET updated_at = NOW()
     WHERE id = :id`,
    {
      type: QueryTypes.UPDATE,
      replacements: { id },
      transaction,
    },
  );
};

/**
 * Update follow status if changed
 */
const updateFollowDetails = async ({
  id,
  connectionStatus,
  transaction,
}: UpdateFollow) => {
  try {
    await sequelize.query(
      `UPDATE "follow_profile"
       SET connection_status = :connectionStatus, updated_at = NOW()
       WHERE id = :id`,
      {
        type: QueryTypes.UPDATE,
        replacements: { id, connectionStatus },
        transaction,
      },
    );
  } catch (error) {
    console.error('Error updating follow details:', error);
    throw new Error('Failed to update follow details');
  }
};

/**
 * Insert a new follow request into the database
 */
const insertNewFollow = async ({
  esId,
  connectionStatus,
  transaction,
}: InsertNewFollow) => {
  const id = ulid();
  await sequelize.query(
    `INSERT INTO "follow_profile" (id, es_id, connection_status, created_at, updated_at)
     VALUES (:id, :esId, :connectionStatus, NOW(), NOW())`,
    {
      type: QueryTypes.INSERT,
      replacements: { id, esId, connectionStatus },
      transaction,
    },
  );
};

/**
 * Handle follow request logic: create, update, or refresh timestamp
 */
export const handleFollowProfile = async ({
  esId,
  connectionStatus,
}: FollowProfileData): Promise<FollowProfileResult> => {
  if (!esId) {
    console.error('handleFollowProfile Error: esId is missing');
    throw new Error('handleFollowProfile Error: esId is required');
  }

  console.log('handleFollowProfile received:', { esId, connectionStatus });

  const transaction = await sequelize.transaction();
  try {
    const existingFollow = await fetchExistingFollow({ esId, transaction });

    if (existingFollow) {
      const { id, connectionStatus: existingStatus } = existingFollow;

      if (existingStatus === connectionStatus) {
        await updateFollowTimestamp(id, transaction);
      } else {
        await updateFollowDetails({ id, esId, connectionStatus, transaction });
      }
    } else {
      await insertNewFollow({ esId, connectionStatus, transaction });
    }

    await transaction.commit();
    return {
      success: true,
      message: 'Follow profile updated successfully',
    };
  } catch (error) {
    await transaction.rollback();
    console.error('Database Error:', error);
    throw new BDError(
      'Database operation failed',
      HttpStatusCode.InternalServerError,
      ErrorCode.DBError,
    );
  }
};

/**
 * Fetch follow profile details by esId
 */
export const handleGetFollowProfile = async (): Promise<string[] | null> => {
  try {
    const result = await sequelize.query<{ esId: string }>(
      `SELECT  es_id AS "esId"
         FROM "follow_profile"
         where connection_status= true`,
      {
        type: QueryTypes.SELECT,
      },
    );

    return result.length > 0 ? result.map((item) => item.esId) : null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new BDError(
      'Database operation failed',
      HttpStatusCode.InternalServerError,
      ErrorCode.DBError,
    );
  }
};
