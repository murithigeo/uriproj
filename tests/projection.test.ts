import { expect, test } from "@playwright/test";
import {uriproj} from "../src/index";
const EPSG4326 = "http://www.opengis.net/def/crs/EPSG/0/4326";
const OGCCRS84 = "http://www.opengis.net/def/crs/OGC/1.3/CRS84";

test("[AxisOrder: EPSG:4326 to OGC:CRS84] It should flip axis order", async () => {
  const [lat, lon] = [-180, 90];
  const pos = (await uriproj(OGCCRS84, EPSG4326)).forward([lat, lon], true);
  expect(pos).toEqual([lon, lat]);
});

test("[AxisOrder: OGC:CRS84 to OGC:CRS84] It should flip axis order", async () => {
  const [lon, lat] = [-180, -90];
  const pos = (await uriproj(EPSG4326, OGCCRS84)).forward([lon, lat], true);
  expect(pos).toEqual([lat, lon]);
});

test("[NADGRID] Does not need GeoTIFF for projection", async () => {
  const reprojector = await uriproj("EPSG:27700", undefined);
  let [x, y] = reprojector.forward([-1.54, 55.5], true);
  expect(x).toBeCloseTo(429158, 6);
  expect(y).toBeCloseTo(623009, 6);
});
