import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = resolve(repoRoot, "public");
const manifestPath = resolve(repoRoot, "asset-manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.assets)) {
  throw new Error("Unsupported or invalid asset-manifest.json");
}

function gitBlobSha(buffer) {
  const hash = createHash("sha1");
  hash.update(`blob ${buffer.length}\0`);
  hash.update(buffer);
  return hash.digest("hex");
}

function assertExpectedMediaPayload(buffer, asset) {
  if (!asset.sourcePath.toLowerCase().endsWith(".webp")) {
    return;
  }

  const isWebp =
    buffer.length >= 12
    && buffer.subarray(0, 4).toString("ascii") === "RIFF"
    && buffer.subarray(8, 12).toString("ascii") === "WEBP";

  if (!isWebp) {
    throw new Error(
      `Invalid WebP payload for ${asset.assetId}: ${asset.sourcePath}`,
    );
  }
}

for (const asset of manifest.assets) {
  const targetPath = resolve(repoRoot, asset.runtimePath);
  const publicRelativePath = relative(publicRoot, targetPath);
  if (
    publicRelativePath === ""
    || publicRelativePath.startsWith("..")
    || isAbsolute(publicRelativePath)
  ) {
    throw new Error(`Runtime asset must stay under public/: ${asset.runtimePath}`);
  }

  const response = await fetch(asset.sourceUrl, {
    headers: { "user-agent": "untold-runtime-asset-sync" },
  });
  if (!response.ok) {
    throw new Error(`Failed to download ${asset.assetId}: HTTP ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  assertExpectedMediaPayload(buffer, asset);

  if (buffer.length !== asset.sourceSize) {
    throw new Error(
      `Size mismatch for ${asset.assetId}: expected ${asset.sourceSize}, got ${buffer.length}`,
    );
  }

  const revision = gitBlobSha(buffer);
  if (revision !== asset.sourceRevision) {
    throw new Error(
      `Revision mismatch for ${asset.assetId}: expected ${asset.sourceRevision}, got ${revision}`,
    );
  }

  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, buffer);
  console.log(`synced ${asset.assetId} -> ${asset.runtimePath}`);
}
