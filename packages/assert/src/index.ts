/**
 * @see https://gist.github.com/jamiebuilds/2a40f565cba317a80bed1eec127340f6
 */
export function assert(value: boolean, message?: string): asserts value;
export function assert<T>(value: T | null | undefined, message?: string): asserts value is T;
export function assert(value: unknown, message?: string): void {
	if (value === false || value == null) {
		if (process.env["NODE_ENV"] !== "production") {
			throw new Error(message || "Assertion failed");
		}
	}
}
