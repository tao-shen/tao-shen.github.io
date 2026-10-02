import { build } from "esbuild";
import { mkdir, cp, readFile, writeFile, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { renderToString } from "react-dom/server";
import React from "react";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/assets", { recursive: true });
await mkdir(".build", { recursive: true });
await cp("public", "dist", { recursive: true });
await build({
  entryPoints: ["src/client.jsx"],
  bundle: true,
  minify: true,
  outfile: "dist/assets/site.js",
  format: "esm",
  jsx: "automatic",
  target: ["es2020"],
  loader: { ".woff2": "file", ".woff": "file" },
  assetNames: "fonts/[name]-[hash]",
});
execFileSync(process.execPath, ["node_modules/@tailwindcss/cli/dist/index.mjs", "-i", "src/styles.css", "-o", "dist/assets/styles.css", "--minify"], {
  stdio: "inherit",
});
await build({
  entryPoints: ["src/App.jsx"],
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  outfile: ".build/app.mjs",
  jsx: "automatic",
});
const { default: App } = await import(pathToFileURL(`${process.cwd()}/.build/app.mjs`).href + `?t=${Date.now()}`);
const markup = renderToString(React.createElement(App));
const template = await readFile("src/document.html", "utf8");
await writeFile("dist/index.html", template.replace("<!--app-->", markup));
await writeFile("dist/.nojekyll", "");
await rm(".build", { recursive: true });
console.log("Built static homepage → dist/ (pre-rendered HTML + local assets).");
