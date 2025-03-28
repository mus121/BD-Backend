import { ProfileRequest, EsIds } from '../../../interfaces/aiService';

export const getProfileSegmentByEsids = async (
  esIds: EsIds,
): Promise<ProfileRequest> => {
  const response = await fetch(`${process.env.AI_END_POINT}/similar_profiles`, {
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

export const getProfileSegmentByLabel = async (label: {
  label: string;
}): Promise<{ ids: string[] }> => {
  const response = await fetch(`${process.env.AI_END_POINT}/receive_prompts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(label),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `Error ${response.status}: ${result.message || response.statusText}`,
    );
  }

  return {
    ids: result.profiles.map((profile: { id: string }) => profile.id),
  };
};
