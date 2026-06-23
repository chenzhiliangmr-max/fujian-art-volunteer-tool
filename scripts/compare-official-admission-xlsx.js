const { readOfficialRows } = require("./import-official-admission-xlsx.js");
const current = require("../miniprogram/shared/fujian-art-data.js").colleges;

function text(value) {
  return String(value ?? "").trim();
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function sourceKey(row) {
  return [text(row.school), Number(row.year), text(row.major)].join("|");
}

function currentKey(row) {
  return [text(row.school), Number(row.year), text(row.info).replace(/，录取.*$/, "")].join("|");
}

function sourceValue(row) {
  return {
    admit: number(row.admit_count),
    min: number(row.min_score),
    max: number(row.max_score),
    avg: number(row.avg_score),
    verify: text(row.verify_status),
  };
}

function currentValue(row) {
  return {
    admit: number(text(row.info).match(/，录取([\d.]+)/)?.[1]),
    min: number(row.min),
    max: number(row.max),
    avg: number(row.avg),
    verify: text(row.status).match(/省教委官方数据（([^）]+)）/)?.[1] || "",
  };
}

function same(a, b) {
  return ["admit", "min", "max", "avg", "verify"].every((field) => a[field] === b[field]);
}

function compare(sourcePath) {
  const raw = readOfficialRows(sourcePath);
  const invalid = raw.map((row, index) => ({ row: index + 2, ...row })).filter((row) =>
    !text(row.school) || !Number.isFinite(Number(row.year)) || number(row.min_score) == null
  );
  const valid = raw.filter((row) => text(row.school) && Number.isFinite(Number(row.year)) && number(row.min_score) != null);
  const sourceMap = new Map(valid.map((row) => [sourceKey(row), row]));
  const currentMap = new Map(current.map((row) => [currentKey(row), row]));
  const keyCounts = new Map();
  valid.forEach((row) => keyCounts.set(sourceKey(row), (keyCounts.get(sourceKey(row)) || 0) + 1));
  const duplicateKeys = [...keyCounts].filter(([, count]) => count > 1);
  const added = [...sourceMap].filter(([key]) => !currentMap.has(key));
  const removed = [...currentMap].filter(([key]) => !sourceMap.has(key));
  const changed = [...sourceMap].filter(([key, row]) => {
    const before = currentMap.get(key);
    return before && !same(sourceValue(row), currentValue(before));
  }).map(([key, row]) => ({ key, before: currentValue(currentMap.get(key)), after: sourceValue(row) }));
  return {
    rawRows: raw.length,
    validRows: valid.length,
    invalidRows: invalid,
    duplicateKeys,
    added: added.map(([key, row]) => ({ key, value: sourceValue(row) })),
    removed: removed.map(([key, row]) => ({ key, value: currentValue(row) })),
    changed,
  };
}

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error("Please provide an xlsx path");
console.log(JSON.stringify(compare(sourcePath), null, 2));

module.exports = { compare };
