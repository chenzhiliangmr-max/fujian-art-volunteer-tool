const USER_KEY = "fujian_art_user";

function getCurrentUser() {
  return wx.getStorageSync(USER_KEY) || null;
}

function saveUser(user) {
  wx.setStorageSync(USER_KEY, user);
  return user;
}

function isAdmin(user = getCurrentUser()) {
  return !!user && (user.role === "admin" || user.role === "super_admin");
}

function login() {
  return new Promise((resolve) => {
    wx.login({
      success(result) {
        const fallbackUser = {
          openid: `local-${Date.now()}`,
          role: "user",
          loginCode: result.code || "",
          source: "local",
        };

        if (!wx.cloud || !wx.cloud.callFunction) {
          resolve(saveUser(fallbackUser));
          return;
        }

        wx.cloud.callFunction({
          name: "login",
          success(res) {
            const profile = res.result || {};
            resolve(saveUser({
              openid: profile.openid || fallbackUser.openid,
              role: profile.role || "user",
              nickname: profile.nickname || "",
              enabled: profile.enabled !== false,
              source: profile.openid ? "cloud" : "local",
            }));
          },
          fail() {
            resolve(saveUser(fallbackUser));
          },
        });
      },
      fail() {
        resolve(saveUser({
          openid: `local-${Date.now()}`,
          role: "user",
          source: "local",
        }));
      },
    });
  });
}

function logout() {
  wx.removeStorageSync(USER_KEY);
}

function setLocalAdmin(enabled) {
  const user = getCurrentUser() || {
    openid: `local-${Date.now()}`,
    source: "local",
  };
  user.role = enabled ? "admin" : "user";
  return saveUser(user);
}

module.exports = {
  login,
  logout,
  getCurrentUser,
  isAdmin,
  setLocalAdmin,
};
