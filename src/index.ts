import proj4 from "proj4";
import type { Converter } from "proj4";

/**
 * @description the keys of the cache are absolute uris
 */
const cache: Record<string, string> = {};

const URI_ROOT_PREFIX = `http://www.opengis.net/def/crs`;
const URN_ROOT_PREFIX = `urn:ogc:def:crs`;

export function get(uri: string): string | undefined {
  return cache[uri];
}

export function set(uri: string, projtxt: string): string {
  cache[uri] = projtxt;
  proj4.defs(uri, projtxt);
  return projtxt;
}

export async function load(crsUri: string): Promise<string> {
  const uri = toURI(crsUri);
  const [auth, code] = fromURI(uri).asAuthCode.split(":");
  const projtxt = get(uri);
  if (projtxt) return projtxt;
  const res = await fetch(
    `https://spatialreference.org/ref/${auth.toLocaleLowerCase()}/${code}/prettywkt2.txt`,
  );
  if (!res.ok)
    throw Error(
      `Error fetching crs definition:${res.status} at url:${res.url}`,
    );
  const wkt = await res.text();
  return set(uri, wkt);
}

export function toURI(val: string): string {
  if (val.indexOf(URI_ROOT_PREFIX) === 0) return val;
  if (val.indexOf(URN_ROOT_PREFIX) === 0) return fromURN(val).asURI;
  if (val.split(":").length === 2) return fromAuthCode(val).asURI;
  throw Error(`val MAY not be a authority:code, URN or URI string`);
}

export function fromURN(val: string) {
  if (val.indexOf(URN_ROOT_PREFIX) === -1) throw Error(`value is not an URN`);
  const [, authority, version, code] = val
    .substring(URN_ROOT_PREFIX.length)
    .split(":");
  return {
    get asURI() {
      return `${URI_ROOT_PREFIX}/${authority.toUpperCase()}/${version}/${code}`;
    },
    get asAuthCode() {
      return `${authority}:${code}`;
    },
  };
}

export function fromURI(val: string) {
  if (val.indexOf(URI_ROOT_PREFIX) === -1)
    throw Error(`Not a valid URI string`);

  const [, authority, version, code] = val
    .substring(URI_ROOT_PREFIX.length)
    .split("/");

  return {
    get asURN() {
      return `${URN_ROOT_PREFIX}:${authority.toUpperCase()}:${version}:${code}`;
    },
    get asAuthCode() {
      return `${authority}:${code}`;
    },
  };
}

export function fromAuthCode(val: string) {
  const parts = val.split(":");
  if (parts.length !== 2)
    throw Error(`Expected val to be in format '<authority>:<code>'`);
  const [authority, code] = parts;
  return {
    get asURI() {
      return `${URI_ROOT_PREFIX}/${authority.toUpperCase()}/${code === "CRS84" ? 1.3 : 0}/${code}`;
    },
    get asURN() {
      return `${URN_ROOT_PREFIX}:${authority}:${code === "CRS84" ? 1.3 : 0}:${code}`;
    },
  };
}

/**
 *
 * @param from When a second argument is not provided, this will default to proj4's inbuilt EPSG:4326
 * @param to the crs to project the coordinates to
 */
export async function uriproj(args: {
  from?: string;
  to: string;
}): Promise<Converter> {
  if (args.from === undefined) return proj4(await load(args.to));
  return proj4(await load(args.from), await load(args.to));
}

export { type Converter, proj4 };
