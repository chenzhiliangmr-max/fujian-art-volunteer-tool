const { makeRecommendations, fmt, parseRankData } = require("../../shared/fujian-art-recommend");
const { loadColleges, saveRecommendRecord } = require("../../shared/data-store");
const { getCurrentUser } = require("../../shared/auth");

const RANK_TABLE_CACHE_KEY = "fujian_art_rank_tables";

Page({
  data: {
    options: {},
    rows: [],
    poolCount: 0,
    modeText: "分数",
    modeHint: "当前按综合分差值",
    rankText: "暂无",
    notice: "",
    favorites: [],
  },

  onShow() {
    this.load();
  },

  load() {
    const options = wx.getStorageSync("lastRecommendOptions") || { subject: "history", score: 535, includeUnverified: true, preferFujian: true };
    const cachedRankTables = wx.getStorageSync(RANK_TABLE_CACHE_KEY) || {};
    const hydratedOptions = {
      ...options,
      rankData2026: parseRankData(cachedRankTables.rankText2026 || ""),
    };
    loadColleges().then(({ colleges }) => {
      const result = makeRecommendations({ ...hydratedOptions, colleges });
      const favorites = wx.getStorageSync("fujian_art_favorites") || [];
      const rows = result.rows.map((row) => ({
        ...row,
        key: this.itemKey(row.item),
        subjectText: row.item.subject === "both" ? "不限/待分" : row.item.subject === "history" ? "历史" : "物理",
        isFavorite: favorites.includes(this.itemKey(row.item)),
      }));

      this.setData({
        options,
        rows,
        poolCount: result.poolCount,
        modeText: result.mode === "rank" ? "位次" : "分数",
        modeHint: result.modeHint || (result.mode === "rank" ? "2025位次映射2026等位分" : "当前按综合分差值"),
        rankText: result.userRank || "暂无",
        notice: result.notice || "",
        favorites,
      });
    });
  },

  itemKey(item) {
    return [item.school, item.year, item.subject, item.info, fmt(item.min)].join("|");
  },

  openSchool(event) {
    const key = event.currentTarget.dataset.key;
    const row = this.data.rows.find((entry) => entry.key === key);
    if (!row) return;
    wx.setStorageSync("currentSchool", row);
    wx.navigateTo({ url: "/pages/school/school" });
  },

  toggleFavorite(event) {
    const key = event.currentTarget.dataset.key;
    const exists = this.data.favorites.includes(key);
    const favorites = exists ? this.data.favorites.filter((item) => item !== key) : [...this.data.favorites, key];
    wx.setStorageSync("fujian_art_favorites", favorites);
    this.setData({
      favorites,
      rows: this.data.rows.map((row) => ({ ...row, isFavorite: favorites.includes(row.key) })),
    });
  },

  copyList() {
    const text = this.data.rows
      .map((row) => `${row.index}. ${row.bandLabel} ${row.item.school} ${row.item.info} ${row.scoreText}`)
      .join("\n");
    wx.setClipboardData({ data: text });
  },

  saveRecord() {
    const record = saveRecommendRecord({
      options: this.data.options,
      rows: this.data.rows.map((row) => ({
        index: row.index,
        band: row.bandLabel,
        school: row.item.school,
        province: row.item.province,
        level: row.item.level,
        info: row.item.info,
        year: row.item.year,
        min: row.scoreText,
        equivalentScore: row.equivalentScore || "",
        status: row.item.status,
      })),
    }, getCurrentUser());
    wx.showToast({ title: "已保存草表" });
    wx.setStorageSync("currentRecommendRecord", record);
  },

  openFilter() {
    wx.navigateBack({
      fail: () => wx.switchTab({ url: "/pages/index/index" }),
    });
  },
});
