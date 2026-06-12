const { login, logout, getCurrentUser, isAdmin, setLocalAdmin } = require("../../shared/auth");
const { getAuditLogs, getRecommendRecords } = require("../../shared/data-store");

Page({
  data: {
    user: null,
    admin: false,
    favoriteCount: 0,
    auditLogs: [],
    records: [],
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const user = getCurrentUser();
    this.setData({
      user,
      admin: isAdmin(user),
      favoriteCount: (wx.getStorageSync("fujian_art_favorites") || []).length,
      auditLogs: getAuditLogs().slice(0, 5),
      records: getRecommendRecords().slice(0, 5),
    });
  },

  login() {
    login().then(() => this.refresh());
  },

  logout() {
    logout();
    this.refresh();
  },

  toggleLocalAdmin(event) {
    setLocalAdmin(event.detail.value);
    this.refresh();
  },

  openAdmin() {
    if (!this.data.admin) {
      wx.showToast({ title: "当前账号不是管理员", icon: "none" });
      return;
    }
    wx.navigateTo({ url: "/pages/admin/admin" });
  },

  copyRecord(event) {
    const id = event.currentTarget.dataset.id;
    const record = this.data.records.find((item) => item.id === id);
    if (!record) return;
    const text = record.rows.map((row) => {
      const equivalent = row.equivalentScore ? ` 等位分${row.equivalentScore}` : "";
      return `${row.index}. ${row.band} ${row.school} ${row.info} ${row.min}${equivalent}`;
    }).join("\n");
    wx.setClipboardData({ data: text });
  },
});
