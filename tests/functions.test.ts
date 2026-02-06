import test, { expect } from "@playwright/test";
import { authCodeToUri, get, load, set } from "../src/index";

test("[load] loading a crs string should persist the string in cache", async () => {
  await load("OGC:CRS84");
  expect(get(authCodeToUri("OGC:CRS84"))).toBeDefined();
});

test("[set] Setting a crs should return a string from that key", () => {
  expect(set("OGC:CRS84", "randohm")).toBe("randohm");
});

