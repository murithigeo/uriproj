import test, { expect } from "@playwright/test";
import {
  authCodeToUri,
  get,
  load,
  parseCrsId,
  set,
  uriToAuthCode,
} from "../src/index";

test("[load] loading a crs string should persist the string in cache", async () => {
  await load("OGC:CRS84");
  expect(get(authCodeToUri("OGC:CRS84"))).toBeDefined();
});

test("[set] Setting a crs should return a string from that key", () => {
  expect(set("OGC:CRS84", "randohm")).toBe("randohm");
});

// Tests for Conversions

test("[parseCrsId] parses uri to authCode", () => {
  expect(parseCrsId("http://www.opengis.net/def/crs/OGC/1.3/CRS84")).toBe(
    "OGC:CRS84",
  );
});

test("[parseCrsId] parses authCode to authCode", () => {
  expect(parseCrsId("EPSG:4326")).toBe("EPSG:4326");
});

test(`[parseCrsId] parses urn to authCode`, () => {
  expect(parseCrsId("urn:ogc:def:crs:EPSG:6.3:26986")).toBe("EPSG:26986");
});

test("[uriToAuthCode] invalid uri throws error", () => {
  expect(() =>
    uriToAuthCode("http://www.opengis.net/def/tsx/OGC/0/CRS84"),
  ).toThrowError();
});

test(`[authCodeToUri] invalid string throws error`, () => {
  expect(() => authCodeToUri("EPSG:3000:ax")).toThrowError();
});

// test(`[uripro] returns a converter`,async()=>)
