import { z } from 'zod';

export const liConnectionSchema = {
  body: z.object({
    userId: z.number(),
    firstName: z.string().min(1, 'first name is required'),
    lastName: z.string().min(1, 'last name is required'),
    headline: z.string().min(1, 'headline is required'),
    profilePicture: z.string().url('Invalid URL format'),
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
    userId: z.number(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    publicIdentifier: z.string().optional(),
    entityUrn: z.string().optional(),
  }),
};
