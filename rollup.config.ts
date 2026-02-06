// import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig({
  external: ["proj4"],
  input: "./src/index.ts",
  plugins: [typescript()],
  output: [
    {
      format: "es",
      name: "uriproj",
      file: "./dist/uriproj.esm.js",
    },
    {
      format: "commonjs",
      plugins: [],
      name: "uriproj",
      file: "./dist/uriproj.cjs.js",
      globals: { proj4: "proj4" },
    },
  ],
});
