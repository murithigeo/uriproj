import { it, expect, describe } from "vitest";
import { fromAuthCode, fromURI, fromURN, toURI } from "../src/index";
const CRS84 = "http://www.opengis.net/def/crs/OGC/1.3/CRS84";
const CRS84_URN = `urn:ogc:def:crs:OGC:1.3:CRS84`;

describe("[fromURI] tests", () => {
  it("should not throw error on valid URI", () => {
    expect(() => fromURI(CRS84)).not.toThrow();
  });
  it("should resolve to correct authcode", () => {
    expect(fromURI(CRS84).asAuthCode).toBe("OGC:CRS84");
  });

  it("should resolve to correct URN", () => {
    expect(fromURI(CRS84).asURN).toBe(CRS84_URN);
  });
});

describe("[fromURN] tests", () => {
  it("should not throw error on valid URN", () => {
    expect(() => fromURN(CRS84_URN)).not.toThrow();
  });
  it("should resolve to correct authcode", () => {
    expect(fromURN(CRS84_URN).asAuthCode).toBe("OGC:CRS84");
  });

  it("should resolve to correct URI", () => {
    expect(fromURN(CRS84_URN).asURI).toBe(CRS84);
  });
});

describe("[fromAuthCode] tests", () => {
  it("should not throw error on valid AuthCode", () => {
    expect(() => fromAuthCode("OGC:CRS84")).not.toThrow();
  });
  it("should resolve to correct URI", () => {
    expect(fromAuthCode("OGC:CRS84").asURI).toBe(CRS84);
  });

  it("should resolve to correct URN", () => {
    expect(fromAuthCode("OGC:CRS84").asURN).toBe(CRS84_URN);
  });
});

describe("[toURI]", () => {
  it("should not throw error on valid string", () => {
    expect(() => toURI(CRS84)).not.toThrow();
    expect(() => toURI(CRS84_URN)).not.toThrow();
    expect(() => toURI("OGC:CRS84")).not.toThrow();
  });
  it("should resolve to correct URI from URI", () => {
    expect(toURI(CRS84)).toBe(CRS84);
  });

  it("should resolve to correct URI from URN", () => {
    expect(toURI(CRS84_URN)).toBe(CRS84);
  });
  it("should resolve to correct URI from AuthCode", () => {
    expect(toURI("OGC:CRS84")).toBe(CRS84);
  });
});
