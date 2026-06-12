const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database();
  const now = new Date().toISOString();
  const userQuery = await db.collection("users").where({ openid: wxContext.OPENID }).limit(1).get();
  const user = userQuery.data && userQuery.data[0] ? userQuery.data[0] : null;

  if (!user) {
    await db.collection("users").add({
      data: {
        openid: wxContext.OPENID,
        role: "user",
        enabled: true,
        nickname: "",
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    role: user && user.role ? user.role : "user",
    nickname: user && user.nickname ? user.nickname : "",
    enabled: user ? user.enabled !== false : true,
  };
};
