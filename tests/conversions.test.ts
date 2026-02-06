import { test, expect } from "@playwright/test";
import { authCodeToUri, uriToAuthCode, urnToUri } from "../src/index";
const CRS84 = "http://www.opengis.net/def/crs/OGC/1.3/CRS84";

test("OGC URN to URI", () => {
  expect(urnToUri("urn:ogc:def:crs:OGC:1.3:CRS84")).toBe(CRS84);
});

test("authcode to URI", () => {
  expect(authCodeToUri("OGC:CRS84")).toBe(CRS84);
});

test("URI to authcode", () => {
  expect(uriToAuthCode(CRS84)).toBe("OGC:CRS84");
});
