import { Transaction } from 'sequelize';

export type UserAttributes = {
  id: string;
  user_id: string;
  email: string;
  sessionToken: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
  transaction: Transaction;
};

export type TokenPayload = {
  id: string;
  email: string;
  name?: string;
};

export type User = {
  id: string;
  email: string;
};

export type FetchUser = {
  email: string;
  sessionToken: string;
  refreshToken: string;
  transaction: Transaction;
};
