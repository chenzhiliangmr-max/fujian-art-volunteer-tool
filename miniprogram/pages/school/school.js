Page({
  data: {
    row: null,
    isFavorite: false,
  },

  onShow() {
    const row = wx.getStorageSync("currentSchool");
    if (!row) return;
    const favorites = wx.getStorageSync("fujian_art_favorites") || [];
    this.setData({
      row: {
        ...row,
        tagsText: row.item.tags.join("、"),
      },
      isFavorite: favorites.includes(row.key),
    });
  },

  toggleFavorite() {
    if (!this.data.row) return;
    const favorites = wx.getStorageSync("fujian_art_favorites") || [];
    const key = this.data.row.key;
    const next = favorites.includes(key) ? favorites.filter((item) => item !== key) : [...favorites, key];
    wx.setStorageSync("fujian_art_favorites", next);
    this.setData({ isFavorite: next.includes(key) });
  },

  copyLink() {
    if (!this.data.row || !this.data.row.link) {
      wx.showToast({ title: "暂无链接", icon: "none" });
      return;
    }
    wx.setClipboardData({ data: this.data.row.link });
  },
});
