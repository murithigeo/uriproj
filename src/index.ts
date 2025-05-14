import proj4 from "proj4";

/**make sure it's at least two coordinates */
export type Position = number[]; //|[number,number,number];
export type Projection = {
  forward: (position: Position) => Position;
  inverse: (position: Position) => Position;
};
const ROOT_PREFIX = `http://www.opengis.net/def/crs/`;
const OGC_PREFIX = `${ROOT_PREFIX}OGC/`;
const EPSG_PREFIX = `${ROOT_PREFIX}EPGS/0/`;

// a cache of URI string -> Projection object mappings
let projCache: { [x: string]: Projection } = {};

// work-arounds for incorrect epsg.io / proj4 behavior
const needsAxesReordering = {
  [`${EPSG_PREFIX}4326`]: true,
};

// store some built-in projections which are not available on epsg.io
let LONLAT: Projection = proj4("+proj=longlat +datum=WGS84 +no_defs");
set(OGC_PREFIX + "1.3/CRS84", LONLAT);
set(OGC_PREFIX + "0/CRS84h", LONLAT);
set(EPSG_PREFIX + 4979, reverseAxes(LONLAT));

/**
 * Returns a stored {@link Projection} for a given URI, or {@link undefined} if no {@link Projection} is stored for that URI.
 *
 * @param {string} crsUri The CRS URI for which to return a {@link Projection}.
 * @return {Projection|undefined} A {@link Projection} object, or {@link undefined} if not stored by {@link load} or {@link set}.
 *
 * @example
 * // has to be stored previously via load() or set()
 * var proj = uriproj.get('http://www.opengis.net/def/crs/EPSG/0/27700')
 * var [longitude, latitude] = [-1.54, 55.5]
 * var [easting,northing] = proj.forward([longitude, latitude])
 */
export function get(crsUri: string) {
  return projCache[crsUri];
}
/**
 * Returns a {@link Promise} that succeeds with an already stored {@link Projection} or, if not stored,
 * that remotely loads the {@link Projection} (currently using https://epsg.io), stores it, and then succeeds with it.
 *
 * @example <caption>Loading a single projection</caption>
 * uriproj.load('http://www.opengis.net/def/crs/EPSG/0/27700').then(proj => {
 *   var [longitude, latitude] = [-1.54, 55.5]
 *   var [easting,northing] = proj.forward([longitude, latitude])
 * })
 *
 * @example <caption>Loading multiple projections</caption>
 * var uris = [
 *   'http://www.opengis.net/def/crs/EPSG/0/27700',
 *   'http://www.opengis.net/def/crs/EPSG/0/7376',
 *   'http://www.opengis.net/def/crs/EPSG/0/7375']
 * Promise.all(uris.map(uriproj.load)).then(projs => {
 *   // all projections are loaded and stored now
 *
 *   // get the first projection
 *   var proj1 = projs[0]
 *   // or:
 *   var proj1 = uriproj.get(uris[0])
 * })
 *
 */
export function load(crsUri: string) {
  if (crsUri in projCache) return Promise.resolve(projCache[crsUri]);
  let url = `https://epsg.io/${crsUriToEPSG(crsUri)}.proj4`;
  return fetch(url)
    .then((response) => {
      if (!response.ok) throw Error(`HTTP response code: ${response.status}`);
      return response.text();
    })
    .then((proj4string) =>
      set(crsUri, proj4string, { reverseAxes: crsUri in needsAxesReordering })
    );
}
/**
 * Stores a given projection for a given URI that can then be accessed via {@link get} and {@link load}.
 * If the projection is given as proj4 string and does not require axis reversal, then it is stored
 * as a named projection in proj4 itself under the given URI.
 * @throws {Error} If crsUri or proj is missing, or if a PROJ.4 string cannot be parsed by proj4js.
 * @example <caption>Storing a projection using a PROJ.4 string</caption>
 * var uri = 'http://www.opengis.net/def/crs/EPSG/0/27700'
 * var proj4 = '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 ' +
 *   '+ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs'
 * uriproj.set(uri, proj4)
 *
 * @example <caption>Storing a projection using a Projection object</caption>
 * var uri = 'http://www.opengis.net/def/crs/EPSG/0/27700'
 * var proj = {
 *   forward: ([lon,lat]) => [..., ...],
 *   inverse: ([x,y]) => [..., ...]
 * }
 * uriproj.set(uri, proj)
 */
export function set(
  crsUri: string,
  proj: Projection | string,
  options: { reverseAxes?: boolean } = { reverseAxes: false }
) {
  if (typeof proj === "object") {
    projCache[crsUri] = proj;
    return proj;
  }

  let projobj: Projection = proj4(proj);

  if (!projobj) throw Error(`Unsupported proj4 string: ${proj}`);

  proj4.defs(crsUri, proj);
  if (options.reverseAxes) projobj = reverseAxes(projobj);
  projCache[crsUri] = projobj;
  return projobj;
}
/**
 * Return the EPSG code of an OGC CRS URI of the form
 * http://www.opengis.net/def/crs/EPSG/0/1234 (would return 1234).
 */
function crsUriToEPSG(uri: string) {
  let isValid = uri.indexOf(EPSG_PREFIX) === 0;
  if (!isValid) throw Error(`Unsupported CRS URI: ${uri}`);
  return uri.substring(EPSG_PREFIX.length);
}
/**
 * Reverses projection axis order.
 *
 * For example, a projection with lon, lat axis order is turned into one with lat, lon order.
 * This is necessary since geographic projections in proj4 can only be defined with
 * lon,lat order, however some CRSs have lat,lon order (like EPSG4326).
 * Incorrectly, epsg.io returns a proj4 string (with lon,lat order) even if the CRS
 * has lat,lon order. This function manually flips the axis order of a given projection.
 * See also `needsAxesReordering` above.
 */
function reverseAxes(proj: Projection) {
  return {
    forward: (position: Position) => proj.forward(position).reverse(),
    inverse: (position: Position) => proj.inverse([position[1], position[0]]),
  };
}
