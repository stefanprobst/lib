export async function async<T>(fn: () => Promise<T> | T) {
	try {
		const data = await fn();
		return { data, error: null };
	} catch (error) {
		return { data: null, error };
	}
}
