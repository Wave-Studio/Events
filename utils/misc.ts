export const removeKeysWithSameValues = (
	old: Record<string, unknown>,
	newObj: Record<string, unknown>,
): Record<string, unknown> => {
	const result: Record<string, unknown> = {};

	for (const key in newObj) {
		if (!(key in old) || old[key] !== newObj[key]) {
			result[key] = newObj[key];
		}
	}

	return result;
};
