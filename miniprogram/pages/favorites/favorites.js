const { getPool, fmt, schoolLinks } = require("../../shared/fujian-art-recommend");
const { loadColleges } = require("../../shared/data-store");

Page({
  data: {
    rows: [],
  },

  onShow() {
    this.load();
  },

  itemKey(item) {
    return [item.school, item.year, item.subject, item.info, fmt(item.min)].join("|");
  },

  load() {
    const favoriteKeys = wx.getStorageSync("fujian_art_favorites") || [];
    loadColleges().then(({ colleges, schoolLinks: managedLinks }) => {
      const links = managedLinks || schoolLinks;
      const all = getPool({ subject: "history", includeUnverified: true, includePrivate: true, includeCoop: true, colleges })
        .concat(getPool({ subject: "physics", includeUnverified: true, includePrivate: true, includeCoop: true, colleges }));
      const seen = new Set();
      const rows = [];
      all.forEach((item) => {
        const key = this.itemKey(item);
        if (seen.has(key) || !favoriteKeys.includes(key)) return;
        seen.add(key);
        rows.push({
          key,
          item,
          scoreText: `${fmt(item.min)}${item.max ? `-${fmt(item.max)}` : ""}`,
          subjectText: item.subject === "both" ? "不限/待分" : item.subject === "history" ? "历史" : "物理",
          link: links[item.school] || "",
        });
      });
      this.setData({ rows });
    });
  },

  openSchool(event) {
    const key = event.currentTarget.dataset.key;
    const row = this.data.rows.find((entry) => entry.key === key);
    if (!row) return;
    wx.setStorageSync("currentSchool", { ...row, band: "info", bandLabel: "收藏", risk: "收藏院校，请结合最新招生章程和考试院数据复核。" });
    wx.navigateTo({ url: "/pages/school/school" });
  },

  remove(event) {
    const key = event.currentTarget.dataset.key;
    const favorites = (wx.getStorageSync("fujian_art_favorites") || []).filter((item) => item !== key);
    wx.setStorageSync("fujian_art_favorites", favorites);
    this.load();
  },
});
