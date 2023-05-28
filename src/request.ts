import { HttpError } from "./error.js";

export const httpMethods = ["get", "post", "put", "patch", "delete", "head", "options"] as const;

export type HttpMethod = (typeof httpMethods)[number];

export type ResponseContentType =
	| "arrayBuffer"
	| "blob"
	| "formData"
	| "json"
	| "raw"
	| "stream"
	| "text"
	| "void";

export interface RequestConfig extends RequestInit {
	fetch?: (request: Request) => Promise<Response>;
	json?: unknown;
	method?: HttpMethod;
	responseType?: ResponseContentType;
	/** @default 10_000 */
	timeout?: number;
}

export async function request(url: URL, config: RequestConfig = {}): Promise<unknown> {
	const controller = createAbortController(config);

	const request = createRequest(url, config);

	if (config.responseType !== undefined && !request.headers.has("accept")) {
		if (config.responseType === "json") {
			request.headers.set("accept", "application/json");
		} else if (config.responseType === "text") {
			request.headers.set("accept", "text/*");
		} else {
			/** No need to set `Accept` headers for `formData`, `arrayBuffer`, `blob`. */
		}
	}

	const fetch = config.fetch ?? globalThis.fetch;

	const response = await fetch(request);

	if (!response.ok) {
		throw new HttpError(request, response);
	}

	const responseType =
		config.responseType ??
		getContentType(response.headers.get("content-type")?.split(";", 1).at(0));

	if (responseType === "raw") {
		return response;
	}

	if (responseType === "stream") {
		return response.body;
	}

	if (responseType === "void") {
		return null;
	}

	if (
		responseType === "json" &&
		(response.status === 204 || response.headers.get("content-length") === "0")
	) {
		return "";
	}

	return response[responseType]();
}

/**
 * TODO: Once `AbortSignal.timeout` has better support,
 * and once `AbortSignal.any` lands, we should use these.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static
 * @see https://github.com/whatwg/dom/issues/920
 */
function createAbortController(config: RequestConfig): AbortController {
	const controller = new AbortController();

	const timeout = config.timeout ?? 10_000;
	const timer = setTimeout(() => {
		controller.abort();
	}, timeout);

	config.signal?.addEventListener("abort", () => {
		controller.abort();
	});
	config.signal = controller.signal;

	return controller;
}

function createRequest(url: URL, config: RequestConfig): Request {
	if (config.json !== undefined) {
		const headers = new Headers(config.headers);

		if (!headers.has("content-type")) {
			headers.set("content-type", "application/json");
		}

		return new Request(url, { ...config, body: JSON.stringify(config.json), headers });
	}

	return new Request(url, config);
}

const contentTypes = {
	json: new Set(["application/json", "application/ld+json"]),
	text: new Set([
		"application/html",
		"application/xml",
		"image/svg+xml",
		"text/html",
		"text/plain",
		"text/xml",
	]),
};

function getContentType(type: string | undefined): ResponseContentType {
	if (type == null) return "void";
	if (contentTypes.json.has(type)) return "json";
	if (contentTypes.text.has(type)) return "text";

	return "raw";
}
