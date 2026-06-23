const fs = require("fs");
const path = require("path");
const { readOfficialRows } = require("./import-official-admission-xlsx.js");

const DEFAULT_SOURCE = "C:\\Users\\Administrator\\Desktop\\填报志愿数据\\fujian-art-2023-2025-structured-0617.xlsx";
const DEFAULT_TARGET = path.resolve(__dirname, "..", "outputs", "official-admission-data-audit-20260620.csv");

function numericOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function issuesFor(row) {
  const school = String(row.school || "").trim();
  const min = numericOrNull(row.min_score);
  const max = numericOrNull(row.max_score);
  const avg = numericOrNull(row.avg_score);
  const issues = [];

  if (!school) issues.push("学校名为空");
  for (const [field, value] of [["max_score", max], ["min_score", min], ["avg_score", avg]]) {
    if (value != null && value > 750) issues.push(`${field}超过750`);
    if (value != null && value > 0 && value < 300) issues.push(`${field}低于300`);
  }
  if (min != null && max != null && max < min) issues.push("最高分小于最低分");
  if (min != null && max != null && avg != null && (avg < min - 1 || avg > max + 1)) {
    issues.push("平均分明显不在最低-最高区间");
  }
  return issues;
}

function audit(sourcePath, targetPath) {
  const rows = readOfficialRows(sourcePath);
  const header = ["row", "school", "major", "year", "admit_count", "max_score", "min_score", "avg_score", "verify_status", "issues"];
  const output = [header];
  const statusCounts = {};
  const issueCounts = {};

  rows.forEach((row, index) => {
    const status = String(row.verify_status || "(空)");
    statusCounts[status] = (statusCounts[status] || 0) + 1;
    const issues = issuesFor(row);
    issues.forEach((issue) => {
      issueCounts[issue] = (issueCounts[issue] || 0) + 1;
    });
    if (!issues.length) return;
    output.push([
      index + 2,
      row.school,
      row.major,
      row.year,
      row.admit_count,
      row.max_score,
      row.min_score,
      row.avg_score,
      row.verify_status,
      issues.join("；"),
    ]);
  });

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, output.map((row) => row.map(csvCell).join(",")).join("\r\n"), "utf8");
  return {
    source: sourcePath,
    target: targetPath,
    rows: rows.length,
    issueRows: output.length - 1,
    statusCounts,
    issueCounts,
  };
}

function main() {
  const args = process.argv.slice(2);
  const sourcePath = args.find((arg) => !arg.startsWith("--")) || DEFAULT_SOURCE;
  const outIndex = args.indexOf("--out");
  const targetPath = outIndex >= 0 ? path.resolve(args[outIndex + 1]) : DEFAULT_TARGET;
  console.log(JSON.stringify(audit(sourcePath, targetPath), null, 2));
}

if (require.main === module) {
  main();
}

module.exports = { audit, issuesFor };
