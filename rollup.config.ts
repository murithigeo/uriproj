import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import { defineConfig } from "rollup";

const sourcemap = true;
export default defineConfig({
  external: ["proj4"],
  input: "./src/index.ts",
  plugins: [typescript(), resolve(), babel({ babelHelpers: "bundled" })],
  output: [
    {
      format: "es",
      name: "uriproj",
      file: "./dist/uriproj.js",
      sourcemap,
    },
    {
      format: "iife",
      name: "uriproj",
      file: "./dist/uriproj.browser.js",
      sourcemap,
      plugins: [terser()],
      globals: { proj4: "proj4" },
    },
  ],
});
