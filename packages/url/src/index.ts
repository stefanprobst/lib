export interface CreateUrlParams {
	baseUrl: string | URL;
	hash?: string;
	pathname?: string | URL;
	searchParams?: URLSearchParams;
}

export function createUrl(params: CreateUrlParams) {
	const { baseUrl, hash, pathname = "", searchParams } = params;

	const url = new URL(pathname, baseUrl);

	if (searchParams != null) {
		url.search = String(searchParams);
	}

	if (hash != null) {
		url.hash = hash;
	}

	return url;
}
