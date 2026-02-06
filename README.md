# @murithigeo/uriproj

This is an offshot of the project uriproj by letmaik and the Reading eScience Center. Due to the nature of the project, I have decided to publish my own with some features I'd like to use and promote use.

### Changes

Some mechanisms have changed:

1. The projection text is now sourced from `https://spatialreference.org` instead of `https://epsg.io` because their CRS WKTs are somewhat incomplete resulting in issues such as [Missing Nagrid Buffers](https://github.com/Reading-eScience-Centre/uriproj/issues/4)
2. EPSG:4326 will not use the EPSG:4326 definition shipped with proj4. This is because that definition is not axis aware resulting in incorrect coordinates.
3. You can load CRS Ids formatted as OGC URNs such as `urn:ogc:def:crs:EPSG:6.3:26986` deprecated or shorthand strings such as `EPSG:4326`. These will be reformatted into absolute OGC CRS URIs
4. Dissimilar to how uriproj stored the Converter function, this project stores the projection wkt string instead. This is because once loaded, proj4 wont accept the converter function when you try to project from one crs to another
5. The version is ommitted from the request because Spatial Reference does not support versioning. This is not a breaking change because neither does EPSG
6. This is intended to be an ES module. It has a default export

### Loading

Promise=>then syntax

``` ts
    uriproj.load(`http://www.opengis.net/def/crs/OGC/1.3/CRS84`).then(proj=>proj.forward([36,1],true))
```

Promise=>await

``` ts
 const proj=await uriproj.reproject(`http://www.opengis.net/def/crs/OGC/1.3/CRS84`);
 const [x,y]=proj.forward([36,1],true);
```

Target and Source
If the source is omitted, then the source defaults to EPSG:4326 shipped with proj4

``` ts
const source="EPSG:4326";
const target="OGC:CRS84";
const [lat,lon]=[-180,-90]
const proj=await uriproj(target,source);
const [x,y]=proj.forward([lat,lon],true);
//-90,-180
```
