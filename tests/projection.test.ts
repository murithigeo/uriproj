import { expect, describe, it } from "vitest";
import { uriproj } from "../src/index";
const EPSG4326 = "http://www.opengis.net/def/crs/EPSG/0/4326";
const OGCCRS84 = "http://www.opengis.net/def/crs/OGC/1.3/CRS84";

it("[AxisOrder: EPSG:4326 to OGC:CRS84] It should flip axis order", async () => {
  const pos = (await uriproj({ to: OGCCRS84, from: EPSG4326 })).forward(
    { x: -90, y: -180 },
    true,
  );
  expect(pos).toEqual({ x: -180, y: -90 });
});

it("[AxisOrder: OGC:CRS84 to OGC:CRS84] It should flip axis order", async () => {
  const [lon, lat] = [-180, -90];
  const pos = (await uriproj({ to: EPSG4326, from: OGCCRS84 })).forward(
    [lon, lat],
    true,
  );
  expect(pos).toEqual([lat, lon]);
});

it("[NADGRID] Does not need GeoTIFF for projection", async () => {
  const reprojector = await uriproj({ to: "EPSG:27700" });
  let [x, y] = reprojector.forward([-1.54, 55.5], true);
  expect(Math.floor(x)).toBe(429157);
  expect(Math.floor(y)).toBe(623009);
});
