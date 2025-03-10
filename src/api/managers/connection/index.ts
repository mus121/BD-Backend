import { QueryTypes, Transaction } from 'sequelize';
import { ulid } from 'ulid';
import { sequelize } from '../../../../database';
import { HttpStatusCode, BDError, ErrorCode } from '../../../utils/bdError';
import {
  ProfileConnectionResult,
  ConnectedProfile,
  ExistingConnection,
  LiConnectionProfile,
  RetrieveConnection,
  InserNewConnection,
  UpdateConnection,
  FetchExistingConnection,
} from '../../../interfaces/connection';

/**
 * Fetch an existing connection by user ID and public identifier
 */
const fetchExistingConnection = async ({
  userId,
  publicIdentifier,
  transaction,
}: FetchExistingConnection): Promise<ExistingConnection | null> => {
  const result = await sequelize.query<ExistingConnection>(
    `SELECT id, 
            public_identifier AS "publicIdentifier", 
            entity_urn AS "entityUrn", 
            connection_status AS "connectionStatus" 
     FROM "connection" 
     WHERE user_id = :userId AND public_identifier = :publicIdentifier`,
    {
      type: QueryTypes.SELECT,
      replacements: { userId, publicIdentifier },
      transaction,
    },
  );

  return result.length > 0 ? result[0] : null;
};

/**
 * Update only the timestamp of an existing connection
 */
const updateConnectionTimestamp = async (
  id: string,
  transaction: Transaction,
) => {
  await sequelize.query(
    `UPDATE "connection"
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
 * Update connection details if entity URN or connection status changes
 */
const updateConnectionDetails = async ({
  id,
  publicIdentifier,
  entityUrn,
  connectionStatus,
  transaction,
}: UpdateConnection) => {
  await sequelize.query(
    `UPDATE "connection"
     SET public_identifier = :publicIdentifier,
         entity_urn = :entityUrn, 
         connection_status = :connectionStatus, 
         updated_at = NOW()
     WHERE id = :id`,
    {
      type: QueryTypes.UPDATE,
      replacements: { id, publicIdentifier, entityUrn, connectionStatus },
      transaction,
    },
  );
};

/**
 * Insert a new connection into the database
 */
const insertNewConnection = async ({
  userId,
  publicIdentifier,
  entityUrn,
  connectionStatus,
  transaction,
}: InserNewConnection) => {
  const id = ulid();
  await sequelize.query(
    `INSERT INTO "connection" (id, user_id, public_identifier, entity_urn, connection_status, created_at, updated_at)
     VALUES (:id, :userId, :publicIdentifier, :entityUrn, :connectionStatus, NOW(), NOW())`,
    {
      type: QueryTypes.INSERT,
      replacements: {
        id,
        userId,
        publicIdentifier,
        entityUrn,
        connectionStatus,
      },
      transaction,
    },
  );
};

/**
 * Handle profile connection logic: create, update, or refresh timestamp
 */
export const handleProfileConnection = async ({
  userId,
  publicIdentifier,
  entityUrn,
  connectionStatus,
}: LiConnectionProfile): Promise<ProfileConnectionResult> => {
  const transaction = await sequelize.transaction();
  try {
    const existingConnection = await fetchExistingConnection({
      userId,
      publicIdentifier,
      transaction,
    });

    if (existingConnection) {
      const {
        id,
        public_identifier: existingPublicIdentifier,
        entity_urn: existingEntityUrn,
        connection_status: existingConnectionStatus,
      } = existingConnection;

      if (
        existingPublicIdentifier === publicIdentifier &&
        existingEntityUrn === entityUrn &&
        existingConnectionStatus === connectionStatus
      ) {
        await updateConnectionTimestamp(id, transaction);
      } else {
        await updateConnectionDetails({
          id,
          publicIdentifier,
          entityUrn,
          connectionStatus,
          transaction,
        });
      }
    } else {
      await insertNewConnection({
        userId,
        publicIdentifier,
        entityUrn,
        connectionStatus,
        transaction,
      });
    }

    await transaction.commit();
    return {
      success: true,
      message: 'Profile connection updated successfully',
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
 * Retrieve connected profiles for a user
 */
export const retrieveConnectedProfiles = async ({
  userId,
}: RetrieveConnection): Promise<ConnectedProfile[]> => {
  try {
    const query = `
      SELECT public_identifier, entity_urn 
      FROM "connection"
      WHERE user_id = :userId AND connection_status = TRUE
    `;

    const profiles = await sequelize.query<ConnectedProfile>(query, {
      type: QueryTypes.SELECT,
      replacements: { userId },
    });
    return profiles;
  } catch (error) {
    console.error('Database Error:', error);
    throw new BDError(
      'Failed to retrieve profile data',
      HttpStatusCode.InternalServerError,
      ErrorCode.DBError,
    );
  }
};
