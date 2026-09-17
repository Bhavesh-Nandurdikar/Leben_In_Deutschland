import fs from "node:fs";
import path from "node:path";

const sourceDir = process.argv[2];
const targetDir = process.argv[3] ?? path.join(process.cwd(), "public", "data", "bamf");

if (!sourceDir) {
  console.error("Usage: node scripts/apply-bamf-update.mjs <generated-data-dir> [target-dir]");
  process.exit(2);
}

const sourceQuestionsPath = path.join(sourceDir, "questions.json");
const targetQuestionsPath = path.join(targetDir, "questions.json");

if (!fs.existsSync(sourceQuestionsPath)) {
  console.error(`Generated questions not found: ${sourceQuestionsPath}`);
  process.exit(2);
}

const sourceData = JSON.parse(fs.readFileSync(sourceQuestionsPath, "utf8"));
const targetData = fs.existsSync(targetQuestionsPath)
  ? JSON.parse(fs.readFileSync(targetQuestionsPath, "utf8"))
  : null;

// Compare the actual question payload, not generatedAt/datasetVersion/lastCheckedAt.
// This prevents a monthly PR when BAMF content has not changed.
const sourcePayload = JSON.stringify(sourceData.questions);
const targetPayload = targetData ? JSON.stringify(targetData.questions) : null;

if (sourcePayload === targetPayload) {
  console.log("✅ BAMF check completed: question content is unchanged. No files updated.");
  process.exit(0);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });

for (const name of ["questions.json", "manifest.json", "images"]) {
  const sourcePath = path.join(sourceDir, name);
  if (!fs.existsSync(sourcePath)) {
    console.error(`Expected generated resource is missing: ${sourcePath}`);
    process.exit(2);
  }
  fs.cpSync(sourcePath, path.join(targetDir, name), { recursive: true });
}

console.log("🔄 BAMF content changed. Local app snapshot has been refreshed.");
