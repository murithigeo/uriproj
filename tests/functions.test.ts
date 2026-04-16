import { describe, it, expect } from "vitest";
import { get, load, set, proj4, fromAuthCode } from "../src/index";

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

  it("[get] returns a previously loaded crs wkt ", () =>
    expect(get(fromAuthCode("OGC:CRS84").asURI)).toBeDefined());

  it("[load] supports parsing VerticalCRS", () => {
    expect(async () => await load("EPSG:5614")).not.toThrow();
  });
  it("[load] preloads the definition in proj4", async () => {
    await load("OGC:CRS84");
    expect(proj4.defs(fromAuthCode("OGC:CRS84").asURI)).toBeDefined();
  });
});
