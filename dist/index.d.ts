export declare function get(crsUri: string): string | undefined;
export declare function set(authCode: string, projtxt: string): string;
export declare function load(crsUri: string): Promise<string>;
/**
 * @description return a auth:code string
 */
export declare function parseCrsId(crsuri: string): string;
/**
 *
 * @param crsuri a valid CRS uri
 * @returns the authority and code of the uri
 * http://www.opengis.net/def/crs/OGC/1.3/CRS84 -> OGC:CRS84
 */
export declare function uriToAuthCode(crsuri: string): string;
export declare function authCodeToUri(authCode: string): string;
/**
 *
 * @param uri a deprecated urn identifier @example urn:ogc:def:crs:EPSG:6.3:26986
 */
export declare function urnToUri(urn: string): string;
/**
 *
 * @param from When a second argument is not provided, this will default to proj4's inbuilt EPSG:4326
 * @param to the crs to project the coordinates to
 */
export declare function uriproj(to: string, from: string | undefined): Promise<import("proj4/dist/lib/core").Converter>;
