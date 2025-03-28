import { QueryTypes, Transaction } from 'sequelize';
import { ulid } from 'ulid';
import { sequelize } from '../../../../../database';
import { BDError, ErrorCode, HttpStatusCode } from '../../../../utils/bdError';
import { ProfileLabels } from '../../../../interfaces/aiService';

/**
 * Check if the profile segment exists
 */
const fetchProfileSegmentId = async (
  userId: number,
  labels: string,
  transaction: Transaction,
): Promise<number | null> => {
  try {
    const result = await sequelize.query<{ id: number }>(
      'SELECT id FROM profile_segments WHERE user_id = :userId AND labels = :labels LIMIT 1;',
      {
        type: QueryTypes.SELECT,
        replacements: { userId, labels: JSON.stringify(labels) },
        transaction,
      },
    );
    return result.length > 0 ? result[0].id : null;
  } catch (error) {
    console.error('Error fetching profile segment:', error);
    throw error;
  }
};

/**
 * Update profile segment if it exists
 */
const updateProfileSegment = async (
  userId: number,
  labels: string,
  isChecked: boolean,
  transaction: Transaction,
): Promise<void> => {
  try {
    await sequelize.query(
      `UPDATE profile_segments 
        SET is_checked = :isChecked, updated_at = NOW()
        WHERE user_id = :userId AND labels = :labels;`,
      {
        type: QueryTypes.UPDATE,
        replacements: { userId, labels: JSON.stringify(labels), isChecked },
        transaction,
      },
    );
  } catch (error) {
    console.error('Error updating profile segment:', error);
    throw error;
  }
};

/**
 * Create a new profile segment
 */
const insertProfileSegment = async (
  userId: number,
  labels: string,
  isChecked: boolean,
  transaction: Transaction,
): Promise<void> => {
  const id = ulid();

  try {
    await sequelize.query(
      `INSERT INTO profile_segments (id, user_id, labels, is_checked, created_at, updated_at)
        VALUES (:id, :userId, :labels, :isChecked, NOW(), NOW());`,
      {
        type: QueryTypes.INSERT,
        replacements: { id, userId, labels: JSON.stringify(labels), isChecked },
        transaction,
      },
    );
  } catch (error) {
    console.error('Error inserting profile segment:', error);
    throw error;
  }
};

/**
 * Main function to create or update profile segments
 */
export const saveProfileSegment = async ({
  userId,
  labels,
  isChecked,
}: ProfileLabels): Promise<{ success: boolean; message: string }> => {
  const transaction = await sequelize.transaction();
  try {
    const existingSegmentId = await fetchProfileSegmentId(
      userId,
      labels,
      transaction,
    );
    if (existingSegmentId) {
      await updateProfileSegment(userId, labels, isChecked, transaction);
    } else {
      await insertProfileSegment(userId, labels, isChecked, transaction);
    }

    await transaction.commit();
    return {
      success: true,
      message: 'Profile segment saved/updated successfully',
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
 * Fetch profile segment labels by userId
 */
export const fetchProfileSegmentLabels = async (
  userId: number,
): Promise<string[]> => {
  try {
    const result = await sequelize.query<{ labels: string }>(
      'SELECT labels FROM profile_segments WHERE user_id = :userId;',
      {
        type: QueryTypes.SELECT,
        replacements: { userId },
      },
    );

    return result.map((row) => row.labels);
  } catch (error) {
    console.error('Error fetching profile segment labels:', error);
    throw new BDError(
      'Failed to fetch profile segment labels',
      HttpStatusCode.InternalServerError,
      ErrorCode.DBError,
    );
  }
};
