import { test } from "uvu";
import * as assert from "uvu/assert";
import { createTimer } from "../src/index.js";
import { install } from "@sinonjs/fake-timers";

test.before((context) => {
	context["clock"] = install();
});

test.after((context) => {
	context["clock"].uninstall();
});

test("should start new timer", (context) => {
	let result = 0;
	const timer = createTimer(() => {
		result++;
	}, 200);
	context["clock"].tick(100);
	assert.is(result, 0);
	context["clock"].tick(100);
	assert.is(result, 1);
});

test("should pause and resume timer", (context) => {
	let result = 0;
	const timer = createTimer(() => {
		result++;
	}, 200);
	context["clock"].tick(100);
	assert.is(result, 0);
	timer.pause();
	context["clock"].tick(200);
	assert.is(result, 0);
	timer.resume();
	context["clock"].tick(50);
	assert.is(result, 0);
	context["clock"].tick(50);
	assert.is(result, 1);
});

test("should return noop functions when timeout is Infinity", () => {
	const timer = createTimer(() => {}, Infinity);
	assert.type(timer.pause, "function");
	assert.type(timer.resume, "function");
});

test("should throw when timeout is negative number", () => {
	assert.throws(() => createTimer(() => {}, -100));
});

test("should throw when timeout is non-integer", () => {
	assert.throws(() => createTimer(() => {}, 100.5));
});

test.run();
