const baseData = require("./fujian-art-data");

const COLLEGES_KEY = "fujian_art_managed_colleges";
const LINKS_KEY = "fujian_art_managed_school_links";
const LOG_KEY = "fujian_art_audit_logs";
const RECORDS_KEY = "fujian_art_recommend_records";

function getLocalColleges() {
  return wx.getStorageSync(COLLEGES_KEY) || baseData.colleges;
}

function getLocalLinks() {
  return wx.getStorageSync(LINKS_KEY) || baseData.schoolLinks;
}

function saveLocalColleges(colleges) {
  wx.setStorageSync(COLLEGES_KEY, colleges);
}

function saveLocalLinks(schoolLinks) {
  wx.setStorageSync(LINKS_KEY, schoolLinks);
}

function importColleges(colleges, user) {
  if (!Array.isArray(colleges)) throw new Error("数据必须是数组");
  const normalized = colleges.map((item) => ({
    ...item,
    id: item.id || [item.school, item.year, item.subject, item.info].join("|"),
    year: Number(item.year),
    min: item.min === "" || item.min == null ? null : Number(item.min),
    max: item.max === "" || item.max == null ? undefined : Number(item.max),
    tags: Array.isArray(item.tags) ? item.tags : String(item.tags || "").split(/[,，、\s]+/).filter(Boolean),
  }));
  saveLocalColleges(normalized);
  addAuditLog("import_colleges", `导入 ${normalized.length} 条院校数据`, user);
  return normalized;
}

function exportCollegesText() {
  return JSON.stringify(getLocalColleges(), null, 2);
}

function getAuditLogs() {
  return wx.getStorageSync(LOG_KEY) || [];
}

function addAuditLog(action, detail, user) {
  const logs = getAuditLogs();
  const log = {
    action,
    detail,
    operator: user && user.openid ? user.openid : "unknown",
    time: new Date().toISOString(),
  };
  logs.unshift(log);
  wx.setStorageSync(LOG_KEY, logs.slice(0, 100));
  syncAuditLogToCloud(log);
}

function syncAuditLogToCloud(log) {
  if (!wx.cloud || !wx.cloud.database) return;
  wx.cloud.database().collection("audit_logs").add({ data: log });
}

function syncCollegeToCloud(college) {
  if (!wx.cloud || !wx.cloud.database) return;
  const db = wx.cloud.database();
  db.collection("colleges").where({ id: college.id }).get({
    success(res) {
      if (res.data && res.data[0] && res.data[0]._id) {
        db.collection("colleges").doc(res.data[0]._id).update({ data: college });
      } else {
        db.collection("colleges").add({ data: college });
      }
    },
  });
}

function deleteCollegeFromCloud(id) {
  if (!wx.cloud || !wx.cloud.database) return;
  const db = wx.cloud.database();
  db.collection("colleges").where({ id }).get({
    success(res) {
      (res.data || []).forEach((item) => {
        if (item._id) db.collection("colleges").doc(item._id).remove();
      });
    },
  });
}

function loadColleges() {
  return new Promise((resolve) => {
    if (!wx.cloud || !wx.cloud.database) {
      resolve({ colleges: getLocalColleges(), schoolLinks: getLocalLinks(), source: "local" });
      return;
    }

    wx.cloud.database().collection("colleges").limit(200).get({
      success(res) {
        if (!res.data || !res.data.length) {
          resolve({ colleges: getLocalColleges(), schoolLinks: getLocalLinks(), source: "local" });
          return;
        }
        resolve({ colleges: res.data, schoolLinks: getLocalLinks(), source: "cloud" });
      },
      fail() {
        resolve({ colleges: getLocalColleges(), schoolLinks: getLocalLinks(), source: "local" });
      },
    });
  });
}

function saveRecommendRecord(record, user) {
  const records = wx.getStorageSync(RECORDS_KEY) || [];
  const normalized = {
    id: `record-${Date.now()}`,
    userOpenid: user && user.openid ? user.openid : "local",
    options: sanitizeRecommendOptions(record.options),
    rows: record.rows,
    createdAt: new Date().toISOString(),
  };
  records.unshift(normalized);
  wx.setStorageSync(RECORDS_KEY, records.slice(0, 30));

  if (wx.cloud && wx.cloud.database) {
    wx.cloud.database().collection("recommend_records").add({ data: normalized });
  }

  return normalized;
}

function sanitizeRecommendOptions(options = {}) {
  return {
    subject: options.subject,
    score: options.score,
    rank: options.rank,
    recommendMode: options.recommendMode,
    includeUnverified: options.includeUnverified,
    includePrivate: options.includePrivate,
    includeCoop: options.includeCoop,
    preferFujian: options.preferFujian,
    onlyPublic: options.onlyPublic,
    onlyHigh: options.onlyHigh,
    keyword: options.keyword,
    rankTableSummary: options.rankTableSummary || {
      table2025Rows: Array.isArray(options.rankData2025) ? options.rankData2025.length : "embedded",
      table2026Rows: Array.isArray(options.rankData2026) ? options.rankData2026.length : 0,
    },
  };
}

function getRecommendRecords() {
  return wx.getStorageSync(RECORDS_KEY) || [];
}

function upsertCollege(college, user) {
  const colleges = getLocalColleges();
  const key = college.id || [college.school, college.year, college.subject, college.info].join("|");
  const normalized = {
    ...college,
    id: key,
    year: Number(college.year),
    min: college.min === "" || college.min == null ? null : Number(college.min),
    max: college.max === "" || college.max == null ? undefined : Number(college.max),
    tags: Array.isArray(college.tags) ? college.tags : String(college.tags || "").split(/[,\s，、]+/).filter(Boolean),
  };
  const index = colleges.findIndex((item) => (item.id || [item.school, item.year, item.subject, item.info].join("|")) === key);
  if (index >= 0) colleges.splice(index, 1, normalized);
  else colleges.unshift(normalized);
  saveLocalColleges(colleges);
  syncCollegeToCloud(normalized);
  addAuditLog(index >= 0 ? "update_college" : "create_college", normalized.school, user);
  return normalized;
}

function deleteCollege(id, user) {
  const colleges = getLocalColleges();
  const next = colleges.filter((item) => (item.id || [item.school, item.year, item.subject, item.info].join("|")) !== id);
  saveLocalColleges(next);
  deleteCollegeFromCloud(id);
  addAuditLog("delete_college", id, user);
  return next;
}

function resetLocalData(user) {
  wx.removeStorageSync(COLLEGES_KEY);
  wx.removeStorageSync(LINKS_KEY);
  addAuditLog("reset_local_data", "恢复到内置 H5 同步数据", user);
}

module.exports = {
  loadColleges,
  getLocalColleges,
  getLocalLinks,
  saveLocalColleges,
  saveLocalLinks,
  importColleges,
  exportCollegesText,
  upsertCollege,
  deleteCollege,
  resetLocalData,
  getAuditLogs,
  saveRecommendRecord,
  getRecommendRecords,
};
