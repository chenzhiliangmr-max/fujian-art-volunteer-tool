const { colleges, schoolLinks } = require("./fujian-art-data");
const { rankData2025BySubject } = require("./fujian-art-rank-2025");

const DEFAULT_COUNTS = { rush: 10, steady: 18, safe: 12 };

function fmt(value) {
  if (value == null) return "待补";
  return Number(value).toFixed(2).replace(/\.00$/, "");
}

function bandLabel(band) {
  return band === "rush" ? "冲" : band === "steady" ? "稳" : band === "safe" ? "保" : "提示";
}

function hasAny(item, tags) {
  return tags.some((tag) => item.tags.includes(tag));
}

function calculateCompositeScore(culture, major) {
  const c = Number(culture);
  const m = Number(major);
  if (!Number.isFinite(c) || !Number.isFinite(m)) return null;
  return c * 0.5 + m * 2.5 * 0.5;
}

function rankForScore(score, rankData = []) {
  const numericScore = Number(score);
  if (!rankData.length || !Number.isFinite(numericScore)) return null;
  const sorted = [...rankData].sort((a, b) => b.score - a.score);
  const row = sorted.find((item) => numericScore >= item.score);
  return row ? row.rank : sorted[sorted.length - 1].rank;
}

function scoreForRank(rank, rankData = []) {
  const numericRank = Number(rank);
  if (!rankData.length || !Number.isFinite(numericRank)) return null;
  const sorted = [...rankData].sort((a, b) => a.rank - b.rank);
  const row = sorted.find((item) => numericRank <= item.rank);
  return row ? row.score : sorted[sorted.length - 1].score;
}

function estimatedRank(score, rankData2026 = []) {
  return rankForScore(score, rankData2026);
}

function collegeRank(item, rankData2025 = []) {
  return item.min == null ? null : rankForScore(item.min, rankData2025);
}

function equivalentScore2026(item, rankData2025 = [], rankData2026 = []) {
  const rank = collegeRank(item, rankData2025);
  return rank ? scoreForRank(rank, rankData2026) : null;
}

function referenceText(item, rankData2025 = [], rankData2026 = []) {
  if (item.min == null) return "";
  const scoreText = `${item.year}参考最低分 ${fmt(item.min)}${item.max ? `-${fmt(item.max)}` : ""}`;
  const rank = collegeRank(item, rankData2025);
  const equivalent = equivalentScore2026(item, rankData2025, rankData2026);
  if (rank && equivalent != null) return `${scoreText}，2025位次约 ${rank}，2026等位分约 ${fmt(equivalent)}`;
  if (rank) return `${scoreText}，2025位次约 ${rank}，2026等位分待导入2026表`;
  return `${scoreText}，2025位次待导入2025表`;
}

function normalizeCounts(counts = DEFAULT_COUNTS) {
  const rush = Math.max(0, Number(counts.rush || 0));
  const steady = Math.max(0, Number(counts.steady || 0));
  const safe = Math.max(0, Number(counts.safe || 0));
  const total = rush + steady + safe;
  if (total === 40) return { rush, steady, safe };
  if (total === 0) return DEFAULT_COUNTS;
  const scale = 40 / total;
  const r = Math.round(rush * scale);
  const s = Math.round(steady * scale);
  return { rush: r, steady: s, safe: 40 - r - s };
}

function itemMatches(item, options = {}) {
  const subject = options.subject || "history";
  const includeUnverified = options.includeUnverified !== false;
  const includePrivate = !!options.includePrivate;
  const includeCoop = !!options.includeCoop;
  const onlyPublic = !!options.onlyPublic;
  const onlyHigh = !!options.onlyHigh;
  const keyword = String(options.keyword || "").trim().toLowerCase();
  const subjectOk = item.subject === "both" || item.subject === subject;

  if (!subjectOk) return false;
  if (!includeUnverified && item.min == null) return false;
  if (!includePrivate && item.tags.includes("private")) return false;
  if (!includeCoop && item.tags.includes("coop")) return false;
  if (onlyPublic && !item.tags.includes("public")) return false;
  if (onlyHigh && !hasAny(item, ["985", "211", "double"])) return false;
  if (keyword) {
    const hay = [item.school, item.province, item.level, item.info, item.status].join(" ").toLowerCase();
    if (!hay.includes(keyword)) return false;
  }
  return true;
}

function classifyByScore(item, score) {
  const numericScore = Number(score);
  if (item.min == null || !Number.isFinite(numericScore)) return "info";
  const diff = item.min - numericScore;
  if (diff > 0 && diff <= 20) return "rush";
  if (diff <= 0 && diff >= -12) return "steady";
  if (diff < -12) return "safe";
  return "info";
}

function classifyByRank(item, score, rankData2025 = [], rankData2026 = []) {
  const equivalent = equivalentScore2026(item, rankData2025, rankData2026);
  if (equivalent == null || !Number.isFinite(Number(score))) return "info";
  return classifyByScore({ ...item, min: equivalent }, Number(score));
}

function rankEquivalentDiff(item, score, rankData2025 = [], rankData2026 = []) {
  const equivalent = equivalentScore2026(item, rankData2025, rankData2026);
  if (equivalent == null || !Number.isFinite(Number(score))) return Number.POSITIVE_INFINITY;
  return equivalent - Number(score);
}

function rankRiskText(item, rankData2025 = [], rankData2026 = []) {
  const rank = collegeRank(item, rankData2025);
  const equivalent = equivalentScore2026(item, rankData2025, rankData2026);
  if (rank && equivalent != null) return `按位次换算：2025录取位次约 ${rank}，2026等位分约 ${fmt(equivalent)}`;
  return "";
}

function sortGroup(items, band, score, useRank, rankData2025 = [], rankData2026 = []) {
  if (!useRank) {
    if (band === "rush") items.sort((a, b) => a.min - b.min);
    if (band === "steady") items.sort((a, b) => Math.abs(a.min - score) - Math.abs(b.min - score));
    if (band === "safe") items.sort((a, b) => b.min - a.min);
    return;
  }
  if (band === "rush") items.sort((a, b) => rankEquivalentDiff(a, score, rankData2025, rankData2026) - rankEquivalentDiff(b, score, rankData2025, rankData2026));
  if (band === "steady") items.sort((a, b) => Math.abs(rankEquivalentDiff(a, score, rankData2025, rankData2026)) - Math.abs(rankEquivalentDiff(b, score, rankData2025, rankData2026)));
  if (band === "safe") items.sort((a, b) => rankEquivalentDiff(b, score, rankData2025, rankData2026) - rankEquivalentDiff(a, score, rankData2025, rankData2026));
}

function riskText(item, recommendMode, rankData2025 = [], rankData2026 = []) {
  const bits = [];
  if (item.min != null) bits.push(referenceText(item, rankData2025, rankData2026));
  if (recommendMode === "rank" && item.min != null && rankRiskText(item, rankData2025, rankData2026)) bits.push(rankRiskText(item, rankData2025, rankData2026));
  if (item.status !== "已核") bits.push(`数据状态：${item.status}`);
  if (hasAny(item, ["985", "211", "double"])) bits.push("高层级院校，小计划波动需放大安全垫");
  if (item.tags.includes("coop")) bits.push("中外合作需核学费、外语和培养方式");
  if (item.tags.includes("private")) bits.push("民办/独立学院需核学费和校区");
  if (!bits.length) bits.push("待官方录取分补齐后再判定冲稳保");
  return bits.join("；");
}

function getPool(options = {}) {
  const sourceColleges = options.colleges || colleges;
  const rows = sourceColleges.filter((item) => itemMatches(item, options));
  if (options.preferFujian) {
    rows.sort((a, b) => (b.province === "福建") - (a.province === "福建") || (b.min || 0) - (a.min || 0));
  } else {
    rows.sort((a, b) => (b.min || -1) - (a.min || -1));
  }
  return rows;
}

function makeRecommendations(options = {}) {
  const score = Number(options.score);
  const recommendMode = options.recommendMode || "score";
  const rankData2025 = options.rankData2025 || options.rankData || rankData2025BySubject[options.subject || "history"] || [];
  const rankData2026 = options.rankData2026 || options.rankData || [];
  const inputRank = Number(options.rank);
  const userRank = inputRank || estimatedRank(score, rankData2026);
  const useRank = recommendMode === "rank" && !!userRank && rankData2025.length > 0 && rankData2026.length > 0;
  const counts = normalizeCounts(options.counts);
  const allRows = getPool(options).filter((item) => !item.tags.includes("special"));
  let notice = "";

  if (recommendMode === "rank" && (!rankData2025.length || !rankData2026.length)) {
    return {
      mode: "rank",
      modeHint: "2025位次映射2026等位分",
      userRank,
      poolCount: allRows.length,
      notice: !rankData2025.length
        ? "未加载到内置 2025 一分一段表，请检查小程序共享数据。"
        : "按位次生成需要导入 2026 一分一段表。2025表已内置，用于查往年录取位次；2026表用于换算今年等位分。",
      rows: [],
    };
  }

  if (recommendMode === "rank" && !userRank) {
    return {
      mode: "rank",
      modeHint: "2025位次映射2026等位分",
      userRank,
      poolCount: allRows.length,
      notice: "按位次生成需要填写考生位次；也可以先输入综合分并导入一分一段表，由系统估算位次。",
      rows: [],
    };
  }

  const rows = allRows.filter((item) => item.min != null);
  const grouped = { rush: [], steady: [], safe: [] };

  rows.forEach((item) => {
    const band = useRank ? classifyByRank(item, score, rankData2025, rankData2026) : classifyByScore(item, score);
    if (grouped[band]) grouped[band].push(item);
  });

  sortGroup(grouped.rush, "rush", score, useRank, rankData2025, rankData2026);
  sortGroup(grouped.steady, "steady", score, useRank, rankData2025, rankData2026);
  sortGroup(grouped.safe, "safe", score, useRank, rankData2025, rankData2026);

  const picked = [];
  const take = (band, count) => {
    for (const item of grouped[band]) {
      if (picked.length >= 40 || picked.filter((entry) => entry.band === band).length >= count) break;
      if (!picked.some((entry) => entry.item === item)) picked.push({ item, band });
    }
  };

  take("rush", counts.rush);
  take("steady", counts.steady);
  take("safe", counts.safe);

  const fallback = rows.filter((item) => !picked.some((entry) => entry.item === item));
  for (const item of fallback) {
    if (picked.length >= 40) break;
    const band = useRank ? classifyByRank(item, score, rankData2025, rankData2026) : classifyByScore(item, score);
    picked.push({ item, band: grouped[band] ? band : "safe" });
  }

  const unknown = recommendMode === "rank" ? [] : allRows.filter((item) => item.min == null && !picked.some((entry) => entry.item === item));
  for (const item of unknown) {
    if (picked.length >= 40) break;
    picked.push({ item, band: "info" });
  }

  return {
    mode: useRank ? "rank" : "score",
    modeHint: useRank ? "2025位次映射2026等位分" : "当前按综合分差值",
    userRank,
    poolCount: allRows.length,
    notice,
    rows: picked.slice(0, 40).map((entry, index) => ({
      index: index + 1,
      band: entry.band,
      bandLabel: bandLabel(entry.band),
      item: entry.item,
      scoreText: `${fmt(entry.item.min)}${entry.item.max ? `-${fmt(entry.item.max)}` : ""}`,
      equivalentScore: useRank ? equivalentScore2026(entry.item, rankData2025, rankData2026) : null,
      risk: riskText(entry.item, recommendMode, rankData2025, rankData2026),
      link: schoolLinks[entry.item.school] || "",
    })),
  };
}

function parseRankData(text = "") {
  const value = String(text || "").trim();
  if (!value) return [];
  return value.split(/\n+/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const parts = line.split(/[,，\s]+/).filter(Boolean);
    if (parts[0] && parts[0].toLowerCase() === "score") return null;
    const score = Number(parts[0]);
    const rank = Number(parts[1]);
    const count = Number(parts[2] || "");
    if (!Number.isFinite(score) || !Number.isFinite(rank)) return null;
    return { score, rank, count: Number.isFinite(count) ? count : "" };
  }).filter(Boolean);
}

module.exports = {
  colleges,
  schoolLinks,
  fmt,
  bandLabel,
  calculateCompositeScore,
  estimatedRank,
  rankForScore,
  scoreForRank,
  parseRankData,
  getPool,
  makeRecommendations,
  rankData2025BySubject,
};
