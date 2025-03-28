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
  userId: number;
  firstName: string;
  lastName: string;
  publicIdentifier: string;
  entityUrn: string;
};

export type LiConnection = {
  userId: number;
  firstName: string;
  lastName: string;
  publicIdentifier: string;
  entityUrn: string;
};

export type LiConnectionProfile = {
  userId: number;
  firstName: string;
  lastName: string;
  headline: string;
  profilePicture: string;
  publicIdentifier: string;
  entityUrn: string;
  connectionStatus: boolean;
};

export type RetrieveConnection = {
  userId: number;
};

export type InserNewConnection = {
  userId: number;
  firstName: string;
  lastName: string;
  headline: string;
  profilePicture: string;
  publicIdentifier: string;
  entityUrn: string;
  connectionStatus: boolean;
  transaction: Transaction;
};
export type UpdateConnection = {
  id: string;
  firstName: string;
  lastName: string;
  headline: string;
  profilePicture: string;
  publicIdentifier: string;
  entityUrn: string;
  connectionStatus: boolean;
  transaction: Transaction;
};

export type FetchExistingConnection = {
  userId: number;
  publicIdentifier: string;
  transaction: Transaction;
};
