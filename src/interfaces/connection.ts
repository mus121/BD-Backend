import { Transaction } from 'sequelize';

export type ProfileConnectionResult = {
  success: boolean;
  message: string;
};

export type ConnectedProfile = {
  public_identifier: string;
  entity_urn: string;
};
export type ExistingConnection = {
  id: string;
  public_identifier: string;
  entity_urn: string;
  connection_status: boolean;
};
export type ExistingConnections = {
  id: string;
  publicIdentifier: string;
  entityUrn: string;
  connectionStatus: boolean;
};

export type LiProfile = {
  userId: string;
  firstName: string;
  lastName: string;
  publicIdentifier: string;
  entityUrn: string;
};

export type LiConnection = {
  userId: string;
  firstName: string;
  lastName: string;
  publicIdentifier: string;
  entityUrn: string;
};

export type LiConnectionProfile = {
  userId: string;
  publicIdentifier: string;
  entityUrn: string;
  connectionStatus: boolean;
};

export type RetrieveConnection = {
  userId: string;
};

export type InserNewConnection = {
  userId: string;
  publicIdentifier: string;
  entityUrn: string;
  connectionStatus: boolean;
  transaction: Transaction;
};
export type UpdateConnection = {
  id: string;
  publicIdentifier: string;
  entityUrn: string;
  connectionStatus: boolean;
  transaction: Transaction;
};

export type FetchExistingConnection = {
  userId: string;
  publicIdentifier: string;
  transaction: Transaction;
};
