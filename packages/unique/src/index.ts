export function unique<T>(values: Array<T>) {
	return Array.from(new Set(values));
}
