import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const questionsPath = path.join(root, "public", "data", "bamf", "questions.json");
const imagesDir = path.join(root, "public", "data", "bamf", "images");
const stateCodes = ["BW", "BY", "BE", "BB", "HB", "HH", "HE", "MV", "NI", "NW", "RP", "SL", "SN", "ST", "SH", "TH"];

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

if (!fs.existsSync(questionsPath)) fail(`Missing ${questionsPath}`);

const data = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
const questions = data.questions;
if (!Array.isArray(questions)) fail("questions.json must contain a questions array.");
if (questions.length !== 460) fail(`Expected 460 questions, found ${questions.length}.`);

const ids = new Set();
for (const question of questions) {
  if (!question.id || ids.has(question.id)) fail(`Missing or duplicate question id: ${question.id}`);
  ids.add(question.id);
  if (!question.question?.trim()) fail(`Question ${question.id} has no text.`);
  if (!question.answers || Object.keys(question.answers).length !== 4) fail(`Question ${question.id} must have four answers.`);
  if (!["a", "b", "c", "d"].includes(question.solution)) fail(`Question ${question.id} has an invalid solution.`);
  for (const image of question.images ?? []) {
    const relative = image.path.replace(/^images\//, "");
    const imagePath = path.join(imagesDir, relative);
    if (!fs.existsSync(imagePath)) fail(`Missing image for ${question.id}: ${image.path}`);
  }
}

const general = questions.filter((question) => question.scope === "general");
if (general.length !== 300) fail(`Expected 300 general questions, found ${general.length}.`);

for (const stateCode of stateCodes) {
  const count = questions.filter((question) => question.scope === "state" && question.stateCode === stateCode).length;
  if (count !== 10) fail(`Expected 10 questions for ${stateCode}, found ${count}.`);
}

console.log("✅ BAMF dataset valid: 460 questions, 300 general, 10 per Bundesland, all referenced images present.");
