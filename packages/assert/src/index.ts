const defaultMessage = "Assertion failed";
const isProduction = process.env["NODE_ENV"] === "production";

/**
 * @see https://gist.github.com/jamiebuilds/2a40f565cba317a80bed1eec127340f6
 */
export function assert(value: boolean, message?: string): asserts value;
export function assert<T>(value: T | null | undefined, message?: string): asserts value is T;
export function assert(value: unknown, message?: string): void {
	if (value !== false && value != null) return;
	const msg = isProduction ? defaultMessage : message ?? defaultMessage;
	throw new Error(msg);
}
