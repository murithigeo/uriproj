import proj4 from "proj4";

/**
 * @description the keys of the cache are absolute uris
 */
const cache: Record<string, string> = {};

const ROOT_PREFIX = `http://www.opengis.net/def/crs`;

export function get(crsUri: string): string | undefined {
  return cache[crsUri];
}

export function set(authCode: string, projtxt: string): string {
  cache[authCodeToUri(authCode)] = projtxt;
  return projtxt;
}

export async function load(crsUri: string): Promise<string> {
  const authCode = parseCrsId(crsUri);
  const txt = get(authCode);
  const [auth, code] = authCode.split(":");
  if (txt) return txt;
  const res = await fetch(
    `https://spatialreference.org/ref/${auth.toLocaleLowerCase()}/${code}/prettywkt2.txt`,
  );
  if (!res.ok)
    throw Error(
      `Error fetching crs definition:${res.status} at url:${res.url}`,
    );
  const wkt = await res.text();

  return set(authCode, wkt);
}

/**
 * @description return a auth:code string
 */
export function parseCrsId(crsuri: string): string {
  if (crsuri.indexOf(ROOT_PREFIX) !== -1) return uriToAuthCode(crsuri);
  if (crsuri.split(":").length === 2) return crsuri;
  if (crsuri.split(":").length === 7) return uriToAuthCode(urnToUri(crsuri));
  throw Error(`Invalid syntax`);
}

/**
 *
 * @param crsuri a valid CRS uri
 * @returns the authority and code of the uri
 * http://www.opengis.net/def/crs/OGC/1.3/CRS84 -> OGC:CRS84
 */
export function uriToAuthCode(crsuri: string): string {
  if (crsuri.indexOf(ROOT_PREFIX) === -1)
    throw Error(`Unsupported CRS URI:${crsuri}`);
  let [, auth, , code] = crsuri.substring(ROOT_PREFIX.length).split("/");
  return `${auth}:${code}`;
}

export function authCodeToUri(authCode: string): string {
  let parts = authCode.split(":");
  if (parts.length !== 2)
    throw Error(`Invalid syntax. Should be <authority>:<code>`);
  let version = 0;
  if (parts[1] === "CRS84") version = 1.3;
  return `${ROOT_PREFIX}/${parts[0]}/${version}/${parts[1]}`;
}

/**
 *
 * @param uri a deprecated urn identifier @example urn:ogc:def:crs:EPSG:6.3:26986
 */
export function urnToUri(urn: string): string {
  const [, , , , authority, version, code] = urn.split(":");
  return `${ROOT_PREFIX}/${authority}/${version}/${code}`;
}

/**
 *
 * @param from When a second argument is not provided, this will default to proj4's inbuilt EPSG:4326
 * @param to the crs to project the coordinates to
 */
export async function uriproj(to: string, from: string | undefined) {
  if (from === undefined) return proj4(await load(to));
  return proj4(await load(from), await load(to));
}
