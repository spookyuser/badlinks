import type { BuildConfig } from "bun";

const defaultBuildConfig: BuildConfig = {
  entrypoints: ["./index.ts"],

  outdir: "./dist",
  target: "node",
};

await Promise.all([
  Bun.build({
    ...defaultBuildConfig,

    format: "esm",
    naming: "[dir]/[name].js",
  }),
  Bun.build({
    ...defaultBuildConfig,
    format: "cjs",
    naming: "[dir]/[name].cjs",
  }),
]);
