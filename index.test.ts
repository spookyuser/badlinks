import { expect, test } from "bun:test";
import { extractJsLinks } from "./index";
import fs from "fs";

// More or less from https://github.com/kevva/url-regex/blob/master/test.js

test("match js URLs in text", () => {
  const fixture = `
		<a href="http://example.com/file.js">example.com</a>
		<a href="http://example.com/with-path/file.js">with path</a>
		[and another](https://another.example.com/file.min.js) and
        https://another.example.com/file.min.js?withqueryparams=true
	`;

  expect(extractJsLinks(fixture)).toEqual([
    "http://example.com/file.js",
    "http://example.com/with-path/file.js",
    "https://another.example.com/file.min.js",
    "https://another.example.com/file.min.js?withqueryparams=true",
  ]);
});

test("dont't match these urls", () => {
  const fixture = `
      "https://www.googletagmanager.com/gtag/js"
      `;

  expect(extractJsLinks(fixture)).toEqual([]);
});

test("match js URLs in js", () => {
  const fixture = fs.readFileSync("./folder/fixture.js", "utf-8");

  expect(extractJsLinks(fixture)).toEqual([
    "https://apis.google.com/js/api.js?q=$",
    "https://apis.google.com/js/api.js?onload=$",
    "https://www.google.com/recaptcha/enterprise.js?render=",
  ]);
});
