import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const projectRoot = process.cwd();
const outputRoot = join(projectRoot, "dist");
const assetRoot = join(outputRoot, "assets");

const rootFiles = [
  "index.html",
  "about.html",
  "Projects2.html",
  "Experience.html",
  "education.html",
  "gallery.html",
  "contact.html",
  "site.css",
  "site.js",
  "edu.js",
  "navbar.html",
];

const assetDirectories = ["images", "photoshop", "jackime", "Comp creativity"];

await rm(outputRoot, { recursive: true, force: true });
await mkdir(assetRoot, { recursive: true });
await mkdir(join(outputRoot, "server"), { recursive: true });

for (const file of rootFiles) {
  await cp(join(projectRoot, file), join(assetRoot, file));
}

for (const directory of assetDirectories) {
  await cp(join(projectRoot, directory), join(assetRoot, directory), {
    recursive: true,
  });
}

const workerSource = `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
`;

await writeFile(join(outputRoot, "server", "index.js"), workerSource, "utf8");

const copiedFiles = await readdir(assetRoot);
console.log(`Built portfolio with ${copiedFiles.length} top-level asset entries.`);
