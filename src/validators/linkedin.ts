import { z } from 'zod';

export const liConnectionSchema = {
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    publicIdentifier: z.string().min(1, 'Public Identifier is required'),
    entityUrn: z.string().min(1, 'Entity URN is required'),
    connectionStatus: z.boolean(),
  }),
};

export const getConnectedProfilesSchema = {
  query: z.object({
    userId: z.string().min(1, { message: 'User ID is required' }),
  }),
};

export const liProfileSchema = {
  body: z.object({
    userId: z.string().ulid(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    publicIdentifier: z.string().optional(),
    entityUrn: z.string().optional(),
  }),
};
