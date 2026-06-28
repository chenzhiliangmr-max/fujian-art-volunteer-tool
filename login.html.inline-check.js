
    const form = document.getElementById("loginForm");
    const status = document.getElementById("status");
    const submitBtn = document.getElementById("submitBtn");
    const toggleRegisterBtn = document.getElementById("toggleRegisterBtn");
    const registerNameWrap = document.getElementById("registerNameWrap");
    const setupNotice = document.getElementById("setupNotice");
    let registerMode = false;

    function safeNextUrl() {
      const requested = new URLSearchParams(location.search).get("next");
      if (!requested) return "./index.html";
      try {
        const target = new URL(requested, location.href);
        if (location.protocol === "file:" || target.origin === location.origin) return target.href;
      } catch (error) {
        return "./index.html";
      }
      return "./index.html";
    }

    function setMode(mode) {
      registerMode = mode === "register";
      registerNameWrap.hidden = !registerMode;
      submitBtn.textContent = registerMode ? "注册并登录" : "登录";
      toggleRegisterBtn.textContent = registerMode ? "已有账号？返回登录" : "没有账号？立即注册";
      status.textContent = "";
      status.className = "";
    }

    async function initialize() {
      const ready = FujianArtAuth.isEnabled() && FujianArtAuth.isConfigured();
      setupNotice.hidden = ready;
      form.hidden = !ready;
      if (!ready) return;
      try {
        const authorization = await FujianArtAuth.getAuthorization();
        if (authorization.ok && !authorization.bypass) location.replace(safeNextUrl());
      } catch (error) {
        status.textContent = "暂时无法连接授权服务，请稍后重试。";
        status.className = "error";
      }
    }

    form.addEventListener("submit", async event => {
      event.preventDefault();
      submitBtn.disabled = true;
      status.className = "";
      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = document.getElementById("password").value;
      const displayName = document.getElementById("displayName").value.trim();
      try {
        if (registerMode) {
          status.textContent = "正在创建账号...";
          await FujianArtAuth.signUp(email, password, displayName);
          status.textContent = "注册成功，正在登录...";
        } else {
          status.textContent = "正在验证账号...";
        }
        await FujianArtAuth.signIn(email, password);
        const authorization = await FujianArtAuth.getAuthorization();
        if (!authorization.ok) throw new Error(authorization.reason === "expired" ? "账号授权已到期" : "账号尚未获得使用授权");
        location.replace(safeNextUrl());
      } catch (error) {
        status.textContent = registerMode
          ? (error.message || "注册或登录失败，请检查邮箱和密码。")
          : (error.message || "账号或密码不正确");
        status.className = "error";
        submitBtn.disabled = false;
      }
    });

    toggleRegisterBtn.addEventListener("click", () => setMode(registerMode ? "login" : "register"));
    setMode("login");
    initialize();
  