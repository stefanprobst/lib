export function groupBy<T>(values: Array<T>, getKey: (value: T) => string) {
	const grouped: { [key: string]: Array<T> } = {};

	for (const value of values) {
		const key = getKey(value);

		if (key in grouped) {
			grouped[key]!.push(value);
		} else {
			grouped[key] = [value];
		}
	}

	return grouped;
}

export function groupByToMap<T>(values: Array<T>, getKey: (value: T) => string) {
	const grouped = new Map<string, Array<T>>();

	for (const value of values) {
		const key = getKey(value);

		if (grouped.has(key)) {
			grouped.get(key)!.push(value);
		} else {
			grouped.set(key, [value]);
		}
	}

	return grouped;
}
