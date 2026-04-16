import { describe, it, expect } from "vitest";
import { get, load, set, proj4 } from "../src/index";

describe(`[load, set, retrieve]`, () => {
  it("[load] does not throw on valid URN", () => {
    expect(
      async () => await load("urn:ogc:def:crs:OGC:1.3:CRS84"),
    ).not.toThrow();
  });
  it("[load] returns a valid projection string and does not throw on AuthCode", async () => {
    expect(async () => await load("OGC:CRS84")).not.toThrow();
    expect(await load("OGC:CRS84")).toBeTypeOf("string");
  });

  it("[load] does not throw on URI", async () => {
    expect(
      async () => await load("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),
    );
  });
});
