const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const source = path.join(root, "index.html");
const target = path.join(root, "miniprogram", "shared", "fujian-art-data.js");
const rankSource = path.join(root, "shared", "fujian-art-rank-2025.js");
const rankTarget = path.join(root, "miniprogram", "shared", "fujian-art-rank-2025.js");

const html = fs.readFileSync(source, "utf8");
const collegesMatch = html.match(/const colleges = (\[[\s\S]*?\n\s*\]);\n\n\s*const schoolLinks = /);
const linksMatch = html.match(/const schoolLinks = (\{[\s\S]*?\n\s*\});\n\n\s*let subject = /);

if (!collegesMatch || !linksMatch) {
  throw new Error("Cannot find colleges or schoolLinks blocks in index.html");
}

const syncDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const dataVersion = `h5-sync-${syncDate}`;
const content = `// Shared school data for the H5 page and WeChat mini program.
// Generated from index.html by scripts/sync-h5-to-miniprogram.js.
const colleges = ${collegesMatch[1]};

const schoolLinks = ${linksMatch[1]};

const dataVersion = "${dataVersion}";

const dataSourceNote = "院校池由 H5 工具同步，持续按官方招生章程、分省计划、录取查询结果维护。";

const payload = { colleges, schoolLinks, dataVersion, dataSourceNote };

if (typeof module !== "undefined" && module.exports) {
  module.exports = payload;
}

if (typeof window !== "undefined") {
  window.FujianArtData = payload;
}
`;

fs.writeFileSync(target, content, "utf8");
if (fs.existsSync(rankSource)) {
  fs.copyFileSync(rankSource, rankTarget);
}

const linkCount = Object.keys(Function(`return (${linksMatch[1]});`)()).length;
const rowCount = (collegesMatch[1].match(/\{school:/g) || []).length;
let rankRows = null;
if (fs.existsSync(rankTarget)) {
  const { rankData2025BySubject } = require(rankTarget);
  rankRows = {
    history: rankData2025BySubject.history.length,
    physics: rankData2025BySubject.physics.length,
  };
}

console.log(JSON.stringify({
  source: path.relative(root, source),
  target: path.relative(root, target),
  dataVersion,
  rowCount,
  linkCount,
  rankRows,
}, null, 2));
