export type LiiConnectionAttributes = {
  id: number;
  userId: number;
  publicIdentifier: string;
  entityUrn: string;
  isConnected: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

export type LiProfileAttributes = {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  public_identifier?: string;
  entity_urn?: string;
  created_at: Date;
  updated_at: Date;
};
