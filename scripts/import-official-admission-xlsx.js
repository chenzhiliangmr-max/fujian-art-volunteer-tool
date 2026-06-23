const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const schoolMetadata = require(path.resolve(__dirname, "..", "shared", "fujian-art-school-metadata.js"));

const DEFAULT_SOURCE = "C:\\Users\\Administrator\\Desktop\\填报志愿数据\\fujian-art-2023-2025-structured-0617.xlsx";
const DEFAULT_H5 = path.resolve(__dirname, "..", "index.html");
const OFFICIAL_SOURCE = "福建省教委官方结构化数据（2023-2025，用户提供）";
const OFFICIAL_ROW_CORRECTIONS = new Map([
  ["湖北美术学院|环境设计|2025", { admit_count: 1, max_score: 545.25, min_score: 545.25, avg_score: 545 }],
  ["湖南文理学院|美术学|2023", { admit_count: 4, max_score: 519.5, min_score: 519, avg_score: 519 }],
  ["吉林师范大学博达学院|美术学|2024", { admit_count: 6, max_score: 481.5, min_score: 474.75, avg_score: 478 }],
  ["吉首大学|视觉传达设计|2024", { admit_count: 3, max_score: 512, min_score: 511.25, avg_score: 512 }],
  ["江南大学|视觉传达设计|2024", { admit_count: 4, max_score: 594.5, min_score: 582.5, avg_score: 589 }],
  ["山东艺术学院|工艺美术|2025", { admit_count: 1, max_score: 523.75, min_score: 523.75, avg_score: 524 }],
]);

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

function columnNumber(column) {
  return column.split("").reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0);
}

function loadSharedStrings(entries) {
  const xml = entries.get("xl/sharedStrings.xml");
  if (!xml) return [];
  return [...xml.toString("utf8").matchAll(/<si>([\s\S]*?)<\/si>/g)].map((match) => {
    const text = [...match[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((part) => part[1]).join("");
    return decodeXml(text);
  });
}

function loadSheets(entries) {
  const workbook = entries.get("xl/workbook.xml")?.toString("utf8");
  const rels = entries.get("xl/_rels/workbook.xml.rels")?.toString("utf8");
  if (!workbook || !rels) throw new Error("Cannot find workbook metadata");
  const relMap = new Map();
  for (const rel of rels.matchAll(/<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/g)) {
    relMap.set(rel[1], rel[2].replace(/^\/?xl\//, ""));
  }
  return [...workbook.matchAll(/<sheet[^>]*name="([^"]+)"[^>]*r:id="([^"]+)"/g)].map((match) => ({
    name: decodeXml(match[1]),
    path: "xl/" + relMap.get(match[2]).replace(/^\//, ""),
  }));
}

function parseSheetRows(entries, sheetPath) {
  const sheet = entries.get(sheetPath);
  if (!sheet) throw new Error(`Cannot find ${sheetPath}`);
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

function rowsToObjects(rows) {
  const headerIndex = rows.findIndex((row) => Object.values(row).some((value) => {
    const text = String(value).trim().toLowerCase();
    return text.includes("院校") || text.includes("学校") || text === "school";
  }));
  if (headerIndex < 0) return [];
  const headers = rows[headerIndex];
  const columns = Object.keys(headers).sort((a, b) => columnNumber(a) - columnNumber(b));
  return rows.slice(headerIndex + 1)
    .map((row) => {
      const item = {};
      for (const column of columns) {
        const key = String(headers[column] ?? "").trim();
        if (!key) continue;
        item[key] = row[column] ?? "";
      }
      return item;
    })
    .filter((item) => Object.values(item).some((value) => String(value).trim() !== ""));
}

function inspectWorkbook(sourcePath) {
  const entries = unzipEntries(sourcePath);
  return loadSheets(entries).map((sheet) => {
    const rows = parseSheetRows(entries, sheet.path);
    const objects = rowsToObjects(rows);
    return {
      sheet: sheet.name,
      path: sheet.path,
      rowCount: rows.length,
      objectCount: objects.length,
      firstRows: rows.slice(0, 8),
      headers: objects.length ? Object.keys(objects[0]) : [],
      sample: objects.slice(0, 5),
    };
  });
}

function readOfficialRows(sourcePath) {
  const entries = unzipEntries(sourcePath);
  const sheets = loadSheets(entries);
  if (!sheets.length) return [];
  const rows = parseSheetRows(entries, sheets[0].path);
  return rowsToObjects(rows);
}

function extractCurrentData(html) {
  const collegesMatch = html.match(/const colleges = (\[[\s\S]*?\n\s*\]);\n\n\s*const schoolLinks = /);
  const linksMatch = html.match(/const schoolLinks = (\{[\s\S]*?\n\s*\});\n\n\s*let subject = /);
  if (!collegesMatch || !linksMatch) throw new Error("Cannot find colleges or schoolLinks blocks in index.html");
  return {
    collegesBlock: collegesMatch[1],
    linksBlock: linksMatch[1],
    colleges: Function(`return (${collegesMatch[1]});`)(),
    schoolLinks: Function(`return (${linksMatch[1]});`)(),
  };
}

function writeWebSharedData(h5Path, html) {
  const data = extractCurrentData(html);
  const target = path.join(path.dirname(h5Path), "shared", "fujian-art-data.js");
  const payload = "// Web-only shared data generated from index.html.\nconst colleges = "
    + JSON.stringify(data.colleges, null, 2)
    + ";\n\nconst schoolLinks = "
    + JSON.stringify(data.schoolLinks, null, 2)
    + ";\n\nconst payload = { colleges, schoolLinks, dataVersion: \"h5-sync\", dataSourceNote: \"H5 official admission data\" };\n"
    + "if (typeof module !== \"undefined\" && module.exports) module.exports = payload;\n"
    + "if (typeof window !== \"undefined\") window.FujianArtData = payload;\n";
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, payload, "utf8");
}

function baseSchoolName(name) {
  return String(name || "")
    .replace(/[（(〔\[].*?[）)〕\]]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

function inferProvince(school) {
  const text = String(school || "");
  if (/^(福建|福州|厦门|泉州|闽南|闽江|集美|龙岩|莆田|三明|宁德|武夷|阳光|仰恩)/.test(text)) return "福建";
  return "";
}

function buildMetaMap(currentRows) {
  const meta = new Map();
  for (const item of currentRows) {
    if (!item || !item.school) continue;
    const enriched = schoolMetadata.enrich(item);
    const value = {
      province: enriched.province || "",
      level: enriched.level || "",
      subject: enriched.subject || "both",
      tags: Array.isArray(enriched.tags) ? enriched.tags.filter((tag) => !["todo", "special"].includes(tag)) : [],
    };
    if (!meta.has(item.school)) meta.set(item.school, value);
    const base = baseSchoolName(item.school);
    if (base && !meta.has(base)) meta.set(base, value);
  }
  return meta;
}

function numericOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function qualityFlags(row) {
  const min = numericOrNull(row.min_score);
  const max = numericOrNull(row.max_score);
  const avg = numericOrNull(row.avg_score);
  const flags = [];
  const recommendationBlocking = [];

  for (const [field, value] of [["max_score", max], ["min_score", min], ["avg_score", avg]]) {
    if (value != null && value > 750) {
      flags.push(`${field}超过750`);
      if (field !== "avg_score") recommendationBlocking.push(`${field}超过750`);
    }
    if (value != null && value > 0 && value < 300) {
      flags.push(`${field}低于300`);
      if (field !== "avg_score") recommendationBlocking.push(`${field}低于300`);
    }
  }

  if (min != null && max != null && max < min) {
    flags.push("最高分小于最低分");
    recommendationBlocking.push("最高分小于最低分");
  }

  if (min != null && max != null && avg != null && (avg < min - 1 || avg > max + 1)) {
    flags.push("平均分明显不在最低-最高区间");
  }

  return {
    flags: [...new Set(flags)],
    recommendationBlocking: [...new Set(recommendationBlocking)],
  };
}

function statusFor(row, quality) {
  const verify = String(row.verify_status || "").trim();
  const base = verify ? `省教委官方数据（${verify}）` : "省教委官方数据";
  if (!quality.flags.length) return base;
  return `${base}；需确认：${quality.flags.join("、")}`;
}

function tagsFor(row, meta, quality) {
  const tags = new Set(meta.tags || []);
  tags.add("official");
  if (/中外|合作办学/.test(String(row.school) + String(row.major))) tags.add("coop");
  if (quality.flags.length) tags.add("todo");
  if (quality.recommendationBlocking.length) tags.add("special");
  return [...tags];
}

function rowToCollege(row, metaMap) {
  const school = String(row.school || "").trim();
  const major = String(row.major || "").trim();
  const meta = metaMap.get(school) || metaMap.get(baseSchoolName(school)) || {};
  const admitCount = numericOrNull(row.admit_count);
  const max = numericOrNull(row.max_score);
  const min = numericOrNull(row.min_score);
  const avg = numericOrNull(row.avg_score);
  const quality = qualityFlags(row);
  const infoParts = [major || "美术与设计类"];
  if (admitCount != null) infoParts.push(`录取${admitCount}`);
  if (avg != null) infoParts.push(`平均${avg}`);
  const college = {
    school,
    province: meta.province || inferProvince(school),
    level: meta.level || "官方数据",
    year: Number(row.year),
    info: infoParts.join("，"),
    subject: "history",
    min,
    ...(max != null ? { max } : {}),
    ...(avg != null ? { avg } : {}),
    status: statusFor(row, quality),
    source: OFFICIAL_SOURCE,
    tags: tagsFor(row, meta, quality),
  };
  return schoolMetadata.enrich(college);
}

function jsValue(value) {
  return JSON.stringify(value);
}

function collegeLiteral(item) {
  const parts = [
    `school:${jsValue(item.school)}`,
    `province:${jsValue(item.province)}`,
    `level:${jsValue(item.level)}`,
    `year:${item.year}`,
    `info:${jsValue(item.info)}`,
    `subject:${jsValue(item.subject)}`,
    `min:${item.min == null ? "null" : item.min}`,
  ];
  if (item.max != null) parts.push(`max:${item.max}`);
  if (item.avg != null) parts.push(`avg:${item.avg}`);
  parts.push(`status:${jsValue(item.status)}`);
  parts.push(`source:${jsValue(item.source)}`);
  parts.push(`tags:${JSON.stringify(item.tags)}`);
  return `{${parts.join(", ")}}`;
}

function buildCollegesBlock(rows) {
  return `[\n${rows.map((row) => `      ${collegeLiteral(row)}`).join(",\n")}\n    ]`;
}

function isExcludedOfficialRow(row) {
  return row.school === "吉首大学"
    && row.major === "视觉传达设计"
    && Number(row.year) === 2025;
}

function applyOfficialCorrection(row) {
  const key = String(row.school) + "|" + String(row.major) + "|" + String(row.year);
  return OFFICIAL_ROW_CORRECTIONS.has(key)
    ? { ...row, ...OFFICIAL_ROW_CORRECTIONS.get(key) }
    : row;
}

function admissionDuplicateKey(row) {
  const normalize = (value) => String(value ?? "").trim().replace(/\s+/g, "");
  return [normalize(row.school), normalize(row.major), normalize(row.year)].join("|");
}

function writeDuplicateAudit(rows, subject) {
  const counts = rows.reduce((result, row) => {
    const key = admissionDuplicateKey(row);
    result.set(key, (result.get(key) || 0) + 1);
    return result;
  }, new Map());
  const duplicateKeys = [...counts.entries()].filter(([, count]) => count > 1).map(([key]) => key);
  const target = path.resolve(__dirname, "..", "outputs", `official-admission-duplicates-${subject}.csv`);
  const duplicateSet = new Set(duplicateKeys);
  const csvCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const output = [["school", "major", "year", "admit_count", "max_score", "min_score", "avg_score", "verify_status"]];
  rows.filter((row) => duplicateSet.has(admissionDuplicateKey(row))).forEach((row) => output.push([
    row.school, row.major, row.year, row.admit_count, row.max_score, row.min_score, row.avg_score, row.verify_status,
  ]));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `\uFEFF${output.map((line) => line.map(csvCell).join(",")).join("\r\n")}`, "utf8");
  return { duplicateKeys, target };
}

function importOfficialAdmissions(sourcePath, h5Path) {
  const html = fs.readFileSync(h5Path, "utf8");
  const current = extractCurrentData(html);
  const metaMap = buildMetaMap(current.colleges);
  const normalizedRows = readOfficialRows(sourcePath)
    .map(applyOfficialCorrection)
    .filter((row) => !isExcludedOfficialRow(row));
  const duplicateAudit = writeDuplicateAudit(normalizedRows, "history");
  const officialRows = normalizedRows
    .map((row) => rowToCollege(row, metaMap))
    .filter((row) => row.school && Number.isFinite(row.year) && row.min != null);

  const collegesBlock = buildCollegesBlock(officialRows);
  const updated = html.replace(
    /const colleges = \[[\s\S]*?\n\s*\];\n\n\s*const schoolLinks = /,
    `const colleges = ${collegesBlock};\n\n    const schoolLinks = `,
  );

  if (updated === html) throw new Error("Failed to replace colleges block");
  fs.writeFileSync(h5Path, updated, "utf8");
  writeWebSharedData(h5Path, updated);
  return {
    source: sourcePath,
    target: h5Path,
    rows: officialRows.length,
    schools: new Set(officialRows.map((row) => row.school)).size,
    years: [...new Set(officialRows.map((row) => row.year))].sort(),
    duplicateKeys: duplicateAudit.duplicateKeys,
    duplicateAudit: duplicateAudit.target,
  };
}

function normalizePhysicsRow(row) {
  const shifted = Number(row.year) > 0
    && Number(row.year) < 10
    && Number(row.major) >= 2023
    && Number(row.major) <= 2025;
  if (!shifted) return row;
  return {
    school: "东华大学",
    major: row.school,
    year: Number(row.major),
    admit_count: Number(row.year),
    max_score: row.admit_count,
    min_score: row.max_score,
    avg_score: row.min_score,
    verify_status: "人工已核（用户按原表确认）",
  };
}

function applyPhysicsCorrection(row) {
  if (row.school === "井冈山大学"
    && row.major === "美术学"
    && Number(row.year) === 2023
    && Number(row.admit_count) === 3
    && Number(row.max_score) === 514.5) {
    return { ...row, year: 2024, verify_status: "人工已核（用户按原表确认）" };
  }
  return row;
}

const PHYSICS_REPLACEMENT_SCHOOLS = new Set(["南昌理工学院", "南昌职业大学"]);
const PHYSICS_REPLACEMENT_ROWS = [
  { school: "南昌理工学院", major: "产品设计", year: 2024, admit_count: 1, max_score: 460, min_score: 460, avg_score: 460 },
  { school: "南昌理工学院", major: "环境设计", year: 2025, admit_count: 1, max_score: 431.5, min_score: 431.5, avg_score: 432 },
  { school: "南昌理工学院", major: "环境设计", year: 2024, admit_count: 1, max_score: 443.75, min_score: 443.75, avg_score: 444 },
  { school: "南昌理工学院", major: "环境设计", year: 2023, admit_count: 1, max_score: 477, min_score: 477, avg_score: 477 },
  { school: "南昌理工学院", major: "视觉传达设计", year: 2025, admit_count: 2, max_score: 448.5, min_score: 440.5, avg_score: 445 },
  { school: "南昌理工学院", major: "视觉传达设计", year: 2024, admit_count: 1, max_score: 461.75, min_score: 461.75, avg_score: 462 },
  { school: "南昌职业大学", major: "视觉传达设计", year: 2025, admit_count: 2, max_score: 436.75, min_score: 428, avg_score: 432 },
  { school: "南昌职业大学", major: "数字媒体艺术", year: 2025, admit_count: 2, max_score: 430.5, min_score: 428, avg_score: 429 },
  { school: "南昌职业大学", major: "视觉传达设计", year: 2024, admit_count: 2, max_score: 456, min_score: 450.75, avg_score: 453 },
  { school: "南昌职业大学", major: "视觉传达设计", year: 2023, admit_count: 2, max_score: 480.3, min_score: 479.6, avg_score: 480 },
].map((row) => ({ ...row, verify_status: "人工已核（用户按原表确认）" }));

function importPhysicsAdmissions(sourcePath, h5Path) {
  const html = fs.readFileSync(h5Path, "utf8");
  const current = extractCurrentData(html);
  const metaMap = buildMetaMap(current.colleges);
  const normalizedRows = readOfficialRows(sourcePath)
    .filter((row) => !PHYSICS_REPLACEMENT_SCHOOLS.has(row.school))
    .map(normalizePhysicsRow)
    .map(applyPhysicsCorrection)
    .concat(PHYSICS_REPLACEMENT_ROWS);
  const duplicateAudit = writeDuplicateAudit(normalizedRows, "physics");
  const keyFor = admissionDuplicateKey;
  const keyCounts = normalizedRows.reduce((counts, row) => {
    const key = keyFor(row);
    counts.set(key, (counts.get(key) || 0) + 1);
    return counts;
  }, new Map());
  const duplicateKeys = duplicateAudit.duplicateKeys;
  const physicsRows = normalizedRows
    .filter((row) => keyCounts.get(keyFor(row)) === 1)
    .map((row) => ({
      ...rowToCollege(row, metaMap),
      subject: "physics",
      source: "福建省教委官方结构化数据（物理组，2023-2025，用户提供）",
    }))
    .filter((row) => row.school && row.year >= 2023 && row.year <= 2025 && row.min != null);
  const combinedRows = [
    ...current.colleges.filter((row) => row.subject !== "physics"),
    ...physicsRows,
  ];
  const collegesBlock = buildCollegesBlock(combinedRows);
  const updated = html.replace(
    /const colleges = \[[\s\S]*?\n\s*\];\n\n\s*const schoolLinks = /,
    `const colleges = ${collegesBlock};\n\n    const schoolLinks = `,
  );
  if (updated === html) throw new Error("Failed to replace colleges block");
  fs.writeFileSync(h5Path, updated, "utf8");
  writeWebSharedData(h5Path, updated);
  return {
    source: sourcePath,
    target: h5Path,
    importedRows: physicsRows.length,
    physicsSchools: new Set(physicsRows.map((row) => row.school)).size,
    totalRows: combinedRows.length,
    duplicateKeys,
    duplicateAudit: duplicateAudit.target,
  };
}

function main() {
  const args = process.argv.slice(2);
  const sourcePath = args.find((arg) => !arg.startsWith("--")) || DEFAULT_SOURCE;
  if (!fs.existsSync(sourcePath)) throw new Error(`Source xlsx not found: ${sourcePath}`);

  if (args.includes("--inspect")) {
    console.log(JSON.stringify(inspectWorkbook(sourcePath), null, 2));
    return;
  }

  if (args.includes("--write")) {
    const targetFlagIndex = args.indexOf("--out");
    const h5Path = targetFlagIndex >= 0 ? path.resolve(args[targetFlagIndex + 1]) : DEFAULT_H5;
    console.log(JSON.stringify(importOfficialAdmissions(sourcePath, h5Path), null, 2));
    return;
  }

  console.log(JSON.stringify(inspectWorkbook(sourcePath).map((sheet) => ({
    sheet: sheet.sheet,
    rows: sheet.objectCount,
    headers: sheet.headers,
    sample: sheet.sample[0] || null,
  })), null, 2));
}

if (require.main === module) {
  main();
}

module.exports = { inspectWorkbook, readOfficialRows, importOfficialAdmissions, importPhysicsAdmissions, admissionDuplicateKey, writeDuplicateAudit };
