export const removeKeysWithSameValues = (
  obj1: Record<string, string | undefined | number>,
  obj2: Record<string, string | undefined | number>,
): Record<string, string | undefined | number> => {
  const result: Record<string, string | undefined | number> = {};

  for (const key in obj1) {
    if (key in obj1 && key in obj2 && obj1[key] !== obj2[key]) {
      result[key] = obj2[key];
    }
  }

  return result;
};
