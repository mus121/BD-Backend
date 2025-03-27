import { ProfileRequest } from '../../../interfaces/aiService';

export const getProfileSegmentByEsids = async (esIds: {
  profiles: {
    es_id: string;
  }[];
}): Promise<ProfileRequest> => {
  const response = await fetch(`${process.env.AI_END_POINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(esIds),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `Error ${response.status}: ${result.message || response.statusText}`,
    );
  }

  return result;
};
