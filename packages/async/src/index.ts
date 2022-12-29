export async function async<T>(fn: () => T | Promise<T>) {
	try {
		const data = await fn();
		return { data, error: null };
	} catch (error) {
		return { data: null, error };
	}
}
