export function keyBy<T>(values: Array<T>, getKey: (value: T) => string) {
	const keyed: { [key: string]: T } = {};

	for (const value of values) {
		const key = getKey(value);

		keyed[key] = value;
	}

	return keyed;
}

export function keyByToMap<T>(values: Array<T>, getKey: (value: T) => string) {
	const keyed = new Map<string, T>();

	for (const value of values) {
		const key = getKey(value);

		keyed.set(key, value);
	}

	return keyed;
}
