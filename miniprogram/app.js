App({
  onLaunch() {
    if (wx.cloud) {
      const cloudEnvId = "";
      wx.cloud.init({
        env: cloudEnvId || undefined,
        traceUser: true,
      });
    }
  },

  globalData: {
    favoritesKey: "fujian_art_favorites",
  },
});
