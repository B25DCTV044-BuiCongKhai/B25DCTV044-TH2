import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const outputDirectory = resolve("dist");
const htmlPath = resolve(outputDirectory, "index.html");
let html = await readFile(htmlPath, "utf8");

const scriptTag = html.match(/<script\b([^>]*)\bsrc="([^"]+)"([^>]*)><\/script>/);
const stylesheetTag = html.match(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);

if (!scriptTag || !stylesheetTag) {
  throw new Error("Could not find the built JavaScript and CSS assets in dist/index.html.");
}

const scriptPath = resolve(outputDirectory, scriptTag[2].replace(/^\.\//, ""));
const stylesheetPath = resolve(outputDirectory, stylesheetTag[1].replace(/^\.\//, ""));
const [script, stylesheet] = await Promise.all([
  readFile(scriptPath, "utf8"),
  readFile(stylesheetPath, "utf8"),
]);

html = html
  .replace(
    scriptTag[0],
    `<script>\ndocument.addEventListener("DOMContentLoaded", function () {\n${script.replace(/<\/script/gi, "<\\/script")}\n});\n</script>`,
  )
  .replace(stylesheetTag[0], `<style>\n${stylesheet}\n</style>`);

await writeFile(htmlPath, html, "utf8");
console.log("Standalone app ready: open dist/index.html directly.");
