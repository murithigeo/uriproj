import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

const sourcemap = true;
export default defineConfig({
  external: ["proj4"],
  input: "./src/index.ts",
  plugins: [typescript()],
  output: [
    {
      format: "es",
      name: "uriproj",
      file: "./dist/uriproj.esm.js",
      sourcemap,
    },
    {
      format: "commonjs",
      name: "uriproj",
      file: "./dist/uriproj.cjs.js",
      sourcemap,
    },
    {
      format: "iife",
      name: "uriproj",
      file: "dist/uriproj.browser.js",
      globals: { proj4: "proj4" },
      sourcemap,
      plugins: [terser()],
    },
  ],
});
