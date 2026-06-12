const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const root = path.resolve(__dirname, "..");
const data = require("../miniprogram/shared/fujian-art-data");
const recommend = require("../miniprogram/shared/fujian-art-recommend");

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.name.endsWith(".js")) acc.push(full);
  }
  return acc;
}

for (const file of walk(path.join(root, "miniprogram")).concat(walk(path.join(root, "cloudfunctions")))) {
  childProcess.execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
}

for (const file of [
  "project.config.json",
  "miniprogram/app.json",
  "miniprogram/sitemap.json",
  "cloudfunctions/login/package.json",
]) {
  JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
}

const rank2025 = recommend.parseRankData("560,100,5\n550,180,8\n540,260,9\n530,360,10\n520,500,12\n500,900,20\n480,1500,30");
const rank2026 = recommend.parseRankData("565,100,5\n555,180,8\n545,260,9\n535,360,10\n525,500,12\n505,900,20\n485,1500,30");
const score = recommend.makeRecommendations({
  subject: "history",
  score: 535,
  includeUnverified: true,
  includePrivate: false,
  includeCoop: false,
  preferFujian: true,
});
const rankMissing = recommend.makeRecommendations({
  subject: "history",
  score: 535,
  recommendMode: "rank",
  includeUnverified: true,
});
const rank = recommend.makeRecommendations({
  subject: "history",
  score: 535,
  recommendMode: "rank",
  rankData2025: rank2025,
  rankData2026: rank2026,
  includeUnverified: true,
  includePrivate: false,
  includeCoop: false,
  preferFujian: true,
});
const embeddedRank = recommend.makeRecommendations({
  subject: "history",
  score: 535,
  recommendMode: "rank",
  rankData2026: rank2026,
  includeUnverified: true,
  includePrivate: false,
  includeCoop: false,
  preferFujian: true,
});

if (score.rows.length !== 40) throw new Error("Score mode should generate 40 rows");
if (!rankMissing.notice) throw new Error("Rank mode without rank tables should return a notice");
if (!rank.rows.length || rank.mode !== "rank") throw new Error("Rank mode should generate rows when both rank tables are present");
if (!embeddedRank.rows.length || embeddedRank.mode !== "rank") throw new Error("Rank mode should use embedded 2025 rank table");

console.log(JSON.stringify({
  dataVersion: data.dataVersion,
  rows: data.colleges.length,
  links: Object.keys(data.schoolLinks).length,
  scoreRows: score.rows.length,
  rankRows: rank.rows.length,
  embeddedRankRows: embeddedRank.rows.length,
  firstEquivalent: rank.rows[0] && rank.rows[0].equivalentScore,
}, null, 2));
