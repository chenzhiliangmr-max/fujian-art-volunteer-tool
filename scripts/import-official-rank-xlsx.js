const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const SOURCE_DIR = "C:\\Users\\Administrator\\Desktop\\填报志愿数据";
const DEFAULT_TARGET = path.resolve(__dirname, "..", "shared", "fujian-art-rank-2025.js");

const SOURCES = [
  { year: 2023, subject: "history", file: "2023艺术综合分历史组一分一段表.xlsx" },
  { year: 2023, subject: "physics", file: "2023艺术综合分物理组一分一段表.xlsx" },
  { year: 2024, subject: "history", file: "2024艺术综合分历史组一分一段表.xlsx" },
  { year: 2024, subject: "physics", file: "2024艺术综合分物理组一分一段表.xlsx" },
  { year: 2025, subject: "history", file: "2025艺术综合分历史组一分一段表.xlsx" },
  { year: 2025, subject: "physics", file: "2025艺术综合分物理组一分一段表.xlsx" },
];

function inflateRaw(buffer) {
  return zlib.inflateRawSync(buffer);
}

function readUInt16(buffer, offset) {
  return buffer.readUInt16LE(offset);
}

function readUInt32(buffer, offset) {
  return buffer.readUInt32LE(offset);
}

function unzipEntries(filePath) {
  const buffer = fs.readFileSync(filePath);
  const entries = new Map();
  let offset = 0;
  while (offset < buffer.length - 4) {
    const signature = readUInt32(buffer, offset);
    if (signature !== 0x04034b50) {
      offset += 1;
      continue;
    }
    const method = readUInt16(buffer, offset + 8);
    const compressedSize = readUInt32(buffer, offset + 18);
    const fileNameLength = readUInt16(buffer, offset + 26);
    const extraLength = readUInt16(buffer, offset + 28);
    const nameStart = offset + 30;
    const dataStart = nameStart + fileNameLength + extraLength;
    const name = buffer.slice(nameStart, nameStart + fileNameLength).toString("utf8");
    const compressed = buffer.slice(dataStart, dataStart + compressedSize);
    let content;
    if (method === 0) content = compressed;
    else if (method === 8) content = inflateRaw(compressed);
    else throw new Error(`Unsupported zip compression method ${method} for ${name}`);
    entries.set(name.replace(/\\/g, "/"), content);
    offset = dataStart + compressedSize;
  }
  return entries;
}

function decodeXml(text) {
  return String(text)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'");
}

function columnOf(ref) {
  return (String(ref).match(/[A-Z]+/) || [""])[0];
}

function loadSharedStrings(entries) {
  const xml = entries.get("xl/sharedStrings.xml");
  if (!xml) return [];
  return [...xml.toString("utf8").matchAll(/<si>([\s\S]*?)<\/si>/g)].map((match) => {
    const text = [...match[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((part) => part[1]).join("");
    return decodeXml(text);
  });
}

function firstWorksheetPath(entries) {
  if (entries.has("xl/worksheets/sheet1.xml")) return "xl/worksheets/sheet1.xml";
  const key = [...entries.keys()].find((name) => /^xl\/worksheets\/sheet\d+\.xml$/.test(name));
  if (!key) throw new Error("Cannot find worksheet xml");
  return key;
}

function parseSheetRows(entries) {
  const sheet = entries.get(firstWorksheetPath(entries));
  const sharedStrings = loadSharedStrings(entries);
  const xml = sheet.toString("utf8");
  return [...xml.matchAll(/<row[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)].map((rowMatch) => {
    const cells = {};
    for (const cellMatch of rowMatch[2].matchAll(/<c[^>]*r="([A-Z]+\d+)"([^>]*)>([\s\S]*?)<\/c>/g)) {
      const ref = cellMatch[1];
      const attrs = cellMatch[2];
      const body = cellMatch[3];
      const raw = body.match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? body.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1] ?? "";
      let value = raw;
      if (/t="s"/.test(attrs)) value = sharedStrings[Number(raw)] ?? raw;
      else if (/t="inlineStr"/.test(attrs)) value = decodeXml(raw);
      else if (raw !== "" && Number.isFinite(Number(raw))) value = Number(raw);
      cells[columnOf(ref)] = value;
    }
    return cells;
  });
}

function importSingleRankFile(filePath) {
  const entries = unzipEntries(filePath);
  const rows = parseSheetRows(entries).slice(1);
  return rows
    .map((row) => ({
      score: Number(row.A),
      count: Number(row.B),
      rank: Number(row.C),
    }))
    .filter((row) => Number.isFinite(row.score) && Number.isFinite(row.rank))
    .map((row) => ({
      score: row.score,
      rank: row.rank,
      count: Number.isFinite(row.count) ? row.count : "",
    }));
}

function validateRows(rows) {
  const issues = [];
  for (let index = 1; index < rows.length; index += 1) {
    const prev = rows[index - 1];
    const row = rows[index];
    if (row.score > prev.score) issues.push(`row ${index + 1}: score rises ${prev.score} -> ${row.score}`);
    if (row.rank < prev.rank) issues.push(`row ${index + 1}: rank decreases ${prev.rank} -> ${row.rank}`);
  }
  return issues;
}

function buildRankData(sourceDir = SOURCE_DIR) {
  const rankDataByYearSubject = {};
  const summary = [];
  for (const source of SOURCES) {
    const filePath = path.join(sourceDir, source.file);
    if (!fs.existsSync(filePath)) throw new Error(`Source xlsx not found: ${filePath}`);
    const rows = importSingleRankFile(filePath);
    rankDataByYearSubject[source.year] ||= { history: [], physics: [] };
    rankDataByYearSubject[source.year][source.subject] = rows;
    summary.push({
      year: source.year,
      subject: source.subject,
      file: source.file,
      rows: rows.length,
      top: rows[0] || null,
      bottom: rows[rows.length - 1] || null,
      issues: validateRows(rows),
    });
  }
  return { rankDataByYearSubject, summary };
}

function buildModule(rankDataByYearSubject, summary) {
  const rankData2025BySubject = rankDataByYearSubject[2025] || { history: [], physics: [] };
  return `// Fujian art comprehensive score ranking tables.
// Generated by scripts/import-official-rank-xlsx.js from official 2023-2025 rank files.
const rankDataByYearSubject = ${JSON.stringify(rankDataByYearSubject, null, 2)};

const rankData2025BySubject = ${JSON.stringify(rankData2025BySubject, null, 2)};

const rankDataImportSummary = ${JSON.stringify(summary, null, 2)};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { rankDataByYearSubject, rankData2025BySubject, rankDataImportSummary };
}

if (typeof window !== "undefined") {
  window.FujianArtRank2025 = { rankDataByYearSubject, rankData2025BySubject, rankDataImportSummary };
}
`;
}

function main() {
  const args = process.argv.slice(2);
  const sourceDirFlagIndex = args.indexOf("--source-dir");
  const sourceDir = sourceDirFlagIndex >= 0 ? path.resolve(args[sourceDirFlagIndex + 1]) : SOURCE_DIR;
  const targetFlagIndex = args.indexOf("--out");
  const targetPath = targetFlagIndex >= 0 ? path.resolve(args[targetFlagIndex + 1]) : DEFAULT_TARGET;
  const jsonOnly = args.includes("--json");
  const { rankDataByYearSubject, summary } = buildRankData(sourceDir);
  if (jsonOnly) {
    process.stdout.write(JSON.stringify({ rankDataByYearSubject, summary }, null, 2));
    return;
  }
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, buildModule(rankDataByYearSubject, summary), "utf8");
  console.log(JSON.stringify({ target: targetPath, summary }, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = { importSingleRankFile, buildRankData, buildModule, validateRows };
