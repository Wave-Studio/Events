export const isUUID = (uuid: string) => {
  if (uuid.length != 36) return false;
  const uuidRegex =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

  return uuidRegex.test(uuid);
};

export const isTicketUUID = (uuid: string) => {
  if (uuid.length != 110) return false;

  for (const segment of uuid.split('_')) {
    if (!isUUID(segment)) return false;
  }

  return true;
};