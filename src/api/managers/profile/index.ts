import { QueryTypes, Transaction } from 'sequelize';
import { ulid } from 'ulid';
import { HttpStatusCode, BDError, ErrorCode } from '../../../utils/bdError';
import {
  ProfileConnectionResult,
  LiConnection,
} from '../../../interfaces/connection';
import { sequelize } from '../../../../database';

/**
 * Fetch existing LinkedIn profile by user ID
 */
const fetchLinkedInProfileId = async (
  userId: string,
  transaction: Transaction,
): Promise<string | null> => {
  const result: { id: string }[] = await sequelize.query(
    'SELECT id FROM linkedin_profile WHERE user_id = :userId LIMIT 1;',
    {
      type: QueryTypes.SELECT,
      replacements: { userId },
      transaction,
    },
  );
  return result.length > 0 ? result[0].id : null;
};

/**
 * Update LinkedIn profile if it exists
 */
const updateLinkedInProfileByUserId = async (
  userId: string,
  firstName: string,
  lastName: string,
  publicIdentifier: string,
  entityUrn: string,
  transaction: Transaction,
): Promise<void> => {
  await sequelize.query(
    `UPDATE linkedin_profile 
      SET first_name = :firstName, 
          last_name = :lastName, 
          public_identifier = :publicIdentifier, 
          entity_urn = :entityUrn, 
          updated_at = NOW()
      WHERE user_id = :userId;`,
    {
      type: QueryTypes.UPDATE,
      replacements: {
        userId,
        firstName,
        lastName,
        publicIdentifier,
        entityUrn,
      },
      transaction,
    },
  );
};

/**
 * Create a new LinkedIn profile
 */
const insertLinkedInProfile = async (
  userId: string,
  firstName: string,
  lastName: string,
  publicIdentifier: string,
  entityUrn: string,
  transaction: Transaction,
): Promise<void> => {
  const id = ulid();
  await sequelize.query(
    `INSERT INTO linkedin_profile (id, user_id, first_name, last_name, public_identifier, entity_urn, created_at, updated_at)
      VALUES (:id, :userId, :firstName, :lastName, :publicIdentifier, :entityUrn, NOW(), NOW());`,
    {
      type: QueryTypes.INSERT,
      replacements: {
        id,
        userId,
        firstName,
        lastName,
        publicIdentifier,
        entityUrn,
      },
      transaction,
    },
  );
};

/**
 * Main function to create or update LinkedIn profile
 */
export const saveLinkedInProfile = async ({
  userId,
  firstName,
  lastName,
  publicIdentifier,
  entityUrn,
}: LiConnection): Promise<ProfileConnectionResult> => {
  const transaction = await sequelize.transaction();

  try {
    const existingProfileId = await fetchLinkedInProfileId(userId, transaction);

    if (existingProfileId) {
      await updateLinkedInProfileByUserId(
        userId,
        firstName,
        lastName,
        publicIdentifier,
        entityUrn,
        transaction,
      );
    } else {
      await insertLinkedInProfile(
        userId,
        firstName,
        lastName,
        publicIdentifier,
        entityUrn,
        transaction,
      );
    }

    await transaction.commit();
    return {
      success: true,
      message: 'LinkedIn profile saved/updated successfully',
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
