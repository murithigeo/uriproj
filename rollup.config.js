import { defineConfig } from "rollup";
import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
const outputCfgs = [
  {
    minify: true,
  },
  {
    minify: false,
  },
];

export default defineConfig({
  input: "src/index.ts",
  plugins: [
    typescript({outDir:"./"}),
    nodeResolve({ browser: true }),
    commonjs({ include: "node_modules/**" }),
    babel({ babelHelpers: "bundled" }),
  ],
  external: ["proj4"],

  output: outputCfgs.map((opts) => ({
    file: "uriproj." + (opts.minify ? "min" : "src") + ".js",
    format: "iife",
    name: "uriproj",
    sourcemap: true,
    globals: {
      proj4: "proj4",
    },
    plugins: opts.minify ? [terser()] : [],
  })),
});
