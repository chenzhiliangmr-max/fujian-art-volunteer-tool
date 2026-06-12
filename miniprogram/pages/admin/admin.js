const { isAdmin, getCurrentUser } = require("../../shared/auth");
const { loadColleges, deleteCollege, resetLocalData, importColleges, exportCollegesText } = require("../../shared/data-store");
const { fmt } = require("../../shared/fujian-art-recommend");

Page({
  data: {
    keyword: "",
    rows: [],
    allRows: [],
    source: "local",
    importText: "",
    showImport: false,
  },

  onShow() {
    if (!isAdmin()) {
      wx.showToast({ title: "无管理员权限", icon: "none" });
      wx.navigateBack();
      return;
    }
    this.load();
  },

  itemKey(item) {
    return item.id || [item.school, item.year, item.subject, item.info].join("|");
  },

  load() {
    loadColleges().then(({ colleges, source }) => {
      const rows = colleges.map((item) => ({
        ...item,
        key: this.itemKey(item),
        minText: `${fmt(item.min)}${item.max ? `-${fmt(item.max)}` : ""}`,
        tagsText: item.tags.join("、"),
        subjectText: item.subject === "both" ? "不限/待分" : item.subject === "history" ? "历史" : "物理",
      }));
      this.setData({ allRows: rows, source }, () => this.filter());
    });
  },

  onKeyword(event) {
    this.setData({ keyword: event.detail.value }, () => this.filter());
  },

  filter() {
    const keyword = this.data.keyword.trim().toLowerCase();
    const rows = keyword
      ? this.data.allRows.filter((item) => [item.school, item.province, item.level, item.info, item.status].join(" ").toLowerCase().includes(keyword))
      : this.data.allRows;
    this.setData({ rows });
  },

  add() {
    wx.removeStorageSync("editingCollege");
    wx.navigateTo({ url: "/pages/admin-edit/admin-edit" });
  },

  edit(event) {
    const key = event.currentTarget.dataset.key;
    const item = this.data.allRows.find((row) => row.key === key);
    wx.setStorageSync("editingCollege", item);
    wx.navigateTo({ url: "/pages/admin-edit/admin-edit" });
  },

  remove(event) {
    const key = event.currentTarget.dataset.key;
    wx.showModal({
      title: "删除记录",
      content: "确认删除这条院校/专业记录？",
      success: (res) => {
        if (!res.confirm) return;
        deleteCollege(key, getCurrentUser());
        this.load();
      },
    });
  },

  reset() {
    wx.showModal({
      title: "恢复内置数据",
      content: "会清空本机后台改动，恢复到 H5 同步数据。",
      success: (res) => {
        if (!res.confirm) return;
        resetLocalData(getCurrentUser());
        this.load();
      },
    });
  },

  exportData() {
    wx.setClipboardData({
      data: exportCollegesText(),
      success: () => wx.showToast({ title: "已复制 JSON" }),
    });
  },

  toggleImport() {
    this.setData({ showImport: !this.data.showImport });
  },

  onImportText(event) {
    this.setData({ importText: event.detail.value });
  },

  importData() {
    try {
      const data = JSON.parse(this.data.importText);
      importColleges(data, getCurrentUser());
      wx.showToast({ title: "导入成功" });
      this.setData({ showImport: false, importText: "" });
      this.load();
    } catch (error) {
      wx.showToast({ title: "JSON 格式不正确", icon: "none" });
    }
  },
});
