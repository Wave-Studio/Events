export const removeKeysWithSameValues = (
  old: Record<string, unknown>,
  newobj: Record<string, unknown>,
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  for (const key in newobj) {
    if (!(key in old) || old[key] !== newobj[key]) {
      result[key] = newobj[key];
    }
  }

  return result;
};
