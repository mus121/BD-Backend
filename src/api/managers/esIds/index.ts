export const esIdsFetch = async (publicIdentifiers: string[]) => {
  const response = await fetch(
    `${process.env.BD_ESID_PUBLIC_IDENTIFIER}/retrieveProfileIdByPublicIdentifier`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.QLU_BD_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(publicIdentifiers),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `Error ${response.status}: ${result.message || response.statusText}`,
    );
  }

  return {
    profiles: result.map((es_id: { id: string }) => ({
      es_id: es_id.id,
    })) as { es_id: string }[],
  };
};
