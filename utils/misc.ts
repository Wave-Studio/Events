export const removeKeysWithSameValues = (
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>,
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  for (const key in obj1) {
    if (key in obj1 && key in obj2 && obj1[key] !== obj2[key]) {
      result[key] = obj2[key];
    }
  }

  return result;
};
