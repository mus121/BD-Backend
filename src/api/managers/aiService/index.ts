import { Profile } from '../../../interfaces/aiService';
import { profiles } from '../../../data/profile';

export const getProfiles = (): Profile[] => {
  return profiles;
};
