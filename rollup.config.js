import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      file: "dist/calcium.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/calcium.esm.js",
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [typescript({ module:'ESNext' })]
});
