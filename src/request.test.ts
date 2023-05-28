import {
	createServer,
	type IncomingMessage,
	type RequestListener,
	type Server,
	type ServerResponse,
} from "node:http";
import { type AddressInfo } from "node:net";

import { suite } from "uvu";
import * as assert from "uvu/assert";

import { createUrl } from "./create-url.js";
import { request } from "./request.js";

interface Context<
	Request extends typeof IncomingMessage = typeof IncomingMessage,
	Response extends typeof ServerResponse = typeof ServerResponse,
> {
	createServer: (handler: RequestListener<Request, Response>) => Promise<URL>;
	server?: Server<Request, Response>;
}

const test = suite<Context>("request");

test.before.each((context) => {
	context.createServer = async (handler) => {
		const server = createServer(handler);

		const url = await new Promise<URL>((resolve, reject) => {
			server.on("error", reject);
			server.listen(() => {
				const { port } = server.address() as AddressInfo;
				const url = createUrl({ baseUrl: `http://localhost:${port}` });
				resolve(url);
			});
		});

		context.server = server;

		return url;
	};
});

test.after.each(async (context) => {
	// FIXME: this seems to wait for sockets to be destroyed,
	// which takes 5 seconds per test (probably waiting for keep-alive?)
	context.server?.close();
});

test("should dispatch request and receive response", async (context) => {
	const expected = "hello world";

	const url = await context.createServer((request, response) => {
		response.end(expected);
	});

	const response = await request(url, { responseType: "text" });

	assert.is(response, expected);
});

test("should use specified response type", async (context) => {
	const expected = { hello: "world" };

	const url = await context.createServer((request, response) => {
		response.end(JSON.stringify(expected));
	});

	assert.instance(await request(url, { responseType: "arrayBuffer" }), ArrayBuffer);
	assert.instance(await request(url, { responseType: "blob" }), Blob);
	// assert.instance(await request(url, { responseType: "formData" }), FormData);
	assert.equal(await request(url, { responseType: "json" }), expected);
	assert.instance(await request(url, { responseType: "raw" }), Response);
	assert.instance(await request(url, { responseType: "stream" }), ReadableStream);
	assert.is(await request(url, { responseType: "text" }), JSON.stringify(expected));
	assert.is(await request(url, { responseType: "void" }), null);
});

test("should use content-type header when no response type specified", async (context) => {
	const expected = { hello: "world" };

	const url = await context.createServer((request, response) => {
		response.writeHead(200, { "Content-Type": "application/json" });
		response.end(JSON.stringify(expected));
	});

	assert.equal(await request(url), expected);
});

// test("should handle json payload");

// test("should timeout");

test.run();
