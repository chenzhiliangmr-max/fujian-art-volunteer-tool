const { calculateCompositeScore, makeRecommendations, parseRankData } = require("../../shared/fujian-art-recommend");
const { dataVersion } = require("../../shared/fujian-art-data");
const { loadColleges } = require("../../shared/data-store");

const RANK_TABLE_CACHE_KEY = "fujian_art_rank_tables";

Page({
  data: {
    dataVersion,
    subject: "history",
    culture: "",
    major: "",
    score: "535",
    rank: "",
    recommendMode: "score",
    rankText2026: "",
    includeUnverified: true,
    includePrivate: false,
    includeCoop: false,
    preferFujian: true,
    onlyPublic: false,
    onlyHigh: false,
    keyword: "",
    colleges: [],
    preview: { poolCount: 0, count: 0, mode: "score" },
  },

  onLoad() {
    const cachedRankTables = wx.getStorageSync(RANK_TABLE_CACHE_KEY) || {};
    this.setData({
      rankText2026: cachedRankTables.rankText2026 || "",
    });
    loadColleges().then(({ colleges }) => {
      this.setData({ colleges }, () => this.refreshPreview());
    });
  },

  setSubject(event) {
    this.setData({ subject: event.currentTarget.dataset.subject }, () => this.refreshPreview());
  },

  setRecommendMode(event) {
    this.setData({ recommendMode: event.currentTarget.dataset.mode }, () => this.refreshPreview());
  },

  onInput(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({ [field]: event.detail.value }, () => {
      if (field === "culture" || field === "major") this.updateComposite();
      if (field === "rankText2026") this.saveRankTables();
      this.refreshPreview();
    });
  },

  saveRankTables() {
    wx.setStorageSync(RANK_TABLE_CACHE_KEY, {
      rankText2026: this.data.rankText2026,
    });
  },

  clearRankTables() {
    wx.removeStorageSync(RANK_TABLE_CACHE_KEY);
    this.setData({ rankText2026: "" }, () => this.refreshPreview());
  },

  onSwitch(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({ [field]: event.detail.value }, () => this.refreshPreview());
  },

  updateComposite() {
    const score = calculateCompositeScore(this.data.culture, this.data.major);
    if (score == null) return;
    this.setData({ score: score.toFixed(2).replace(/\.00$/, "") });
  },

  buildOptions() {
    return {
      subject: this.data.subject,
      score: Number(this.data.score),
      rank: Number(this.data.rank),
      recommendMode: this.data.recommendMode,
      rankData2026: parseRankData(this.data.rankText2026),
      includeUnverified: this.data.includeUnverified,
      includePrivate: this.data.includePrivate,
      includeCoop: this.data.includeCoop,
      preferFujian: this.data.preferFujian,
      onlyPublic: this.data.onlyPublic,
      onlyHigh: this.data.onlyHigh,
      keyword: this.data.keyword,
      colleges: this.data.colleges,
    };
  },

  buildStoredOptions() {
    const options = this.buildOptions();
    delete options.colleges;
    delete options.rankData2026;
    return {
      ...options,
      rankTableSummary: {
        table2025Rows: "embedded",
        table2026Rows: options.rankData2026.length,
      },
    };
  },

  refreshPreview() {
    const result = makeRecommendations(this.buildOptions());
    this.setData({
      preview: {
        poolCount: result.poolCount,
        count: result.rows.length,
        mode: result.mode === "rank" ? "位次" : "分数",
        notice: result.notice || "",
      },
    });
  },

  generate() {
    wx.setStorageSync("lastRecommendOptions", this.buildStoredOptions());
    wx.navigateTo({ url: "/pages/results/results" });
  },
});
