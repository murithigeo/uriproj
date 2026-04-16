# URIProj

A TypeScript wrapper for loading remote CRS WKT definitions and extends the original [uriproj](https://github.com/reading-escience/uriproj) by adding support for URNs and shorthand prefixes, making it easier to work with different CRS formats.

## Features

- Supports specifying OGC URNs, URIs and <authority>:<code> shorthands
- Uses OGC WKT2 definitions eliminating need for NADGRID TIFF files
- Caches definitions

## Installation

```bash
npm install @murithigeo/uriproj
```

## Quick Start

```typescript
import { uriproj, load, fromAuthCode, toURI } from "@murithigeo/uriproj";

// Project coordinates from EPSG:4326 to OGC:CRS84
const converter = await uriproj({
  from: "EPSG:4326",
  to: "OGC:CRS84",
});

const projected = converter.forward({ x: -90, y: -180 });
console.log(projected); // { x: -180, y: -90 }
```

## API Documentation

### Formats

URIProj supports three CRS identifier formats:

1. **Authority:Code** (shorthand): `EPSG:4326`, `OGC:CRS84`
2. **URI**: `http://www.opengis.net/def/crs/EPSG/0/4326`
3. **URN**: `urn:ogc:def:crs:EPSG:0:4326`

The `fromURI`, `fromURN` and `fromAuthCode` functions allow conversions to other formats

The `toURI` allows conversions from an unknown string to an absolute URI

### Loading a remote WKT definition

Loads a CRS definition from spatialreference.org and caches it locally. Automatically registers the definition with proj4. Accepts any supported CRS format.

```typescript
import { load } from "@murithigeo/uriproj";

let wkt = await load("EPSG:4326");
wkt = await load("urn:ogc:def:crs:OGC:1.3:CRS84");
wkt = await load("http://www.opengis.net/def/crs/EPSG/0/4326");

console.log(wkt);
```

### Retrieving a cached definition

Retrieve a cached CRS definition.

```typescript
import { get } from "@murithigeo/uriproj";

const cached = get("http://www.opengis.net/def/crs/EPSG/0/4326");
if (cached) {
  console.log("CRS definition is cached:", cached);
}
```

### Getting the Converter function

```ts
const converter = await uriproj({
  from: "OGC:CRS84", // If undefined, defaults to EPSG:4326
  to: "EPSG:32737",
});
```

### Re-exported from proj4

Both `proj4` and the `Converter` type are re-exported for convenience:

```typescript
import { proj4, type Converter } from "@murithigeo/uriproj";

// Use proj4 directly if needed
proj4.defs("EPSG:4326");
```
