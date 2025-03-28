export const profileFetchByEsids = async (es_id: string[]) => {
  const response = await fetch(
    `${process.env.BD_ESID_PUBLIC_IDENTIFIER}/getProfilesByProfileIds`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.QLU_BD_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ esIds: es_id }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `Error ${response.status}: ${result.message || response.statusText}`,
    );
  }

  return result;
};
