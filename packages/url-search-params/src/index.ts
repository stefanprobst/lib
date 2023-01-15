type Nullable<T> = T | null | undefined;

type Primitive = boolean | number | string;

export interface CreateUrlSearchParamsParams {
	[key: string]: Array<Nullable<Primitive>> | Nullable<Primitive>;
}

export function createUrlSearchParams(params: CreateUrlSearchParamsParams) {
	const urlSearchParams = new URLSearchParams();

	for (const [key, value] of Object.entries(params)) {
		if (Array.isArray(value)) {
			value.forEach((v) => {
				if (v != null) {
					urlSearchParams.append(key, String(v));
				}
			});
		} else if (value != null) {
			urlSearchParams.set(key, String(value));
		}
	}

	return urlSearchParams;
}
