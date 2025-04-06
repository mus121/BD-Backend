// These types should be placed in ../../../types/follow.ts

import { Transaction } from 'sequelize';

export type FollowProfileResult = {
  success: boolean;
  message: string;
};

export type FollowedProfile = {
  id: string;
  esId: string;
  connectionStatus: boolean;
};

export type ExistingFollow = {
  id: string;
  esId: string;
  connectionStatus: boolean;
};

export type ProfileFollowRequest = {
  esId: string;
  connectionStatus: boolean;
};

export type RetrieveFollowsRequest = {
  // You could add filters here if needed
};

export type InsertNewFollow = {
  userId: number;
  esId: string;
  connectionStatus: boolean;
  transaction: Transaction;
};

export type UpdateFollow = {
  id: string;
  esId: string;
  connectionStatus: boolean;
  transaction: Transaction;
};

export type FetchExistingFollow = {
  esId: string;
  transaction?: Transaction;
};

export type FollowProfileData = {
  userId: number;
  esId: string;
  connectionStatus: boolean;
};
