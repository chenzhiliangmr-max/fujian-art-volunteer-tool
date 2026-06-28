
    (async function initializeAuthorization() {
      const result = await FujianArtAuth.guard();
      const body = document.body;
      const title = document.getElementById("authGateTitle");
      const message = document.getElementById("authGateMessage");
      if (!result.ok) {
        body.classList.remove("auth-pending");
        body.classList.add("auth-denied");
        title.textContent = "暂时无法使用";
        const messages = {
          config: "授权已启用，但 Supabase 配置不完整。",
          profile: "账号资料尚未初始化，请联系管理员。",
          inactive: "该账号已停用，请联系管理员。",
          expired: "该账号授权已到期，请联系管理员续期。",
          network: "无法连接授权服务，请检查网络后刷新页面。"
        };
        message.textContent = messages[result.reason] || "授权验证失败。";
        return;
      }
      body.classList.remove("auth-pending");
      document.getElementById("adminLink").hidden = !result.isAdmin;
      if (result.bypass) {
        document.getElementById("authUserLabel").textContent = "授权准备模式";
        return;
      }
      const label = result.profile.display_name || result.profile.email || result.session.user.email;
      document.getElementById("authUserLabel").textContent = label;
      const changePasswordButton = document.getElementById("changePasswordBtn");
      const signOutButton = document.getElementById("signOutBtn");
      if (changePasswordButton) changePasswordButton.hidden = false;
      if (signOutButton) {
        signOutButton.hidden = false;
        signOutButton.addEventListener("click", FujianArtAuth.signOut);
      }
      const riskVersion = "2026-06-22-v1";
      const riskStorageKey = `fujian-art-risk-ack:${riskVersion}:${result.session.user.id}`;
      let riskAcknowledged = false;
      try { riskAcknowledged = Boolean(localStorage.getItem(riskStorageKey)); } catch (error) {}
      if (!riskAcknowledged) {
        const modal = document.getElementById("riskConfirmModal");
        const checkbox = document.getElementById("riskAgreeCheckbox");
        const acceptButton = document.getElementById("riskAcceptBtn");
        modal.hidden = false;
        checkbox.addEventListener("change", () => { acceptButton.disabled = !checkbox.checked; });
        document.getElementById("riskExitBtn").addEventListener("click", FujianArtAuth.signOut);
        acceptButton.addEventListener("click", () => {
          if (!checkbox.checked) return;
          try { localStorage.setItem(riskStorageKey, JSON.stringify({ version: riskVersion, acknowledgedAt: new Date().toISOString() })); } catch (error) {}
          modal.hidden = true;
        });
      }
    })();
  
;

    const colleges = [
      {school:"福建技术师范学院", province:"福建", level:"公办", year:2025, info:"工艺美术，录取15，平均501", subject:"history", min:498.75, max:507, avg:501, status:"省教委官方数据（人工已核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建技术师范学院", province:"福建", level:"公办", year:2024, info:"工艺美术，录取20，平均498", subject:"history", min:496.5, max:502.25, avg:498, status:"省教委官方数据（人工已核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建技术师范学院", province:"福建", level:"公办", year:2023, info:"工艺美术，录取20，平均513", subject:"history", min:511.8, max:517.2, avg:513, status:"省教委官方数据（人工已核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建江夏学院", province:"福建", level:"公办", year:2025, info:"动画，录取41，平均515", subject:"history", min:512.5, max:522.25, avg:515, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建江夏学院", province:"福建", level:"公办", year:2024, info:"动画，录取35，平均511", subject:"history", min:509.5, max:519.5, avg:511, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建江夏学院", province:"福建", level:"公办", year:2023, info:"动画，录取10，平均527", subject:"history", min:525.2, max:533.4, avg:527, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建江夏学院", province:"福建", level:"公办", year:2024, info:"动画(中外合作办学)，录取78，平均488", subject:"history", min:482, max:503.25, avg:488, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"福建江夏学院", province:"福建", level:"公办", year:2025, info:"艺术设计学，录取41，平均513", subject:"history", min:511, max:521.75, avg:513, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建江夏学院", province:"福建", level:"公办", year:2024, info:"艺术设计学，录取37，平均511", subject:"history", min:508.25, max:515.75, avg:511, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建江夏学院", province:"福建", level:"公办", year:2023, info:"艺术设计学，录取39，平均526", subject:"history", min:523.6, max:530.3, avg:526, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建江夏学院(中外合作)", province:"福建", level:"公办", year:2025, info:"动画，录取73，平均491", subject:"history", min:484, max:511.5, avg:491, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"福建江夏学院(中外合作)", province:"福建", level:"公办", year:2023, info:"动画，录取78，平均501", subject:"history", min:496.6, max:519.1, avg:501, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"福建江夏学院〔闽台合作)", province:"福建", level:"公办", year:2023, info:"艺术设计学，录取25，平均516", subject:"history", min:514.6, max:521, avg:516, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2025, info:"产品设计，录取35，平均523", subject:"history", min:521.75, max:525.75, avg:523, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2024, info:"产品设计，录取35，平均518", subject:"history", min:517, max:521.75, avg:518, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2023, info:"产品设计，录取28，平均532", subject:"history", min:530.6, max:536.4, avg:532, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2025, info:"环境设计，录取35，平均520", subject:"history", min:518.5, max:522, avg:520, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2024, info:"环境设计，录取35，平均516", subject:"history", min:513.75, max:518.75, avg:516, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2023, info:"环境设计，录取29，平均531", subject:"history", min:529.2, max:534.5, avg:531, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2025, info:"视觉传达设计，录取35，平均528", subject:"history", min:525.5, max:531.25, avg:528, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2024, info:"视觉传达设计，录取35，平均522", subject:"history", min:519.75, max:530.25, avg:522, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2023, info:"视觉传达设计，录取27，平均536", subject:"history", min:533.7, max:541.4, avg:536, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2024, info:"数字媒体艺术，录取35，平均523", subject:"history", min:520, max:535.25, avg:523, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2023, info:"数字媒体艺术，录取28，平均537", subject:"history", min:533.7, max:542.2, avg:537, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学(闽台合作)", province:"福建", level:"公办", year:2025, info:"环境设计，录取60，平均510", subject:"history", min:506, max:520.75, avg:510, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学(闽台合作)", province:"福建", level:"公办", year:2024, info:"环境设计，录取60，平均508", subject:"history", min:504.5, max:514.25, avg:508, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学(闽台合作)", province:"福建", level:"公办", year:2023, info:"环境设计，录取60，平均524", subject:"history", min:520.2, max:532.3, avg:524, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学(中外合作)", province:"福建", level:"公办", year:2025, info:"数字媒体艺术，录取37，平均495", subject:"history", min:440.75, max:519, avg:495, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2025, info:"产品设计，录取62，平均533", subject:"history", min:530.5, max:540.5, avg:533, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2024, info:"产品设计，录取50，平均528", subject:"history", min:525.75, max:532.5, avg:528, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2023, info:"产品设计，录取46，平均541", subject:"history", min:538.2, max:543.3, avg:541, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2025, info:"动画，录取40，平均536", subject:"history", min:533.75, max:541.75, avg:536, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2024, info:"动画，录取25，平均531", subject:"history", min:529.25, max:537.75, avg:531, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2023, info:"动画，录取20，平均544", subject:"history", min:542.1, max:549.5, avg:544, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2025, info:"环境设计，录取40，平均529", subject:"history", min:526.25, max:542, avg:529, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2024, info:"环境设计，录取55，平均524", subject:"history", min:521.75, max:531, avg:524, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2023, info:"环境设计，录取48，平均540", subject:"history", min:537.9, max:548.2, avg:540, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2024, info:"视觉传达设计，录取25，平均533", subject:"history", min:531, max:537.5, avg:533, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2023, info:"视觉传达设计，录取23，平均545", subject:"history", min:543.5, max:550.8, avg:545, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学金山学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取40，平均486", subject:"history", min:485, max:497, avg:486, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建农林大学金山学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取40，平均486", subject:"history", min:483.75, max:514.75, avg:486, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建农林大学金山学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取40，平均502", subject:"history", min:501.1, max:503.9, avg:502, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建农林大学金山学院", province:"福建", level:"官方数据", year:2025, info:"动画，录取40，平均486", subject:"history", min:485, max:489, avg:486, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建农林大学金山学院", province:"福建", level:"官方数据", year:2024, info:"动画，录取40，平均485", subject:"history", min:483.75, max:487.25, avg:485, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建农林大学金山学院", province:"福建", level:"官方数据", year:2023, info:"动画，录取40，平均504", subject:"history", min:502.3, max:511.7, avg:504, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建农林大学金山学院", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取80，平均484", subject:"history", min:481.75, max:492.75, avg:484, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建农林大学金山学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取80，平均483", subject:"history", min:482, max:487, avg:483, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建农林大学金山学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取80，平均501", subject:"history", min:500.2, max:504.3, avg:501, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建农林大学金山学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取40，平均489", subject:"history", min:487.5, max:503.25, avg:489, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建农林大学金山学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取40，平均489", subject:"history", min:487, max:493.25, avg:489, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建农林大学金山学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取40，平均507", subject:"history", min:504.1, max:517.8, avg:507, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建师范大学协和学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取50，平均493", subject:"history", min:489.25, max:508.5, avg:493, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建师范大学协和学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取45，平均492", subject:"history", min:488, max:498.5, avg:492, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建师范大学协和学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取50，平均507", subject:"history", min:503.9, max:523, avg:507, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建师范大学协和学院", province:"福建", level:"官方数据", year:2025, info:"动画，录取49，平均493", subject:"history", min:490.25, max:501.25, avg:493, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建师范大学协和学院", province:"福建", level:"官方数据", year:2024, info:"动画，录取52，平均491", subject:"history", min:488, max:500.5, avg:491, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建师范大学", province:"福建", level:"公办师范", year:2023, info:"动画，录取18，平均553", subject:"history", min:550.8, max:557.1, avg:553, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建师范大学协和学院", province:"福建", level:"官方数据", year:2023, info:"动画，录取47，平均509", subject:"history", min:505.8, max:518.5, avg:509, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建商学院", province:"福建", level:"公办", year:2025, info:"工艺美术，录取70，平均494", subject:"history", min:492, max:498.5, avg:494, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建商学院", province:"福建", level:"公办", year:2024, info:"工艺美术，录取70，平均493", subject:"history", min:490.75, max:496.75, avg:493, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建商学院", province:"福建", level:"公办", year:2023, info:"工艺美术，录取52，平均510", subject:"history", min:508.2, max:514.4, avg:510, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建商学院", province:"福建", level:"公办", year:2025, info:"环境设计，录取50，平均494", subject:"history", min:492.25, max:497.5, avg:494, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建师范大学协和学院", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取42，平均488", subject:"history", min:486, max:494.75, avg:488, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建商学院", province:"福建", level:"公办", year:2024, info:"环境设计，录取47，平均494", subject:"history", min:491.75, max:506.25, avg:494, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建师范大学协和学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取35，平均488", subject:"history", min:485.5, max:492.25, avg:488, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建商学院", province:"福建", level:"公办", year:2023, info:"环境设计，录取55，平均511", subject:"history", min:509.4, max:522.5, avg:511, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建师范大学协和学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取43，平均506", subject:"history", min:503.3, max:513.5, avg:506, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建师范大学", province:"福建", level:"公办师范", year:2025, info:"美术学，录取77，平均552", subject:"history", min:544.5, max:590.5, avg:552, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建师范大学", province:"福建", level:"公办师范", year:2024, info:"美术学，录取77，平均549", subject:"history", min:541, max:578.25, avg:549, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建师范大学", province:"福建", level:"公办师范", year:2023, info:"美术学，录取74，平均562", subject:"history", min:555.1, max:582.8, avg:562, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建师范大学", province:"福建", level:"公办师范", year:2025, info:"设计学类(包含视觉传达设计，录取69，平均546", subject:"history", min:542.75, max:553, avg:546, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建师范大学", province:"福建", level:"公办师范", year:2024, info:"设计学类(含视觉传达设计、环，录取69，平均540", subject:"history", min:538, max:547, avg:540, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建师范大学", province:"福建", level:"公办师范", year:2023, info:"设计学类(含视觉传达设计、环，录取50，平均554", subject:"history", min:551.6, max:566.2, avg:554, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建商学院", province:"福建", level:"公办", year:2025, info:"视觉传达设计，录取70，平均503", subject:"history", min:498.75, max:514.75, avg:503, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建商学院", province:"福建", level:"公办", year:2024, info:"视觉传达设计，录取70，平均500", subject:"history", min:497, max:510.5, avg:500, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建商学院", province:"福建", level:"公办", year:2023, info:"视觉传达设计，录取46，平均517", subject:"history", min:514.5, max:523.6, avg:517, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"福州大学", province:"福建", level:"211", year:2025, info:"境设计产品设计工艺美术、数，录取182，平均562", subject:"history", min:552.75, max:583, avg:562, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"福州大学", province:"福建", level:"211", year:2024, info:"境设计产品设计工艺美术、数，录取153，平均555", subject:"history", min:547, max:572.75, avg:555, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"福州大学", province:"福建", level:"211", year:2025, info:"美术学类(含绘画、雕塑专业)，录取27，平均554", subject:"history", min:550, max:569.75, avg:554, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"福州大学", province:"福建", level:"211", year:2024, info:"美术学类(含绘画、雕塑专业)，录取26，平均553", subject:"history", min:546.25, max:568.5, avg:553, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"福州大学", province:"福建", level:"211", year:2023, info:"美术学类(含绘画、雕塑专业)，录取26，平均560", subject:"history", min:556.5, max:569.9, avg:560, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"福州大学", province:"福建", level:"211", year:2023, info:"设计工、艺美术数、字媒休艺术，录取103，平均565", subject:"history", min:558, max:580.8, avg:565, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"福州大学(面向厦门)", province:"福建", level:"211", year:2025, info:"美术学类(含绘画、雕塑专业)，录取4，平均553", subject:"history", min:551.25, max:555, avg:553, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"福州大学(面向厦门)", province:"福建", level:"211", year:2024, info:"美术学类(含绘画、雕塑专业)，录取4，平均546", subject:"history", min:544.75, max:546, avg:546, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"福州大学(面向厦门)", province:"福建", level:"211", year:2023, info:"美术学类(含绘画、雕塑专业)，录取4，平均565", subject:"history", min:557.3, max:574.2, avg:565, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"福州大学至诚学院", province:"福建", level:"独立学院/民办", year:2025, info:"产品设计，录取65，平均489", subject:"history", min:486.25, max:499, avg:489, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["private","official"]},
      {school:"福州大学至诚学院", province:"福建", level:"独立学院/民办", year:2024, info:"产品设计，录取65，平均488", subject:"history", min:485.25, max:497.75, avg:488, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["private","official"]},
      {school:"福州大学至诚学院", province:"福建", level:"独立学院/民办", year:2023, info:"产品设计，录取65，平均506", subject:"history", min:502.8, max:521.9, avg:506, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["private","official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取10，平均449", subject:"history", min:426.5, max:479, avg:449, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取85，平均437", subject:"history", min:427.5, max:472, avg:437, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取80，平均465", subject:"history", min:459.7, max:477.5, avg:465, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取18，平均437", subject:"history", min:413.5, max:454.75, avg:437, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取130，平均434", subject:"history", min:405.75, max:486.25, avg:434, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取125，平均463", subject:"history", min:455.8, max:497.4, avg:463, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取129，平均445", subject:"history", min:408.5, max:482, avg:445, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取130，平均453", subject:"history", min:444.5, max:487.75, avg:453, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取120，平均478", subject:"history", min:471.5, max:499, avg:478, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2025, info:"数字媒体艺术，录取138，平均446", subject:"history", min:417.75, max:493.75, avg:446, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2024, info:"数字媒体艺术，录取130，平均451", subject:"history", min:442.25, max:479, avg:451, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2023, info:"数字媒体艺术，录取125，平均478", subject:"history", min:469.5, max:505, avg:478, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州理工学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取40，平均447", subject:"history", min:405.5, max:497.25, avg:447, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州理工学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取100，平均450", subject:"history", min:437.75, max:488.25, avg:450, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州理工学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取115，平均476", subject:"history", min:467.3, max:513.7, avg:476, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取147，平均455", subject:"history", min:445.25, max:483.75, avg:455, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取114，平均467", subject:"history", min:462.75, max:481.5, avg:467, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取95，平均482", subject:"history", min:478, max:501.1, avg:482, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2025, info:"动画，录取77，平均466", subject:"history", min:459, max:485, avg:466, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2024, info:"动画，录取64，平均470", subject:"history", min:465.25, max:481.75, avg:470, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2023, info:"动画，录取75，平均488", subject:"history", min:483.4, max:498.6, avg:488, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2025, info:"服装与服饰设计，录取69，平均449", subject:"history", min:427.5, max:477.5, avg:449, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2024, info:"服装与服饰设计，录取56，平均459", subject:"history", min:455, max:476.75, avg:459, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2023, info:"服装与服饰设计，录取30，平均480", subject:"history", min:474.9, max:494.3, avg:480, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2023, info:"服装与服饰设计(中外合作)，录取8，平均472", subject:"history", min:470.2, max:473.7, avg:472, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2024, info:"服装与服饰设计〈中外合作办学)，录取8，平均454", subject:"history", min:449, max:469.25, avg:454, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取147，平均451", subject:"history", min:418.25, max:485, avg:451, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取114，平均463", subject:"history", min:457.25, max:481, avg:463, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取95，平均480", subject:"history", min:476.4, max:497.4, avg:480, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取147，平均472", subject:"history", min:466, max:486, avg:472, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取117，平均476", subject:"history", min:471.75, max:489.75, avg:476, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取115，平均492", subject:"history", min:487.9, max:511.8, avg:492, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2025, info:"数字媒体艺术，录取146，平均469", subject:"history", min:462.75, max:486.5, avg:469, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2024, info:"数字媒体艺术，录取114，平均474", subject:"history", min:469.25, max:486.5, avg:474, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2023, info:"数字媒体艺术，录取105，平均490", subject:"history", min:485.5, max:507.4, avg:490, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院(中外合作)", province:"福建", level:"官方数据", year:2025, info:"服装与服饰设计，录取2，平均434", subject:"history", min:413.75, max:454.75, avg:434, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"华侨大学", province:"福建", level:"公办/双一流培育", year:2025, info:"产品设计〈产品艺设、家具与室内)，录取8，平均539", subject:"history", min:538, max:539.75, avg:539, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"华侨大学", province:"福建", level:"公办/双一流培育", year:2024, info:"产品设计〈产品艺设、家具与室内)，录取8，平均535", subject:"history", min:533.25, max:536.75, avg:535, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"华侨大学", province:"福建", level:"公办/双一流培育", year:2023, info:"美术学(设油画、中国书画、绘本，录取10，平均547", subject:"history", min:546, max:549.4, avg:547, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"华侨大学", province:"福建", level:"公办/双一流培育", year:2025, info:"美术学(油画、中国书画、绘本)，录取10，平均539", subject:"history", min:537.25, max:544.5, avg:539, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"华侨大学", province:"福建", level:"公办/双一流培育", year:2024, info:"美术学(中国书画、油画、绘本)，录取10，平均536", subject:"history", min:532.5, max:545.25, avg:536, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"华侨大学", province:"福建", level:"公办/双一流培育", year:2023, info:"设计学类，录取16，平均548", subject:"history", min:546.5, max:549.9, avg:548, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"华侨大学", province:"福建", level:"公办/双一流培育", year:2025, info:"视觉传达设计〈视传数媒)，录取8，平均541", subject:"history", min:540.5, max:542.25, avg:541, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"华侨大学", province:"福建", level:"公办/双一流培育", year:2024, info:"视觉传达设计〈视传数媒)，录取8，平均536", subject:"history", min:535.5, max:537.25, avg:536, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"集美大学", province:"福建", level:"公办", year:2025, info:"动画，录取11，平均540", subject:"history", min:538.75, max:547.5, avg:540, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"集美大学", province:"福建", level:"公办", year:2024, info:"动画，录取11，平均537", subject:"history", min:534.25, max:540, avg:537, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"集美大学", province:"福建", level:"公办", year:2023, info:"动画，录取10，平均549", subject:"history", min:547.5, max:551.1, avg:549, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"集美大学", province:"福建", level:"公办", year:2025, info:"环境设计，录取20，平均533", subject:"history", min:531.5, max:534.75, avg:533, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"集美大学", province:"福建", level:"公办", year:2024, info:"环境设计，录取16，平均531", subject:"history", min:529.5, max:533.75, avg:531, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"集美大学", province:"福建", level:"公办", year:2023, info:"环境设计，录取15，平均545", subject:"history", min:543.7, max:546.1, avg:545, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"集美大学", province:"福建", level:"公办", year:2025, info:"美术学，录取50，平均537", subject:"history", min:534.75, max:542.75, avg:537, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"集美大学", province:"福建", level:"公办", year:2024, info:"美术学，录取40，平均534", subject:"history", min:531.25, max:539, avg:534, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"集美大学", province:"福建", level:"公办", year:2023, info:"美术学，录取35，平均548", subject:"history", min:545.8, max:552.5, avg:548, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"集美大学", province:"福建", level:"公办", year:2025, info:"视觉传达设计，录取13，平均542", subject:"history", min:541.25, max:543, avg:542, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"集美大学", province:"福建", level:"公办", year:2024, info:"视觉传达设计，录取10，平均537", subject:"history", min:536.5, max:537.75, avg:537, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"集美大学", province:"福建", level:"公办", year:2023, info:"视觉传达设计，录取10，平均550", subject:"history", min:549.2, max:551.6, avg:550, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"集美大学诚毅学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取14，平均496", subject:"history", min:495.5, max:500.5, avg:496, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"集美大学诚毅学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取11，平均513", subject:"history", min:511.8, max:516.8, avg:513, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"集美大学诚毅学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取16，平均502", subject:"history", min:499.5, max:507.75, avg:502, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"集美大学诚毅学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取25，平均500", subject:"history", min:497.25, max:511, avg:500, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"集美大学诚毅学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取25，平均516", subject:"history", min:513.4, max:525.9, avg:516, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取68，平均498", subject:"history", min:496, max:513.25, avg:498, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取58，平均497", subject:"history", min:494.75, max:516.25, avg:497, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取62，平均514", subject:"history", min:510.4, max:522.8, avg:514, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院", province:"福建", level:"官方数据", year:2025, info:"美术学，录取64，平均500", subject:"history", min:497.75, max:507, avg:500, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院", province:"福建", level:"官方数据", year:2024, info:"美术学，录取32，平均502", subject:"history", min:500.25, max:502.5, avg:502, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院", province:"福建", level:"官方数据", year:2023, info:"美术学，录取34，平均520", subject:"history", min:517, max:525, avg:520, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院(面向龙岩)", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取9，平均494", subject:"history", min:491.75, max:496, avg:494, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院(面向龙岩)", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取5，平均513", subject:"history", min:509.9, max:514.6, avg:513, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院(面向龙岩)", province:"福建", level:"官方数据", year:2024, info:"美术学，录取8，平均499", subject:"history", min:495.5, max:507.5, avg:499, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院(面向龙岩)", province:"福建", level:"官方数据", year:2023, info:"美术学，录取6，平均521", subject:"history", min:515.1, max:528.2, avg:521, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2023, info:"雕塑，录取10，平均528", subject:"history", min:525.6, max:539.7, avg:528, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2025, info:"服装与服饰设计，录取35，平均516", subject:"history", min:513.25, max:533.5, avg:516, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2024, info:"服装与服饰设计，录取35，平均511", subject:"history", min:508.25, max:515, avg:511, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2023, info:"服装与服饰设计，录取30，平均526", subject:"history", min:523.9, max:530.1, avg:526, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2025, info:"工艺美术，录取12，平均520", subject:"history", min:518.25, max:522, avg:520, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2024, info:"工艺美术，录取10，平均514", subject:"history", min:512.75, max:517, avg:514, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2025, info:"环境设计，录取14，平均518", subject:"history", min:516, max:521, avg:518, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2024, info:"环境设计，录取15，平均513", subject:"history", min:512.25, max:516.25, avg:513, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2023, info:"环境设计，录取30，平均528", subject:"history", min:526.9, max:530.3, avg:528, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2025, info:"绘画，录取15，平均521", subject:"history", min:518.5, max:531.5, avg:521, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2024, info:"绘画，录取10，平均514", subject:"history", min:513.75, max:516.25, avg:514, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2023, info:"绘画，录取20，平均529", subject:"history", min:528.1, max:532.4, avg:529, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2025, info:"视觉传达设计，录取14，平均525", subject:"history", min:522.75, max:530.25, avg:525, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2024, info:"视觉传达设计，录取14，平均519", subject:"history", min:517.5, max:527.25, avg:519, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2023, info:"视觉传达设计，录取15，平均533", subject:"history", min:532, max:535.9, avg:533, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2025, info:"数字媒体艺术，录取14，平均525", subject:"history", min:523, max:537.75, avg:525, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2024, info:"数字媒体艺术，录取15，平均518", subject:"history", min:517.25, max:523.75, avg:518, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2023, info:"数字媒体艺术，录取15，平均532", subject:"history", min:530.5, max:533.9, avg:532, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院(闽台合作)", province:"福建", level:"公办", year:2025, info:"服装与服饰设计，录取20，平均506", subject:"history", min:503.25, max:516, avg:506, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院(闽台合作)", province:"福建", level:"公办", year:2024, info:"服装与服饰设计，录取25，平均503", subject:"history", min:500.75, max:508.25, avg:503, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院(闽台合作)", province:"福建", level:"公办", year:2023, info:"服装与服饰设计，录取25，平均519", subject:"history", min:516.8, max:523.7, avg:519, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院(闽台合作)", province:"福建", level:"公办", year:2025, info:"环境设计，录取20，平均509", subject:"history", min:505.25, max:515.5, avg:509, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院(闽台合作)", province:"福建", level:"公办", year:2024, info:"环境设计，录取20，平均505", subject:"history", min:503.5, max:507.75, avg:505, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院(闽台合作)", province:"福建", level:"公办", year:2023, info:"环境设计，录取15，平均521", subject:"history", min:519.4, max:526.8, avg:521, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽南科技学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取52，平均464", subject:"history", min:456, max:487.5, avg:464, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南科技学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取57，平均467", subject:"history", min:459.5, max:491.75, avg:467, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南科技学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取57，平均486", subject:"history", min:480.5, max:496.5, avg:486, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽江学院(中外合作)", province:"福建", level:"公办", year:2025, info:"视觉传达设计，录取70，平均484", subject:"history", min:475.25, max:502.75, avg:484, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"闽江学院(中外合作)", province:"福建", level:"公办", year:2024, info:"视觉传达设计，录取75，平均485", subject:"history", min:478, max:503, avg:485, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"闽江学院(中外合作)", province:"福建", level:"公办", year:2023, info:"视觉传达设计，录取75，平均503", subject:"history", min:496.8, max:514.6, avg:503, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"闽南科技学院", province:"福建", level:"官方数据", year:2025, info:"服装与服饰设计，录取48，平均452", subject:"history", min:412.25, max:494, avg:452, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南科技学院", province:"福建", level:"官方数据", year:2024, info:"服装与服饰设计，录取58，平均450", subject:"history", min:438.75, max:481.75, avg:450, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南科技学院", province:"福建", level:"官方数据", year:2023, info:"服装与服饰设计，录取58，平均472", subject:"history", min:465.5, max:487.6, avg:472, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南科技学院", province:"福建", level:"官方数据", year:2025, info:"数字媒体艺术，录取80，平均472", subject:"history", min:464.5, max:485, avg:472, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南科技学院", province:"福建", level:"官方数据", year:2024, info:"数字媒体艺术，录取80，平均473", subject:"history", min:467.75, max:483.25, avg:473, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南科技学院", province:"福建", level:"官方数据", year:2023, info:"数字媒体艺术，录取70，平均492", subject:"history", min:487.8, max:499.7, avg:492, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取31，平均433", subject:"history", min:405.75, max:475, avg:433, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取37，平均433", subject:"history", min:415.5, max:459.25, avg:433, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取42，平均459", subject:"history", min:452.7, max:475.2, avg:459, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2025, info:"服装与服饰设计，录取7，平均451", subject:"history", min:426.5, max:506.5, avg:451, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2024, info:"服装与服饰设计，录取16，平均440", subject:"history", min:421.75, max:483.5, avg:440, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2023, info:"服装与服饰设计，录取9，平均465", subject:"history", min:461.8, max:475.3, avg:465, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南师范大学", province:"福建", level:"公办师范", year:2025, info:"公共艺术，录取49，平均517", subject:"history", min:514.25, max:521.5, avg:517, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"闽南师范大学（闽台合作）", province:"福建", level:"公办师范", year:2025, info:"公共艺术，录取30，平均508", subject:"history", min:505.25, max:512.5, avg:508, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"闽南师范大学", province:"福建", level:"公办师范", year:2024, info:"公共艺术，录取49，平均514", subject:"history", min:511.5, max:518.5, avg:514, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"闽南师范大学（闽台合作）", province:"福建", level:"公办师范", year:2024, info:"公共艺术，录取30，平均508", subject:"history", min:505, max:511, avg:508, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"闽南师范大学", province:"福建", level:"公办师范", year:2023, info:"公共艺术，录取30，平均531", subject:"history", min:529.5, max:536.7, avg:531, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"闽南师范大学（闽台合作）", province:"福建", level:"公办师范", year:2023, info:"公共艺术，录取30，平均524", subject:"history", min:521, max:529, avg:524, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取20，平均430", subject:"history", min:402.5, max:454.75, avg:430, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取114，平均448", subject:"history", min:407, max:501.75, avg:448, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取99，平均453", subject:"history", min:446.6, max:485.6, avg:453, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南师范大学", province:"福建", level:"公办师范", year:2025, info:"美术学，录取63，平均525", subject:"history", min:520.5, max:542.25, avg:525, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"闽南师范大学", province:"福建", level:"公办师范", year:2024, info:"美术学，录取63，平均522", subject:"history", min:518.25, max:539.5, avg:522, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"闽南师范大学", province:"福建", level:"公办师范", year:2023, info:"美术学，录取70，平均536", subject:"history", min:533.3, max:544.2, avg:536, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取103，平均448", subject:"history", min:420.25, max:481.75, avg:448, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取101，平均439", subject:"history", min:425.25, max:480, avg:439, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取98，平均466", subject:"history", min:455.9, max:488.2, avg:466, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2025, info:"数字媒体艺术，录取85，平均455", subject:"history", min:416.25, max:481, avg:455, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2024, info:"数字媒体艺术，录取102，平均442", subject:"history", min:425, max:470.25, avg:442, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2023, info:"数字媒体艺术，录取102，平均465", subject:"history", min:455.2, max:488.5, avg:465, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2025, info:"工艺美术，录取29，平均507", subject:"history", min:504.5, max:515.25, avg:507, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2024, info:"工艺美术，录取30，平均505", subject:"history", min:502.25, max:511.5, avg:505, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2023, info:"工艺美术，录取30，平均520", subject:"history", min:517.5, max:523.9, avg:520, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2025, info:"环境设计，录取34，平均504", subject:"history", min:502.25, max:509.75, avg:504, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2024, info:"环境设计，录取34，平均505", subject:"history", min:502.25, max:512, avg:505, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2023, info:"环境设计，录取36，平均520", subject:"history", min:519.1, max:522.6, avg:520, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2025, info:"美术学，录取56，平均509", subject:"history", min:507.25, max:524, avg:509, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2024, info:"美术学，录取39，平均508", subject:"history", min:505.75, max:516.5, avg:508, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2023, info:"美术学，录取41，平均525", subject:"history", min:522.4, max:530.5, avg:525, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2025, info:"视觉传达设计，录取39，平均512", subject:"history", min:510.25, max:519.25, avg:512, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2024, info:"视觉传达设计，录取39，平均510", subject:"history", min:507.25, max:514.25, avg:510, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2023, info:"视觉传达设计，录取26，平均525", subject:"history", min:523.1, max:529.4, avg:525, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院(面向莆田)", province:"福建", level:"公办", year:2025, info:"工艺美术，录取15，平均501", subject:"history", min:497.25, max:516, avg:501, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院(面向莆田)", province:"福建", level:"公办", year:2024, info:"工艺美术，录取15，平均500", subject:"history", min:497, max:505.75, avg:500, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院(面向莆田)", province:"福建", level:"公办", year:2023, info:"工艺美术，录取15，平均515", subject:"history", min:512.3, max:526.7, avg:515, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院(面向莆田)", province:"福建", level:"公办", year:2025, info:"环境设计，录取10，平均501", subject:"history", min:498, max:507.75, avg:501, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院(面向莆田)", province:"福建", level:"公办", year:2024, info:"环境设计，录取10，平均501", subject:"history", min:498.5, max:503.25, avg:501, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院(面向莆田)", province:"福建", level:"公办", year:2023, info:"环境设计，录取10，平均518", subject:"history", min:514.2, max:521.1, avg:518, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院(面向莆田)", province:"福建", level:"公办", year:2025, info:"美术学，录取10，平均508", subject:"history", min:505.75, max:513.75, avg:508, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院(面向莆田)", province:"福建", level:"公办", year:2024, info:"美术学，录取4，平均516", subject:"history", min:507.25, max:526.75, avg:516, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院(面向莆田)", province:"福建", level:"公办", year:2023, info:"美术学，录取4，平均531", subject:"history", min:528.3, max:533.8, avg:531, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院(面向莆田)", province:"福建", level:"公办", year:2025, info:"视觉传达设计，录取5，平均509", subject:"history", min:502.5, max:511, avg:509, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院(面向莆田)", province:"福建", level:"公办", year:2024, info:"视觉传达设计，录取5，平均511", subject:"history", min:505.75, max:526.5, avg:511, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院(面向莆田)", province:"福建", level:"公办", year:2023, info:"视觉传达设计，录取5，平均525", subject:"history", min:524.8, max:526.1, avg:525, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2025, info:"产品设计，录取11，平均518", subject:"history", min:517, max:518.25, avg:518, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2024, info:"产品设计，录取9，平均513", subject:"history", min:512.75, max:514, avg:513, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2023, info:"产品设计，录取7，平均529", subject:"history", min:528.3, max:529.2, avg:529, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2025, info:"服装与服饰设计，录取26，平均511", subject:"history", min:509, max:513, avg:511, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2024, info:"服装与服饰设计，录取16，平均508", subject:"history", min:506.75, max:512, avg:508, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2023, info:"服装与服饰设计，录取15，平均524", subject:"history", min:523, max:528.1, avg:524, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院(闽台合作)", province:"福建", level:"公办师范", year:2025, info:"环境设计，录取20，平均502", subject:"history", min:499.5, max:505, avg:502, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2024, info:"环境设计，录取20，平均501", subject:"history", min:499.5, max:503.5, avg:501, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2023, info:"环境设计，录取20，平均518", subject:"history", min:516.8, max:520.1, avg:518, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2025, info:"美术学，录取29，平均517", subject:"history", min:515, max:519.75, avg:517, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2024, info:"美术学，录取20，平均516", subject:"history", min:513.75, max:517.75, avg:516, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2023, info:"美术学，录取17，平均532", subject:"history", min:529.8, max:533.9, avg:532, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2025, info:"视觉传达设计，录取13，平均519", subject:"history", min:518, max:521.75, avg:519, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2024, info:"视觉传达设计，录取9，平均515", subject:"history", min:514.5, max:517, avg:515, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"莆田学院(闽台合作)", province:"福建", level:"公办", year:2023, info:"视觉传达设计，录取30，平均513", subject:"history", min:511.7, max:516.8, avg:513, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2023, info:"视觉传达设计，录取7，平均530", subject:"history", min:529.6, max:530.3, avg:530, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2025, info:"数字媒体艺术，录取13，平均521", subject:"history", min:519.25, max:522.75, avg:521, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2024, info:"数字媒体艺术，录取9，平均516", subject:"history", min:515.5, max:519.5, avg:516, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2023, info:"数字媒体艺术，录取7，平均532", subject:"history", min:530.2, max:533.7, avg:532, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取33，平均459", subject:"history", min:454.5, max:478, avg:459, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取32，平均456", subject:"history", min:451.5, max:479, avg:456, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取32，平均474", subject:"history", min:467.9, max:490.9, avg:474, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取80，平均445", subject:"history", min:420, max:480.5, avg:445, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取79，平均449", subject:"history", min:443, max:469, avg:449, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取80，平均465", subject:"history", min:457.5, max:498, avg:465, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取80，平均465", subject:"history", min:457.75, max:483.5, avg:465, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取125，平均459", subject:"history", min:452.75, max:481.5, avg:459, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取129，平均478", subject:"history", min:470.2, max:502.8, avg:478, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2025, info:"数字媒体艺术，录取127，平均472", subject:"history", min:462, max:499.25, avg:472, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2024, info:"数字媒体艺术，录取80，平均467", subject:"history", min:459.5, max:485.25, avg:467, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2023, info:"数字媒体艺术，录取81，平均481", subject:"history", min:475, max:517.6, avg:481, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院(中外合作)", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取2，平均438", subject:"history", min:435.25, max:440.25, avg:438, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"泉州信息工程学院(中外合作)", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取2，平均455", subject:"history", min:454.3, max:456.6, avg:455, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"泉州信息工程学院(中外合作)", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均449", subject:"history", min:447, max:450.75, avg:449, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"泉州信息工程学院(中外合作)", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均474", subject:"history", min:469.2, max:479.6, avg:474, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"泉州信息工程学院(中外合作)", province:"福建", level:"官方数据", year:2025, info:"数字媒体艺术，录取1，平均437", subject:"history", min:437, max:437, avg:437, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"泉州信息工程学院(中外合作)", province:"福建", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均441", subject:"history", min:440.5, max:442.25, avg:441, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"泉州信息工程学院(中外合作)", province:"福建", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均460", subject:"history", min:456, max:464.5, avg:460, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"泉州职业技术大学", province:"福建", level:"官方数据", year:2025, info:"服装与服饰设计，录取36，平均444", subject:"history", min:407.5, max:488, avg:444, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"泉州职业技术大学", province:"福建", level:"官方数据", year:2024, info:"服装与服饰设计，录取80，平均445", subject:"history", min:408.75, max:491.75, avg:445, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"泉州职业技术大学", province:"福建", level:"官方数据", year:2023, info:"服装与服饰设计，录取80，平均459", subject:"history", min:444.8, max:496.2, avg:459, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"泉州职业技术大学", province:"福建", level:"官方数据", year:2025, info:"工艺美术，录取37，平均455", subject:"history", min:427, max:482.5, avg:455, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"泉州职业技术大学", province:"福建", level:"官方数据", year:2023, info:"工艺美术，录取70，平均463", subject:"history", min:450.1, max:499.6, avg:463, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"泉州职业技术大学", province:"福建", level:"官方数据", year:2025, info:"数字媒体艺术，录取60，平均463", subject:"history", min:451.75, max:484.75, avg:463, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"泉州职业技术大学", province:"福建", level:"官方数据", year:2024, info:"数字媒体艺术，录取55，平均462", subject:"history", min:453, max:481, avg:462, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"泉州职业技术大学", province:"福建", level:"官方数据", year:2023, info:"数字媒体艺术，录取60，平均484", subject:"history", min:474.3, max:500.9, avg:484, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取20，平均504", subject:"history", min:501.75, max:506.75, avg:504, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取8，平均503", subject:"history", min:500.25, max:504.75, avg:503, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取7，平均515", subject:"history", min:514.1, max:516.7, avg:515, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2025, info:"动画，录取26，平均504", subject:"history", min:500.75, max:510, avg:504, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2024, info:"动画，录取18，平均502", subject:"history", min:499.5, max:505.5, avg:502, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2023, info:"动画，录取18，平均516", subject:"history", min:513.7, max:523.5, avg:516, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2025, info:"服装与服饰设计，录取24，平均496", subject:"history", min:493.75, max:500.75, avg:496, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2024, info:"服装与服饰设计，录取14，平均496", subject:"history", min:494.5, max:499, avg:496, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2023, info:"服装与服饰设计，录取12，平均512", subject:"history", min:509.6, max:516.8, avg:512, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取9，平均500", subject:"history", min:498, max:502, avg:500, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取7，平均500", subject:"history", min:498.25, max:503.25, avg:500, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取9，平均515", subject:"history", min:513.7, max:519.1, avg:515, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2025, info:"美术学，录取18，平均505", subject:"history", min:503.5, max:515.75, avg:505, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2024, info:"美术学，录取19，平均504", subject:"history", min:502, max:509.75, avg:504, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2023, info:"美术学，录取19，平均520", subject:"history", min:517.8, max:522.8, avg:520, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取9，平均509", subject:"history", min:502.5, max:510, avg:509, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取7，平均506", subject:"history", min:505.25, max:507.25, avg:506, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取9，平均523", subject:"history", min:520.5, max:527.1, avg:523, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(面向三明)", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取4，平均503", subject:"history", min:501.25, max:504, avg:503, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(面向三明)", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取10，平均496", subject:"history", min:493.75, max:498.75, avg:496, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(面向三明)", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取10，平均510", subject:"history", min:507.7, max:516.8, avg:510, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(面向三明)", province:"福建", level:"官方数据", year:2025, info:"动画，录取4，平均502", subject:"history", min:499.25, max:505.25, avg:502, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(面向三明)", province:"福建", level:"官方数据", year:2024, info:"动画，录取8，平均496", subject:"history", min:493, max:500.75, avg:496, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(面向三明)", province:"福建", level:"官方数据", year:2023, info:"动画，录取8，平均512", subject:"history", min:511.1, max:513.9, avg:512, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(面向三明)", province:"福建", level:"官方数据", year:2025, info:"服装与服饰设计，录取4，平均492", subject:"history", min:491.75, max:492.75, avg:492, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(面向三明)", province:"福建", level:"官方数据", year:2024, info:"服装与服饰设计，录取8，平均490", subject:"history", min:488, max:492.25, avg:490, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(面向三明)", province:"福建", level:"官方数据", year:2023, info:"服装与服饰设计，录取10，平均507", subject:"history", min:505.1, max:509.3, avg:507, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(面向三明)", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取2，平均495", subject:"history", min:494, max:496.25, avg:495, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(面向三明)", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取5，平均493", subject:"history", min:492, max:496, avg:493, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(面向三明)", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取3，平均514", subject:"history", min:513.4, max:516.1, avg:514, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(面向三明)", province:"福建", level:"官方数据", year:2025, info:"美术学，录取4，平均500", subject:"history", min:497.25, max:503.25, avg:500, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(面向三明)", province:"福建", level:"官方数据", year:2024, info:"美术学，录取8，平均501", subject:"history", min:497.75, max:506.5, avg:501, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(面向三明)", province:"福建", level:"官方数据", year:2023, info:"美术学，录取8，平均516", subject:"history", min:513.5, max:520.5, avg:516, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(面向三明)", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均512", subject:"history", min:509.5, max:514.25, avg:512, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(面向三明)", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均504", subject:"history", min:503.75, max:505.75, avg:504, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(面向三明)", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均519", subject:"history", min:518.1, max:519.5, avg:519, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(闽台合作)", province:"福建", level:"官方数据", year:2025, info:"动画，录取22，平均493", subject:"history", min:490.75, max:497, avg:493, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(闽台合作)", province:"福建", level:"官方数据", year:2024, info:"动画，录取22，平均490", subject:"history", min:488.5, max:495.5, avg:490, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(闽台合作)", province:"福建", level:"官方数据", year:2023, info:"动画，录取22，平均506", subject:"history", min:503.9, max:509.1, avg:506, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(闽台合作)", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取30，平均490", subject:"history", min:485, max:490.75, avg:490, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(闽台合作)", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取33，平均488", subject:"history", min:486.75, max:489.5, avg:488, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(闽台合作)", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取33，平均505", subject:"history", min:503.3, max:512.6, avg:505, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(闽台合作)", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取30，平均494", subject:"history", min:491.75, max:500.5, avg:494, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(闽台合作)", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取33，平均492", subject:"history", min:489.75, max:498.25, avg:492, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院(闽台合作)", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取33，平均507", subject:"history", min:505.9, max:511.5, avg:507, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学", province:"福建", level:"985", year:2025, info:"环境设计(中外合作办学)，录取15，平均542", subject:"history", min:532.25, max:569.75, avg:542, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2024, info:"环境设计(中外合作办学)，录取14，平均527", subject:"history", min:520.75, max:536, avg:527, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2023, info:"环境设计(中外合作办学)，录取14，平均536", subject:"history", min:527.6, max:549.4, avg:536, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2025, info:"绘画，录取13，平均598", subject:"history", min:593.75, max:606.5, avg:598, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2024, info:"绘画，录取16，平均589", subject:"history", min:582, max:601, avg:589, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2023, info:"绘画，录取16，平均587", subject:"history", min:582.4, max:601.7, avg:587, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2025, info:"视觉传达设计(中外合作办学)，录取15，平均554", subject:"history", min:549.75, max:558.75, avg:554, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2024, info:"视觉传达设计(中外合作办学)，录取14，平均551", subject:"history", min:537, max:575.75, avg:551, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2023, info:"视觉传达设计(中外合作办学)，录取14，平均547", subject:"history", min:540.7, max:550.7, avg:547, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2025, info:"数字媒体艺术(中外合作办学)，录取18，平均573", subject:"history", min:560.5, max:596.75, avg:573, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2024, info:"数字媒体艺术(中外合作办学)，录取16，平均556", subject:"history", min:545.5, max:596.25, avg:556, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2023, info:"数字媒体艺术(中外合作办学)，录取16，平均560", subject:"history", min:552, max:568.7, avg:560, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取17，平均504", subject:"history", min:502.25, max:512.25, avg:504, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取17，平均501", subject:"history", min:499.5, max:503.75, avg:501, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取17，平均516", subject:"history", min:515, max:519.2, avg:516, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2025, info:"动画，录取20，平均506", subject:"history", min:503, max:511.5, avg:506, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2024, info:"动画，录取20，平均504", subject:"history", min:501.5, max:513.25, avg:504, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2023, info:"动画，录取20，平均517", subject:"history", min:514.2, max:523.1, avg:517, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取13，平均501", subject:"history", min:499.75, max:502, avg:501, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取13，平均500", subject:"history", min:498.75, max:501.25, avg:500, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取13，平均517", subject:"history", min:514.1, max:524.3, avg:517, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取27，平均511", subject:"history", min:505, max:524.25, avg:511, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取27，平均507", subject:"history", min:504, max:514, avg:507, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取27，平均521", subject:"history", min:518.1, max:530.8, avg:521, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门工学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取45，平均478", subject:"history", min:472.5, max:488.5, avg:478, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门工学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取30，平均478", subject:"history", min:476, max:483.25, avg:478, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门工学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取30，平均499", subject:"history", min:495.9, max:506.9, avg:499, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门工学院", province:"福建", level:"官方数据", year:2025, info:"动画，录取40，平均474", subject:"history", min:469, max:484.25, avg:474, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门工学院", province:"福建", level:"官方数据", year:2024, info:"动画，录取40，平均475", subject:"history", min:472, max:481.5, avg:475, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门工学院", province:"福建", level:"官方数据", year:2023, info:"动画，录取40，平均496", subject:"history", min:492.9, max:503.4, avg:496, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门华厦学院", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取40，平均473", subject:"history", min:469.25, max:476.75, avg:473, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门华厦学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取50，平均474", subject:"history", min:471.25, max:492.75, avg:474, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门华厦学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取50，平均492", subject:"history", min:490.1, max:495.7, avg:492, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门华厦学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取67，平均481", subject:"history", min:478.75, max:485, avg:481, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门华厦学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取60，平均480", subject:"history", min:477.25, max:491.5, avg:480, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门华厦学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取60，平均497", subject:"history", min:494.7, max:501.5, avg:497, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门华厦学院", province:"福建", level:"官方数据", year:2025, info:"数字媒体艺术，录取68，平均479", subject:"history", min:475.75, max:490.25, avg:479, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门华厦学院", province:"福建", level:"官方数据", year:2024, info:"数字媒体艺术，录取55，平均480", subject:"history", min:476.75, max:486.75, avg:480, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门华厦学院", province:"福建", level:"官方数据", year:2023, info:"数字媒体艺术，录取55，平均495", subject:"history", min:492.7, max:502.8, avg:495, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2025, info:"产品设计，录取11，平均526", subject:"history", min:525.5, max:527, avg:526, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2024, info:"产品设计，录取8，平均523", subject:"history", min:521.5, max:530, avg:523, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2025, info:"服装与服饰设计，录取14，平均523", subject:"history", min:521, max:525, avg:523, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2024, info:"服装与服饰设计，录取10，平均519", subject:"history", min:516.75, max:521.25, avg:519, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2023, info:"服装与服饰设计，录取8，平均534", subject:"history", min:533.1, max:537.3, avg:534, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2025, info:"环境设计，录取10，平均523", subject:"history", min:522.25, max:525, avg:523, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2024, info:"环境设计，录取8，平均520", subject:"history", min:518.5, max:521.75, avg:520, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2023, info:"设计学类(含视觉传达设计、环，录取16，平均538", subject:"history", min:536, max:541.8, avg:538, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2025, info:"视觉传达设计，录取12，平均529", subject:"history", min:527.25, max:532.5, avg:529, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2024, info:"视觉传达设计，录取7，平均524", subject:"history", min:523.25, max:525, avg:524, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2025, info:"数字媒体艺术，录取30，平均530", subject:"history", min:527.5, max:540, avg:530, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2024, info:"数字媒体艺术，录取20，平均526", subject:"history", min:523.5, max:530.75, avg:526, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2023, info:"数字媒体艺术，录取12，平均537", subject:"history", min:535.7, max:542.3, avg:537, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2024, info:"影视摄影与制作，录取17，平均518", subject:"history", min:515, max:522, avg:518, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院(面向厦门)", province:"福建", level:"公办", year:2025, info:"服装与服饰设计，录取4，平均522", subject:"history", min:519.75, max:525, avg:522, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院(面向厦门)", province:"福建", level:"公办", year:2025, info:"数字媒体艺术，录取6，平均527", subject:"history", min:526, max:528.75, avg:527, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院(面向厦门)", province:"福建", level:"公办", year:2024, info:"数字媒体艺术，录取6，平均521", subject:"history", min:519.25, max:524, avg:521, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院(面向厦门)", province:"福建", level:"公办", year:2023, info:"数字媒体艺术，录取4，平均535", subject:"history", min:533.6, max:536.4, avg:535, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取20，平均501", subject:"history", min:497.5, max:503.5, avg:501, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取15，平均500", subject:"history", min:497.25, max:505, avg:500, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取13，平均512", subject:"history", min:510.7, max:513.9, avg:512, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2024, info:"动画，录取16，平均499", subject:"history", min:497.5, max:505.5, avg:499, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2023, info:"动画，录取11，平均515", subject:"history", min:513.4, max:518.3, avg:515, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取25，平均496", subject:"history", min:494.25, max:501.7, avg:496, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取30，平均494", subject:"history", min:492, max:501.5, avg:494, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取26，平均511", subject:"history", min:509.4, max:521.7, avg:511, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2025, info:"美术学，录取19，平均502", subject:"history", min:499, max:506.75, avg:502, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2024, info:"美术学，录取14，平均500", subject:"history", min:499.25, max:506.75, avg:500, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2023, info:"美术学，录取11，平均517", subject:"history", min:515.3, max:522.2, avg:517, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取13，平均506", subject:"history", min:504.5, max:508.5, avg:506, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取13，平均503", subject:"history", min:501.5, max:505.25, avg:503, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取12，平均518", subject:"history", min:516, max:520.6, avg:518, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2025, info:"数字媒体艺术，录取23，平均507", subject:"history", min:504.25, max:510.5, avg:507, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2024, info:"数字媒体艺术，录取15，平均505", subject:"history", min:501.25, max:512.75, avg:505, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2023, info:"数字媒体艺术，录取13，平均517", subject:"history", min:514.2, max:523.9, avg:517, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院(面向南平〕", province:"福建", level:"官方数据", year:2024, info:"动画，录取4，平均494", subject:"history", min:492.5, max:496.25, avg:494, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院(面向南平〕", province:"福建", level:"官方数据", year:2023, info:"动画，录取5，平均513", subject:"history", min:509.5, max:516.9, avg:513, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院(面向南平〕", province:"福建", level:"官方数据", year:2025, info:"美术学，录取7，平均498", subject:"history", min:495.5, max:500.25, avg:498, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院(面向南平〕", province:"福建", level:"官方数据", year:2024, info:"美术学，录取7，平均495", subject:"history", min:492, max:499.25, avg:495, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院(面向南平〕", province:"福建", level:"官方数据", year:2023, info:"美术学，录取8，平均509", subject:"history", min:505.6, max:516.4, avg:509, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院(面向南平〕", province:"福建", level:"官方数据", year:2025, info:"数字媒体艺术，录取4，平均506", subject:"history", min:502.25, max:515.7, avg:506, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院(闽台合作〕", province:"福建", level:"官方数据", year:2025, info:"美术学，录取25，平均491", subject:"history", min:489.25, max:496.25, avg:491, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院(闽台合作〕", province:"福建", level:"官方数据", year:2024, info:"美术学，录取25，平均490", subject:"history", min:489, max:497.5, avg:490, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院(闽台合作〕", province:"福建", level:"官方数据", year:2023, info:"美术学，录取25，平均508", subject:"history", min:505.3, max:514.6, avg:508, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院(闽台合作〕", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取30，平均493", subject:"history", min:491, max:498.5, avg:493, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院(闽台合作〕", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取30，平均492", subject:"history", min:489.75, max:496, avg:492, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院(闽台合作〕", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取26，平均508", subject:"history", min:506.7, max:512.6, avg:508, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"阳光学院", province:"福建", level:"官方数据", year:2025, info:"美术学，录取64，平均453", subject:"history", min:419, max:483, avg:453, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"阳光学院", province:"福建", level:"官方数据", year:2024, info:"美术学，录取45，平均469", subject:"history", min:462, max:485.75, avg:469, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"阳光学院", province:"福建", level:"官方数据", year:2023, info:"美术学，录取50，平均491", subject:"history", min:485.5, max:508.2, avg:491, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"阳光学院", province:"福建", level:"官方数据", year:2025, info:"数字媒体艺术，录取129，平均451", subject:"history", min:427.25, max:479.75, avg:451, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"阳光学院", province:"福建", level:"官方数据", year:2024, info:"数字媒体艺术，录取116，平均463", subject:"history", min:457.25, max:495.75, avg:463, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"阳光学院", province:"福建", level:"官方数据", year:2023, info:"数字媒体艺术，录取116，平均486", subject:"history", min:480.7, max:499.5, avg:486, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2025, info:"产品设计，录取1，平均527", subject:"history", min:526.75, max:526.75, avg:527, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2024, info:"产品设计，录取1，平均525", subject:"history", min:525.25, max:525.25, avg:525, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2023, info:"产品设计，录取1，平均535", subject:"history", min:534.5, max:534.5, avg:535, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2025, info:"动画，录取1，平均530", subject:"history", min:529.5, max:529.5, avg:530, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2024, info:"动画，录取1，平均524", subject:"history", min:523.75, max:523.75, avg:524, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2023, info:"动画，录取1，平均537", subject:"history", min:536.5, max:536.5, avg:537, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2025, info:"服装与服饰设计，录取1，平均519", subject:"history", min:519, max:519, avg:519, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2024, info:"服装与服饰设计，录取1，平均517", subject:"history", min:516.5, max:516.5, avg:517, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2023, info:"服装与服饰设计，录取1，平均536", subject:"history", min:535.7, max:535.7, avg:536, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2025, info:"工艺美术，录取1，平均521", subject:"history", min:521.25, max:521.25, avg:521, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2024, info:"工艺美术，录取1，平均518", subject:"history", min:517.75, max:517.75, avg:518, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2023, info:"工艺美术，录取1，平均537", subject:"history", min:536.7, max:536.7, avg:537, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2025, info:"环境设计，录取1，平均522", subject:"history", min:522, max:522, avg:522, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2024, info:"环境设计，录取1，平均519", subject:"history", min:518.5, max:518.5, avg:519, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2023, info:"环境设计，录取1，平均529", subject:"history", min:529.3, max:529.3, avg:529, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2025, info:"视觉传达设计，录取1，平均533", subject:"history", min:533.25, max:533.25, avg:533, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2024, info:"视觉传达设计，录取1，平均530", subject:"history", min:530.25, max:530.25, avg:530, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2023, info:"视觉传达设计，录取1，平均540", subject:"history", min:539.7, max:539.7, avg:540, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2025, info:"数字媒体艺术，录取1，平均534", subject:"history", min:533.75, max:533.75, avg:534, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2024, info:"数字媒体艺术，录取1，平均529", subject:"history", min:529, max:529, avg:529, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2023, info:"数字媒体艺术，录取1，平均543", subject:"history", min:542.7, max:542.7, avg:543, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工业大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取5，平均516", subject:"history", min:512.5, max:519.75, avg:516, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽工业大学", province:"", level:"官方数据", year:2024, info:"环境设计，录取5，平均515", subject:"history", min:511.75, max:517.75, avg:515, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽工业大学", province:"", level:"官方数据", year:2023, info:"环境设计，录取5，平均530", subject:"history", min:528.5, max:533.7, avg:530, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽工业大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均526", subject:"history", min:524.5, max:530, avg:526, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽工业大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均521", subject:"history", min:519.75, max:522, avg:521, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽工业大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均533", subject:"history", min:532.6, max:535.1, avg:533, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽工业大学", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均530", subject:"history", min:530.25, max:530.25, avg:530, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽工业大学", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均527", subject:"history", min:526.25, max:528.25, avg:527, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽工业大学", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均544", subject:"history", min:542.6, max:545.6, avg:544, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽建筑大学", province:"", level:"官方数据", year:2025, info:"动画，录取2，平均527", subject:"history", min:526.75, max:527.25, avg:527, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽建筑大学", province:"", level:"官方数据", year:2024, info:"动画，录取2，平均521", subject:"history", min:520.5, max:521.25, avg:521, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽建筑大学", province:"", level:"官方数据", year:2023, info:"动画，录取2，平均534", subject:"history", min:532.4, max:534.7, avg:534, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽建筑大学", province:"", level:"官方数据", year:2023, info:"公共艺术，录取2，平均527", subject:"history", min:526, max:527.1, avg:527, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽建筑大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取5，平均515", subject:"history", min:514, max:517.25, avg:515, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽建筑大学", province:"", level:"官方数据", year:2024, info:"环境设计，录取7，平均513", subject:"history", min:510.25, max:515.75, avg:513, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽建筑大学", province:"", level:"官方数据", year:2023, info:"环境设计，录取7，平均529", subject:"history", min:528.1, max:529.7, avg:529, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽建筑大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取5，平均525", subject:"history", min:523, max:527.5, avg:525, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽建筑大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均517", subject:"history", min:516.5, max:518.5, avg:517, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽建筑大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取5，平均533", subject:"history", min:530.8, max:535.7, avg:533, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽建筑大学", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均531", subject:"history", min:527.25, max:534, avg:531, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽师范大学", province:"安徽", level:"公办师范", year:2025, info:"雕塑，录取1，平均531", subject:"history", min:530.75, max:530.75, avg:531, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽师范大学", province:"安徽", level:"公办师范", year:2024, info:"雕塑，录取1，平均527", subject:"history", min:526.5, max:526.5, avg:527, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽师范大学", province:"安徽", level:"公办师范", year:2025, info:"动画，录取3，平均532", subject:"history", min:530.75, max:534.25, avg:532, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽师范大学", province:"安徽", level:"公办师范", year:2024, info:"动画，录取3，平均527", subject:"history", min:527, max:528.25, avg:527, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽师范大学", province:"安徽", level:"公办师范", year:2023, info:"动画，录取3，平均540", subject:"history", min:539.5, max:541.9, avg:540, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽师范大学", province:"安徽", level:"公办师范", year:2025, info:"工艺美术，录取1，平均529", subject:"history", min:529, max:529, avg:529, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽师范大学", province:"安徽", level:"公办师范", year:2024, info:"工艺美术，录取1，平均521", subject:"history", min:521.25, max:521.25, avg:521, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽师范大学", province:"安徽", level:"公办师范", year:2025, info:"环境设计，录取1，平均525", subject:"history", min:524.75, max:524.75, avg:525, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽师范大学", province:"安徽", level:"公办师范", year:2024, info:"环境设计，录取1，平均525", subject:"history", min:525, max:525, avg:525, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽师范大学", province:"安徽", level:"公办师范", year:2025, info:"绘画，录取1，平均531", subject:"history", min:530.5, max:530.5, avg:531, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽师范大学", province:"安徽", level:"公办师范", year:2024, info:"绘画，录取1，平均530", subject:"history", min:529.75, max:529.75, avg:530, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽师范大学", province:"安徽", level:"公办师范", year:2025, info:"美术学，录取3，平均533", subject:"history", min:532, max:533.75, avg:533, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽师范大学", province:"安徽", level:"公办师范", year:2024, info:"美术学，录取3，平均533", subject:"history", min:529.75, max:534.75, avg:533, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽师范大学", province:"安徽", level:"公办师范", year:2023, info:"美术学，录取3，平均546", subject:"history", min:545.2, max:546.1, avg:546, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽师范大学", province:"安徽", level:"公办师范", year:2023, info:"美术学类，录取2，平均540", subject:"history", min:539.9, max:540.1, avg:540, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽师范大学", province:"安徽", level:"公办师范", year:2023, info:"设计学类，录取3，平均541", subject:"history", min:540.7, max:542.3, avg:541, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽师范大学", province:"安徽", level:"公办师范", year:2025, info:"视觉传达设计，录取1，平均535", subject:"history", min:535, max:535, avg:535, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽师范大学", province:"安徽", level:"公办师范", year:2024, info:"视觉传达设计，录取1，平均531", subject:"history", min:530.5, max:530.5, avg:531, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽信息工程学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取5，平均463", subject:"history", min:460, max:469.75, avg:463, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽信息工程学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取5，平均460", subject:"history", min:453, max:468.75, avg:460, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽信息工程学院", province:"", level:"官方数据", year:2025, info:"动画，录取5，平均459", subject:"history", min:453, max:466.75, avg:459, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽信息工程学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取5，平均440", subject:"history", min:420.25, max:449.75, avg:440, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽信息工程学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取5，平均453", subject:"history", min:440, max:460, avg:453, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽信息工程学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取5，平均475", subject:"history", min:472.75, max:480.75, avg:475, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽信息工程学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均474", subject:"history", min:472.25, max:476.5, avg:474, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽艺术学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取5，平均519", subject:"history", min:517, max:519.75, avg:519, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽艺术学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均512", subject:"history", min:510.75, max:513, avg:512, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"安徽艺术学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取5，平均526", subject:"history", min:525, max:527.1, avg:526, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"百色学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取2，平均490", subject:"history", min:489.75, max:490.25, avg:490, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"百色学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取2，平均491", subject:"history", min:490.25, max:491, avg:491, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"百色学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取2，平均509", subject:"history", min:508.7, max:508.8, avg:509, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"百色学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取2，平均491", subject:"history", min:489.75, max:491.25, avg:491, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"百色学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取2，平均488", subject:"history", min:486.75, max:490, avg:488, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"百色学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取2，平均506", subject:"history", min:506.1, max:506.3, avg:506, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"百色学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均489", subject:"history", min:488.5, max:488.5, avg:489, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"百色学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均492", subject:"history", min:491.75, max:492, avg:492, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"百色学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均506", subject:"history", min:506.4, max:506.5, avg:506, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"百色学院", province:"", level:"官方数据", year:2025, info:"美术学，录取2，平均494", subject:"history", min:490.25, max:498.25, avg:494, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"百色学院", province:"", level:"官方数据", year:2024, info:"美术学，录取2，平均491", subject:"history", min:491, max:491.5, avg:491, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"百色学院", province:"", level:"官方数据", year:2023, info:"美术学，录取2，平均511", subject:"history", min:510.1, max:511.2, avg:511, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"百色学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均492", subject:"history", min:491.75, max:492.75, avg:492, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"百色学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均493", subject:"history", min:492.75, max:493.25, avg:493, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"百色学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均511", subject:"history", min:510.1, max:512.3, avg:511, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北方民族大学", province:"", level:"官方数据", year:2023, info:"动画，录取2，平均529", subject:"history", min:528.4, max:529.1, avg:529, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北方民族大学", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均521", subject:"history", min:518.8, max:522.8, avg:521, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北方民族大学", province:"", level:"官方数据", year:2023, info:"绘画(油画方向)，录取2，平均522", subject:"history", min:518.8, max:524.7, avg:522, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北方民族大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取1，平均524", subject:"history", min:524.4, max:524.4, avg:524, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取4，平均455", subject:"history", min:435.5, max:479, avg:455, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取6，平均457", subject:"history", min:454.25, max:462.25, avg:457, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取4，平均488", subject:"history", min:487.6, max:489.1, avg:488, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2025, info:"雕塑，录取1，平均466", subject:"history", min:465.75, max:465.75, avg:466, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2024, info:"雕塑，录取2，平均453", subject:"history", min:447, max:459, avg:453, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2023, info:"雕塑，录取2，平均485", subject:"history", min:474.7, max:494.8, avg:485, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2025, info:"动画，录取5，平均462", subject:"history", min:446.5, max:472.75, avg:462, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2024, info:"动画，录取12，平均457", subject:"history", min:452, max:466.75, avg:457, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2023, info:"动画，录取10，平均484", subject:"history", min:478, max:495, avg:484, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取6，平均444", subject:"history", min:437.75, max:449.75, avg:444, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取4，平均478", subject:"history", min:474, max:481.3, avg:478, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均442", subject:"history", min:441.75, max:441.75, avg:442, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取12，平均446", subject:"history", min:434.5, max:453.75, avg:446, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取20，平均483", subject:"history", min:476.6, max:489.7, avg:483, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2025, info:"绘画，录取1，平均430", subject:"history", min:429.5, max:429.5, avg:430, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2024, info:"绘画，录取10，平均449", subject:"history", min:443.75, max:454.25, avg:449, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2023, info:"绘画，录取9，平均480", subject:"history", min:475, max:485.1, avg:480, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2025, info:"美术学，录取3，平均467", subject:"history", min:462.75, max:469.75, avg:467, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2024, info:"美术学，录取10，平均468", subject:"history", min:461.5, max:476.5, avg:468, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2023, info:"美术学，录取6，平均496", subject:"history", min:493.1, max:501.4, avg:496, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2025, info:"摄影，录取2，平均459", subject:"history", min:455.25, max:463.5, avg:459, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2024, info:"摄影，录取2，平均455", subject:"history", min:455.25, max:455.5, avg:455, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2023, info:"摄影，录取7，平均474", subject:"history", min:470.4, max:479.8, avg:474, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取15，平均448", subject:"history", min:426.75, max:477, avg:448, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取20，平均463", subject:"history", min:456, max:473, avg:463, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取22，平均493", subject:"history", min:490.2, max:498.8, avg:493, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取20，平均452", subject:"history", min:422, max:481, avg:452, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取20，平均468", subject:"history", min:458.75, max:476.25, avg:468, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取8，平均495", subject:"history", min:493.5, max:497.2, avg:495, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2025, info:"艺术与科技，录取5，平均440", subject:"history", min:417, max:452.75, avg:440, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北京城市学院", province:"", level:"官方数据", year:2025, info:"工艺美术，录取2，平均487", subject:"history", min:486.5, max:487.75, avg:487, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北京城市学院", province:"", level:"官方数据", year:2024, info:"工艺美术，录取2，平均495", subject:"history", min:490.25, max:499, avg:495, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北京城市学院", province:"", level:"官方数据", year:2023, info:"工艺美术，录取2，平均514", subject:"history", min:505.1, max:522.9, avg:514, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北京城市学院", province:"", level:"官方数据", year:2024, info:"摄影，录取1，平均496", subject:"history", min:496, max:496, avg:496, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北京城市学院", province:"", level:"官方数据", year:2025, info:"文物保护与修复，录取2，平均490", subject:"history", min:490.25, max:490.25, avg:490, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北京城市学院", province:"", level:"官方数据", year:2024, info:"文物保护与修复，录取2，平均499", subject:"history", min:498.75, max:499.25, avg:499, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北京城市学院", province:"", level:"官方数据", year:2023, info:"文物保护与修复，录取2，平均518", subject:"history", min:517, max:519, avg:518, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北京城市学院", province:"", level:"官方数据", year:2025, info:"戏剧影视美术设计(人物造型设计)，录取1，平均495", subject:"history", min:494.75, max:494.75, avg:495, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北京城市学院", province:"", level:"官方数据", year:2025, info:"影视摄影与制作，录取1，平均509", subject:"history", min:508.5, max:508.5, avg:509, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北京城市学院", province:"", level:"官方数据", year:2024, info:"影视摄影与制作，录取1，平均498", subject:"history", min:498, max:498, avg:498, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北京城市学院", province:"", level:"官方数据", year:2025, info:"影视摄影与制作(虚拟制作)，录取1，平均519", subject:"history", min:519, max:519, avg:519, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"北京服装学院", province:"北京", level:"公办/设计强校", year:2025, info:"产品设计，录取6，平均551", subject:"history", min:547.5, max:559.25, avg:551, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京服装学院", province:"北京", level:"公办/设计强校", year:2024, info:"产品设计，录取6，平均544", subject:"history", min:540.5, max:548.25, avg:544, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京服装学院", province:"北京", level:"公办/设计强校", year:2025, info:"动画，录取1，平均560", subject:"history", min:560, max:560, avg:560, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京服装学院", province:"北京", level:"公办/设计强校", year:2024, info:"动画，录取1，平均547", subject:"history", min:547.25, max:547.25, avg:547, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京服装学院", province:"北京", level:"公办/设计强校", year:2025, info:"环境设计，录取2，平均543", subject:"history", min:542.75, max:543.25, avg:543, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京服装学院", province:"北京", level:"公办/设计强校", year:2024, info:"环境设计，录取2，平均536", subject:"history", min:535.75, max:535.75, avg:536, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京服装学院", province:"北京", level:"公办/设计强校", year:2025, info:"绘画，录取1，平均548", subject:"history", min:547.5, max:547.5, avg:548, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京服装学院", province:"北京", level:"公办/设计强校", year:2024, info:"绘画，录取1，平均541", subject:"history", min:540.5, max:540.5, avg:541, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京服装学院", province:"北京", level:"公办/设计强校", year:2025, info:"艺术与科技，录取2，平均552", subject:"history", min:547.75, max:555.75, avg:552, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京服装学院", province:"北京", level:"公办/设计强校", year:2024, info:"艺术与科技，录取2，平均543", subject:"history", min:542, max:544.25, avg:543, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京服装学院", province:"北京", level:"公办/设计强校", year:2025, info:"中国画，录取1，平均544", subject:"history", min:543.75, max:543.75, avg:544, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京服装学院", province:"北京", level:"公办/设计强校", year:2024, info:"中国画，录取1，平均537", subject:"history", min:537.25, max:537.25, avg:537, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京航空航天大学", province:"北京", level:"985", year:2025, info:"设计学类，录取2，平均612", subject:"history", min:611.25, max:612.25, avg:612, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"北京航空航天大学", province:"北京", level:"985", year:2024, info:"设计学类，录取2，平均618", subject:"history", min:613.25, max:622.75, avg:618, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"北京航空航天大学", province:"北京", level:"985", year:2023, info:"设计学类，录取2，平均619", subject:"history", min:613.5, max:624, avg:619, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"北京交通大学(威海校区)", province:"北京", level:"211/双一流", year:2025, info:"数字媒体艺术(中外合作办学)，录取4，平均539", subject:"history", min:536.75, max:544.5, avg:539, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official","coop"]},
      {school:"北京交通大学(威海校区)", province:"北京", level:"211/双一流", year:2024, info:"数字媒体艺术(中外合作办学)，录取2，平均543", subject:"history", min:539.25, max:546.25, avg:543, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official","coop"]},
      {school:"北京交通大学(威海校区)", province:"北京", level:"211/双一流", year:2023, info:"数字媒体艺术(中外合作办学)，录取2，平均552", subject:"history", min:551.5, max:551.6, avg:552, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official","coop"]},
      {school:"北京林业大学", province:"北京", level:"211/双一流", year:2025, info:"动画，录取2，平均578", subject:"history", min:576.5, max:580.25, avg:578, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"北京林业大学", province:"北京", level:"211/双一流", year:2024, info:"动画，录取2，平均576", subject:"history", min:576.25, max:576.5, avg:576, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"北京林业大学", province:"北京", level:"211/双一流", year:2023, info:"动画，录取2，平均574", subject:"history", min:573.9, max:574.6, avg:574, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"北京林业大学", province:"北京", level:"211/双一流", year:2025, info:"设计学类，录取2，平均588", subject:"history", min:587.5, max:587.5, avg:588, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"北京林业大学", province:"北京", level:"211/双一流", year:2024, info:"设计学类，录取2，平均578", subject:"history", min:577.5, max:579, avg:578, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"北京林业大学", province:"北京", level:"211/双一流", year:2023, info:"设计学类，录取2，平均599", subject:"history", min:592, max:605.1, avg:599, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"北京印刷学院", province:"北京", level:"公办/设计传媒", year:2025, info:"产品设计，录取1，平均560", subject:"history", min:559.75, max:559.75, avg:560, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京印刷学院", province:"北京", level:"公办/设计传媒", year:2024, info:"产品设计，录取2，平均558", subject:"history", min:557, max:558.5, avg:558, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京印刷学院", province:"北京", level:"公办/设计传媒", year:2023, info:"产品设计，录取2，平均563", subject:"history", min:563.2, max:563.3, avg:563, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京印刷学院", province:"北京", level:"公办/设计传媒", year:2025, info:"艺术与科技，录取1，平均554", subject:"history", min:553.75, max:553.75, avg:554, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京印刷学院", province:"北京", level:"公办/设计传媒", year:2024, info:"艺术与科技，录取2，平均557", subject:"history", min:552, max:561.75, avg:557, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京印刷学院", province:"北京", level:"公办/设计传媒", year:2023, info:"艺术与科技，录取1，平均565", subject:"history", min:565.2, max:565.2, avg:565, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"长春电子科技学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均455", subject:"history", min:455.25, max:455.25, avg:455, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长春电子科技学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取10，平均446", subject:"history", min:423, max:456, avg:446, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长春电子科技学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均449", subject:"history", min:434.75, max:462.5, avg:449, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长春电子科技学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取12，平均456", subject:"history", min:422.5, max:481, avg:456, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长春建筑学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取3，平均450", subject:"history", min:447.75, max:452, avg:450, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长春建筑学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取3，平均478", subject:"history", min:474.2, max:484.2, avg:478, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长春建筑学院", province:"", level:"官方数据", year:2025, info:"动画，录取2，平均439", subject:"history", min:428.5, max:449.75, avg:439, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长春建筑学院", province:"", level:"官方数据", year:2024, info:"动画，录取2，平均458", subject:"history", min:457, max:458.25, avg:458, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长春建筑学院", province:"", level:"官方数据", year:2023, info:"动画，录取2，平均481", subject:"history", min:480, max:482.1, avg:481, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长春建筑学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取5，平均453", subject:"history", min:442, max:461.75, avg:453, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长春建筑学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取5，平均478", subject:"history", min:469.8, max:485.6, avg:478, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长春建筑学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取5，平均445", subject:"history", min:431.75, max:455.25, avg:445, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长春建筑学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均462", subject:"history", min:460, max:464.25, avg:462, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长春建筑学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均486", subject:"history", min:484.2, max:487.2, avg:486, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长春建筑学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均452", subject:"history", min:446.5, max:456.75, avg:452, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长春建筑学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均457", subject:"history", min:456.25, max:457.75, avg:457, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长春建筑学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均481", subject:"history", min:479, max:483.3, avg:481, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长江大学文理学院", province:"", level:"官方数据", year:2025, info:"美术学，录取5，平均484", subject:"history", min:482.25, max:486.75, avg:484, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长江大学文理学院", province:"", level:"官方数据", year:2024, info:"美术学，录取5，平均487", subject:"history", min:483, max:497, avg:487, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长江师范学院", province:"", level:"官方数据", year:2024, info:"雕塑，录取3，平均502", subject:"history", min:501.25, max:502, avg:502, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长江师范学院", province:"", level:"官方数据", year:2023, info:"雕塑，录取3，平均521", subject:"history", min:518.7, max:523.1, avg:521, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长江师范学院", province:"", level:"官方数据", year:2025, info:"美术学，录取4，平均516", subject:"history", min:514.25, max:518, avg:516, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长江师范学院", province:"", level:"官方数据", year:2024, info:"美术学，录取3，平均514", subject:"history", min:513.5, max:514.5, avg:514, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长江师范学院", province:"", level:"官方数据", year:2023, info:"美术学，录取3，平均527", subject:"history", min:527.2, max:527.6, avg:527, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙理工大学", province:"湖南", level:"公办", year:2025, info:"工艺美术，录取1，平均536", subject:"history", min:536, max:536, avg:536, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"长沙理工大学", province:"湖南", level:"公办", year:2024, info:"工艺美术，录取1，平均527", subject:"history", min:526.75, max:526.75, avg:527, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"长沙理工大学", province:"湖南", level:"公办", year:2023, info:"工艺美术，录取2，平均541", subject:"history", min:540.5, max:542.3, avg:541, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"长沙理工大学", province:"湖南", level:"公办", year:2025, info:"环境设计，录取2，平均529", subject:"history", min:528.5, max:528.75, avg:529, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"长沙理工大学", province:"湖南", level:"公办", year:2024, info:"环境设计，录取2，平均528", subject:"history", min:527.25, max:528.75, avg:528, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"长沙理工大学", province:"湖南", level:"公办", year:2023, info:"环境设计，录取2，平均542", subject:"history", min:541.5, max:541.5, avg:542, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"长沙理工大学", province:"湖南", level:"公办", year:2025, info:"视觉传达设计，录取6，平均539", subject:"history", min:537.75, max:541.25, avg:539, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"长沙理工大学", province:"湖南", level:"公办", year:2024, info:"视觉传达设计，录取2，平均534", subject:"history", min:533.5, max:534.25, avg:534, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"长沙理工大学", province:"湖南", level:"公办", year:2023, info:"视觉传达设计，录取2，平均547", subject:"history", min:545.9, max:547.4, avg:547, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"长沙理工大学", province:"湖南", level:"公办", year:2025, info:"数字媒体艺术，录取3，平均541", subject:"history", min:540.25, max:542.75, avg:541, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"长沙理工大学", province:"湖南", level:"公办", year:2024, info:"数字媒体艺术，录取1，平均536", subject:"history", min:536.25, max:536.25, avg:536, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"长沙理工大学", province:"湖南", level:"公办", year:2023, info:"数字媒体艺术，录取4，平均548", subject:"history", min:546.2, max:549.1, avg:548, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"长沙师范学院", province:"", level:"官方数据", year:2025, info:"动画，录取4，平均513", subject:"history", min:512, max:514.25, avg:513, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙师范学院", province:"", level:"官方数据", year:2024, info:"动画，录取4，平均509", subject:"history", min:507.5, max:511.5, avg:509, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙师范学院", province:"", level:"官方数据", year:2023, info:"动画，录取4，平均526", subject:"history", min:525, max:526.2, avg:526, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙师范学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取4，平均508", subject:"history", min:507, max:510.75, avg:508, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙师范学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取4，平均505", subject:"history", min:504.25, max:505.25, avg:505, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙师范学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取4，平均520", subject:"history", min:518.9, max:521.2, avg:520, status:"省教委官方数据（人工录入）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙师范学院", province:"", level:"官方数据", year:2023, info:"工艺美术，录取4，平均522", subject:"history", min:520.6, max:524, avg:522, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙师范学院", province:"", level:"官方数据", year:2025, info:"美术学，录取1，平均512", subject:"history", min:510.25, max:515.5, avg:512, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙师范学院", province:"", level:"官方数据", year:2024, info:"美术学，录取4，平均509", subject:"history", min:507.25, max:510.5, avg:509, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙师范学院", province:"", level:"官方数据", year:2023, info:"美术学，录取4，平均527", subject:"history", min:525.9, max:527.5, avg:527, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙师范学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取4，平均517", subject:"history", min:515.25, max:518.5, avg:517, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙师范学院", province:"", level:"官方数据", year:2025, info:"艺术与科技，录取1，平均512", subject:"history", min:511.75, max:513, avg:512, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙师范学院", province:"", level:"官方数据", year:2024, info:"艺术与科技，录取4，平均510", subject:"history", min:509, max:510.75, avg:510, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙师范学院", province:"", level:"官方数据", year:2023, info:"艺术与科技，录取4，平均525", subject:"history", min:524.5, max:526.7, avg:525, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"常州大学", province:"", level:"官方数据", year:2025, info:"产品设计，录取1，平均532", subject:"history", min:531.5, max:531.5, avg:532, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"常州大学", province:"", level:"官方数据", year:2025, info:"环境设计(室内设计)，录取1，平均532", subject:"history", min:532, max:532, avg:532, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"常州大学", province:"", level:"官方数据", year:2025, info:"美术学，录取1，平均542", subject:"history", min:542.25, max:542.25, avg:542, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"常州大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取1，平均534", subject:"history", min:531.25, max:534.25, avg:534, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"常州大学", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取1，平均543", subject:"history", min:542.5, max:542.5, avg:543, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"成都大学", province:"四川", level:"公办", year:2025, info:"数字媒体艺术，录取1，平均543", subject:"history", min:543.25, max:543.25, avg:543, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"成都大学", province:"四川", level:"公办", year:2024, info:"数字媒体艺术，录取1，平均539", subject:"history", min:539, max:539, avg:539, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"成都锦城学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取2，平均494", subject:"history", min:491, max:497.75, avg:494, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"成都锦城学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取2，平均496", subject:"history", min:495.5, max:495.75, avg:496, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"成都锦城学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取2，平均507", subject:"history", min:504.9, max:509.2, avg:507, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"成都锦城学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取2，平均489", subject:"history", min:488.25, max:489.25, avg:489, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"成都锦城学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取2，平均489", subject:"history", min:487.5, max:490.25, avg:489, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"成都锦城学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取2，平均508", subject:"history", min:506.1, max:510.6, avg:508, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆城市科技学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取1，平均482", subject:"history", min:482.25, max:482.25, avg:482, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"成都锦城学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取1，平均512", subject:"history", min:511.5, max:511.5, avg:512, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"成都艺术职业大学", province:"", level:"官方数据", year:2023, info:"环境艺术设计，录取2，平均496", subject:"history", min:494.4, max:497.9, avg:496, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"成都艺术职业大学", province:"", level:"官方数据", year:2024, info:"美术，录取5，平均477", subject:"history", min:475.25, max:481.75, avg:477, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"成都艺术职业大学", province:"", level:"官方数据", year:2023, info:"美术，录取2，平均498", subject:"history", min:498.1, max:498.3, avg:498, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆城市科技学院", province:"", level:"官方数据", year:2025, info:"摄影，录取2，平均484", subject:"history", min:482.75, max:485.25, avg:484, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆城市科技学院", province:"", level:"官方数据", year:2024, info:"摄影，录取1，平均478", subject:"history", min:478.25, max:478.25, avg:478, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"成都艺术职业大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取5，平均478", subject:"history", min:477, max:480, avg:478, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆城市科技学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均484", subject:"history", min:483.75, max:484.5, avg:484, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"成都艺术职业大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均478", subject:"history", min:476, max:478.5, avg:478, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆城市科技学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均483", subject:"history", min:482.25, max:483.25, avg:483, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"成都锦城学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取1，平均517", subject:"history", min:517.3, max:517.3, avg:517, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"成都艺术职业大学", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取5，平均478", subject:"history", min:475.5, max:481.25, avg:478, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆城市科技学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取3，平均490", subject:"history", min:485.5, max:496.5, avg:490, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆城市科技学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取1，平均485", subject:"history", min:485, max:485, avg:485, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆城市科技学院", province:"", level:"官方数据", year:2025, info:"新媒体艺术，录取2，平均486", subject:"history", min:483, max:488.25, avg:486, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆城市科技学院", province:"", level:"官方数据", year:2024, info:"新媒体艺术，录取1，平均485", subject:"history", min:484.75, max:484.75, avg:485, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"成都师范学院", province:"", level:"官方数据", year:2025, info:"艺术设计学，录取3，平均522", subject:"history", min:517.75, max:527, avg:522, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"成都师范学院", province:"", level:"官方数据", year:2024, info:"艺术设计学，录取3，平均518", subject:"history", min:515, max:520, avg:518, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"成都师范学院", province:"", level:"官方数据", year:2023, info:"艺术设计学，录取3，平均531", subject:"history", min:530.5, max:530.8, avg:531, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆第二师范学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取4，平均508", subject:"history", min:501.5, max:516.5, avg:508, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆第二师范学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取4，平均518", subject:"history", min:516.4, max:521.9, avg:518, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆第二师范学院", province:"", level:"官方数据", year:2023, info:"公共艺术，录取4，平均519", subject:"history", min:516.6, max:523.7, avg:519, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆第二师范学院", province:"", level:"官方数据", year:2025, info:"美术学，录取4，平均511", subject:"history", min:506.75, max:521.25, avg:511, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆大学", province:"重庆", level:"985", year:2025, info:"设计学类，录取2，平均597", subject:"history", min:594, max:600.75, avg:597, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official"]},
      {school:"重庆第二师范学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取4，平均519", subject:"history", min:510, max:524.5, avg:519, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆对外经贸学院", province:"", level:"官方数据", year:2025, info:"戏剧影视美术设计，录取5，平均483", subject:"history", min:480.75, max:484.25, avg:483, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆对外经贸学院", province:"", level:"官方数据", year:2024, info:"戏剧影视美术设计，录取5，平均483", subject:"history", min:481.75, max:484.25, avg:483, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆对外经贸学院", province:"", level:"官方数据", year:2023, info:"戏剧影视美术设计，录取5，平均501", subject:"history", min:499.5, max:503.5, avg:501, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆交通大学", province:"", level:"官方数据", year:2025, info:"设计学类，录取6，平均534", subject:"history", min:531.5, max:537.25, avg:534, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆交通大学", province:"", level:"官方数据", year:2024, info:"设计学类，录取6，平均535", subject:"history", min:528.5, max:550.75, avg:535, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆交通大学", province:"", level:"官方数据", year:2023, info:"设计学类，录取6，平均543", subject:"history", min:541.6, max:544.7, avg:543, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆交通大学", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取4，平均540", subject:"history", min:535, max:541.5, avg:540, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆交通大学", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均533", subject:"history", min:532.5, max:533.75, avg:533, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆文理学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均505", subject:"history", min:503.25, max:507.25, avg:505, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆文理学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均507", subject:"history", min:506.5, max:507.75, avg:507, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆文理学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均526", subject:"history", min:524.8, max:526.75, avg:526, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆文理学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均516", subject:"history", min:515, max:517, avg:516, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆文理学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均513", subject:"history", min:513, max:513.25, avg:513, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"重庆文理学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均529", subject:"history", min:528.7, max:528.7, avg:529, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙学院", province:"", level:"官方数据", year:2025, info:"动画，录取2，平均525", subject:"history", min:522.75, max:527.75, avg:525, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙学院", province:"", level:"官方数据", year:2024, info:"动画，录取1，平均515", subject:"history", min:514.75, max:514.75, avg:515, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙学院", province:"", level:"官方数据", year:2023, info:"动画，录取1，平均529", subject:"history", min:528.6, max:528.6, avg:529, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取2，平均506", subject:"history", min:505.75, max:507, avg:506, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取2，平均523", subject:"history", min:523.4, max:523.5, avg:523, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均505", subject:"history", min:503, max:509.25, avg:505, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均506", subject:"history", min:504.5, max:507.25, avg:506, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均525", subject:"history", min:524.7, max:525.7, avg:525, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取4，平均516", subject:"history", min:514, max:517.75, avg:516, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取4，平均513", subject:"history", min:512.25, max:513.75, avg:513, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均527", subject:"history", min:526, max:528.5, avg:527, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙学院", province:"", level:"官方数据", year:2025, info:"影视摄影与制作，录取3，平均512", subject:"history", min:509.75, max:512.75, avg:512, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"长沙学院", province:"", level:"官方数据", year:2024, info:"影视摄影与制作，录取3，平均504", subject:"history", min:501, max:507.75, avg:504, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连医科大学", province:"", level:"官方数据", year:2025, info:"摄影，录取3，平均512", subject:"history", min:511.5, max:511.75, avg:512, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连医科大学", province:"", level:"官方数据", year:2024, info:"摄影，录取3，平均507", subject:"history", min:506.5, max:507.7, avg:507, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连医科大学", province:"", level:"官方数据", year:2023, info:"摄影，录取3，平均526", subject:"history", min:521.7, max:528, avg:526, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连医科大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均521", subject:"history", min:519, max:523.25, avg:521, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连医科大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均517", subject:"history", min:515.5, max:518.5, avg:517, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连医科大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均534", subject:"history", min:530.6, max:536, avg:534, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连医科大学中山学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取3，平均459", subject:"history", min:456.5, max:462, avg:459, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连艺术学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取4，平均464", subject:"history", min:445.25, max:484.25, avg:464, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连医科大学中山学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取3，平均468", subject:"history", min:464.25, max:472.5, avg:468, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连艺术学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取2，平均488", subject:"history", min:477, max:499.75, avg:488, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连医科大学中山学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取3，平均484", subject:"history", min:481.9, max:485, avg:484, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连艺术学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取2，平均494", subject:"history", min:488.8, max:498.3, avg:494, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连医科大学中山学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均463", subject:"history", min:457.75, max:468.75, avg:463, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连艺术学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取4，平均461", subject:"history", min:447.5, max:478.25, avg:461, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连医科大学中山学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均464", subject:"history", min:463, max:464.75, avg:464, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连艺术学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取4，平均474", subject:"history", min:471.25, max:479, avg:474, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连医科大学中山学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均487", subject:"history", min:485.4, max:488, avg:487, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连艺术学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均504", subject:"history", min:495.7, max:511.9, avg:504, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连医科大学中山学院", province:"", level:"官方数据", year:2025, info:"美术学，录取2，平均455", subject:"history", min:451.5, max:457.5, avg:455, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连医科大学中山学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均473", subject:"history", min:469.5, max:476.25, avg:473, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连艺术学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均467", subject:"history", min:466.25, max:468.5, avg:467, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连医科大学中山学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均475", subject:"history", min:472.5, max:477.25, avg:475, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连医科大学中山学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均489", subject:"history", min:488.1, max:489.1, avg:489, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连艺术学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均502", subject:"history", min:501.6, max:502.2, avg:502, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连医科大学中山学院", province:"", level:"官方数据", year:2025, info:"文物保护与修复，录取2，平均461", subject:"history", min:459.75, max:461.25, avg:461, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"大连医科大学中山学院", province:"", level:"官方数据", year:2025, info:"影视摄影与制作，录取2，平均458", subject:"history", min:457.5, max:458.75, avg:458, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"滇池学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取2，平均460", subject:"history", min:457.25, max:463, avg:460, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"电子科技大学中山学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取3，平均493", subject:"history", min:489, max:502, avg:493, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"滇池学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取2，平均469", subject:"history", min:464.25, max:473.75, avg:469, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"电子科技大学中山学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取3，平均488", subject:"history", min:485, max:492.75, avg:488, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"电子科技大学中山学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取9，平均500", subject:"history", min:496.7, max:511.2, avg:500, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"电子科技大学成都学院", province:"", level:"官方数据", year:2025, info:"动画，录取2，平均497", subject:"history", min:496.5, max:497.75, avg:497, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"电子科技大学成都学院", province:"", level:"官方数据", year:2024, info:"动画，录取2，平均495", subject:"history", min:494, max:495.25, avg:495, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"电子科技大学成都学院", province:"", level:"官方数据", year:2023, info:"动画，录取2，平均506", subject:"history", min:504, max:507.9, avg:506, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"滇池学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取2，平均462", subject:"history", min:459.25, max:464.25, avg:462, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"滇池学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均447", subject:"history", min:438.25, max:456.25, avg:447, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"滇池学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均463", subject:"history", min:459, max:468.5, avg:463, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"滇池学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取4，平均482", subject:"history", min:480, max:484.75, avg:482, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"电子科技大学中山学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取6，平均496", subject:"history", min:495, max:498.9, avg:496, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"滇池学院", province:"", level:"官方数据", year:2025, info:"绘画，录取2，平均467", subject:"history", min:466.75, max:467, avg:467, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"滇池学院", province:"", level:"官方数据", year:2024, info:"绘画，录取2，平均482", subject:"history", min:480.25, max:482.75, avg:482, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"滇池学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均471", subject:"history", min:470, max:472, avg:471, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"电子科技大学中山学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均495", subject:"history", min:492, max:497.25, avg:495, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"滇池学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均479", subject:"history", min:476.25, max:480.75, avg:479, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"电子科技大学中山学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均495", subject:"history", min:490.75, max:499.25, avg:495, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"电子科技大学中山学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取5，平均503", subject:"history", min:502, max:503.4, avg:503, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"滇池学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均472", subject:"history", min:471.75, max:472.25, avg:472, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"滇池学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均481", subject:"history", min:481, max:481, avg:481, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"滇池学院", province:"", level:"官方数据", year:2025, info:"艺术与科技，录取2，平均460", subject:"history", min:459, max:460.75, avg:460, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"电子科技大学成都学院", province:"", level:"官方数据", year:2025, info:"艺术与科技，录取2，平均489", subject:"history", min:487.75, max:490.5, avg:489, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"滇池学院", province:"", level:"官方数据", year:2024, info:"艺术与科技，录取2，平均468", subject:"history", min:465.25, max:470.25, avg:468, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"电子科技大学成都学院", province:"", level:"官方数据", year:2024, info:"艺术与科技，录取2，平均488", subject:"history", min:487.25, max:488.5, avg:488, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"电子科技大学成都学院", province:"", level:"官方数据", year:2023, info:"艺术与科技，录取2，平均503", subject:"history", min:502.7, max:503.1, avg:503, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"东北大学", province:"辽宁", level:"985", year:2025, info:"设计学类，录取7，平均581", subject:"history", min:577.5, max:589.5, avg:581, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"东北大学", province:"辽宁", level:"985", year:2024, info:"设计学类，录取7，平均568", subject:"history", min:563.5, max:572.5, avg:568, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"东北大学", province:"辽宁", level:"985", year:2023, info:"设计学类，录取7，平均578", subject:"history", min:574.2, max:582.2, avg:578, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2024, info:"服装与服饰设计〈中外合作办，录取1，平均572", subject:"history", min:571.75, max:571.75, avg:572, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2025, info:"产品设计，录取1，平均590", subject:"history", min:589.75, max:589.75, avg:590, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2024, info:"产品设计，录取1，平均578", subject:"history", min:577.75, max:577.75, avg:578, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2025, info:"服装与服饰设计，录取1，平均602", subject:"history", min:602.25, max:602.25, avg:602, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2024, info:"服装与服饰设计，录取1，平均576", subject:"history", min:575.75, max:575.75, avg:576, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2025, info:"服装与服饰设计〈中外合作办，录取2，平均583", subject:"history", min:576.5, max:588.75, avg:583, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2024, info:"服装与服饰设计〈中外合作办，录取1，平均568", subject:"history", min:568.25, max:568.25, avg:568, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2024, info:"环境设计，录取1，平均575", subject:"history", min:574.75, max:574.75, avg:575, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2025, info:"环境设计(中外合作办学)(中英，录取2，平均564", subject:"history", min:563.5, max:564.75, avg:564, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2024, info:"环境设计(中外合作办学)(中英，录取1，平均556", subject:"history", min:556, max:556, avg:556, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2025, info:"数字媒体艺术，录取1，平均603", subject:"history", min:603.25, max:603.25, avg:603, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2024, info:"数字媒体艺术，录取1，平均584", subject:"history", min:584.25, max:584.25, avg:584, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2025, info:"艺术与科技，录取1，平均592", subject:"history", min:592, max:592, avg:592, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2024, info:"艺术与科技，录取1，平均582", subject:"history", min:582.25, max:582.25, avg:582, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东南大学", province:"江苏", level:"985", year:2025, info:"设计学类，录取2，平均612", subject:"history", min:609.25, max:615, avg:612, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official"]},
      {school:"东南大学", province:"江苏", level:"985", year:2024, info:"设计学类，录取2，平均602", subject:"history", min:600.5, max:604.25, avg:602, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official"]},
      {school:"东南大学", province:"江苏", level:"985", year:2023, info:"设计学类，录取2，平均608", subject:"history", min:606.9, max:608.3, avg:608, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official"]},
      {school:"赣南师范大学", province:"", level:"官方数据", year:2025, info:"产品设计，录取4，平均514", subject:"history", min:513.75, max:514.75, avg:514, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣南师范大学", province:"", level:"官方数据", year:2024, info:"产品设计，录取4，平均513", subject:"history", min:512.25, max:513.7, avg:513, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣南师范大学", province:"", level:"官方数据", year:2023, info:"产品设计，录取4，平均527", subject:"history", min:526.8, max:526.8, avg:527, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣东学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取1，平均494", subject:"history", min:494.25, max:494.25, avg:494, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣东学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取1，平均494", subject:"history", min:493.75, max:493.75, avg:494, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣东学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取1，平均510", subject:"history", min:510.2, max:510.2, avg:510, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣南师范大学科技学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取5，平均485", subject:"history", min:484.25, max:485.25, avg:485, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣南师范大学科技学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取5，平均485", subject:"history", min:484, max:485, avg:485, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣南师范大学科技学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取5，平均503", subject:"history", min:502.8, max:503.3, avg:503, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣南师范大学", province:"", level:"官方数据", year:2025, info:"美术学，录取4，平均519", subject:"history", min:517.5, max:520, avg:519, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣南师范大学", province:"", level:"官方数据", year:2024, info:"美术学，录取4，平均517", subject:"history", min:516.75, max:517.2, avg:517, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣南师范大学", province:"", level:"官方数据", year:2023, info:"美术学，录取4，平均532", subject:"history", min:531.8, max:533, avg:532, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣南科技学院", province:"", level:"官方数据", year:2025, info:"设计学类，录取7，平均501", subject:"history", min:493.5, max:514.25, avg:501, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣南科技学院", province:"", level:"官方数据", year:2024, info:"设计学类，录取7，平均494", subject:"history", min:491.75, max:495.75, avg:494, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣南科技学院", province:"", level:"官方数据", year:2023, info:"设计学类，录取7，平均509", subject:"history", min:508.3, max:510.8, avg:509, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣东学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均499", subject:"history", min:499, max:499.25, avg:499, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣东学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均496", subject:"history", min:495.25, max:495.75, avg:496, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣东学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均511", subject:"history", min:510.4, max:511.7, avg:511, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣南师范大学科技学院", province:"", level:"官方数据", year:2025, info:"美术学，录取9，平均486", subject:"history", min:484.5, max:490.75, avg:486, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣南师范大学科技学院", province:"", level:"官方数据", year:2024, info:"美术学，录取9，平均487", subject:"history", min:485.25, max:489.75, avg:487, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣南师范大学科技学院", province:"", level:"官方数据", year:2023, info:"美术学，录取9，平均506", subject:"history", min:503.6, max:510.5, avg:506, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣南师范大学科技学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取5，平均488", subject:"history", min:487.25, max:489.25, avg:488, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣南师范大学科技学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均487", subject:"history", min:485.75, max:488.75, avg:487, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"赣南师范大学科技学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取5，平均505", subject:"history", min:503.2, max:507.8, avg:505, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广东理工学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取2，平均454", subject:"history", min:453, max:455.5, avg:454, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广东理工学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取2，平均465", subject:"history", min:463.25, max:466.25, avg:465, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广东理工学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均462", subject:"history", min:461, max:462.5, avg:462, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广东理工学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均468", subject:"history", min:467.25, max:469, avg:468, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广东理工学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均488", subject:"history", min:484.2, max:492.5, avg:488, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广东理工学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均478", subject:"history", min:477.25, max:478, avg:478, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广东理工学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均473", subject:"history", min:472, max:473.25, avg:473, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广东理工学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均493", subject:"history", min:490.7, max:495, avg:493, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广东理工学院", province:"", level:"官方数据", year:2025, info:"艺术设计学，录取2，平均476", subject:"history", min:475.5, max:476.25, avg:476, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广东理工学院", province:"", level:"官方数据", year:2024, info:"艺术设计学，录取3，平均472", subject:"history", min:470.25, max:474.75, avg:472, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广东理工学院", province:"", level:"官方数据", year:2023, info:"艺术设计学，录取3，平均490", subject:"history", min:487.9, max:491.7, avg:490, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广东轻工职业技术大学", province:"", level:"官方数据", year:2025, info:"产品设计，录取1，平均512", subject:"history", min:511.75, max:511.75, avg:512, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西科技大学", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取4，平均504", subject:"history", min:499.75, max:508, avg:504, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西科技大学", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取4，平均503", subject:"history", min:501.75, max:505, avg:503, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西科技大学", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取4，平均522", subject:"history", min:520.7, max:522.4, avg:522, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西科技大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取4，平均506", subject:"history", min:505.5, max:506.25, avg:506, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西科技大学", province:"", level:"官方数据", year:2024, info:"环境设计，录取4，平均506", subject:"history", min:503.5, max:510.75, avg:506, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西科技大学", province:"", level:"官方数据", year:2023, info:"环境设计，录取4，平均522", subject:"history", min:520.1, max:523, avg:522, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西科技师范学院", province:"", level:"官方数据", year:2025, info:"美术学，录取2，平均495", subject:"history", min:493.25, max:495.75, avg:495, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西科技师范学院", province:"", level:"官方数据", year:2024, info:"美术学，录取2，平均495", subject:"history", min:494, max:496, avg:495, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西科技师范学院", province:"", level:"官方数据", year:2023, info:"美术学，录取2，平均512", subject:"history", min:511.9, max:512.2, avg:512, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西科技师范学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均495", subject:"history", min:495.25, max:495.5, avg:495, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西科技师范学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均495", subject:"history", min:493.5, max:496.5, avg:495, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西科技师范学院", province:"", level:"官方数据", year:2025, info:"艺术设计学，录取2，平均492", subject:"history", min:491.75, max:493, avg:492, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西科技师范学院", province:"", level:"官方数据", year:2024, info:"艺术设计学，录取2，平均492", subject:"history", min:491.25, max:492.5, avg:492, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西科技师范学院", province:"", level:"官方数据", year:2023, info:"艺术设计学，录取4，平均508", subject:"history", min:506.9, max:510.3, avg:508, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西师范大学", province:"", level:"官方数据", year:2024, info:"产品设计，录取2，平均524", subject:"history", min:521.5, max:527, avg:524, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西师范大学", province:"", level:"官方数据", year:2023, info:"产品设计，录取2，平均534", subject:"history", min:534.1, max:534.7, avg:534, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西师范大学", province:"", level:"官方数据", year:2025, info:"动画，录取2，平均527", subject:"history", min:525.25, max:529, avg:527, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西师范大学", province:"", level:"官方数据", year:2024, info:"动画，录取2，平均523", subject:"history", min:521.25, max:525.5, avg:523, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西师范大学", province:"", level:"官方数据", year:2023, info:"动画，录取2，平均535", subject:"history", min:533.3, max:536.2, avg:535, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西民族大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均510", subject:"history", min:509.75, max:509.75, avg:510, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西师范大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均518", subject:"history", min:517.5, max:517.75, avg:518, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西民族大学", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均510", subject:"history", min:507.75, max:512.75, avg:510, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西师范大学", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均515", subject:"history", min:514.25, max:515, avg:515, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西师范大学", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均533", subject:"history", min:531.7, max:534.6, avg:533, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西师范大学", province:"", level:"官方数据", year:2025, info:"美术学，录取3，平均530", subject:"history", min:529, max:531, avg:530, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西师范大学", province:"", level:"官方数据", year:2024, info:"美术学，录取3，平均532", subject:"history", min:529.5, max:535.25, avg:532, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西民族大学", province:"", level:"官方数据", year:2023, info:"美术学，录取1，平均532", subject:"history", min:532, max:532, avg:532, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西师范大学", province:"", level:"官方数据", year:2023, info:"美术学，录取3，平均549", subject:"history", min:546.5, max:552.2, avg:549, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西民族大学", province:"", level:"官方数据", year:2023, info:"设计学类，录取4，平均527", subject:"history", min:527.3, max:527.6, avg:527, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西师范大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计(中外合作办学)，录取3，平均513", subject:"history", min:511.5, max:514.75, avg:513, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"广西师范大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计(中外合作办学)，录取3，平均507", subject:"history", min:506, max:508.25, avg:507, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"广西师范大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计(中外合作办学)，录取3，平均521", subject:"history", min:520.1, max:520.9, avg:521, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"广西艺术学院", province:"", level:"官方数据", year:2025, info:"绘画，录取1，平均523", subject:"history", min:522.5, max:522.5, avg:523, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西艺术学院", province:"", level:"官方数据", year:2024, info:"绘画，录取2，平均516", subject:"history", min:515.5, max:517.25, avg:516, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西外国语学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均423", subject:"history", min:423.25, max:423.25, avg:423, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西艺术学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均519", subject:"history", min:518.75, max:518.75, avg:519, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西外国语学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均443", subject:"history", min:436.5, max:451.75, avg:443, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西艺术学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取1，平均519", subject:"history", min:518.75, max:518.75, avg:519, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西外国语学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均467", subject:"history", min:465.4, max:468.7, avg:467, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西艺术学院", province:"", level:"官方数据", year:2025, info:"美术教育，录取2，平均526", subject:"history", min:525.5, max:526.75, avg:526, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西艺术学院", province:"", level:"官方数据", year:2024, info:"美术教育，录取2，平均524", subject:"history", min:520.5, max:526.75, avg:524, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西外国语学院", province:"", level:"官方数据", year:2025, info:"美术学，录取4，平均446", subject:"history", min:422.75, max:465, avg:446, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西外国语学院", province:"", level:"官方数据", year:2024, info:"美术学，录取8，平均451", subject:"history", min:438.75, max:471, avg:451, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西外国语学院", province:"", level:"官方数据", year:2023, info:"美术学，录取8，平均480", subject:"history", min:469.9, max:493.1, avg:480, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西艺术学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取1，平均533", subject:"history", min:533.25, max:533.25, avg:533, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西艺术学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取1，平均528", subject:"history", min:528, max:528, avg:528, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西外国语学院", province:"", level:"官方数据", year:2025, info:"艺术设计学，录取1，平均431", subject:"history", min:430.75, max:430.75, avg:431, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西外国语学院", province:"", level:"官方数据", year:2024, info:"艺术设计学，录取12，平均432", subject:"history", min:408.75, max:450.25, avg:432, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西外国语学院", province:"", level:"官方数据", year:2023, info:"艺术设计学，录取9，平均470", subject:"history", min:466.2, max:489.5, avg:470, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西艺术学院", province:"", level:"官方数据", year:2025, info:"影视摄影与制作，录取1，平均519", subject:"history", min:519.25, max:519.25, avg:519, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西艺术学院", province:"", level:"官方数据", year:2025, info:"中国画，录取2，平均521", subject:"history", min:520.25, max:522.25, avg:521, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广西艺术学院", province:"", level:"官方数据", year:2024, info:"中国画，录取2，平均524", subject:"history", min:523.75, max:524.25, avg:524, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广州华立学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均463", subject:"history", min:462.75, max:463.75, avg:463, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广州华立学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均476", subject:"history", min:474.75, max:476.25, avg:476, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"广州华立学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均492", subject:"history", min:491.9, max:492.5, avg:492, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"桂林信息科技学院", province:"", level:"官方数据", year:2025, info:"动画，录取1，平均446", subject:"history", min:446.25, max:446.25, avg:446, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"桂林信息科技学院", province:"", level:"官方数据", year:2024, info:"动画，录取3，平均460", subject:"history", min:459.75, max:461.5, avg:460, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"桂林信息科技学院", province:"", level:"官方数据", year:2023, info:"动画，录取3，平均492", subject:"history", min:489, max:497.3, avg:492, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"桂林信息科技学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取4，平均481", subject:"history", min:478, max:486.1, avg:481, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"贵阳学院", province:"", level:"官方数据", year:2025, info:"美术学，录取2，平均498", subject:"history", min:498, max:498.75, avg:498, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"桂林师范学院", province:"", level:"官方数据", year:2025, info:"美术学，录取2，平均502", subject:"history", min:497.25, max:507, avg:502, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"贵阳学院", province:"", level:"官方数据", year:2024, info:"美术学，录取4，平均497", subject:"history", min:493.5, max:505, avg:497, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"贵阳学院", province:"", level:"官方数据", year:2023, info:"美术学，录取4，平均515", subject:"history", min:512.9, max:519.3, avg:515, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"桂林电子科技大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均519", subject:"history", min:516.75, max:521, avg:519, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"桂林信息科技学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取4，平均455", subject:"history", min:451, max:466, avg:455, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"桂林电子科技大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均513", subject:"history", min:513, max:513.25, avg:513, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"桂林信息科技学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取4，平均467", subject:"history", min:461.25, max:475.25, avg:467, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"桂林电子科技大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均528", subject:"history", min:527.9, max:528.3, avg:528, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"桂林信息科技学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取4，平均489", subject:"history", min:486.9, max:493.2, avg:489, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"桂林信息科技学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取3，平均459", subject:"history", min:456.25, max:462.75, avg:459, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"桂林信息科技学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取3，平均468", subject:"history", min:466.5, max:469, avg:468, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"桂林信息科技学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取3，平均487", subject:"history", min:484.9, max:490.8, avg:487, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"桂林学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均459", subject:"history", min:453.25, max:462.25, avg:459, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"桂林学院", province:"", level:"官方数据", year:2024, info:"设计学类，录取4，平均483", subject:"history", min:481, max:483.25, avg:483, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"桂林学院", province:"", level:"官方数据", year:2023, info:"设计学类，录取4，平均499", subject:"history", min:497.4, max:501.8, avg:499, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"桂林学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均479", subject:"history", min:478, max:480.25, avg:479, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"哈尔滨工业大学", province:"", level:"官方数据", year:2025, info:"雕塑，录取2，平均512", subject:"history", min:510.25, max:513, avg:512, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"哈尔滨工业大学", province:"", level:"官方数据", year:2024, info:"雕塑，录取2，平均509", subject:"history", min:507, max:511.5, avg:509, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"哈尔滨工业大学", province:"", level:"官方数据", year:2023, info:"雕塑，录取2，平均526", subject:"history", min:525.2, max:527.5, avg:526, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"哈尔滨工业大学", province:"", level:"官方数据", year:2025, info:"绘画(版画)，录取4，平均511", subject:"history", min:509.25, max:513, avg:511, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"哈尔滨工业大学", province:"", level:"官方数据", year:2024, info:"绘画(版画)，录取4，平均509", subject:"history", min:507, max:513.25, avg:509, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"哈尔滨工业大学", province:"", level:"官方数据", year:2023, info:"绘画(版画)，录取4，平均525", subject:"history", min:517.7, max:538.2, avg:525, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"哈尔滨工业大学", province:"", level:"官方数据", year:2025, info:"绘画(油画)，录取4，平均515", subject:"history", min:513.25, max:516.25, avg:515, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"哈尔滨工业大学", province:"", level:"官方数据", year:2024, info:"绘画(油画)，录取4，平均511", subject:"history", min:510, max:512, avg:511, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"哈尔滨工业大学", province:"", level:"官方数据", year:2023, info:"绘画(油画)，录取4，平均522", subject:"history", min:518.1, max:526.2, avg:522, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"哈尔滨工业大学", province:"", level:"官方数据", year:2023, info:"数字媒体艺术(中外合作办学)，录取2，平均592", subject:"history", min:588.3, max:596.2, avg:592, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2025, info:"动画，录取1，平均444", subject:"history", min:443.5, max:443.5, avg:444, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2024, info:"动画，录取3，平均432", subject:"history", min:430.75, max:434, avg:432, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2023, info:"动画，录取3，平均467", subject:"history", min:463.6, max:469, avg:467, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取2，平均468", subject:"history", min:461.5, max:473.7, avg:468, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2024, info:"产品设计〈设计商学)，录取4，平均427", subject:"history", min:407.75, max:467.5, avg:427, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2023, info:"产品设计〈设计商学)，录取2，平均452", subject:"history", min:450.9, max:452.4, avg:452, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2024, info:"产品设计〈虚拟空间设计)，录取2，平均482", subject:"history", min:456.5, max:507.25, avg:482, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2023, info:"产品设计〈虚拟空间设计)，录取2，平均459", subject:"history", min:458.7, max:459.3, avg:459, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均453", subject:"history", min:451, max:456, avg:453, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均463", subject:"history", min:461.7, max:463.7, avg:463, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2024, info:"摄影〈影视摄影)，录取3，平均427", subject:"history", min:406.75, max:451.5, avg:427, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2023, info:"摄影〈影视摄影)，录取2，平均463", subject:"history", min:457.4, max:469, avg:463, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均442", subject:"history", min:432.75, max:452.25, avg:442, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均470", subject:"history", min:466.3, max:472.8, avg:470, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计(影视美术设计)，录取5，平均443", subject:"history", min:432, max:457.5, avg:443, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计(影视美术设计)，录取3，平均469", subject:"history", min:467.8, max:469.7, avg:469, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2024, info:"艺术与科技(电子竞技运营与设计)，录取4，平均445", subject:"history", min:414.75, max:460.75, avg:445, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2023, info:"艺术与科技(电子竞技运营与设计)，录取3，平均473", subject:"history", min:472, max:474.5, avg:473, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2024, info:"艺术与科技(书画与艺术)，录取3，平均434", subject:"history", min:416.5, max:461.5, avg:434, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海南大学", province:"海南", level:"211", year:2025, info:"绘画，录取4，平均548", subject:"history", min:547.5, max:548.5, avg:548, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"海南大学", province:"海南", level:"211", year:2024, info:"绘画，录取4，平均542", subject:"history", min:540.75, max:543, avg:542, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"海南大学", province:"海南", level:"211", year:2023, info:"绘画，录取3，平均555", subject:"history", min:554.2, max:557.3, avg:555, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"海南大学", province:"海南", level:"211", year:2025, info:"视觉传达设计，录取5，平均553", subject:"history", min:549.25, max:558.5, avg:553, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"海南大学", province:"海南", level:"211", year:2024, info:"视觉传达设计，录取6，平均548", subject:"history", min:544.5, max:558, avg:548, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"海南大学", province:"海南", level:"211", year:2023, info:"视觉传达设计，录取8，平均557", subject:"history", min:554.1, max:567.3, avg:557, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"海南热带海洋学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均499", subject:"history", min:498.25, max:499.5, avg:499, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海南热带海洋学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均504", subject:"history", min:501.75, max:505.25, avg:504, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海南热带海洋学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均519", subject:"history", min:513, max:519.7, avg:519, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海南师范大学", province:"", level:"官方数据", year:2023, info:"环境设计〈中外合作办学)，录取2，平均524", subject:"history", min:521.8, max:525.5, avg:524, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"海南热带海洋学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均511", subject:"history", min:511, max:511, avg:511, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海南热带海洋学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均508", subject:"history", min:507.25, max:509, avg:508, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"海南热带海洋学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均523", subject:"history", min:522.5, max:522.9, avg:523, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"汉口学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取2，平均475", subject:"history", min:473.25, max:475.75, avg:475, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"汉口学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取2，平均474", subject:"history", min:473.5, max:474.75, avg:474, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"汉口学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均466", subject:"history", min:465.75, max:465.75, avg:466, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"汉口学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取1，平均468", subject:"history", min:467.75, max:467.75, avg:468, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"汉口学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取5，平均477", subject:"history", min:474.75, max:480, avg:477, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"汉口学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均477", subject:"history", min:474.75, max:478.5, avg:477, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"汉口学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取5，平均496", subject:"history", min:491.6, max:500.7, avg:496, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"汉口学院", province:"", level:"官方数据", year:2025, info:"艺术与科技，录取5，平均469", subject:"history", min:465.25, max:473, avg:469, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"汉口学院", province:"", level:"官方数据", year:2024, info:"艺术与科技，录取5，平均473", subject:"history", min:471, max:477.5, avg:473, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"汉口学院", province:"", level:"官方数据", year:2023, info:"艺术与科技，录取5，平均488", subject:"history", min:487.3, max:490.5, avg:488, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"合肥工业大学", province:"安徽", level:"211/双一流", year:2025, info:"环境设计，录取4，平均541", subject:"history", min:539.75, max:544.75, avg:541, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"河北传媒学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取1，平均448", subject:"history", min:447.5, max:447.5, avg:448, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河北传媒学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取3，平均459", subject:"history", min:457, max:462.25, avg:459, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河北传媒学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计(中外高水平大学，录取2，平均466", subject:"history", min:455.75, max:475.25, avg:466, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"河北传媒学院", province:"", level:"官方数据", year:2025, info:"戏剧影视美术设计，录取2，平均470", subject:"history", min:469.5, max:470.25, avg:470, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河北传媒学院", province:"", level:"官方数据", year:2024, info:"戏剧影视美术设计，录取4，平均476", subject:"history", min:472.25, max:479.25, avg:476, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河北工程大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均509", subject:"history", min:506, max:512.25, avg:509, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河北美术学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均465", subject:"history", min:463, max:467, avg:465, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河北工程大学", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均511", subject:"history", min:510.25, max:511.75, avg:511, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河北美术学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取5，平均458", subject:"history", min:452.5, max:470, avg:458, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河北工程大学", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均525", subject:"history", min:524.3, max:526, avg:525, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河北师范大学", province:"", level:"官方数据", year:2024, info:"美术学，录取2，平均531", subject:"history", min:529.75, max:531.25, avg:531, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河北美术学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取10，平均482", subject:"history", min:478.75, max:486.75, avg:482, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河北美术学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均498", subject:"history", min:482.5, max:524, avg:498, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河北美术学院", province:"", level:"官方数据", year:2025, info:"新媒体艺术，录取20，平均470", subject:"history", min:460.25, max:482, avg:470, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河北美术学院", province:"", level:"官方数据", year:2024, info:"新媒体艺术，录取23，平均473", subject:"history", min:461, max:500.5, avg:473, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河池学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取5，平均490", subject:"history", min:489, max:490.25, avg:490, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河池学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取5，平均489", subject:"history", min:482.5, max:489.75, avg:489, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河池学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取5，平均505", subject:"history", min:504.8, max:506, avg:505, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河池学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取5，平均487", subject:"history", min:486.25, max:487.5, avg:487, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河池学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取5，平均486", subject:"history", min:485.25, max:487.5, avg:486, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河池学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取5，平均503", subject:"history", min:502.5, max:504.6, avg:503, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河池学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取5，平均486", subject:"history", min:485, max:487.5, avg:486, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河池学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取5，平均487", subject:"history", min:486.75, max:488.25, avg:487, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河池学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取5，平均505", subject:"history", min:504.5, max:505.5, avg:505, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河池学院", province:"", level:"官方数据", year:2025, info:"美术学，录取5，平均488", subject:"history", min:486.75, max:489, avg:488, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河池学院", province:"", level:"官方数据", year:2024, info:"美术学，录取5，平均489", subject:"history", min:488.25, max:490.5, avg:489, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河池学院", province:"", level:"官方数据", year:2023, info:"美术学，录取5，平均509", subject:"history", min:507.1, max:510, avg:509, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河池学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取5，平均491", subject:"history", min:490.5, max:492, avg:491, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河池学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均491", subject:"history", min:489.5, max:494.5, avg:491, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河池学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取5，平均507", subject:"history", min:506.1, max:509.3, avg:507, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河南大学", province:"河南", level:"双一流", year:2024, info:"美术学，录取3，平均536", subject:"history", min:533.25, max:539.25, avg:536, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"河南大学", province:"河南", level:"双一流", year:2023, info:"美术学，录取5，平均549", subject:"history", min:546.9, max:550.3, avg:549, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"河南大学", province:"河南", level:"双一流", year:2025, info:"设计学类，录取3，平均543", subject:"history", min:542.25, max:543.5, avg:543, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"河南大学", province:"河南", level:"双一流", year:2024, info:"设计学类，录取4，平均537", subject:"history", min:535.25, max:538.25, avg:537, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"河南大学", province:"河南", level:"双一流", year:2023, info:"设计学类，录取5，平均548", subject:"history", min:545.1, max:551.5, avg:548, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"河南工程学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计(中外合作办学)，录取21，平均484", subject:"history", min:481, max:490.25, avg:484, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"河南工程学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计(中外合作办学)，录取15，平均486", subject:"history", min:484, max:489.75, avg:486, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"河南工程学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计(中外合作办学)，录取15，平均503", subject:"history", min:500.9, max:514.4, avg:503, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"河南工业大学", province:"", level:"官方数据", year:2025, info:"设计学类，录取2，平均526", subject:"history", min:524.75, max:527.5, avg:526, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河南工业大学", province:"", level:"官方数据", year:2024, info:"设计学类，录取2，平均523", subject:"history", min:520, max:525.25, avg:523, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"河南工业大学", province:"", level:"官方数据", year:2023, info:"设计学类，录取2，平均533", subject:"history", min:532.6, max:533.1, avg:533, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"贺州学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取5，平均488", subject:"history", min:486.75, max:487.5, avg:488, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"贺州学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取5，平均489", subject:"history", min:488, max:491.5, avg:489, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"贺州学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取5，平均506", subject:"history", min:505.6, max:507.3, avg:506, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"贺州学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取5，平均493", subject:"history", min:491.75, max:493.75, avg:493, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"贺州学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均492", subject:"history", min:491.5, max:492.5, avg:492, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"贺州学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取5，平均511", subject:"history", min:508.4, max:514.5, avg:511, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"贺州学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取6，平均496", subject:"history", min:494, max:499, avg:496, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"贺州学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取6，平均492", subject:"history", min:490.5, max:493.25, avg:492, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"贺州学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取5，平均509", subject:"history", min:507.6, max:510.2, avg:509, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"黑龙江外国语学院", province:"", level:"官方数据", year:2025, info:"动画，录取1，平均437", subject:"history", min:436.75, max:436.75, avg:437, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"黑龙江外国语学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均442", subject:"history", min:435, max:448, avg:442, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"衡水学院", province:"", level:"官方数据", year:2025, info:"动画，录取3，平均495", subject:"history", min:491.5, max:500.25, avg:495, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"衡水学院", province:"", level:"官方数据", year:2024, info:"动画，录取3，平均495", subject:"history", min:493.75, max:495.5, avg:495, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"衡水学院", province:"", level:"官方数据", year:2023, info:"动画，录取3，平均510", subject:"history", min:508.6, max:510.9, avg:510, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"衡水学院", province:"", level:"官方数据", year:2025, info:"美术学，录取4，平均491", subject:"history", min:490.75, max:491.5, avg:491, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"衡水学院", province:"", level:"官方数据", year:2024, info:"美术学，录取4，平均494", subject:"history", min:492.25, max:495.75, avg:494, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"衡水学院", province:"", level:"官方数据", year:2023, info:"美术学，录取2，平均513", subject:"history", min:511.3, max:514.4, avg:513, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北大学", province:"湖北", level:"公办重点", year:2025, info:"设计学类，录取5，平均540", subject:"history", min:539.25, max:540.25, avg:540, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"湖北大学", province:"湖北", level:"公办重点", year:2024, info:"设计学类，录取5，平均536", subject:"history", min:534.75, max:536.5, avg:536, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"湖北大学", province:"湖北", level:"公办重点", year:2023, info:"设计学类，录取9，平均548", subject:"history", min:545.1, max:557.2, avg:548, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"湖北恩施学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取5，平均472", subject:"history", min:471, max:473.5, avg:472, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北恩施学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取5，平均475", subject:"history", min:473.5, max:476.75, avg:475, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北恩施学院", province:"", level:"官方数据", year:2025, info:"美术学，录取6，平均480", subject:"history", min:478.75, max:481.25, avg:480, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北恩施学院", province:"", level:"官方数据", year:2024, info:"美术学，录取6，平均482", subject:"history", min:475, max:491.5, avg:482, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北恩施学院", province:"", level:"官方数据", year:2023, info:"美术学，录取4，平均496", subject:"history", min:496, max:497, avg:496, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北工程学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取2，平均505", subject:"history", min:505.25, max:505.5, avg:505, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北工程学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取2，平均503", subject:"history", min:502.75, max:503.75, avg:503, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北工程学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取2，平均518", subject:"history", min:516.3, max:520.5, avg:518, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北工程学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均499", subject:"history", min:495.5, max:503, avg:499, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北工程学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均500", subject:"history", min:498.25, max:502, avg:500, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北工程学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均517", subject:"history", min:514.7, max:518.6, avg:517, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北工程学院", province:"", level:"官方数据", year:2025, info:"美术学，录取3，平均505", subject:"history", min:502.25, max:510, avg:505, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北工程学院", province:"", level:"官方数据", year:2024, info:"美术学，录取3，平均502", subject:"history", min:500.25, max:502.25, avg:502, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北工程学院", province:"", level:"官方数据", year:2023, info:"美术学，录取3，平均521", subject:"history", min:512, max:523.1, avg:521, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北工程学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均509", subject:"history", min:508.5, max:508.75, avg:509, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北工程学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均508", subject:"history", min:507, max:509.5, avg:508, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北工程学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均523", subject:"history", min:522.5, max:524.3, avg:523, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北工业大学", province:"湖北", level:"公办/设计强校", year:2025, info:"公共艺术，录取1，平均531", subject:"history", min:531, max:531, avg:531, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"湖北工业大学", province:"湖北", level:"公办/设计强校", year:2024, info:"公共艺术，录取1，平均527", subject:"history", min:527.25, max:527.25, avg:527, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"湖北工业大学", province:"湖北", level:"公办/设计强校", year:2023, info:"公共艺术，录取1，平均542", subject:"history", min:542.2, max:542.2, avg:542, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"湖北工业大学", province:"湖北", level:"公办/设计强校", year:2025, info:"视觉传达设计，录取1，平均542", subject:"history", min:542, max:542, avg:542, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"湖北工业大学", province:"湖北", level:"公办/设计强校", year:2024, info:"视觉传达设计，录取1，平均536", subject:"history", min:536.25, max:536.25, avg:536, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"湖北工业大学", province:"湖北", level:"公办/设计强校", year:2023, info:"视觉传达设计，录取1，平均546", subject:"history", min:545.8, max:545.8, avg:546, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"湖北工业大学", province:"湖北", level:"公办/设计强校", year:2025, info:"数字媒体艺术，录取1，平均548", subject:"history", min:548.25, max:548.25, avg:548, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"湖北工业大学", province:"湖北", level:"公办/设计强校", year:2024, info:"数字媒体艺术，录取1，平均540", subject:"history", min:539.5, max:539.5, avg:540, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"湖北工业大学", province:"湖北", level:"公办/设计强校", year:2023, info:"数字媒体艺术，录取1，平均547", subject:"history", min:547.2, max:547.2, avg:547, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"湖北工业大学工程技术学院", province:"", level:"官方数据", year:2025, info:"动画，录取2，平均485", subject:"history", min:482.75, max:486.25, avg:485, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北工业大学工程技术学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均494", subject:"history", min:489.25, max:498, avg:494, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北科技学院", province:"", level:"官方数据", year:2025, info:"美术学，录取2，平均504", subject:"history", min:502.25, max:505.75, avg:504, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北科技学院", province:"", level:"官方数据", year:2025, info:"设计学类，录取2，平均506", subject:"history", min:505, max:507, avg:506, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北科技学院", province:"", level:"官方数据", year:2024, info:"设计学类，录取4，平均503", subject:"history", min:502, max:504.5, avg:503, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北科技学院", province:"", level:"官方数据", year:2023, info:"设计学类，录取5，平均521", subject:"history", min:516.7, max:526, avg:521, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2025, info:"产品设计，录取2，平均551", subject:"history", min:550.5, max:551.25, avg:551, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"产品设计，录取1，平均547", subject:"history", min:547, max:547, avg:547, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"产品设计 (展示设计)，录取1，平均543", subject:"history", min:543.25, max:543.25, avg:543, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2025, info:"动画 (中外合作办学)，录取2，平均541", subject:"history", min:539, max:542.5, avg:541, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official","coop"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"动画 (中外合作办学)，录取2，平均535", subject:"history", min:532.5, max:536.75, avg:535, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official","coop"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2025, info:"服装与服饰设计，录取1，平均545", subject:"history", min:544.5, max:544.5, avg:545, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"服装与服饰设计，录取1，平均539", subject:"history", min:539.25, max:539.25, avg:539, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2025, info:"工艺美术，录取1，平均550", subject:"history", min:549.25, max:549.5, avg:550, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"工艺美术，录取1，平均539", subject:"history", min:538.75, max:538.75, avg:539, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2025, info:"公共艺术，录取1，平均542", subject:"history", min:542.25, max:542.25, avg:542, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"公共艺术，录取1，平均530", subject:"history", min:530.25, max:530.25, avg:530, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2025, info:"环境设计，录取1，平均545", subject:"history", min:545.25, max:545.25, avg:545, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"环境设计，录取1，平均540", subject:"history", min:540.25, max:540.75, avg:540, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2025, info:"跨媒体艺术，录取1，平均558", subject:"history", min:557.75, max:557.75, avg:558, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"跨媒体艺术，录取1，平均565", subject:"history", min:564.5, max:567.5, avg:565, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2025, info:"美术教育，录取1，平均549", subject:"history", min:548.75, max:548.75, avg:549, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"美术教育，录取1，平均547", subject:"history", min:547, max:547, avg:547, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2025, info:"视觉传达设计，录取1，平均578", subject:"history", min:577.5, max:577.5, avg:578, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"视觉传达设计，录取1，平均574", subject:"history", min:573.75, max:573.75, avg:574, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2025, info:"数字媒体艺术，录取1，平均574", subject:"history", min:574.25, max:574.25, avg:574, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"数字媒体艺术，录取1，平均567", subject:"history", min:566.5, max:566.5, avg:567, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2025, info:"陶瓷艺术设计，录取1，平均544", subject:"history", min:544.25, max:544.25, avg:544, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"陶瓷艺术设计，录取1，平均529", subject:"history", min:528.75, max:528.75, avg:529, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2025, info:"戏剧影视美术设计，录取1，平均549", subject:"history", min:548.75, max:548.75, avg:549, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"戏剧影视美术设计，录取1，平均539", subject:"history", min:538.5, max:538.5, avg:539, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2025, info:"纤维艺术，录取1，平均546", subject:"history", min:545.5, max:545.5, avg:546, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"纤维艺术，录取1，平均537", subject:"history", min:536.75, max:536.75, avg:537, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2025, info:"艺术设计学，录取1，平均541", subject:"history", min:540.5, max:540.5, avg:541, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"艺术设计学，录取1，平均529", subject:"history", min:529, max:529, avg:529, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2025, info:"艺术与科技，录取1，平均550", subject:"history", min:550, max:550, avg:550, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"艺术与科技，录取1，平均546", subject:"history", min:546.25, max:546.25, avg:546, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2025, info:"影视摄影与制作，录取1，平均545", subject:"history", min:544.5, max:544.5, avg:545, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"影视摄影与制作，录取1，平均531", subject:"history", min:531.25, max:531.25, avg:531, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北师范大学", province:"", level:"官方数据", year:2025, info:"设计学类，录取6，平均524", subject:"history", min:521.75, max:528, avg:524, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北师范大学", province:"", level:"官方数据", year:2024, info:"设计学类，录取12，平均517", subject:"history", min:515.5, max:528.5, avg:517, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北师范大学", province:"", level:"官方数据", year:2023, info:"设计学类，录取12，平均532", subject:"history", min:530.5, max:536.4, avg:532, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北文理学院理工学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取12，平均478", subject:"history", min:475, max:480.5, avg:478, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北文理学院理工学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取12，平均480", subject:"history", min:479, max:481.25, avg:480, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北文理学院理工学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取12，平均496", subject:"history", min:495.2, max:498.7, avg:496, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北文理学院理工学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取6，平均482", subject:"history", min:481, max:483.5, avg:482, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北文理学院理工学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取6，平均483", subject:"history", min:481.75, max:486.5, avg:483, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖北文理学院理工学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取6，平均501", subject:"history", min:498.9, max:505.9, avg:501, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南城市学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均500", subject:"history", min:499.25, max:501, avg:500, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南城市学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均503", subject:"history", min:501.75, max:503.75, avg:503, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南城市学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均514", subject:"history", min:513.8, max:514.6, avg:514, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南城市学院", province:"", level:"官方数据", year:2025, info:"美术学，录取2，平均501", subject:"history", min:500.75, max:501.75, avg:501, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南城市学院", province:"", level:"官方数据", year:2024, info:"美术学，录取2，平均503", subject:"history", min:502.25, max:503.25, avg:503, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南城市学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均521", subject:"history", min:520.9, max:521.3, avg:521, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南城市学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计 (中外合作办学)，录取3，平均489", subject:"history", min:485, max:491.75, avg:489, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"湖南城市学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计 (中外合作办学)，录取5，平均495", subject:"history", min:491.5, max:502, avg:495, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"湖南城市学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计 (中外合作办学)，录取5，平均507", subject:"history", min:506.6, max:508.3, avg:507, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"湖南第一师范学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取1，平均528", subject:"history", min:528.2, max:528.2, avg:528, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南第一师范学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取1，平均531", subject:"history", min:530.6, max:530.6, avg:531, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工程学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取1，平均522", subject:"history", min:521.5, max:521.5, avg:522, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工程学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取3，平均518", subject:"history", min:515.9, max:520.2, avg:518, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工程学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均518", subject:"history", min:517.4, max:518.4, avg:518, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工程学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均517", subject:"history", min:513, max:521.75, avg:517, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工程学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均514", subject:"history", min:511.75, max:518.5, avg:514, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工程学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取1，平均524", subject:"history", min:524.1, max:524.1, avg:524, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工商大学", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取1，平均513", subject:"history", min:512.5, max:512.5, avg:513, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工商大学", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取1，平均529", subject:"history", min:528.6, max:528.6, avg:529, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工商大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均521", subject:"history", min:521, max:521, avg:521, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工商大学", province:"", level:"官方数据", year:2024, info:"环境设计，录取1，平均515", subject:"history", min:514.75, max:514.75, avg:515, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工商大学", province:"", level:"官方数据", year:2023, info:"环境设计，录取1，平均529", subject:"history", min:529.3, max:529.3, avg:529, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工商大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取1，平均528", subject:"history", min:527.75, max:527.75, avg:528, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工商大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取1，平均523", subject:"history", min:523, max:523, avg:523, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工商大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取1，平均537", subject:"history", min:537, max:537, avg:537, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工商大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计(中外合作办学)，录取1，平均502", subject:"history", min:501.75, max:501.75, avg:502, status:"省教委官方数据（ocr待校对）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"湖南工业大学", province:"", level:"官方数据", year:2023, info:"包装设计，录取1，平均550", subject:"history", min:550.4, max:550.4, avg:550, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工业大学", province:"", level:"官方数据", year:2023, info:"产品设计，录取1，平均550", subject:"history", min:549.6, max:549.6, avg:550, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工业大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计 (中外合作办学)，录取2，平均531", subject:"history", min:530.1, max:531.2, avg:531, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"湖南工业大学", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取1，平均558", subject:"history", min:557.6, max:557.6, avg:558, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工业大学", province:"", level:"官方数据", year:2023, info:"陶瓷艺术设计，录取1，平均529", subject:"history", min:528.9, max:528.9, avg:529, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工业大学科技学院", province:"", level:"官方数据", year:2024, info:"包装设计，录取2，平均506", subject:"history", min:482.5, max:530, avg:506, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工业大学科技学院", province:"", level:"官方数据", year:2023, info:"包装设计，录取4，平均499", subject:"history", min:497.9, max:500.9, avg:499, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工业大学科技学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取5，平均482", subject:"history", min:481.5, max:483.5, avg:482, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工业大学科技学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取6，平均499", subject:"history", min:497.8, max:500.8, avg:499, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工业大学科技学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均482", subject:"history", min:480.75, max:483, avg:482, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工业大学科技学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取4，平均482", subject:"history", min:481.5, max:482.25, avg:482, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工业大学科技学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取9，平均500", subject:"history", min:498.9, max:503, avg:500, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取3，平均502", subject:"history", min:500, max:504.75, avg:502, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取3，平均501", subject:"history", min:499.75, max:501.5, avg:501, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取3，平均516", subject:"history", min:515.4, max:517.1, avg:516, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均497", subject:"history", min:497, max:497, avg:497, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取1，平均497", subject:"history", min:496.75, max:496.75, avg:497, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取1，平均516", subject:"history", min:515.7, max:515.7, avg:516, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2025, info:"美术学，录取4，平均500", subject:"history", min:496.75, max:506.25, avg:500, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2024, info:"美术学，录取4，平均499", subject:"history", min:497.75, max:501.25, avg:499, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2023, info:"美术学，录取4，平均516", subject:"history", min:516.1, max:516.1, avg:516, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2025, info:"摄影，录取4，平均491", subject:"history", min:489.5, max:493.25, avg:491, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2024, info:"摄影，录取4，平均494", subject:"history", min:492, max:495.75, avg:494, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2023, info:"摄影，录取4，平均508", subject:"history", min:507.6, max:509.8, avg:508, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取4，平均508", subject:"history", min:508, max:508.5, avg:508, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取4，平均506", subject:"history", min:503.25, max:510.75, avg:506, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取4，平均520", subject:"history", min:518.5, max:520.7, avg:520, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南理工学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均505", subject:"history", min:504.5, max:506, avg:505, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南理工学院", province:"", level:"官方数据", year:2025, info:"美术学，录取1，平均507", subject:"history", min:507, max:507, avg:507, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南理工学院", province:"", level:"官方数据", year:2025, info:"美术学 (师范类)，录取1，平均520", subject:"history", min:519.75, max:519.75, avg:520, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南理工学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取1，平均521", subject:"history", min:520.75, max:520.75, avg:521, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南师范大学", province:"", level:"官方数据", year:2025, info:"绘画，录取1，平均576", subject:"history", min:576.25, max:576.25, avg:576, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南师范大学", province:"", level:"官方数据", year:2024, info:"绘画，录取1，平均563", subject:"history", min:562.5, max:562.5, avg:563, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南师范大学", province:"", level:"官方数据", year:2023, info:"绘画，录取1，平均570", subject:"history", min:570.1, max:570.1, avg:570, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南师范大学", province:"", level:"官方数据", year:2025, info:"美术学，录取1，平均578", subject:"history", min:577.5, max:577.5, avg:578, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南师范大学", province:"", level:"官方数据", year:2024, info:"美术学，录取1，平均571", subject:"history", min:571.25, max:571.25, avg:571, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南师范大学", province:"", level:"官方数据", year:2023, info:"美术学，录取1，平均576", subject:"history", min:576.2, max:576.2, avg:576, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南师范大学", province:"", level:"官方数据", year:2025, info:"艺术设计学 (中外合作办学)，录取3，平均541", subject:"history", min:540.25, max:541, avg:541, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"湖南师范大学", province:"", level:"官方数据", year:2024, info:"艺术设计学 (中外合作办学)，录取3，平均536", subject:"history", min:535.5, max:537.25, avg:536, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"湖南师范大学", province:"", level:"官方数据", year:2023, info:"艺术设计学 (中外合作办学)，录取3，平均550", subject:"history", min:548.6, max:551.5, avg:550, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"湖南文理学院", province:"", level:"官方数据", year:2023, info:"动画，录取3，平均520", subject:"history", min:518.1, max:522.3, avg:520, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南文理学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取6，平均497", subject:"history", min:495.5, max:497.75, avg:497, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南文理学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取6，平均515", subject:"history", min:512.6, max:516.9, avg:515, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南文理学院", province:"", level:"官方数据", year:2025, info:"美术学，录取10，平均504", subject:"history", min:502, max:507, avg:504, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南文理学院", province:"", level:"官方数据", year:2024, info:"美术学，录取4，平均505", subject:"history", min:503.5, max:507.75, avg:505, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南文理学院", province:"", level:"官方数据", year:2023, info:"美术学，录取4，平均519", subject:"history", min:519, max:519.5, avg:519, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖南文理学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计(中外合作办学)，录取7，平均484", subject:"history", min:482.5, max:486, avg:484, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"湖南文理学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计(中外合作办学)，录取7，平均491", subject:"history", min:486, max:505, avg:491, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"湖南文理学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计(中外合作办学)，录取3，平均507", subject:"history", min:506, max:508.8, avg:507, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"湖州师范学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取1，平均525", subject:"history", min:524.5, max:524.5, avg:525, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖州师范学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取1，平均518", subject:"history", min:518.25, max:518.25, avg:518, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖州师范学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取1，平均529", subject:"history", min:529, max:529, avg:529, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖州师范学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取2，平均514", subject:"history", min:512.75, max:516, avg:514, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖州师范学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取1，平均508", subject:"history", min:507.75, max:507.75, avg:508, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖州师范学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取1，平均521", subject:"history", min:521.4, max:521.4, avg:521, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖州师范学院", province:"", level:"官方数据", year:2025, info:"美术学 (师范)，录取1，平均526", subject:"history", min:526.25, max:526.25, avg:526, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖州师范学院", province:"", level:"官方数据", year:2024, info:"美术学 (师范)，录取1，平均523", subject:"history", min:523.25, max:523.5, avg:523, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖州师范学院", province:"", level:"官方数据", year:2023, info:"美术学 (师范)，录取1，平均535", subject:"history", min:535.1, max:535.1, avg:535, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖州师范学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取1，平均522", subject:"history", min:521.5, max:521.5, avg:522, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湖州师范学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取1，平均535", subject:"history", min:535.3, max:535.3, avg:535, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华北科技学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取8，平均497", subject:"history", min:493.25, max:507.5, avg:497, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华北科技学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取8，平均496", subject:"history", min:492.5, max:500, avg:496, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华北科技学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取8，平均512", subject:"history", min:508.9, max:517.9, avg:512, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华东师范大学", province:"", level:"官方数据", year:2025, info:"美术学，录取3，平均608", subject:"history", min:607.75, max:609, avg:608, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华东师范大学", province:"", level:"官方数据", year:2024, info:"美术学，录取2，平均602", subject:"history", min:600.5, max:603.5, avg:602, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华东师范大学", province:"", level:"官方数据", year:2024, info:"美术学 (美教)，录取1，平均631", subject:"history", min:630.5, max:630.5, avg:631, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华东师范大学", province:"", level:"官方数据", year:2023, info:"美术学(美教)，录取1，平均610", subject:"history", min:609.8, max:609.8, avg:610, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华东师范大学", province:"", level:"官方数据", year:2023, info:"美术学类，录取2，平均607", subject:"history", min:604.2, max:609.8, avg:607, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华东师范大学", province:"", level:"官方数据", year:2025, info:"设计学类，录取2，平均614", subject:"history", min:613, max:615, avg:614, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华东师范大学", province:"", level:"官方数据", year:2024, info:"设计学类，录取2，平均611", subject:"history", min:607, max:614.75, avg:611, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华东师范大学", province:"", level:"官方数据", year:2023, info:"设计学类，录取3，平均613", subject:"history", min:610, max:617.4, avg:613, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华南师范大学", province:"", level:"官方数据", year:2025, info:"产品设计，录取3，平均576", subject:"history", min:575.75, max:576.5, avg:576, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华南师范大学", province:"", level:"官方数据", year:2024, info:"产品设计，录取3，平均568", subject:"history", min:566.75, max:568.75, avg:568, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华南师范大学", province:"", level:"官方数据", year:2023, info:"产品设计，录取3，平均573", subject:"history", min:572, max:573.9, avg:573, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华南师范大学", province:"", level:"官方数据", year:2025, info:"美术学 (师范)，录取5，平均579", subject:"history", min:577, max:580.5, avg:579, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华南师范大学", province:"", level:"官方数据", year:2024, info:"美术学 (师范)，录取5，平均571", subject:"history", min:569.5, max:573.5, avg:571, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华南师范大学", province:"", level:"官方数据", year:2023, info:"美术学 (师范)，录取5，平均577", subject:"history", min:575.2, max:581.5, avg:577, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华中师范大学", province:"", level:"官方数据", year:2025, info:"绘画，录取5，平均584", subject:"history", min:581.75, max:587, avg:584, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华中师范大学", province:"", level:"官方数据", year:2024, info:"美术学 (公费师范生)，录取12，平均600", subject:"history", min:594.25, max:611.25, avg:600, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华中师范大学", province:"", level:"官方数据", year:2023, info:"美术学，录取12，平均600", subject:"history", min:593.7, max:608.1, avg:600, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华中师范大学", province:"", level:"官方数据", year:2025, info:"设计学类，录取6，平均588", subject:"history", min:583.75, max:595.75, avg:588, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"华中师范大学 (公费师范)", province:"", level:"官方数据", year:2025, info:"美术学 (公费师范生)，录取1，平均604", subject:"history", min:603.75, max:603.75, avg:604, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取2，平均498", subject:"history", min:495.5, max:499.75, avg:498, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取2，平均494", subject:"history", min:494, max:494.25, avg:494, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取2，平均511", subject:"history", min:511.2, max:511.5, avg:511, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均492", subject:"history", min:490.25, max:492.75, avg:492, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均509", subject:"history", min:508, max:509, avg:509, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2024, info:"美术学，录取5，平均497", subject:"history", min:493.5, max:503.75, avg:497, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2023, info:"美术学，录取3，平均514", subject:"history", min:513.9, max:515.5, avg:514, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2025, info:"美术学 (非师范)，录取7，平均490", subject:"history", min:488.75, max:493.25, avg:490, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取4，平均497", subject:"history", min:496.5, max:498.25, avg:497, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均496", subject:"history", min:494.75, max:498.5, avg:496, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取4，平均513", subject:"history", min:511.4, max:515.9, avg:513, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取3，平均504", subject:"history", min:503.25, max:505, avg:504, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均502", subject:"history", min:503, max:504.75, avg:502, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均520", subject:"history", min:519.8, max:520.9, avg:520, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"惠州学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取4，平均517", subject:"history", min:514.6, max:521.2, avg:517, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"惠州学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取4，平均502", subject:"history", min:494.5, max:506.25, avg:502, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"惠州学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取6，平均513", subject:"history", min:511.6, max:514.4, avg:513, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉利学院", province:"", level:"官方数据", year:2025, info:"设计学类，录取8，平均468", subject:"history", min:460.75, max:483.25, avg:468, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉利学院", province:"", level:"官方数据", year:2024, info:"设计学类，录取8，平均468", subject:"history", min:463, max:472.25, avg:468, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉利学院", province:"", level:"官方数据", year:2023, info:"设计学类，录取6，平均487", subject:"history", min:484.7, max:490.4, avg:487, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取8，平均467", subject:"history", min:464.75, max:470.75, avg:467, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取8，平均474", subject:"history", min:471, max:479, avg:474, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取5，平均494", subject:"history", min:491.4, max:498.2, avg:494, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2024, info:"动画，录取12，平均492", subject:"history", min:485.75, max:514, avg:492, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2023, info:"动画，录取17，平均507", subject:"history", min:502.2, max:514.9, avg:507, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2025, info:"动画 (含二维动画、三维动画、新媒体动画方向)，录取7，平均499", subject:"history", min:488, max:518, avg:499, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2025, info:"动画 (含智能影像创意、影视特效、物理特效方向)，录取10，平均490", subject:"history", min:428.25, max:508.75, avg:490, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2023, info:"动画 (中外合作办学)，录取4，平均490", subject:"history", min:488.1, max:493, avg:490, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取3，平均445", subject:"history", min:433, max:454.25, avg:445, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取3，平均469", subject:"history", min:468, max:470.25, avg:469, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取3，平均486", subject:"history", min:484.9, max:486.6, avg:486, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2023, info:"工艺美术，录取3，平均490", subject:"history", min:487.1, max:494.6, avg:490, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取4，平均468", subject:"history", min:460.75, max:477.25, avg:468, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取4，平均478", subject:"history", min:474.75, max:484.5, avg:478, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均497", subject:"history", min:494.1, max:499, avg:497, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2025, info:"漫画，录取8，平均471", subject:"history", min:458.5, max:486.25, avg:471, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2024, info:"漫画，录取8，平均480", subject:"history", min:474, max:484.5, avg:480, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2023, info:"漫画，录取8，平均496", subject:"history", min:491.1, max:497.6, avg:496, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2023, info:"摄影，录取3，平均486", subject:"history", min:480.8, max:488.6, avg:486, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取8，平均478", subject:"history", min:475, max:480.75, avg:478, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取8，平均481", subject:"history", min:478.25, max:486.5, avg:481, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取6，平均499", subject:"history", min:496.9, max:500.5, avg:499, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取7，平均482", subject:"history", min:479.25, max:484.5, avg:482, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取8，平均490", subject:"history", min:483.75, max:505.25, avg:490, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取8，平均506", subject:"history", min:500.3, max:525.9, avg:506, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2025, info:"戏剧影视美术设计，录取6，平均467", subject:"history", min:463, max:470.5, avg:467, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2024, info:"戏剧影视美术设计，录取8，平均474", subject:"history", min:468.25, max:478, avg:474, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2023, info:"戏剧影视美术设计，录取4，平均495", subject:"history", min:492.9, max:497, avg:495, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2025, info:"艺术与科技，录取9，平均462", subject:"history", min:454.25, max:474.75, avg:462, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2024, info:"艺术与科技，录取8，平均473", subject:"history", min:468.5, max:478, avg:473, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2023, info:"艺术与科技，录取4，平均491", subject:"history", min:490.1, max:493.2, avg:491, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2025, info:"影视摄影与制作，录取4，平均461", subject:"history", min:453.25, max:473.75, avg:461, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2024, info:"影视摄影与制作，录取4，平均471", subject:"history", min:466.5, max:476.5, avg:471, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林工程技术师范学院", province:"", level:"官方数据", year:2023, info:"动画 (中外合作办学)，录取10，平均494", subject:"history", min:489.6, max:500.6, avg:494, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"吉林建筑科技学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均437", subject:"history", min:436.5, max:436.5, avg:437, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林建筑科技学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取6，平均432", subject:"history", min:414.5, max:453.5, avg:432, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林建筑科技学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取6，平均473", subject:"history", min:465.4, max:484.4, avg:473, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林师范大学博达学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取6，平均457", subject:"history", min:443.75, max:467.5, avg:457, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林师范大学博达学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取6，平均459", subject:"history", min:455.5, max:464.75, avg:459, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林师范大学博达学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取6，平均486", subject:"history", min:482.7, max:488.1, avg:486, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林师范大学博达学院", province:"", level:"官方数据", year:2025, info:"美术学，录取6，平均471", subject:"history", min:468.75, max:474.5, avg:471, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林师范大学博达学院", province:"", level:"官方数据", year:2024, info:"美术学，录取6，平均478", subject:"history", min:474.75, max:481.5, avg:478, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林师范大学博达学院", province:"", level:"官方数据", year:2023, info:"美术学，录取6，平均496", subject:"history", min:492.8, max:500.7, avg:496, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林师范大学博达学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取6，平均470", subject:"history", min:466.75, max:477, avg:470, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林师范大学博达学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取6，平均474", subject:"history", min:468, max:480.75, avg:474, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林师范大学博达学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取6，平均491", subject:"history", min:487.8, max:495.1, avg:491, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2025, info:"雕塑，录取1，平均503", subject:"history", min:503.25, max:503.25, avg:503, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2024, info:"雕塑，录取1，平均515", subject:"history", min:514.75, max:514.75, avg:515, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2025, info:"动画，录取2，平均521", subject:"history", min:519.5, max:521.75, avg:521, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2024, info:"动画，录取2，平均514", subject:"history", min:513.25, max:514.5, avg:514, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2025, info:"绘画，录取2，平均511", subject:"history", min:509, max:512.5, avg:511, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2024, info:"绘画，录取2，平均511", subject:"history", min:506.5, max:514.75, avg:511, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取1，平均518", subject:"history", min:518.25, max:518.25, avg:518, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取1，平均513", subject:"history", min:513, max:513, avg:513, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取3，平均517", subject:"history", min:512.5, max:520.5, avg:517, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取3，平均515", subject:"history", min:512.25, max:518.75, avg:515, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2025, info:"艺术与科技，录取1，平均525", subject:"history", min:525, max:525, avg:525, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2024, info:"艺术与科技，录取1，平均523", subject:"history", min:523, max:523, avg:523, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2025, info:"中国画，录取1，平均509", subject:"history", min:509, max:509, avg:509, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2024, info:"中国画，录取1，平均501", subject:"history", min:500.5, max:500.5, avg:501, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉首大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均511", subject:"history", min:510.25, max:511.75, avg:511, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉首大学", province:"", level:"官方数据", year:2024, info:"环境设计，录取4，平均508", subject:"history", min:507.5, max:508.5, avg:508, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉首大学", province:"", level:"官方数据", year:2023, info:"环境设计，录取4，平均524", subject:"history", min:523.1, max:525.4, avg:524, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉首大学", province:"", level:"官方数据", year:2025, info:"美术学，录取3，平均517", subject:"history", min:512.25, max:525, avg:517, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉首大学", province:"", level:"官方数据", year:2024, info:"美术学，录取3，平均513", subject:"history", min:511.25, max:515, avg:513, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉首大学", province:"", level:"官方数据", year:2023, info:"美术学，录取3，平均528", subject:"history", min:527, max:530.2, avg:528, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉首大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均512", subject:"history", min:511.25, max:512, avg:512, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉首大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均527", subject:"history", min:526.7, max:528.6, avg:527, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉首大学", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取5，平均516", subject:"history", min:514.25, max:516.25, avg:516, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉首大学", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均515", subject:"history", min:512.75, max:517.5, avg:515, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"吉首大学", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均533", subject:"history", min:528.4, max:538, avg:533, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"济南大学", province:"山东", level:"公办", year:2023, info:"产品设计，录取3，平均539", subject:"history", min:537.7, max:541.7, avg:539, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"济南大学", province:"山东", level:"公办", year:2025, info:"环境设计，录取3，平均524", subject:"history", min:523.75, max:524.75, avg:524, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"济南大学", province:"山东", level:"公办", year:2024, info:"环境设计，录取3，平均522", subject:"history", min:521.25, max:523, avg:522, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"济南大学", province:"山东", level:"公办", year:2023, info:"环境设计，录取3，平均537", subject:"history", min:536.1, max:537.4, avg:537, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"济南大学", province:"山东", level:"公办", year:2025, info:"美术学，录取3，平均530", subject:"history", min:528.75, max:531.75, avg:530, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"济南大学", province:"山东", level:"公办", year:2024, info:"美术学，录取3，平均526", subject:"history", min:526, max:526.5, avg:526, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"济南大学", province:"山东", level:"公办", year:2023, info:"美术学，录取3，平均541", subject:"history", min:539.7, max:541.6, avg:541, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江汉大学", province:"", level:"官方数据", year:2025, info:"产品设计，录取1，平均527", subject:"history", min:527.25, max:527.25, avg:527, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江汉大学", province:"", level:"官方数据", year:2025, info:"绘画，录取2，平均521", subject:"history", min:516, max:526.75, avg:521, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江汉大学", province:"", level:"官方数据", year:2025, info:"美术学 (师范)，录取1，平均526", subject:"history", min:526.25, max:526.25, avg:526, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江汉大学", province:"", level:"官方数据", year:2024, info:"美术学 (师范)，录取1，平均519", subject:"history", min:518.5, max:518.5, avg:519, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江汉大学", province:"", level:"官方数据", year:2024, info:"美术学类，录取2，平均517", subject:"history", min:517, max:517, avg:517, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江汉大学", province:"", level:"官方数据", year:2023, info:"美术学类，录取2，平均535", subject:"history", min:533.4, max:536.4, avg:535, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江汉大学", province:"", level:"官方数据", year:2024, info:"设计学类，录取1，平均523", subject:"history", min:522.5, max:522.5, avg:523, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江汉大学", province:"", level:"官方数据", year:2023, info:"设计学类，录取4，平均535", subject:"history", min:532.8, max:537.1, avg:535, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江汉大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计 (中外合作办学)，录取2，平均515", subject:"history", min:514.5, max:515.25, avg:515, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"江汉大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计 (中外合作办学)，录取2，平均514", subject:"history", min:513.25, max:514.75, avg:514, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"江汉大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计 (中外合作办学)，录取2，平均531", subject:"history", min:530.6, max:530.7, avg:531, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"江南大学", province:"江苏", level:"211/双一流/设计强", year:2025, info:"产品设计，录取4，平均594", subject:"history", min:592.25, max:596.25, avg:594, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"江南大学", province:"江苏", level:"211/双一流/设计强", year:2024, info:"产品设计，录取3，平均589", subject:"history", min:587.5, max:590.75, avg:589, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"江南大学", province:"江苏", level:"211/双一流/设计强", year:2023, info:"产品设计，录取3，平均593", subject:"history", min:592, max:594.2, avg:593, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"江南大学", province:"江苏", level:"211/双一流/设计强", year:2025, info:"服装与服饰设计，录取2，平均558.4", subject:"history", min:558, max:586, avg:558.4, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"江南大学", province:"江苏", level:"211/双一流/设计强", year:2024, info:"服装与服饰设计，录取4，平均571", subject:"history", min:570.5, max:572.75, avg:571, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"江南大学", province:"江苏", level:"211/双一流/设计强", year:2023, info:"服装与服饰设计，录取4，平均581", subject:"history", min:575, max:583.2, avg:581, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"江南大学", province:"江苏", level:"211/双一流/设计强", year:2025, info:"环境设计，录取2，平均587", subject:"history", min:586.75, max:587.25, avg:587, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"江南大学", province:"江苏", level:"211/双一流/设计强", year:2024, info:"环境设计，录取2，平均577", subject:"history", min:576.75, max:577.25, avg:577, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"江南大学", province:"江苏", level:"211/双一流/设计强", year:2023, info:"环境设计，录取2，平均583", subject:"history", min:582.3, max:583.6, avg:583, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"江南大学", province:"江苏", level:"211/双一流/设计强", year:2025, info:"视觉传达设计，录取5，平均595", subject:"history", min:591.25, max:600.75, avg:595, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"江南大学", province:"江苏", level:"211/双一流/设计强", year:2024, info:"视觉传达设计，录取4，平均589", subject:"history", min:582.5, max:594.5, avg:589, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"江南大学", province:"江苏", level:"211/双一流/设计强", year:2023, info:"视觉传达设计，录取4，平均598", subject:"history", min:592.2, max:602.3, avg:598, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取2，平均518", subject:"history", min:517.5, max:517.75, avg:518, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取1，平均514", subject:"history", min:513.75, max:513.75, avg:514, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取1，平均526", subject:"history", min:526.3, max:526.3, avg:526, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取3，平均514", subject:"history", min:512.5, max:515.75, avg:514, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取2，平均509", subject:"history", min:508.25, max:509.25, avg:509, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取4，平均525", subject:"history", min:523, max:529.4, avg:525, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2025, info:"美术学，录取4，平均517", subject:"history", min:517, max:517.75, avg:517, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2024, info:"美术学，录取4，平均515", subject:"history", min:513.5, max:516.25, avg:515, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2023, info:"美术学，录取2，平均533", subject:"history", min:528.2, max:538.3, avg:533, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均520", subject:"history", min:517, max:520, avg:520, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均518", subject:"history", min:513, max:519, avg:518, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均528", subject:"history", min:526.9, max:529.5, avg:528, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取4，平均521", subject:"history", min:520.5, max:522.75, avg:521, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均516", subject:"history", min:514.5, max:517, avg:516, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均527", subject:"history", min:527.3, max:527.5, avg:527, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江苏师范大学", province:"", level:"官方数据", year:2023, info:"美术学，录取10，平均544", subject:"history", min:542.2, max:550.1, avg:544, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江苏师范大学", province:"", level:"官方数据", year:2023, info:"设计学类，录取10，平均542", subject:"history", min:540.9, max:543.4, avg:542, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西财经大学", province:"江西", level:"公办", year:2025, info:"环境设计，录取1，平均529", subject:"history", min:529, max:529, avg:529, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西财经大学", province:"江西", level:"公办", year:2024, info:"环境设计，录取1，平均527", subject:"history", min:526.75, max:526.75, avg:527, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西财经大学", province:"江西", level:"公办", year:2023, info:"环境设计，录取2，平均539", subject:"history", min:538.5, max:540.3, avg:539, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西财经大学", province:"江西", level:"公办", year:2025, info:"数字媒体艺术，录取1，平均543", subject:"history", min:542.75, max:542.75, avg:543, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西财经大学", province:"江西", level:"公办", year:2024, info:"数字媒体艺术，录取2，平均533", subject:"history", min:531.5, max:534, avg:533, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西财经大学", province:"江西", level:"公办", year:2023, info:"数字媒体艺术，录取2，平均545", subject:"history", min:544, max:546.1, avg:545, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西财经大学", province:"江西", level:"公办", year:2025, info:"数字媒体艺术 (VR 艺术设计)，录取2，平均537", subject:"history", min:536.5, max:537.25, avg:537, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西财经大学", province:"江西", level:"公办", year:2024, info:"数字媒体艺术 (VR 艺术设计)，录取2，平均530", subject:"history", min:529, max:531.5, avg:530, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西财经大学", province:"江西", level:"公办", year:2023, info:"数字媒体艺术 (VR 艺术设计)，录取2，平均543", subject:"history", min:543.2, max:543.2, avg:543, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西财经大学现代经济管理学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取5，平均486", subject:"history", min:483.25, max:493.75, avg:486, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西财经大学现代经济管理学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取5，平均484", subject:"history", min:481.5, max:490.25, avg:484, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取5，平均462", subject:"history", min:450.75, max:469.75, avg:462, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取7，平均468", subject:"history", min:464.25, max:477.75, avg:468, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取3，平均489", subject:"history", min:488.7, max:490.3, avg:489, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2025, info:"动画，录取2，平均456", subject:"history", min:425, max:460.5, avg:456, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2024, info:"动画，录取3，平均467", subject:"history", min:462.25, max:473.5, avg:467, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取25，平均449", subject:"history", min:431.5, max:473.25, avg:449, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取18，平均483", subject:"history", min:465.3, max:502.2, avg:483, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取6，平均448", subject:"history", min:435, max:483.75, avg:448, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取7，平均458", subject:"history", min:453.5, max:466.75, avg:458, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取4，平均483", subject:"history", min:480.2, max:486.8, avg:483, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2025, info:"美术学，录取5，平均452", subject:"history", min:429.5, max:466.25, avg:452, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2024, info:"美术学，录取7，平均455", subject:"history", min:446, max:462.75, avg:455, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取4，平均475", subject:"history", min:473.25, max:478.5, avg:475, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均476", subject:"history", min:473.25, max:478.25, avg:476, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均495", subject:"history", min:491.6, max:497.6, avg:495, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取6，平均460", subject:"history", min:452.5, max:470.25, avg:460, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取7，平均465", subject:"history", min:460, max:473, avg:465, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2025, info:"戏剧影视美术设计，录取2，平均442", subject:"history", min:439.25, max:445.25, avg:442, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2024, info:"戏剧影视美术设计，录取3，平均450", subject:"history", min:441.5, max:462, avg:450, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西工程学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均472", subject:"history", min:471.5, max:472.75, avg:472, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西工程学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均479", subject:"history", min:478.5, max:480.75, avg:479, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技师范大学", province:"", level:"官方数据", year:2025, info:"动画 (泰豪)，录取3，平均519", subject:"history", min:517.75, max:520, avg:519, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技师范大学", province:"", level:"官方数据", year:2024, info:"动画 (泰豪)，录取3，平均511", subject:"history", min:509.5, max:513.5, avg:511, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技师范大学", province:"", level:"官方数据", year:2023, info:"动画 (泰豪)，录取3，平均527", subject:"history", min:526, max:527.3, avg:527, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技师范大学", province:"", level:"官方数据", year:2025, info:"工艺美术，录取1，平均517", subject:"history", min:517, max:517, avg:517, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技师范大学", province:"", level:"官方数据", year:2024, info:"环境设计 (泰豪)，录取3，平均504", subject:"history", min:503.75, max:504, avg:504, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技师范大学", province:"", level:"官方数据", year:2023, info:"环境设计 (泰豪)，录取3，平均523", subject:"history", min:521.4, max:524.5, avg:523, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技师范大学", province:"", level:"官方数据", year:2025, info:"美术学，录取3，平均522", subject:"history", min:521.25, max:523.5, avg:522, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技师范大学", province:"", level:"官方数据", year:2024, info:"美术学 (师范)，录取2，平均519", subject:"history", min:518.75, max:518.75, avg:519, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技师范大学", province:"", level:"官方数据", year:2023, info:"美术学 (师范)，录取2，平均538", subject:"history", min:535.6, max:539.5, avg:538, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技师范大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均525", subject:"history", min:522.5, max:528.25, avg:525, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技师范大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均515", subject:"history", min:514.25, max:516.5, avg:515, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技师范大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计 (含职教师范)，录取2，平均529", subject:"history", min:528.7, max:530, avg:529, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技师范大学", province:"", level:"官方数据", year:2024, info:"数字媒体艺术 (泰豪)，录取3，平均513", subject:"history", min:512, max:513.5, avg:513, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技师范大学", province:"", level:"官方数据", year:2023, info:"数字媒体艺术 (泰豪)，录取3，平均528", subject:"history", min:527.2, max:528.9, avg:528, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2025, info:"动画，录取20，平均447", subject:"history", min:415.75, max:473.25, avg:447, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2024, info:"动画，录取20，平均450", subject:"history", min:439.75, max:478.5, avg:450, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2023, info:"动画，录取8，平均480", subject:"history", min:470.6, max:508.2, avg:480, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取10，平均432", subject:"history", min:425, max:453.25, avg:432, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取5，平均465", subject:"history", min:462.9, max:466.4, avg:465, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均439", subject:"history", min:429.75, max:448.25, avg:439, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取8，平均452", subject:"history", min:416, max:485, avg:452, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取60，平均456", subject:"history", min:448.6, max:479.6, avg:456, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取52，平均448", subject:"history", min:420.75, max:479.75, avg:448, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取60，平均445", subject:"history", min:431.5, max:474.25, avg:445, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取60，平均468", subject:"history", min:461.9, max:489.5, avg:468, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2025, info:"影视摄影与制作，录取3，平均460", subject:"history", min:436, max:476, avg:460, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2024, info:"影视摄影与制作，录取10，平均429", subject:"history", min:406.75, max:449.5, avg:429, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西农业大学南昌商学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取6，平均483", subject:"history", min:482.25, max:483.75, avg:483, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西农业大学南昌商学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取6，平均484", subject:"history", min:482.5, max:488.5, avg:484, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西农业大学南昌商学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取6，平均500", subject:"history", min:499.4, max:502.7, avg:500, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西软件职业技术大学", province:"", level:"官方数据", year:2025, info:"环境艺术设计，录取2，平均455", subject:"history", min:449.75, max:461, avg:455, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西软件职业技术大学", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取8，平均457", subject:"history", min:422, max:470.25, avg:457, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西软件职业技术大学", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取10，平均430", subject:"history", min:420, max:445, avg:430, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西师范大学", province:"江西", level:"公办师范", year:2025, info:"产品设计，录取1，平均536", subject:"history", min:535.5, max:535.5, avg:536, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西师范大学", province:"江西", level:"公办师范", year:2024, info:"产品设计，录取1，平均531", subject:"history", min:530.5, max:530.5, avg:531, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西师范大学", province:"江西", level:"公办师范", year:2023, info:"产品设计，录取2，平均542", subject:"history", min:540.7, max:542.7, avg:542, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西师范大学", province:"江西", level:"公办师范", year:2025, info:"动画，录取2，平均537", subject:"history", min:535.5, max:539, avg:537, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西师范大学", province:"江西", level:"公办师范", year:2024, info:"动画，录取2，平均533", subject:"history", min:532.5, max:533.25, avg:533, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西师范大学", province:"江西", level:"公办师范", year:2023, info:"动画，录取3，平均546", subject:"history", min:545.1, max:548.9, avg:546, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西师范大学", province:"江西", level:"公办师范", year:2025, info:"环境设计，录取1，平均529", subject:"history", min:528.5, max:528.5, avg:529, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西师范大学", province:"江西", level:"公办师范", year:2024, info:"环境设计，录取1，平均529", subject:"history", min:528.5, max:528.5, avg:529, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西师范大学", province:"江西", level:"公办师范", year:2023, info:"环境设计 (室内设计方向)，录取3，平均539", subject:"history", min:537.8, max:539.7, avg:539, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西师范大学", province:"江西", level:"公办师范", year:2025, info:"绘画，录取3，平均533", subject:"history", min:531.75, max:533.5, avg:533, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西师范大学", province:"江西", level:"公办师范", year:2024, info:"绘画，录取2，平均529", subject:"history", min:529, max:529.25, avg:529, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西师范大学", province:"江西", level:"公办师范", year:2023, info:"绘画，录取3，平均543", subject:"history", min:541.7, max:545, avg:543, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西师范大学", province:"江西", level:"公办师范", year:2025, info:"美术学，录取2，平均543", subject:"history", min:542.5, max:542.75, avg:543, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西师范大学", province:"江西", level:"公办师范", year:2024, info:"美术学，录取2，平均540", subject:"history", min:540.25, max:540.5, avg:540, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西师范大学", province:"江西", level:"公办师范", year:2023, info:"美术学，录取3，平均554", subject:"history", min:552.7, max:554.4, avg:554, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西师范大学", province:"江西", level:"公办师范", year:2023, info:"视觉传达设计 (平面设计方向)，录取2，平均548", subject:"history", min:544.5, max:550.7, avg:548, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西师范大学", province:"江西", level:"公办师范", year:2025, info:"视觉传达设计 (中外合作办学)，录取3，平均515", subject:"history", min:510.25, max:522, avg:515, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"江西师范大学", province:"江西", level:"公办师范", year:2023, info:"视觉传达设计 (中外合作办学)，录取2，平均528", subject:"history", min:526.4, max:529.6, avg:528, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"江西师范大学 (中外合作)", province:"江西", level:"公办师范", year:2024, info:"视觉传达设计 (中外合作办学)，录取2，平均517", subject:"history", min:516, max:517, avg:517, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"江西师范大学科学技术学院", province:"", level:"官方数据", year:2023, info:"动画，录取1，平均504", subject:"history", min:504.4, max:504.4, avg:504, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西师范大学科学技术学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取1，平均501", subject:"history", min:500.7, max:500.7, avg:501, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西师范大学科学技术学院", province:"", level:"官方数据", year:2025, info:"影视摄影与制作，录取2，平均483", subject:"history", min:481.5, max:483.5, avg:483, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"江西师范大学科学技术学院", province:"", level:"官方数据", year:2024, info:"影视摄影与制作，录取2，平均484", subject:"history", min:483.5, max:484.25, avg:484, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"荆楚理工学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均495", subject:"history", min:490, max:499.5, avg:495, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"井冈山大学", province:"", level:"官方数据", year:2025, info:"美术学，录取3，平均514", subject:"history", min:512.75, max:516.25, avg:514, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"井冈山大学", province:"", level:"官方数据", year:2024, info:"美术学，录取2，平均512", subject:"history", min:511.5, max:512.5, avg:512, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"井冈山大学", province:"", level:"官方数据", year:2023, info:"美术学，录取3，平均527", subject:"history", min:526.6, max:527.7, avg:527, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"井冈山大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均521", subject:"history", min:519, max:522.25, avg:521, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"井冈山大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均520", subject:"history", min:516.25, max:523, avg:520, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"井冈山大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均526", subject:"history", min:525.8, max:526.3, avg:526, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2025, info:"产品设计，录取2，平均536", subject:"history", min:535.5, max:535.75, avg:536, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2025, info:"动画，录取2，平均539", subject:"history", min:538.25, max:540.25, avg:539, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2024, info:"动画，录取2，平均537", subject:"history", min:534.5, max:538.75, avg:537, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2025, info:"工艺美术，录取1，平均531", subject:"history", min:531.25, max:531.25, avg:531, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2025, info:"公共艺术，录取1，平均531", subject:"history", min:530.5, max:530.5, avg:531, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2024, info:"公共艺术，录取1，平均518", subject:"history", min:517.5, max:517.5, avg:518, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2025, info:"环境设计，录取2，平均528", subject:"history", min:526, max:530.5, avg:528, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2024, info:"环境设计，录取2，平均521", subject:"history", min:521, max:521.75, avg:521, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2023, info:"环境设计 (中外高水平大学学生交流计划)，录取1，平均518", subject:"history", min:517.6, max:517.6, avg:518, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official","coop"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2025, info:"绘画，录取2，平均535", subject:"history", min:534.25, max:536.25, avg:535, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2025, info:"美术学，录取1，平均533", subject:"history", min:532.5, max:532.5, avg:533, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2024, info:"美术学，录取1，平均526", subject:"history", min:526, max:526, avg:526, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2024, info:"实验艺术，录取1，平均522", subject:"history", min:522.25, max:522.25, avg:522, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2025, info:"视觉传达设计，录取2，平均537", subject:"history", min:536.75, max:537.75, avg:537, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2024, info:"视觉传达设计，录取2，平均534", subject:"history", min:532.25, max:536.25, avg:534, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2023, info:"视觉传达设计 (中外高水平大学学生交流计划)，录取1，平均518", subject:"history", min:517.8, max:517.8, avg:518, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official","coop"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2025, info:"数字媒体艺术，录取2，平均538", subject:"history", min:537.5, max:537.75, avg:538, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2024, info:"数字媒体艺术，录取2，平均532", subject:"history", min:531.5, max:532.25, avg:532, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2025, info:"艺术与科技，录取1，平均536", subject:"history", min:536.25, max:536.25, avg:536, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2024, info:"艺术与科技，录取1，平均533", subject:"history", min:533, max:533, avg:533, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2025, info:"中国画，录取1，平均528", subject:"history", min:527.75, max:527.75, avg:528, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇陶瓷大学", province:"江西", level:"专业强校", year:2024, info:"中国画，录取2，平均520", subject:"history", min:518, max:521.75, avg:520, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"景德镇学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取3，平均498", subject:"history", min:496, max:501.5, avg:498, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取4，平均496", subject:"history", min:495, max:496.5, avg:496, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取4，平均512", subject:"history", min:511.6, max:513, avg:512, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇学院", province:"", level:"官方数据", year:2025, info:"雕塑，录取2，平均495", subject:"history", min:494.5, max:494.75, avg:495, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇学院", province:"", level:"官方数据", year:2024, info:"雕塑，录取3，平均498", subject:"history", min:492.5, max:505.5, avg:498, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇学院", province:"", level:"官方数据", year:2023, info:"雕塑，录取3，平均512", subject:"history", min:506.6, max:522.2, avg:512, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇学院", province:"", level:"官方数据", year:2025, info:"工艺美术，录取7，平均497", subject:"history", min:495, max:502.5, avg:497, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇学院", province:"", level:"官方数据", year:2024, info:"工艺美术，录取4，平均493", subject:"history", min:493, max:494.5, avg:493, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇学院", province:"", level:"官方数据", year:2023, info:"工艺美术，录取4，平均513", subject:"history", min:508.6, max:518, avg:513, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均493", subject:"history", min:492.5, max:493, avg:493, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取4，平均493", subject:"history", min:492.25, max:494.75, avg:493, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取4，平均512", subject:"history", min:509.3, max:514, avg:512, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2025, info:"产品设计，录取6，平均478", subject:"history", min:477.25, max:479.25, avg:478, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2024, info:"产品设计，录取6，平均477", subject:"history", min:474.25, max:480.75, avg:477, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2023, info:"产品设计，录取2，平均495", subject:"history", min:494.5, max:494.8, avg:495, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2025, info:"雕塑，录取4，平均459", subject:"history", min:449.25, max:468.75, avg:459, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2024, info:"雕塑，录取4，平均472", subject:"history", min:465.25, max:477.5, avg:472, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2025, info:"工艺美术，录取6，平均472", subject:"history", min:463, max:478, avg:472, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2024, info:"工艺美术，录取6，平均468", subject:"history", min:460.75, max:476, avg:468, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2023, info:"公共艺术设计，录取2，平均493", subject:"history", min:492.6, max:494, avg:493, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取6，平均468", subject:"history", min:463.75, max:471.25, avg:468, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2024, info:"环境设计，录取6，平均465", subject:"history", min:456.25, max:473, avg:465, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均495", subject:"history", min:493.4, max:495.7, avg:495, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2025, info:"环境艺术设计，录取2，平均478", subject:"history", min:471, max:485.25, avg:478, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2024, info:"环境艺术设计，录取5，平均473", subject:"history", min:468.75, max:474.5, avg:473, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2025, info:"绘画，录取4，平均483", subject:"history", min:480.75, max:487.75, avg:483, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2024, info:"绘画，录取4，平均480", subject:"history", min:479.25, max:481.25, avg:480, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2023, info:"绘画，录取4，平均497", subject:"history", min:496.5, max:498.1, avg:497, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取6，平均477", subject:"history", min:475, max:479.75, avg:477, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取6，平均473", subject:"history", min:469, max:477, avg:473, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取4，平均493", subject:"history", min:492.4, max:493.7, avg:493, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2025, info:"数字动画，录取5，平均481", subject:"history", min:480, max:482.5, avg:481, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2024, info:"数字动画，录取5，平均480", subject:"history", min:477.75, max:486.75, avg:480, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2023, info:"数字动画，录取4，平均496", subject:"history", min:495, max:496.4, avg:496, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取8，平均474", subject:"history", min:473.5, max:476.25, avg:474, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取8，平均473", subject:"history", min:470.5, max:477, avg:473, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取8，平均489", subject:"history", min:484.2, max:495.6, avg:489, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2025, info:"陶瓷艺术设计，录取8，平均474", subject:"history", min:473.5, max:476.25, avg:474, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2024, info:"陶瓷艺术设计，录取8，平均473", subject:"history", min:470.5, max:477, avg:473, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"景德镇艺术职业大学", province:"", level:"官方数据", year:2023, info:"陶瓷艺术设计，录取8，平均489", subject:"history", min:484.2, max:495.6, avg:489, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"九江学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取4，平均502", subject:"history", min:499.5, max:505, avg:502, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"九江学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取4，平均501", subject:"history", min:498.25, max:503.25, avg:501, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"九江学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取6，平均514", subject:"history", min:512.6, max:515.4, avg:514, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"九江学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均500", subject:"history", min:499, max:501.5, avg:500, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"九江学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均497", subject:"history", min:496, max:499.75, avg:497, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"九江学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均512", subject:"history", min:511.7, max:512.9, avg:512, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"九江学院", province:"", level:"官方数据", year:2025, info:"绘画，录取3，平均497", subject:"history", min:495.75, max:497.5, avg:497, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"九江学院", province:"", level:"官方数据", year:2024, info:"绘画，录取3，平均498", subject:"history", min:497, max:498.75, avg:498, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"九江学院", province:"", level:"官方数据", year:2023, info:"绘画，录取3，平均515", subject:"history", min:512.5, max:516.8, avg:515, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"九江学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计 (中外合作办学)，录取3，平均497", subject:"history", min:496, max:497.25, avg:497, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"九江学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计 (中外合作办学)，录取3，平均496", subject:"history", min:495.25, max:496.75, avg:496, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"九江学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计 (中外合作办学)，录取3，平均512", subject:"history", min:510.4, max:513.1, avg:512, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"喀什大学", province:"", level:"官方数据", year:2025, info:"美术学，录取3，平均503", subject:"history", min:491.25, max:518, avg:503, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"昆明城市学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均429", subject:"history", min:429, max:429, avg:429, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"昆明城市学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取6，平均450", subject:"history", min:441.25, max:457.75, avg:450, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"昆明城市学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均481", subject:"history", min:479.5, max:482.7, avg:481, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"昆明城市学院", province:"", level:"官方数据", year:2025, info:"美术学，录取1，平均437", subject:"history", min:436.5, max:436.5, avg:437, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"昆明城市学院", province:"", level:"官方数据", year:2024, info:"美术学，录取7，平均451", subject:"history", min:428, max:467.25, avg:451, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"昆明城市学院", province:"", level:"官方数据", year:2023, info:"美术学，录取3，平均489", subject:"history", min:487.8, max:491.5, avg:489, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"昆明城市学院", province:"", level:"官方数据", year:2024, info:"摄影，录取3，平均447", subject:"history", min:438.5, max:453.75, avg:447, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"昆明城市学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取6，平均449", subject:"history", min:439.5, max:464, avg:449, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"昆明城市学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均464", subject:"history", min:459.75, max:473.75, avg:464, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"昆明城市学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均485", subject:"history", min:483.6, max:487.5, avg:485, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"昆明城市学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均456", subject:"history", min:450, max:461.75, avg:456, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"昆明城市学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取5，平均457", subject:"history", min:449.75, max:467, avg:457, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"昆明传媒学院", province:"", level:"官方数据", year:2024, info:"美术学 (师范类)，录取9，平均480", subject:"history", min:473.5, max:486.75, avg:480, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"昆明传媒学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取12，平均462", subject:"history", min:454.25, max:475.5, avg:462, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"昆明传媒学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均473", subject:"history", min:470.5, max:476.75, avg:473, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"昆明文理学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均452", subject:"history", min:448.5, max:455.5, avg:452, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"昆明文理学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均473", subject:"history", min:470.8, max:475.2, avg:473, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"兰州大学", province:"甘肃", level:"985", year:2025, info:"环境设计 (中外合作办学)，录取5，平均532", subject:"history", min:530.75, max:534.5, avg:532, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official","coop"]},
      {school:"兰州大学", province:"甘肃", level:"985", year:2024, info:"环境设计 (中外合作办学)，录取5，平均516", subject:"history", min:511.25, max:519, avg:516, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official","coop"]},
      {school:"兰州大学", province:"甘肃", level:"985", year:2025, info:"视觉传达设计 (中外合作办学)，录取5，平均546", subject:"history", min:539, max:554.5, avg:546, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official","coop"]},
      {school:"兰州大学", province:"甘肃", level:"985", year:2024, info:"视觉传达设计 (中外合作办学)，录取5，平均535", subject:"history", min:531.25, max:542.25, avg:535, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official","coop"]},
      {school:"兰州交通大学", province:"", level:"官方数据", year:2025, info:"产品设计，录取1，平均520", subject:"history", min:520, max:520, avg:520, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"兰州交通大学", province:"", level:"官方数据", year:2025, info:"动画，录取1，平均510", subject:"history", min:510.25, max:510.25, avg:510, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"兰州交通大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均516", subject:"history", min:515.5, max:515.5, avg:516, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"兰州交通大学", province:"", level:"官方数据", year:2025, info:"绘画，录取1，平均510", subject:"history", min:510.25, max:510.25, avg:510, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"兰州交通大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取1，平均523", subject:"history", min:522.75, max:522.75, avg:523, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取4，平均449", subject:"history", min:448.5, max:485, avg:449, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取2，平均457", subject:"history", min:455.25, max:458.5, avg:457, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取2，平均468", subject:"history", min:465, max:471.2, avg:468, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2024, info:"动画，录取4，平均446", subject:"history", min:441.75, max:448, avg:446, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2023, info:"动画，录取4，平均476", subject:"history", min:472, max:478.7, avg:476, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取2，平均441", subject:"history", min:431.25, max:450.75, avg:441, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取2，平均460", subject:"history", min:457.9, max:461.5, avg:460, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均437", subject:"history", min:430.25, max:443.5, avg:437, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均471", subject:"history", min:465.7, max:479.5, avg:471, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2025, info:"美术学，录取1，平均437", subject:"history", min:436.75, max:436.75, avg:437, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2024, info:"美术学，录取4，平均448", subject:"history", min:444.5, max:451, avg:448, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2023, info:"美术学，录取2，平均476", subject:"history", min:469.5, max:482.5, avg:476, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取4，平均446", subject:"history", min:427.5, max:459.75, avg:446, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均452", subject:"history", min:450.25, max:454, avg:452, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取5，平均478", subject:"history", min:471.7, max:482.2, avg:478, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取4，平均446", subject:"history", min:437, max:453.25, avg:446, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取4，平均458", subject:"history", min:455, max:459.5, avg:458, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均481", subject:"history", min:480.2, max:481.4, avg:481, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽水学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均503", subject:"history", min:501.75, max:505.5, avg:503, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽水学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均503", subject:"history", min:502.5, max:503.5, avg:503, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽水学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均519", subject:"history", min:518.4, max:518.9, avg:519, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽水学院", province:"", level:"官方数据", year:2025, info:"美术学(师范)，录取3，平均509", subject:"history", min:508.25, max:509.75, avg:509, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽水学院", province:"", level:"官方数据", year:2024, info:"美术学(师范)，录取3，平均506", subject:"history", min:505.5, max:505.75, avg:506, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽水学院", province:"", level:"官方数据", year:2023, info:"美术学(师范)，录取3，平均523", subject:"history", min:521.9, max:523.6, avg:523, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽水学院", province:"", level:"官方数据", year:2025, info:"摄影，录取6，平均496", subject:"history", min:491.5, max:504.25, avg:496, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽水学院", province:"", level:"官方数据", year:2024, info:"摄影，录取6，平均499", subject:"history", min:491.75, max:506, avg:499, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽水学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均514", subject:"history", min:513.25, max:513.75, avg:514, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽水学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均510", subject:"history", min:507.5, max:512.5, avg:510, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽水学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均524", subject:"history", min:523.3, max:524, avg:524, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽水学院", province:"", level:"官方数据", year:2025, info:"陶盗艺术设计，录取2，平均507", subject:"history", min:503.5, max:509.5, avg:507, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽水学院", province:"", level:"官方数据", year:2024, info:"陶盗艺术设计，录取2，平均500", subject:"history", min:500, max:500.5, avg:500, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"丽水学院", province:"", level:"官方数据", year:2023, info:"陶盗艺术设计，录取2，平均516", subject:"history", min:516.3, max:516.5, avg:516, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"辽宁传媒学院", province:"", level:"官方数据", year:2025, info:"动画，录取2，平均468", subject:"history", min:463.25, max:473.25, avg:468, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"辽宁传媒学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均450", subject:"history", min:425, max:475.75, avg:450, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"柳州工学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取2，平均448", subject:"history", min:448.25, max:448.5, avg:448, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"柳州工学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取20，平均458", subject:"history", min:445.5, max:472.75, avg:458, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"柳州工学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取10，平均485", subject:"history", min:479.6, max:490.5, avg:485, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"柳州工学院", province:"", level:"官方数据", year:2025, info:"动画，录取5，平均459", subject:"history", min:434, max:483, avg:459, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"柳州工学院", province:"", level:"官方数据", year:2024, info:"动画，录取10，平均459", subject:"history", min:442.75, max:472.5, avg:459, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"柳州工学院", province:"", level:"官方数据", year:2023, info:"动画，录取10，平均488", subject:"history", min:486.3, max:490.1, avg:488, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"柳州工学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取1，平均445", subject:"history", min:445, max:445, avg:445, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"柳州工学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取15，平均431", subject:"history", min:412.5, max:444.75, avg:431, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"柳州工学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取10，平均476", subject:"history", min:469.4, max:483.9, avg:476, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"柳州工学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取15，平均449", subject:"history", min:434.5, max:462, avg:449, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"柳州工学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取10，平均487", subject:"history", min:480.4, max:498.1, avg:487, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"柳州工学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取15，平均457", subject:"history", min:450.5, max:465.5, avg:457, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"柳州工学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取20，平均470", subject:"history", min:460.75, max:479.75, avg:470, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"柳州工学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取10，平均493", subject:"history", min:490.2, max:495.2, avg:493, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"陇东学院", province:"", level:"官方数据", year:2023, info:"美术学，录取1，平均507", subject:"history", min:507, max:507, avg:507, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"陇东学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取1，平均509", subject:"history", min:508.7, max:508.7, avg:509, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌大学", province:"江西", level:"211/双一流", year:2025, info:"环境设计，录取4，平均551", subject:"history", min:547.75, max:555.5, avg:551, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"南昌大学", province:"江西", level:"211/双一流", year:2024, info:"环境设计，录取5，平均547", subject:"history", min:544, max:554, avg:547, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"南昌大学", province:"江西", level:"211/双一流", year:2025, info:"绘画，录取2，平均552", subject:"history", min:549.25, max:554, avg:552, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"南昌大学", province:"江西", level:"211/双一流", year:2024, info:"绘画，录取2，平均546", subject:"history", min:545.25, max:546.5, avg:546, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"南昌大学", province:"江西", level:"211/双一流", year:2023, info:"绘画，录取3，平均561", subject:"history", min:555.5, max:566.2, avg:561, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"南昌大学", province:"江西", level:"211/双一流", year:2023, info:"设计学类，录取5，平均561", subject:"history", min:557.9, max:566.2, avg:561, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"南昌大学共青学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取5，平均484", subject:"history", min:482.75, max:486.75, avg:484, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌大学共青学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取5，平均483", subject:"history", min:481.75, max:485, avg:483, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌大学共青学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取5，平均499", subject:"history", min:498, max:499.6, avg:499, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌大学共青学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取8，平均481", subject:"history", min:479.75, max:484.75, avg:481, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌大学共青学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取8，平均481", subject:"history", min:479.5, max:483.75, avg:481, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌大学共青学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取8，平均496", subject:"history", min:494.3, max:499.2, avg:496, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌大学共青学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取8，平均482", subject:"history", min:480.75, max:483.5, avg:482, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌大学共青学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取8，平均481", subject:"history", min:480.5, max:482.75, avg:481, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌大学共青学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取8，平均498", subject:"history", min:498.1, max:498.7, avg:498, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌大学科学技术学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取24，平均488", subject:"history", min:483.75, max:499.25, avg:488, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌大学科学技术学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取24，平均485", subject:"history", min:482, max:493.75, avg:485, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌大学科学技术学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取24，平均501", subject:"history", min:499.6, max:505.7, avg:501, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌工学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取2，平均471", subject:"history", min:467.25, max:475.25, avg:471, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌工学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取6，平均465", subject:"history", min:457.75, max:477, avg:465, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌工学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取2，平均476", subject:"history", min:475.2, max:476.7, avg:476, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌工学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均465", subject:"history", min:465, max:465, avg:465, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌工学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均470", subject:"history", min:468.5, max:470.75, avg:470, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌工学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均481", subject:"history", min:478.1, max:483, avg:481, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌工学院", province:"", level:"官方数据", year:2025, info:"摄影，录取2，平均435", subject:"history", min:425, max:442.25, avg:435, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌工学院", province:"", level:"官方数据", year:2024, info:"摄影，录取7，平均442", subject:"history", min:421.75, max:459, avg:442, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌工学院", province:"", level:"官方数据", year:2023, info:"摄影，录取5，平均463", subject:"history", min:461, max:465.7, avg:463, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌工学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均470", subject:"history", min:466.25, max:472.75, avg:470, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌工学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均483", subject:"history", min:481.7, max:484.3, avg:483, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学", province:"", level:"官方数据", year:2025, info:"动画，录取3，平均533", subject:"history", min:530.75, max:532, avg:533, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学", province:"", level:"官方数据", year:2024, info:"动画，录取2，平均527", subject:"history", min:526.5, max:527.75, avg:527, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学", province:"", level:"官方数据", year:2023, info:"动画，录取2，平均539", subject:"history", min:538.3, max:539.2, avg:539, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均527", subject:"history", min:526, max:528.75, avg:527, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均520", subject:"history", min:519.75, max:519.75, avg:520, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均536", subject:"history", min:535.9, max:536.8, avg:536, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均528", subject:"history", min:526.75, max:528.25, avg:528, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均540", subject:"history", min:539.8, max:539.8, avg:540, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学科技学院", province:"", level:"官方数据", year:2025, info:"动画，录取6，平均488", subject:"history", min:484.5, max:494.75, avg:488, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学科技学院", province:"", level:"官方数据", year:2024, info:"动画，录取6，平均484", subject:"history", min:482.5, max:485.75, avg:484, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学科技学院", province:"", level:"官方数据", year:2023, info:"动画，录取6，平均502", subject:"history", min:500, max:506.2, avg:502, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学科技学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取6，平均499", subject:"history", min:499.1, max:499.9, avg:499, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学科技学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取6，平均488", subject:"history", min:486.25, max:490.25, avg:488, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学科技学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取6，平均488", subject:"history", min:485.75, max:495.25, avg:488, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学科技学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取6，平均502", subject:"history", min:500.5, max:504.9, avg:502, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌理工学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取1，平均481", subject:"history", min:481, max:481, avg:481, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌理工学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取1，平均499", subject:"history", min:499, max:499, avg:499, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌理工学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均475", subject:"history", min:474.75, max:474.75, avg:475, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌理工学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取1，平均480", subject:"history", min:479.75, max:479.75, avg:480, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌理工学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均480", subject:"history", min:479.75, max:479.75, avg:480, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌理工学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均480", subject:"history", min:479.75, max:479.75, avg:480, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌师范学院", province:"", level:"官方数据", year:2025, info:"美术学，录取2，平均519", subject:"history", min:518.5, max:518.75, avg:519, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌师范学院", province:"", level:"官方数据", year:2024, info:"美术学，录取2，平均517", subject:"history", min:516.25, max:516.75, avg:517, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌师范学院", province:"", level:"官方数据", year:2023, info:"美术学，录取2，平均529", subject:"history", min:527.7, max:529.5, avg:529, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌应用技术师范学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均494", subject:"history", min:492.6, max:495.3, avg:494, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌应用技术师范学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均481", subject:"history", min:481.25, max:481.5, avg:481, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌应用技术师范学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均484", subject:"history", min:481.75, max:485.25, avg:484, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌应用技术师范学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取4，平均497", subject:"history", min:495.3, max:498.5, avg:497, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌职业大学", province:"", level:"官方数据", year:2025, info:"工艺美术，录取2，平均444", subject:"history", min:439, max:449, avg:444, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌职业大学", province:"", level:"官方数据", year:2024, info:"工艺美术，录取2，平均456", subject:"history", min:452, max:459.25, avg:456, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌职业大学", province:"", level:"官方数据", year:2023, info:"工艺美术，录取2，平均471", subject:"history", min:471.2, max:471.5, avg:471, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌职业大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均475", subject:"history", min:471.25, max:478, avg:475, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌职业大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均469", subject:"history", min:462.75, max:475, avg:469, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌职业大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均477", subject:"history", min:474.5, max:478.7, avg:477, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌职业大学", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均465", subject:"history", min:463.75, max:466, avg:465, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌职业大学", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均468", subject:"history", min:463.75, max:472.25, avg:468, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南昌职业大学", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均480", subject:"history", min:476.2, max:484.2, avg:480, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南华大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均523", subject:"history", min:520, max:526.25, avg:523, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南华大学", province:"", level:"官方数据", year:2024, info:"设计学类，录取5，平均525", subject:"history", min:522.75, max:531.5, avg:525, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南华大学", province:"", level:"官方数据", year:2023, info:"设计学类，录取5，平均536", subject:"history", min:534.2, max:539.1, avg:536, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南华大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均529", subject:"history", min:528.5, max:528.5, avg:529, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南华大学", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均531", subject:"history", min:530, max:531.25, avg:531, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南京财经大学", province:"江苏", level:"公办", year:2025, info:"环境设计，录取3，平均536", subject:"history", min:535.5, max:537, avg:536, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京财经大学", province:"江苏", level:"公办", year:2024, info:"环境设计，录取3，平均535", subject:"history", min:533.25, max:536.5, avg:535, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京财经大学", province:"江苏", level:"公办", year:2023, info:"环境设计，录取3，平均550", subject:"history", min:548.4, max:551.4, avg:550, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京财经大学", province:"江苏", level:"公办", year:2025, info:"视觉传达设计，录取3，平均545", subject:"history", min:541.5, max:550, avg:545, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京财经大学", province:"江苏", level:"公办", year:2024, info:"视觉传达设计，录取3，平均537", subject:"history", min:536.75, max:536.75, avg:537, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京财经大学", province:"江苏", level:"公办", year:2023, info:"视觉传达设计，录取3，平均551", subject:"history", min:550.7, max:551.7, avg:551, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京传媒学院", province:"江苏", level:"民办/传媒设计", year:2023, info:"动画，录取2，平均534", subject:"history", min:353.36, max:535, avg:534, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["private","official"]},
      {school:"南京传媒学院", province:"江苏", level:"民办/传媒设计", year:2024, info:"设计学类，录取2，平均524", subject:"history", min:522.25, max:526.5, avg:524, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["private","official"]},
      {school:"南京传媒学院", province:"江苏", level:"民办/传媒设计", year:2023, info:"设计学类，录取2，平均535", subject:"history", min:353.31, max:536, avg:535, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["private","official"]},
      {school:"南京传媒学院", province:"江苏", level:"民办/传媒设计", year:2025, info:"摄影，录取2，平均516", subject:"history", min:504.5, max:526.5, avg:516, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["private","official"]},
      {school:"南京传媒学院", province:"江苏", level:"民办/传媒设计", year:2024, info:"摄影，录取2，平均510", subject:"history", min:506.25, max:514.25, avg:510, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["private","official"]},
      {school:"南京传媒学院", province:"江苏", level:"民办/传媒设计", year:2025, info:"视觉传达设计，录取2，平均521", subject:"history", min:520.5, max:521, avg:521, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["private","official"]},
      {school:"南京工程学院", province:"", level:"官方数据", year:2025, info:"动画，录取4，平均526", subject:"history", min:524.25, max:529.75, avg:526, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南京工程学院", province:"", level:"官方数据", year:2025, info:"设计学类，录取6，平均526", subject:"history", min:523.75, max:529.75, avg:526, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南京工程学院", province:"", level:"官方数据", year:2024, info:"设计学类，录取10，平均521", subject:"history", min:518, max:525.25, avg:521, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南京工程学院", province:"", level:"官方数据", year:2023, info:"设计学类，录取7，平均534", subject:"history", min:533.2, max:537.3, avg:534, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南京工业大学", province:"江苏", level:"公办", year:2024, info:"产品设计，录取1，平均538", subject:"history", min:537.75, max:537.75, avg:538, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京工业大学", province:"江苏", level:"公办", year:2025, info:"环境设计，录取1，平均538", subject:"history", min:538.25, max:538.25, avg:538, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京工业大学", province:"江苏", level:"公办", year:2023, info:"设计学类，录取3，平均555", subject:"history", min:555, max:555.7, avg:555, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京工业大学", province:"江苏", level:"公办", year:2025, info:"视觉传达设计，录取1，平均551", subject:"history", min:551, max:551, avg:551, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京工业大学", province:"江苏", level:"公办", year:2024, info:"视觉传达设计，录取1，平均546", subject:"history", min:546, max:546, avg:546, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京工业大学", province:"江苏", level:"公办", year:2025, info:"艺术与科技，录取1，平均547", subject:"history", min:546.5, max:546.5, avg:547, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京工业大学", province:"江苏", level:"公办", year:2024, info:"艺术与科技，录取1，平均544", subject:"history", min:543.75, max:543.75, avg:544, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京航空航天大学金城学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取4，平均494", subject:"history", min:491.5, max:499.25, avg:494, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南京航空航天大学金城学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均503", subject:"history", min:499.75, max:509.75, avg:503, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南京航空航天大学金城学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均498", subject:"history", min:491.75, max:504, avg:498, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南京航空航天大学金城学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取4，平均508", subject:"history", min:506.3, max:509.7, avg:508, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南京林业大学", province:"江苏", level:"双一流", year:2025, info:"设计学类，录取8，平均547", subject:"history", min:545.5, max:551, avg:547, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"南京林业大学", province:"江苏", level:"双一流", year:2024, info:"设计学类，录取8，平均544", subject:"history", min:539.75, max:551.25, avg:544, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"南京林业大学", province:"江苏", level:"双一流", year:2023, info:"设计学类，录取8，平均556", subject:"history", min:553.4, max:565, avg:556, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"南京师范大学", province:"", level:"官方数据", year:2025, info:"跨媒体艺术，录取2，平均580", subject:"history", min:579.5, max:580, avg:580, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南京师范大学", province:"", level:"官方数据", year:2024, info:"跨媒体艺术，录取2，平均575", subject:"history", min:574, max:575, avg:575, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南京师范大学", province:"", level:"官方数据", year:2023, info:"跨媒体艺术，录取2，平均576", subject:"history", min:575.5, max:577.3, avg:576, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南京师范大学", province:"", level:"官方数据", year:2025, info:"美术学类，录取5，平均584", subject:"history", min:580, max:587.75, avg:584, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南京师范大学", province:"", level:"官方数据", year:2024, info:"美术学类，录取5，平均575", subject:"history", min:574, max:576.5, avg:575, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南京师范大学", province:"", level:"官方数据", year:2023, info:"美术学类 (师范)，录取5，平均581", subject:"history", min:577.7, max:586, avg:581, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南京师范大学", province:"", level:"官方数据", year:2025, info:"设计学类，录取3，平均585", subject:"history", min:584, max:586.5, avg:585, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南京师范大学", province:"", level:"官方数据", year:2024, info:"设计学类，录取3，平均577", subject:"history", min:576.75, max:577.5, avg:577, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南京师范大学", province:"", level:"官方数据", year:2023, info:"设计学类，录取3，平均581", subject:"history", min:580.6, max:581.9, avg:581, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2025, info:"产品设计，录取1，平均568", subject:"history", min:568.25, max:568.25, avg:568, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2024, info:"产品设计，录取1，平均563", subject:"history", min:563.25, max:563.25, avg:563, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2025, info:"雕塑，录取1，平均548", subject:"history", min:547.75, max:547.75, avg:548, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2024, info:"雕塑，录取1，平均543", subject:"history", min:543.25, max:543.25, avg:543, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2025, info:"动画，录取2，平均574", subject:"history", min:573, max:574.75, avg:574, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2024, info:"动画，录取2，平均565", subject:"history", min:564.25, max:565, avg:565, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2025, info:"服装与服饰设计，录取1，平均563", subject:"history", min:562.5, max:562.5, avg:563, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2024, info:"服装与服饰设计，录取1，平均553", subject:"history", min:552.5, max:552.5, avg:553, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2025, info:"工艺美术，录取2，平均561", subject:"history", min:554.75, max:568, avg:561, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2024, info:"工艺美术，录取2，平均553", subject:"history", min:552.25, max:553, avg:553, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2025, info:"公共艺术，录取2，平均554", subject:"history", min:553.75, max:554, avg:554, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2024, info:"公共艺术，录取2，平均554", subject:"history", min:550.5, max:557.75, avg:554, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2025, info:"环境设计，录取2，平均545", subject:"history", min:544.5, max:545.25, avg:545, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2024, info:"环境设计，录取2，平均544", subject:"history", min:539.25, max:549, avg:544, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2025, info:"绘画，录取2，平均579", subject:"history", min:570.75, max:586.25, avg:579, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2024, info:"绘画，录取2，平均561", subject:"history", min:560, max:562.75, avg:561, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2025, info:"摄影，录取1，平均557", subject:"history", min:557.25, max:557.25, avg:557, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2024, info:"摄影，录取1，平均547", subject:"history", min:546.5, max:546.5, avg:547, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2025, info:"视觉传达设计，录取1，平均573", subject:"history", min:572.5, max:572.5, avg:573, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2024, info:"视觉传达设计，录取1，平均569", subject:"history", min:569, max:569, avg:569, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2025, info:"数字媒体艺术，录取2，平均586", subject:"history", min:584.5, max:586.75, avg:586, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2024, info:"数字媒体艺术，录取2，平均578", subject:"history", min:573.25, max:582.25, avg:578, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2025, info:"戏剧影视美术设计，录取1，平均576", subject:"history", min:575.75, max:575.75, avg:576, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2024, info:"戏剧影视美术设计，录取1，平均573", subject:"history", min:572.5, max:572.5, avg:573, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2025, info:"艺术与科技，录取1，平均573", subject:"history", min:572.5, max:572.5, avg:573, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2024, info:"艺术与科技，录取1，平均569", subject:"history", min:568.75, max:568.75, avg:569, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2025, info:"中国画，录取1，平均559", subject:"history", min:558.75, max:558.75, avg:559, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京艺术学院", province:"江苏", level:"专业艺术院校", year:2024, info:"中国画，录取1，平均555", subject:"history", min:554.75, max:554.75, avg:555, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"南京邮电大学", province:"江苏", level:"双一流", year:2024, info:"动画，录取4，平均546", subject:"history", min:543.5, max:551.5, avg:546, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"南京邮电大学", province:"江苏", level:"双一流", year:2023, info:"动画，录取4，平均554", subject:"history", min:553.2, max:555.2, avg:554, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"南京邮电大学", province:"江苏", level:"双一流", year:2025, info:"数字媒体艺术，录取8，平均566", subject:"history", min:560.75, max:571.75, avg:566, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"南京邮电大学", province:"江苏", level:"双一流", year:2024, info:"数字媒体艺术，录取4，平均563", subject:"history", min:557.5, max:571, avg:563, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"南京邮电大学", province:"江苏", level:"双一流", year:2023, info:"数字媒体艺术，录取4，平均562", subject:"history", min:561.5, max:563.1, avg:562, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"南宁师范大学", province:"", level:"官方数据", year:2025, info:"美术学，录取2，平均517", subject:"history", min:517.25, max:517.5, avg:517, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南宁师范大学", province:"", level:"官方数据", year:2024, info:"美术学，录取2，平均515", subject:"history", min:514.5, max:515, avg:515, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南宁师范大学", province:"", level:"官方数据", year:2023, info:"美术学，录取2，平均529", subject:"history", min:528.8, max:529.2, avg:529, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南宁师范大学师园学院", province:"", level:"官方数据", year:2025, info:"美术学，录取2，平均479", subject:"history", min:477.25, max:480.5, avg:479, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南宁师范大学师园学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均483", subject:"history", min:482, max:483.5, avg:483, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南宁学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均482", subject:"history", min:481.4, max:482.6, avg:482, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南宁学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均479", subject:"history", min:478, max:479.5, avg:479, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南宁学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均481", subject:"history", min:478.25, max:483.75, avg:481, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南宁学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均492", subject:"history", min:489.8, max:493.5, avg:492, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南宁学院", province:"", level:"官方数据", year:2025, info:"新媒体艺术，录取2，平均477", subject:"history", min:476.5, max:477, avg:477, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南宁学院", province:"", level:"官方数据", year:2024, info:"新媒体艺术，录取2，平均476", subject:"history", min:475.25, max:477.25, avg:476, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南宁学院", province:"", level:"官方数据", year:2023, info:"新媒体艺术，录取3，平均483", subject:"history", min:481, max:485.1, avg:483, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南通大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均526", subject:"history", min:526.25, max:526.75, avg:526, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南通大学", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均522", subject:"history", min:521.5, max:523.25, avg:522, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南通大学", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均537", subject:"history", min:536.4, max:537.9, avg:537, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南通大学", province:"", level:"官方数据", year:2025, info:"美术学(师范)，录取2，平均535", subject:"history", min:533.25, max:535.75, avg:535, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南通大学", province:"", level:"官方数据", year:2024, info:"美术学(师范)，录取2，平均530", subject:"history", min:528.75, max:530.25, avg:530, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南通大学", province:"", level:"官方数据", year:2023, info:"美术学(师范)，录取3，平均542", subject:"history", min:541.1, max:542.9, avg:542, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南通大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取4，平均535", subject:"history", min:533.75, max:536.25, avg:535, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南通大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取4，平均530", subject:"history", min:528.75, max:531, avg:530, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南通大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取4，平均544", subject:"history", min:541.9, max:549.5, avg:544, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"内蒙古师范大学", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取3，平均507", subject:"history", min:506.25, max:507.25, avg:507, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"内蒙古师范大学", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取3，平均507", subject:"history", min:505.25, max:507.25, avg:507, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"内蒙古师范大学", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取2，平均521", subject:"history", min:519.4, max:521.7, avg:521, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南阳理工学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取4，平均496", subject:"history", min:494, max:497, avg:496, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南阳理工学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均496", subject:"history", min:494, max:498, avg:496, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南阳理工学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均513", subject:"history", min:512.3, max:512.7, avg:513, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"内蒙古师范大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均510", subject:"history", min:508.5, max:512, avg:510, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"内蒙古师范大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均510", subject:"history", min:508, max:511.5, avg:510, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"内蒙古师范大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均527", subject:"history", min:526.9, max:528, avg:527, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南阳师范学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取8，平均502", subject:"history", min:499.5, max:505.5, avg:502, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南阳师范学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取8，平均502", subject:"history", min:499.25, max:508, avg:502, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"南阳师范学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取8，平均518", subject:"history", min:516.6, max:518.9, avg:518, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宁波大学科学技术学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取1，平均496", subject:"history", min:495.75, max:495.75, avg:496, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宁波大学科学技术学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取1，平均494", subject:"history", min:494.25, max:494.25, avg:494, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宁波大学科学技术学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取1，平均510", subject:"history", min:509.7, max:509.7, avg:510, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宁波大学科学技术学院", province:"", level:"官方数据", year:2025, info:"动画，录取1，平均500", subject:"history", min:500.25, max:500.25, avg:500, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宁波大学科学技术学院", province:"", level:"官方数据", year:2024, info:"动画，录取1，平均500", subject:"history", min:499.5, max:499.5, avg:500, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宁波大学科学技术学院", province:"", level:"官方数据", year:2023, info:"动画，录取1，平均504", subject:"history", min:503.6, max:503.6, avg:504, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宁波大学科学技术学院", province:"", level:"官方数据", year:2025, info:"工艺美术，录取2，平均493", subject:"history", min:490.25, max:494.75, avg:493, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宁波大学科学技术学院", province:"", level:"官方数据", year:2024, info:"工艺美术，录取2，平均488", subject:"history", min:488, max:488.25, avg:488, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宁波大学科学技术学院", province:"", level:"官方数据", year:2023, info:"工艺美术，录取2，平均500", subject:"history", min:499.4, max:500, avg:500, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宁波大学科学技术学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均492", subject:"history", min:491.5, max:491.5, avg:492, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宁波大学科学技术学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取1，平均489", subject:"history", min:489.25, max:489.25, avg:489, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宁波大学科学技术学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取1，平均508", subject:"history", min:507.7, max:507.7, avg:508, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宁夏大学", province:"宁夏", level:"211/双一流", year:2025, info:"绘画，录取3，平均536", subject:"history", min:534, max:537.75, avg:536, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"宁夏大学", province:"宁夏", level:"211/双一流", year:2024, info:"绘画，录取3，平均534", subject:"history", min:531, max:535.75, avg:534, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"宁夏大学", province:"宁夏", level:"211/双一流", year:2023, info:"绘画，录取3，平均545", subject:"history", min:543.5, max:548.1, avg:545, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"平顶山学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均487", subject:"history", min:486.75, max:487.25, avg:487, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"平顶山学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均506", subject:"history", min:505.5, max:507.6, avg:506, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"平顶山学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取7，平均492", subject:"history", min:491, max:496, avg:492, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"平顶山学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均492", subject:"history", min:491, max:493.25, avg:492, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"平顶山学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均509", subject:"history", min:501, max:509, avg:509, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"平顶山学院", province:"", level:"官方数据", year:2025, info:"陶瓷艺术设计，录取7，平均489", subject:"history", min:488.25, max:490, avg:489, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"平顶山学院", province:"", level:"官方数据", year:2024, info:"陶瓷艺术设计，录取3，平均488", subject:"history", min:487.75, max:489.75, avg:488, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"平顶山学院", province:"", level:"官方数据", year:2023, info:"陶瓷艺术设计，录取2，平均507", subject:"history", min:506.5, max:507.1, avg:507, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"萍乡学院", province:"", level:"官方数据", year:2025, info:"美术学，录取2，平均495", subject:"history", min:495, max:495.5, avg:495, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"萍乡学院", province:"", level:"官方数据", year:2024, info:"美术学，录取2，平均497", subject:"history", min:496.5, max:496.75, avg:497, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"萍乡学院", province:"", level:"官方数据", year:2023, info:"美术学，录取2，平均514", subject:"history", min:513.1, max:514, avg:514, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"黔南民族师范学院", province:"", level:"官方数据", year:2025, info:"产品设计(中外合作办学冫，录取3，平均480", subject:"history", min:479.25, max:482.25, avg:480, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"黔南民族师范学院", province:"", level:"官方数据", year:2024, info:"产品设计(中外合作办学冫，录取3，平均482", subject:"history", min:481.5, max:482, avg:482, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"黔南民族师范学院", province:"", level:"官方数据", year:2023, info:"产品设计(中外合作办学冫，录取3，平均497", subject:"history", min:494.4, max:501.1, avg:497, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"齐鲁工业大学", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取2，平均517", subject:"history", min:513.75, max:520.5, avg:517, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"齐鲁工业大学", province:"", level:"官方数据", year:2024, info:"设计学类，录取2，平均528", subject:"history", min:527, max:529.25, avg:528, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"齐鲁工业大学", province:"", level:"官方数据", year:2023, info:"设计学类，录取2，平均536", subject:"history", min:535.5, max:536.8, avg:536, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2025, info:"动画，录取3，平均463", subject:"history", min:458.25, max:465.5, avg:463, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2024, info:"动画，录取4，平均468", subject:"history", min:465.75, max:471.25, avg:468, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2023, info:"动画，录取2，平均487", subject:"history", min:487.2, max:487.4, avg:487, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2024, info:"绘画，录取3，平均458", subject:"history", min:454, max:464.5, avg:458, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2023, info:"绘画，录取3，平均479", subject:"history", min:474.6, max:485.9, avg:479, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2024, info:"漫画，录取3，平均446", subject:"history", min:433.75, max:456.25, avg:446, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2023, info:"漫画，录取2，平均477", subject:"history", min:472.8, max:481.3, avg:477, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2025, info:"摄影，录取2，平均460", subject:"history", min:443.25, max:476.75, avg:460, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2024, info:"摄影，录取5，平均446", subject:"history", min:428, max:458.5, avg:446, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2023, info:"摄影，录取5，平均470", subject:"history", min:459.4, max:484.9, avg:470, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取3，平均469", subject:"history", min:467.5, max:470, avg:469, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取3，平均494", subject:"history", min:492, max:496.8, avg:494, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2025, info:"文物保护与修复，录取6，平均459", subject:"history", min:445.25, max:476.5, avg:459, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2024, info:"文物保护与修复，录取3，平均458", subject:"history", min:453, max:462.5, avg:458, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2023, info:"文物保护与修复，录取2，平均477", subject:"history", min:477.3, max:477.5, avg:477, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2025, info:"戏剧影视美术设计，录取4，平均459", subject:"history", min:432, max:486.5, avg:459, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2023, info:"戏剧影视美术设计，录取3，平均495", subject:"history", min:486.8, max:502.5, avg:495, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2023, info:"新媒体艺术，录取3，平均487", subject:"history", min:484.7, max:492.2, avg:487, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2025, info:"影视摄影与制作，录取6，平均443", subject:"history", min:427, max:452.75, avg:443, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛电影学院", province:"", level:"官方数据", year:2024, info:"影视摄影与制作，录取5，平均464", subject:"history", min:459.25, max:473.25, avg:464, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛黄海学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均495", subject:"history", min:490.8, max:498.8, avg:495, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛理工大学", province:"", level:"官方数据", year:2025, info:"产品设计，录取5，平均526", subject:"history", min:524.25, max:530.5, avg:526, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛理工大学", province:"", level:"官方数据", year:2024, info:"产品设计，录取3，平均522", subject:"history", min:520.25, max:523.5, avg:522, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛理工大学", province:"", level:"官方数据", year:2023, info:"产品设计，录取3，平均534", subject:"history", min:533.3, max:535.8, avg:534, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛理工大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取6，平均520", subject:"history", min:516.5, max:524.25, avg:520, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛理工大学", province:"", level:"官方数据", year:2024, info:"环境设计，录取4，平均517", subject:"history", min:515, max:518, avg:517, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛理工大学", province:"", level:"官方数据", year:2023, info:"环境设计，录取5，平均532", subject:"history", min:531.5, max:533.1, avg:532, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛理工大学", province:"", level:"官方数据", year:2025, info:"绘画，录取2，平均515", subject:"history", min:515, max:515, avg:515, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛理工大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均520", subject:"history", min:519.5, max:597.5, avg:520, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"青岛理工大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取1，平均536", subject:"history", min:535.9, max:535.9, avg:536, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"琼台师范学院", province:"", level:"官方数据", year:2025, info:"工艺美术，录取2，平均498", subject:"history", min:498, max:498.5, avg:498, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"琼台师范学院", province:"", level:"官方数据", year:2024, info:"工艺美术，录取2，平均500", subject:"history", min:497.5, max:502, avg:500, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"琼台师范学院", province:"", level:"官方数据", year:2023, info:"工艺美术，录取2，平均512", subject:"history", min:511.5, max:511.7, avg:512, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"琼台师范学院", province:"", level:"官方数据", year:2025, info:"美术学，录取3，平均489", subject:"history", min:486.25, max:492, avg:489, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"琼台师范学院", province:"", level:"官方数据", year:2024, info:"美术学，录取2，平均504", subject:"history", min:503.5, max:504.75, avg:504, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"琼台师范学院", province:"", level:"官方数据", year:2023, info:"美术学，录取2，平均519", subject:"history", min:518.7, max:519.4, avg:519, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三江学院", province:"", level:"官方数据", year:2025, info:"动画，录取12，平均479", subject:"history", min:475.5, max:482.5, avg:479, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三江学院", province:"", level:"官方数据", year:2024, info:"动画，录取12，平均483", subject:"history", min:480, max:489.75, avg:483, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三江学院", province:"", level:"官方数据", year:2023, info:"动画，录取10，平均501", subject:"history", min:499, max:506.5, avg:501, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三江学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取15，平均467", subject:"history", min:458.5, max:475.75, avg:467, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三江学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取12，平均476", subject:"history", min:472.5, max:481, avg:476, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"三江学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取10，平均498", subject:"history", min:496, max:499.8, avg:498, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山东大学威海分校", province:"", level:"官方数据", year:2024, info:"美术学，录取2，平均577", subject:"history", min:576.75, max:577.25, avg:577, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山东大学威海分校", province:"", level:"官方数据", year:2023, info:"美术学，录取2，平均581", subject:"history", min:579.5, max:581.8, avg:581, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山东大学威海分校", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均578", subject:"history", min:577, max:579.75, avg:578, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山东大学威海分校", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均581", subject:"history", min:580.4, max:581.6, avg:581, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2025, info:"包装设计，录取1，平均524", subject:"history", min:524, max:524, avg:524, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2025, info:"产品设计，录取2，平均530", subject:"history", min:530.25, max:530.5, avg:530, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2024, info:"产品设计，录取3，平均531", subject:"history", min:526.25, max:533.5, avg:531, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2025, info:"动画，录取1，平均535", subject:"history", min:535.25, max:535.25, avg:535, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2024, info:"动画，录取3，平均532", subject:"history", min:527.75, max:536.25, avg:532, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2025, info:"服装与服饰设计，录取2，平均526", subject:"history", min:525.25, max:526.25, avg:526, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2024, info:"服装与服饰设计，录取3，平均524", subject:"history", min:519.25, max:527.75, avg:524, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2025, info:"工艺美术，录取3，平均534", subject:"history", min:528, max:540.75, avg:534, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2024, info:"工艺美术，录取3，平均531", subject:"history", min:521.5, max:539, avg:531, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2025, info:"环境设计，录取2，平均529", subject:"history", min:520.75, max:537.25, avg:529, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2024, info:"环境设计，录取2，平均518", subject:"history", min:513.5, max:521.5, avg:518, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2025, info:"摄影，录取1，平均522", subject:"history", min:521.75, max:521.75, avg:522, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2025, info:"视觉传达设计，录取2，平均538", subject:"history", min:538.25, max:538.5, avg:538, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2024, info:"视觉传达设计，录取2，平均535", subject:"history", min:534.25, max:535, avg:535, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2025, info:"戏剧影视美术设计，录取2，平均531", subject:"history", min:527.75, max:534.5, avg:531, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2024, info:"戏剧影视美术设计，录取3，平均523", subject:"history", min:520.5, max:525.25, avg:523, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2025, info:"艺术与科技，录取2，平均535", subject:"history", min:532.75, max:536.25, avg:535, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2024, info:"艺术与科技，录取3，平均530", subject:"history", min:527.75, max:531.5, avg:530, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2025, info:"影视摄影与制作，录取1，平均524", subject:"history", min:523.5, max:523.5, avg:524, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东工艺美术学院", province:"山东", level:"专业艺术院校", year:2024, info:"影视摄影与制作，录取3，平均521", subject:"history", min:517.75, max:523.75, avg:521, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东建筑大学", province:"", level:"官方数据", year:2025, info:"环境设计 (环艺方向)，录取4，平均512", subject:"history", min:511, max:512.75, avg:512, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山东建筑大学", province:"", level:"官方数据", year:2024, info:"环境设计 (环艺方向)，录取4，平均510", subject:"history", min:507.75, max:511.75, avg:510, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山东建筑大学", province:"", level:"官方数据", year:2023, info:"环境设计 (环艺方向)，录取3，平均526", subject:"history", min:524.9, max:526.4, avg:526, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山东建筑大学", province:"", level:"官方数据", year:2025, info:"环境设计 (景观方向)，录取3，平均500", subject:"history", min:499, max:501, avg:500, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山东建筑大学", province:"", level:"官方数据", year:2024, info:"环境设计 (景观方向)，录取3，平均505", subject:"history", min:505, max:505, avg:505, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山东建筑大学", province:"", level:"官方数据", year:2023, info:"环境设计 (景观方向)，录取3，平均521", subject:"history", min:520.6, max:522.7, avg:521, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山东建筑大学", province:"", level:"官方数据", year:2025, info:"环境设计 (中外合作办学)，录取3，平均499", subject:"history", min:497.75, max:501.25, avg:499, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"山东建筑大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均523", subject:"history", min:522.75, max:523, avg:523, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山东建筑大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均515", subject:"history", min:513.5, max:515.75, avg:515, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山东师范大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均524", subject:"history", min:524.25, max:524.25, avg:524, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山东师范大学", province:"", level:"官方数据", year:2024, info:"环境设计，录取1，平均501", subject:"history", min:500.75, max:500.75, avg:501, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山东师范大学", province:"", level:"官方数据", year:2023, info:"环境设计，录取1，平均546", subject:"history", min:545.6, max:545.6, avg:546, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2025, info:"雕塑，录取1，平均518", subject:"history", min:518, max:518, avg:518, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2025, info:"动画，录取1，平均536", subject:"history", min:536, max:536, avg:536, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2024, info:"动画，录取1，平均529", subject:"history", min:529, max:529, avg:529, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2025, info:"工艺美术，录取1，平均524", subject:"history", min:523.75, max:523.75, avg:524, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2025, info:"环境设计，录取1，平均520", subject:"history", min:520.25, max:520.25, avg:520, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2024, info:"环境设计，录取1，平均513", subject:"history", min:512.75, max:512.75, avg:513, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2025, info:"绘画，录取1，平均525", subject:"history", min:525.25, max:525.25, avg:525, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2024, info:"绘画，录取1，平均521", subject:"history", min:521.25, max:521.25, avg:521, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2025, info:"视觉传达设计，录取1，平均542", subject:"history", min:542.25, max:542.25, avg:542, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2024, info:"视觉传达设计，录取1，平均539", subject:"history", min:538.75, max:538.75, avg:539, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2025, info:"戏剧影视美术设计，录取2，平均529", subject:"history", min:528.5, max:529.75, avg:529, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2024, info:"戏剧影视美术设计，录取2，平均525", subject:"history", min:522.5, max:526, avg:525, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2025, info:"影视摄影与制作，录取2，平均522", subject:"history", min:520.5, max:522.75, avg:522, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2024, info:"影视摄影与制作，录取2，平均515", subject:"history", min:507.25, max:522, avg:515, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2025, info:"中国画，录取2，平均521", subject:"history", min:521, max:521.5, avg:521, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2024, info:"中国画，录取2，平均526", subject:"history", min:522.5, max:526, avg:526, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东英才学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取5，平均439", subject:"history", min:433.5, max:442.5, avg:439, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山东英才学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取5，平均470", subject:"history", min:467.1, max:474.5, avg:470, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2025, info:"动画，录取5，平均514", subject:"history", min:506.75, max:530.75, avg:514, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2024, info:"动画，录取5，平均506", subject:"history", min:504.5, max:508.75, avg:506, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2023, info:"动画，录取3，平均522", subject:"history", min:521.7, max:521.9, avg:522, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均530", subject:"history", min:529.3, max:529.8, avg:530, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2025, info:"绘画，录取2，平均510", subject:"history", min:508, max:511, avg:510, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2025, info:"美术学，录取2，平均507", subject:"history", min:504, max:509.75, avg:507, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2024, info:"美术学，录取2，平均504", subject:"history", min:503.5, max:504.75, avg:504, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2023, info:"美术学，录取2，平均519", subject:"history", min:451.7, max:519, avg:519, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均500", subject:"history", min:495, max:501.5, avg:500, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均500", subject:"history", min:498.25, max:501.5, avg:500, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均519", subject:"history", min:516, max:523.2, avg:519, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2025, info:"漫画，录取2，平均513", subject:"history", min:511.75, max:513.75, avg:513, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2024, info:"漫画，录取2，平均513", subject:"history", min:510.5, max:515.25, avg:513, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2023, info:"漫画，录取2，平均532", subject:"history", min:526.5, max:537.1, avg:532, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2024, info:"摄影，录取2，平均498", subject:"history", min:497.5, max:498, avg:498, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2023, info:"摄影，录取3，平均506", subject:"history", min:504.3, max:507.5, avg:506, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均510", subject:"history", min:510, max:510.25, avg:510, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均507", subject:"history", min:506.5, max:507, avg:507, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均524", subject:"history", min:522, max:525.6, avg:524, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2025, info:"戏剧影视美术设计(电影美术方向)，录取3，平均513", subject:"history", min:509.5, max:517.75, avg:513, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2024, info:"戏剧影视美术设计(电影美术方向)，录取3，平均506", subject:"history", min:505.75, max:507.25, avg:506, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"山西传媒学院", province:"", level:"官方数据", year:2023, info:"戏剧影视美术设计(电影美术方向)，录取2，平均522", subject:"history", min:520.5, max:523.1, avg:522, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海大学", province:"上海", level:"211/双一流", year:2025, info:"视觉传达设计，录取2，平均590", subject:"history", min:590.25, max:590.5, avg:590, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"上海大学", province:"上海", level:"211/双一流", year:2024, info:"视觉传达设计，录取2，平均579", subject:"history", min:578.5, max:578.5, avg:579, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"上海大学", province:"上海", level:"211/双一流", year:2025, info:"数字媒体艺术，录取2，平均597", subject:"history", min:594.75, max:598.5, avg:597, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"上海大学", province:"上海", level:"211/双一流", year:2024, info:"数字媒体艺术，录取2，平均585", subject:"history", min:578.5, max:592.25, avg:585, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"上海交通大学", province:"上海", level:"985", year:2024, info:"人居设计，录取4，平均624", subject:"history", min:616.75, max:629.25, avg:624, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"上海交通大学", province:"上海", level:"985", year:2023, info:"人居设计，录取3，平均621", subject:"history", min:610.5, max:634.5, avg:621, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"上海立达学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取5，平均437", subject:"history", min:420.5, max:456, avg:437, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海立达学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取5，平均480", subject:"history", min:473.3, max:488.4, avg:480, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海立达学院", province:"", level:"官方数据", year:2024, info:"摄影，录取2，平均454", subject:"history", min:449.5, max:457.75, avg:454, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海立达学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均475", subject:"history", min:475, max:475.5, avg:475, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海立达学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取15，平均454", subject:"history", min:436.25, max:479.75, avg:454, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海立达学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取13，平均484", subject:"history", min:476.4, max:502.4, avg:484, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取3，平均512", subject:"history", min:508.5, max:514.5, avg:512, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取5，平均513", subject:"history", min:511.5, max:516, avg:513, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取8，平均535", subject:"history", min:530.5, max:540.1, avg:535, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取4，平均510", subject:"history", min:507.25, max:515.5, avg:510, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取6，平均514", subject:"history", min:511.25, max:515.5, avg:514, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取6，平均533", subject:"history", min:528.9, max:540.8, avg:533, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2025, info:"工艺美术，录取5，平均511", subject:"history", min:507, max:516.25, avg:511, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2024, info:"工艺美术，录取5，平均517", subject:"history", min:513, max:519, avg:517, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2023, info:"工艺美术，录取5，平均532", subject:"history", min:529.2, max:537.5, avg:532, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均509", subject:"history", min:505.75, max:513, avg:509, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均532", subject:"history", min:529.2, max:535.1, avg:532, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2025, info:"摄影，录取3，平均517", subject:"history", min:508, max:530.25, avg:517, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2024, info:"摄影，录取3，平均510", subject:"history", min:509, max:511, avg:510, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海外国语大学贤达经济人文学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取4，平均471", subject:"history", min:463, max:475, avg:471, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海外国语大学贤达经济人文学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均488", subject:"history", min:487, max:488, avg:488, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海外国语大学贤达经济人文学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均505", subject:"history", min:504, max:506.6, avg:505, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海外国语大学贤达经济人文学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均481", subject:"history", min:477.25, max:485.75, avg:481, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海外国语大学贤达经济人文学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均492", subject:"history", min:490.5, max:493.75, avg:492, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海外国语大学贤达经济人文学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取4，平均495", subject:"history", min:490.5, max:501.25, avg:495, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海外国语大学贤达经济人文学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均500", subject:"history", min:499.5, max:500.5, avg:500, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上海外国语大学贤达经济人文学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取4，平均509", subject:"history", min:505.7, max:510.2, avg:509, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上侨中侨职业技术大学", province:"", level:"官方数据", year:2024, info:"环境艺术设计，录取2，平均457", subject:"history", min:451, max:463.75, avg:457, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上侨中侨职业技术大学", province:"", level:"官方数据", year:2023, info:"环境艺术设计，录取3，平均471", subject:"history", min:469.3, max:473.5, avg:471, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上侨中侨职业技术大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取1，平均479", subject:"history", min:479.25, max:479.25, avg:479, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上侨中侨职业技术大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均464", subject:"history", min:463.5, max:464.75, avg:464, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上侨中侨职业技术大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均490", subject:"history", min:475, max:503.9, avg:490, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上侨中侨职业技术大学", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均466", subject:"history", min:462.25, max:470.25, avg:466, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上侨中侨职业技术大学", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取3，平均482", subject:"history", min:476, max:493.8, avg:482, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上饶师范学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均496", subject:"history", min:494.25, max:498.75, avg:496, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上饶师范学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均501", subject:"history", min:499.75, max:502, avg:501, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上饶师范学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均517", subject:"history", min:515, max:518.5, avg:517, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上饶师范学院", province:"", level:"官方数据", year:2025, info:"美术学，录取3，平均500", subject:"history", min:498.75, max:501.25, avg:500, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上饶师范学院", province:"", level:"官方数据", year:2024, info:"美术学，录取3，平均504", subject:"history", min:503.5, max:505.25, avg:504, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"上饶师范学院", province:"", level:"官方数据", year:2023, info:"美术学，录取2，平均520", subject:"history", min:519.7, max:520.2, avg:520, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"邵阳学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取4，平均492", subject:"history", min:491.25, max:493.25, avg:492, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"邵阳学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取4，平均492", subject:"history", min:491, max:493.5, avg:492, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"邵阳学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取4，平均510", subject:"history", min:509.2, max:511.4, avg:510, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"邵阳学院", province:"", level:"官方数据", year:2025, info:"美术学，录取3，平均497", subject:"history", min:495, max:498.5, avg:497, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"邵阳学院", province:"", level:"官方数据", year:2024, info:"美术学，录取3，平均498", subject:"history", min:496.75, max:499, avg:498, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"邵阳学院", province:"", level:"官方数据", year:2023, info:"美术学，录取3，平均515", subject:"history", min:513.9, max:517, avg:515, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"邵阳学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均503", subject:"history", min:500, max:508, avg:503, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"邵阳学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均499", subject:"history", min:498.25, max:501.5, avg:499, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"邵阳学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均515", subject:"history", min:514.1, max:517, avg:515, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"沈阳音乐学院", province:"", level:"官方数据", year:2025, info:"影视摄影与制作，录取1，平均511", subject:"history", min:510.5, max:510.5, avg:511, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"沈阳音乐学院", province:"", level:"官方数据", year:2024, info:"影视摄影与制作 (长青校区戏剧影视学院)，录取1，平均506", subject:"history", min:506, max:506, avg:506, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"首都师范大学", province:"北京", level:"双一流", year:2024, info:"美术学 (师范)，录取3，平均571", subject:"history", min:567.75, max:573.25, avg:571, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"首都师范大学", province:"北京", level:"双一流", year:2023, info:"美术学 (师范)，录取3，平均578", subject:"history", min:574.5, max:581.9, avg:578, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"首都师范大学", province:"北京", level:"双一流", year:2025, info:"美术学类，录取7，平均569", subject:"history", min:564.75, max:574.75, avg:569, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"首都师范大学", province:"北京", level:"双一流", year:2024, info:"美术学类，录取5，平均561", subject:"history", min:560, max:562, avg:561, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"首都师范大学", province:"北京", level:"双一流", year:2023, info:"美术学类，录取5，平均571", subject:"history", min:568.3, max:572.4, avg:571, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"首都师范大学", province:"北京", level:"双一流", year:2025, info:"设计学类，录取5，平均573", subject:"history", min:567.5, max:585.75, avg:573, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"首都师范大学", province:"北京", level:"双一流", year:2024, info:"设计学类，录取5，平均564", subject:"history", min:559.5, max:571.25, avg:564, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"首都师范大学", province:"北京", level:"双一流", year:2023, info:"设计学类，录取5，平均571", subject:"history", min:568.3, max:575.2, avg:571, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"四川传媒学院", province:"", level:"官方数据", year:2025, info:"跨媒体艺术，录取3，平均509", subject:"history", min:504.5, max:517, avg:509, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川传媒学院", province:"", level:"官方数据", year:2024, info:"跨媒体艺术，录取3，平均510", subject:"history", min:506.75, max:513.25, avg:510, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川传媒学院", province:"", level:"官方数据", year:2023, info:"漫画，录取1，平均546", subject:"history", min:546.1, max:546.1, avg:546, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川传媒学院", province:"", level:"官方数据", year:2025, info:"戏剧影视美术设计(影视人物造，录取1，平均511", subject:"history", min:511.25, max:511.25, avg:511, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川传媒学院", province:"", level:"官方数据", year:2024, info:"戏剧影视美术设计(影视人物造，录取1，平均511", subject:"history", min:511, max:511, avg:511, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川传媒学院", province:"", level:"官方数据", year:2025, info:"新媒体艺术，录取11，平均510", subject:"history", min:504.75, max:518.75, avg:510, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川传媒学院", province:"", level:"官方数据", year:2024, info:"新媒体艺术，录取1，平均513", subject:"history", min:512.5, max:512.5, avg:513, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川传媒学院", province:"", level:"官方数据", year:2023, info:"新媒体艺术，录取1，平均528", subject:"history", min:528.1, max:528.1, avg:528, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川传媒学院", province:"", level:"官方数据", year:2025, info:"影视摄影与制作(中外合作办学)，录取2，平均491", subject:"history", min:487.5, max:495, avg:491, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"四川传媒学院", province:"", level:"官方数据", year:2024, info:"影视摄影与制作(中外合作办学)，录取1，平均489", subject:"history", min:489.25, max:489.25, avg:489, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"四川大学", province:"四川", level:"985", year:2023, info:"服装与服饰设计，录取3，平均582", subject:"history", min:574.7, max:595.5, avg:582, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"四川大学", province:"四川", level:"985", year:2023, info:"绘画，录取1，平均596", subject:"history", min:596.3, max:596.3, avg:596, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"四川大学", province:"四川", level:"985", year:2025, info:"美术学类，录取2，平均600", subject:"history", min:597.75, max:602.25, avg:600, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"四川大学", province:"四川", level:"985", year:2024, info:"美术学类，录取1，平均592", subject:"history", min:592.25, max:592.25, avg:592, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"四川大学", province:"四川", level:"985", year:2025, info:"设计学类，录取3，平均606", subject:"history", min:604, max:608.25, avg:606, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"四川大学", province:"四川", level:"985", year:2024, info:"设计学类，录取4，平均598", subject:"history", min:593.5, max:600, avg:598, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"四川大学", province:"四川", level:"985", year:2023, info:"视觉传达设计，录取2，平均605", subject:"history", min:604.5, max:605.1, avg:605, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"四川大学锦江学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取4，平均485", subject:"history", min:484.5, max:486.75, avg:485, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川大学锦江学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取5，平均488", subject:"history", min:483.5, max:497, avg:488, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川大学锦江学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取3，平均502", subject:"history", min:502.3, max:502.6, avg:502, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川大学锦江学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取4，平均482", subject:"history", min:480.75, max:484.25, avg:482, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川大学锦江学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取5，平均482", subject:"history", min:481, max:484.25, avg:482, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川大学锦江学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均502", subject:"history", min:501.1, max:502, avg:502, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川大学锦江学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取8，平均486", subject:"history", min:485.5, max:487.25, avg:486, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川大学锦江学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均487", subject:"history", min:485, max:489, avg:487, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川大学锦江学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均510", subject:"history", min:503.1, max:514.6, avg:510, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川电影电视学院", province:"", level:"官方数据", year:2025, info:"公共艺术，录取1，平均479", subject:"history", min:478.75, max:478.75, avg:479, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川电影电视学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均516", subject:"history", min:515.4, max:515.9, avg:516, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川电影电视学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术 (中外合作办学)，录取3，平均471", subject:"history", min:458.5, max:477.5, avg:471, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"四川电影电视学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术 (中外合作办学)，录取13，平均459", subject:"history", min:437.25, max:493, avg:459, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"四川电影电视学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术 (中外合作办学)，录取9，平均478", subject:"history", min:469.4, max:502.4, avg:478, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"四川工商学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取3，平均481", subject:"history", min:480.25, max:481.25, avg:481, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川工商学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取3，平均480", subject:"history", min:480, max:481.25, avg:480, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川工商学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取2，平均499", subject:"history", min:499.2, max:499.3, avg:499, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川工商学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均477", subject:"history", min:477, max:477.75, avg:477, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川工商学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均480", subject:"history", min:478.75, max:480.75, avg:480, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川工商学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均499", subject:"history", min:499, max:499.1, avg:499, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川工商学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均484", subject:"history", min:483.25, max:485.25, avg:484, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川工商学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均483", subject:"history", min:482.25, max:483.75, avg:483, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川工商学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均503", subject:"history", min:502.1, max:503.3, avg:503, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川旅游学院", province:"四川", level:"公办", year:2025, info:"工艺美术，录取3，平均501", subject:"history", min:498.25, max:502.5, avg:501, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"四川旅游学院", province:"四川", level:"公办", year:2024, info:"工艺美术，录取2，平均502", subject:"history", min:497.25, max:506.25, avg:502, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"四川美术学院", province:"重庆", level:"专业艺术院校", year:2025, info:"美术教育，录取1，平均579", subject:"history", min:579, max:579, avg:579, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"四川农业大学", province:"四川", level:"211/双一流", year:2025, info:"产品设计，录取5，平均541", subject:"history", min:539.25, max:541.5, avg:541, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"四川农业大学", province:"四川", level:"211/双一流", year:2024, info:"产品设计，录取5，平均538", subject:"history", min:536, max:541, avg:538, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"四川农业大学", province:"四川", level:"211/双一流", year:2023, info:"产品设计，录取5，平均548", subject:"history", min:544.8, max:553.9, avg:548, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"四川农业大学", province:"四川", level:"211/双一流", year:2025, info:"环境设计，录取5，平均538", subject:"history", min:537.5, max:538.75, avg:538, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"四川农业大学", province:"四川", level:"211/双一流", year:2024, info:"环境设计，录取5，平均536", subject:"history", min:532.5, max:543, avg:536, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"四川农业大学", province:"四川", level:"211/双一流", year:2023, info:"环境设计，录取5，平均554", subject:"history", min:551.6, max:560.8, avg:554, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"四川农业大学", province:"四川", level:"211/双一流", year:2025, info:"视觉传达设计，录取5，平均547", subject:"history", min:545, max:548.25, avg:547, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"四川农业大学", province:"四川", level:"211/双一流", year:2024, info:"视觉传达设计，录取5，平均544", subject:"history", min:542, max:545.25, avg:544, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"四川农业大学", province:"四川", level:"211/双一流", year:2023, info:"视觉传达设计，录取5，平均553", subject:"history", min:551.3, max:554.7, avg:553, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"四川农业大学", province:"四川", level:"211/双一流", year:2025, info:"数字媒体艺术，录取5，平均547", subject:"history", min:545.75, max:548.25, avg:547, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"四川农业大学", province:"四川", level:"211/双一流", year:2024, info:"数字媒体艺术，录取5，平均543", subject:"history", min:541.5, max:545.5, avg:543, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"四川农业大学", province:"四川", level:"211/双一流", year:2023, info:"数字媒体艺术，录取5，平均553", subject:"history", min:550.2, max:557.3, avg:553, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"四川师范大学", province:"四川", level:"公办师范", year:2024, info:"产品设计，录取3，平均535", subject:"history", min:531, max:540, avg:535, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"四川师范大学", province:"四川", level:"公办师范", year:2023, info:"产品设计，录取4，平均546", subject:"history", min:543.9, max:549, avg:546, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"四川师范大学", province:"四川", level:"公办师范", year:2025, info:"美术学，录取3，平均537", subject:"history", min:536.25, max:539.5, avg:537, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"四川师范大学", province:"四川", level:"公办师范", year:2024, info:"美术学，录取3，平均536", subject:"history", min:531.25, max:538.5, avg:536, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"四川师范大学", province:"四川", level:"公办师范", year:2025, info:"数字媒体艺术，录取2，平均537", subject:"history", min:537, max:537.75, avg:537, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"四川师范大学", province:"四川", level:"公办师范", year:2024, info:"数字媒体艺术，录取3，平均533", subject:"history", min:531.75, max:533.25, avg:533, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"四川文化艺术学院", province:"", level:"官方数据", year:2025, info:"动画，录取1，平均494", subject:"history", min:493.75, max:493.75, avg:494, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川文化艺术学院", province:"", level:"官方数据", year:2024, info:"动画，录取1，平均481", subject:"history", min:480.75, max:480.75, avg:481, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川文化艺术学院", province:"", level:"官方数据", year:2024, info:"绘画，录取1，平均484", subject:"history", min:483.5, max:483.5, avg:484, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川文化艺术学院", province:"", level:"官方数据", year:2023, info:"绘画，录取1，平均502", subject:"history", min:501.8, max:501.8, avg:502, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川文化艺术学院", province:"", level:"官方数据", year:2025, info:"摄影，录取2，平均473", subject:"history", min:467.75, max:478, avg:473, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川文化艺术学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计 (中外合作办学)，录取1，平均449", subject:"history", min:448.75, max:448.75, avg:449, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"四川文化艺术学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计 (中外合作办学)，录取6，平均440", subject:"history", min:411.75, max:474.75, avg:440, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"四川文化艺术学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计 (中外合作办学)，录取8，平均472", subject:"history", min:444.2, max:496.1, avg:472, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"四川文化艺术学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取1，平均490", subject:"history", min:490, max:490, avg:490, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川文化艺术学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取1，平均493", subject:"history", min:492.75, max:492.75, avg:493, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川文化艺术学院", province:"", level:"官方数据", year:2024, info:"艺术设计学，录取1，平均482", subject:"history", min:482, max:482, avg:482, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川文化艺术学院", province:"", level:"官方数据", year:2023, info:"艺术设计学，录取1，平均504", subject:"history", min:504.2, max:504.2, avg:504, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川音乐学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取1，平均531", subject:"history", min:531, max:531, avg:531, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川音乐学院", province:"", level:"官方数据", year:2025, info:"动画，录取2，平均541", subject:"history", min:540.5, max:541.25, avg:541, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"四川音乐学院", province:"", level:"官方数据", year:2025, info:"绘画，录取2，平均535", subject:"history", min:531.75, max:537.75, avg:535, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津城建大学", province:"", level:"官方数据", year:2025, info:"设计学类，录取4，平均513", subject:"history", min:511.25, max:513.75, avg:513, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津城建大学", province:"", level:"官方数据", year:2024, info:"设计学类，录取4，平均507", subject:"history", min:504, max:509.25, avg:507, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津传媒学院", province:"", level:"官方数据", year:2023, info:"动画，录取2，平均506", subject:"history", min:505.5, max:505.7, avg:506, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津传媒学院", province:"", level:"官方数据", year:2023, info:"公共艺术，录取2，平均500", subject:"history", min:498.3, max:501.9, avg:500, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津传媒学院", province:"", level:"官方数据", year:2023, info:"戏剧影视美术设计，录取2，平均510", subject:"history", min:509.1, max:511.3, avg:510, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津大学", province:"天津", level:"985", year:2025, info:"环境设计，录取2，平均607", subject:"history", min:606, max:607.75, avg:607, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official"]},
      {school:"天津大学", province:"天津", level:"985", year:2024, info:"环境设计，录取2，平均599", subject:"history", min:595.5, max:602.75, avg:599, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official"]},
      {school:"天津大学", province:"天津", level:"985", year:2023, info:"环境设计，录取2，平均596", subject:"history", min:594.4, max:598.5, avg:596, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official"]},
      {school:"天津工业大学", province:"天津", level:"双一流/设计强", year:2025, info:"动画，录取6，平均549", subject:"history", min:545.25, max:555, avg:549, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"天津工业大学", province:"天津", level:"双一流/设计强", year:2024, info:"动画，录取6，平均545", subject:"history", min:536, max:575.75, avg:545, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"天津工业大学", province:"天津", level:"双一流/设计强", year:2025, info:"服装与服饰设计，录取2，平均538", subject:"history", min:537.25, max:538, avg:538, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"天津工业大学", province:"天津", level:"双一流/设计强", year:2024, info:"服装与服饰设计，录取2，平均535", subject:"history", min:534.75, max:535.25, avg:535, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"天津工业大学", province:"天津", level:"双一流/设计强", year:2025, info:"环境设计，录取4，平均535", subject:"history", min:534.5, max:538.25, avg:535, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"天津工业大学", province:"天津", level:"双一流/设计强", year:2024, info:"环境设计，录取4，平均533", subject:"history", min:527.25, max:537.75, avg:533, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"天津工业大学", province:"天津", level:"双一流/设计强", year:2025, info:"视觉传达设计，录取4，平均542", subject:"history", min:540.75, max:544.25, avg:542, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"天津工业大学", province:"天津", level:"双一流/设计强", year:2024, info:"视觉传达设计，录取4，平均538", subject:"history", min:535.75, max:543.25, avg:538, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"天津科技大学", province:"", level:"官方数据", year:2025, info:"产品设计，录取2，平均535", subject:"history", min:530.25, max:539.25, avg:535, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津科技大学", province:"", level:"官方数据", year:2024, info:"产品设计，录取3，平均526", subject:"history", min:524, max:527.75, avg:526, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津科技大学", province:"", level:"官方数据", year:2023, info:"产品设计，录取4，平均537", subject:"history", min:535.5, max:540.5, avg:537, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津科技大学", province:"", level:"官方数据", year:2024, info:"动画，录取3，平均525", subject:"history", min:524.25, max:525.5, avg:525, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津科技大学", province:"", level:"官方数据", year:2023, info:"动画，录取3，平均536", subject:"history", min:535.1, max:536.5, avg:536, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津科技大学", province:"", level:"官方数据", year:2025, info:"公共艺术，录取2，平均526", subject:"history", min:525, max:527.5, avg:526, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津科技大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均525", subject:"history", min:525.25, max:525.5, avg:525, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津科技大学", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均519", subject:"history", min:518.5, max:520, avg:519, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津科技大学", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均534", subject:"history", min:532.4, max:534.2, avg:534, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取1，平均466", subject:"history", min:465.5, max:465.5, avg:466, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取1，平均477", subject:"history", min:477.25, max:477.25, avg:477, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取1，平均495", subject:"history", min:495, max:495, avg:495, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2025, info:"动画，录取1，平均470", subject:"history", min:470, max:470, avg:470, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2024, info:"动画，录取1，平均475", subject:"history", min:474.75, max:474.75, avg:475, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2023, info:"动画，录取1，平均497", subject:"history", min:497, max:497.4, avg:497, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均455", subject:"history", min:455, max:462.25, avg:455, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均465", subject:"history", min:463.25, max:467.5, avg:465, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均489", subject:"history", min:488.2, max:490, avg:489, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取1，平均480", subject:"history", min:479.75, max:479.75, avg:480, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取1，平均482", subject:"history", min:481.5, max:481.5, avg:482, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取1，平均500", subject:"history", min:500.1, max:500.1, avg:500, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津商业大学", province:"", level:"官方数据", year:2025, info:"动画，录取2，平均529", subject:"history", min:522.5, max:535.75, avg:529, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津商业大学", province:"", level:"官方数据", year:2024, info:"动画，录取2，平均520", subject:"history", min:519, max:520, avg:520, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津商业大学", province:"", level:"官方数据", year:2023, info:"动画，录取2，平均536", subject:"history", min:532.7, max:538.7, avg:536, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津商业大学", province:"", level:"官方数据", year:2025, info:"设计学类，录取4，平均523", subject:"history", min:521.5, max:525.25, avg:523, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津商业大学", province:"", level:"官方数据", year:2024, info:"设计学类，录取4，平均516", subject:"history", min:514.75, max:519.75, avg:516, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津商业大学", province:"", level:"官方数据", year:2023, info:"设计学类，录取4，平均531", subject:"history", min:530.6, max:531.4, avg:531, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津商业大学宝德学院", province:"", level:"官方数据", year:2025, info:"设计学类，录取2，平均495", subject:"history", min:487.75, max:502.75, avg:495, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津商业大学宝德学院", province:"", level:"官方数据", year:2024, info:"设计学类，录取2，平均489", subject:"history", min:488.75, max:490, avg:489, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津商业大学宝德学院", province:"", level:"官方数据", year:2023, info:"设计学类，录取2，平均501", subject:"history", min:500.3, max:502.2, avg:501, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津师范大学", province:"天津", level:"公办师范", year:2025, info:"绘画，录取3，平均535", subject:"history", min:534.5, max:534.75, avg:535, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"天津师范大学", province:"天津", level:"公办师范", year:2024, info:"绘画，录取3，平均532", subject:"history", min:530.5, max:533.25, avg:532, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"天津师范大学", province:"天津", level:"公办师范", year:2023, info:"绘画，录取3，平均549", subject:"history", min:548.3, max:550.3, avg:549, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"天津外国语大学", province:"", level:"官方数据", year:2025, info:"动画，录取1，平均530", subject:"history", min:530.25, max:530.25, avg:530, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津外国语大学", province:"", level:"官方数据", year:2024, info:"动画，录取1，平均526", subject:"history", min:526.25, max:526.25, avg:526, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津外国语大学", province:"", level:"官方数据", year:2023, info:"动画，录取1，平均541", subject:"history", min:540.8, max:540.8, avg:541, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津外国语大学", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取1，平均540", subject:"history", min:539.5, max:539.5, avg:540, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津外国语大学", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取1，平均529", subject:"history", min:528.5, max:528.5, avg:529, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"天津外国语大学", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取1，平均543", subject:"history", min:543.4, max:543.4, avg:543, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"渭南师范学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均508", subject:"history", min:507.7, max:508.9, avg:508, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"渭南师范学院", province:"", level:"官方数据", year:2025, info:"美术学，录取2，平均495", subject:"history", min:494.25, max:495, avg:495, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"渭南师范学院", province:"", level:"官方数据", year:2024, info:"美术学，录取2，平均492", subject:"history", min:491.5, max:493, avg:492, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"渭南师范学院", province:"", level:"官方数据", year:2023, info:"美术学，录取2，平均511", subject:"history", min:510.8, max:511.6, avg:511, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"渭南师范学院", province:"", level:"官方数据", year:2025, info:"美术学 (中外合作办学)，录取2，平均485", subject:"history", min:483, max:487.5, avg:485, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"渭南师范学院", province:"", level:"官方数据", year:2024, info:"美术学 (中外合作办学)，录取2，平均486", subject:"history", min:484.5, max:487.75, avg:486, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"渭南师范学院", province:"", level:"官方数据", year:2023, info:"美术学 (中外合作办学)，录取2，平均502", subject:"history", min:499.5, max:503.6, avg:502, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"渭南师范学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均501", subject:"history", min:500, max:502.5, avg:501, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"渭南师范学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均498", subject:"history", min:496.5, max:498.75, avg:498, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"渭南师范学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均514", subject:"history", min:514, max:514, avg:514, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"温州大学", province:"浙江", level:"公办", year:2025, info:"服装与服饰设计 (服装设计、服装展示设计、鞋靴设计)，录取3，平均529", subject:"history", min:528, max:529.75, avg:529, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"温州大学", province:"浙江", level:"公办", year:2024, info:"服装与服饰设计 (服装设计、服装展示设计、鞋靴设计)，录取3，平均524", subject:"history", min:521.5, max:525.75, avg:524, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"温州商学院", province:"", level:"官方数据", year:2025, info:"设计学类，录取2，平均475", subject:"history", min:468.25, max:480.75, avg:475, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"温州商学院", province:"", level:"官方数据", year:2024, info:"设计学类，录取5，平均470", subject:"history", min:466.75, max:473.5, avg:470, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"温州商学院", province:"", level:"官方数据", year:2023, info:"设计学类，录取11，平均484", subject:"history", min:481, max:489.1, avg:484, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"温州商学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取4，平均471", subject:"history", min:466.25, max:478.25, avg:471, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"温州商学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取1，平均471", subject:"history", min:471, max:471, avg:471, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"文山学院", province:"", level:"官方数据", year:2025, info:"美术学，录取5，平均490", subject:"history", min:488.5, max:490.75, avg:490, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"文山学院", province:"", level:"官方数据", year:2024, info:"美术学，录取5，平均490", subject:"history", min:489.25, max:491.25, avg:490, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"文山学院", province:"", level:"官方数据", year:2023, info:"美术学，录取5，平均510", subject:"history", min:508.3, max:512.3, avg:510, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡太湖学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取15，平均468", subject:"history", min:464.5, max:471.75, avg:468, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡太湖学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取10，平均475", subject:"history", min:471.75, max:483.5, avg:475, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡太湖学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取10，平均492", subject:"history", min:488.1, max:496.2, avg:492, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡太湖学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取15，平均456", subject:"history", min:434.75, max:476.5, avg:456, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡太湖学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取10，平均467", subject:"history", min:462.5, max:471, avg:467, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡太湖学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取10，平均486", subject:"history", min:482.4, max:489.9, avg:486, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡太湖学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取15，平均455", subject:"history", min:445.5, max:466.25, avg:455, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡太湖学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取10，平均472", subject:"history", min:468.75, max:478, avg:472, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡太湖学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取10，平均491", subject:"history", min:489.6, max:492.9, avg:491, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡太湖学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取15，平均476", subject:"history", min:473, max:490.75, avg:476, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡太湖学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取10，平均478", subject:"history", min:476.25, max:483.5, avg:478, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡太湖学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取10，平均496", subject:"history", min:494.8, max:501.1, avg:496, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡太湖学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取15，平均479", subject:"history", min:474.25, max:488.5, avg:479, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡太湖学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取10，平均483", subject:"history", min:476.75, max:493.25, avg:483, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡太湖学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取5，平均498", subject:"history", min:495.4, max:501.8, avg:498, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均526", subject:"history", min:522.75, max:530, avg:526, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均519", subject:"history", min:516.75, max:522, avg:519, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均529", subject:"history", min:528.7, max:529.7, avg:529, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术 (中外合作办学)，录取2，平均513", subject:"history", min:513, max:513.25, avg:513, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"无锡学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术 (中外合作办学)，录取2，平均513", subject:"history", min:511.25, max:514.25, avg:513, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"无锡学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术 (中外合作办学)，录取2，平均521", subject:"history", min:519.5, max:522.7, avg:521, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"无锡学院", province:"", level:"官方数据", year:2025, info:"艺术与科技，录取2，平均521", subject:"history", min:519.5, max:521.75, avg:521, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡学院", province:"", level:"官方数据", year:2024, info:"艺术与科技，录取2，平均515", subject:"history", min:514.75, max:515.75, avg:515, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"无锡学院", province:"", level:"官方数据", year:2023, info:"艺术与科技，录取2，平均528", subject:"history", min:527.2, max:528, avg:528, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"梧州学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取1，平均492", subject:"history", min:491.5, max:491.5, avg:492, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"梧州学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取1，平均489", subject:"history", min:489, max:489, avg:489, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"梧州学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取1，平均491", subject:"history", min:490.5, max:490.5, avg:491, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"梧州学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均487", subject:"history", min:486.75, max:486.75, avg:487, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"梧州学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取1，平均487", subject:"history", min:487, max:487, avg:487, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"梧州学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取1，平均496", subject:"history", min:496.25, max:496.25, avg:496, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"梧州学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取1，平均496", subject:"history", min:495.5, max:495.5, avg:496, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"梧州学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取1，平均499", subject:"history", min:499, max:499, avg:499, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"梧州学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取1，平均498", subject:"history", min:498, max:498, avg:498, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"五邑大学", province:"", level:"官方数据", year:2025, info:"产品设计，录取1，平均519", subject:"history", min:519.25, max:519.25, avg:519, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"五邑大学", province:"", level:"官方数据", year:2024, info:"产品设计，录取1，平均515", subject:"history", min:515.25, max:515.25, avg:515, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"五邑大学", province:"", level:"官方数据", year:2023, info:"产品设计，录取1，平均529", subject:"history", min:529.3, max:529.3, avg:529, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"五邑大学", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取1，平均517", subject:"history", min:517, max:517, avg:517, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"五邑大学", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取1，平均514", subject:"history", min:514, max:514, avg:514, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"五邑大学", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取1，平均527", subject:"history", min:526.5, max:526.5, avg:527, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武昌工学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取5，平均488", subject:"history", min:485.4, max:491.9, avg:488, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武昌工学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取6，平均473", subject:"history", min:472.25, max:475.25, avg:473, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武昌工学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取10，平均475", subject:"history", min:472.5, max:476.25, avg:475, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武昌工学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取5，平均494", subject:"history", min:492.4, max:496.9, avg:494, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武昌工学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取4，平均475", subject:"history", min:473.5, max:476, avg:475, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武昌理工学院", province:"湖北", level:"民办", year:2025, info:"动画，录取3，平均477", subject:"history", min:473.75, max:482.75, avg:477, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["private","official"]},
      {school:"武昌理工学院", province:"湖北", level:"民办", year:2024, info:"动画，录取4，平均471", subject:"history", min:468.5, max:475, avg:471, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["private","official"]},
      {school:"武昌理工学院", province:"湖北", level:"民办", year:2023, info:"动画，录取2，平均490", subject:"history", min:488.1, max:492.6, avg:490, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["private","official"]},
      {school:"武昌理工学院", province:"湖北", level:"民办", year:2025, info:"设计学类，录取4，平均470", subject:"history", min:469.75, max:471, avg:470, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["private","official"]},
      {school:"武昌理工学院", province:"湖北", level:"民办", year:2024, info:"设计学类，录取4，平均471", subject:"history", min:469.5, max:474.25, avg:471, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["private","official"]},
      {school:"武昌理工学院", province:"湖北", level:"民办", year:2023, info:"设计学类，录取6，平均489", subject:"history", min:486.1, max:494.3, avg:489, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["private","official"]},
      {school:"武昌理工学院", province:"湖北", level:"民办", year:2025, info:"数字媒体艺术，录取5，平均475", subject:"history", min:473, max:476.25, avg:475, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["private","official"]},
      {school:"武昌理工学院", province:"湖北", level:"民办", year:2024, info:"数字媒体艺术，录取2，平均476", subject:"history", min:473.25, max:479.25, avg:476, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["private","official"]},
      {school:"武昌理工学院", province:"湖北", level:"民办", year:2023, info:"数字媒体艺术，录取2，平均489", subject:"history", min:488.2, max:488.8, avg:489, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["private","official"]},
      {school:"武昌首义学院", province:"", level:"官方数据", year:2025, info:"动画 (数字媒体)，录取3，平均482", subject:"history", min:481, max:483.75, avg:482, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武昌首义学院", province:"", level:"官方数据", year:2024, info:"动画 (数字媒体)，录取4，平均482", subject:"history", min:480.75, max:483.25, avg:482, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武昌首义学院", province:"", level:"官方数据", year:2023, info:"动画 (数字媒体)，录取2，平均498", subject:"history", min:497.4, max:498.1, avg:498, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武昌首义学院", province:"", level:"官方数据", year:2025, info:"设计学类，录取5，平均480", subject:"history", min:478.75, max:480.5, avg:480, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武昌首义学院", province:"", level:"官方数据", year:2024, info:"设计学类，录取6，平均483", subject:"history", min:479.5, max:490.5, avg:483, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武昌首义学院", province:"", level:"官方数据", year:2023, info:"设计学类，录取3，平均500", subject:"history", min:498.7, max:501.7, avg:500, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武昌首义学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均482", subject:"history", min:481.5, max:482.5, avg:482, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉城市学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取1，平均478", subject:"history", min:477.5, max:477.5, avg:478, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉城市学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取1，平均472", subject:"history", min:472, max:472, avg:472, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉城市学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取1，平均492", subject:"history", min:491.6, max:491.6, avg:492, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉城市学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均474", subject:"history", min:474.25, max:474.25, avg:474, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉城市学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取1，平均476", subject:"history", min:475.75, max:475.75, avg:476, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉城市学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取1，平均498", subject:"history", min:497.8, max:497.8, avg:498, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉城市学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取1，平均485", subject:"history", min:484.75, max:484.75, avg:485, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉城市学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取1，平均480", subject:"history", min:479.75, max:479.75, avg:480, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉城市学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取1，平均502", subject:"history", min:501.8, max:501.8, avg:502, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉东湖学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取2，平均473", subject:"history", min:472.75, max:473.5, avg:473, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉东湖学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取3，平均474", subject:"history", min:470.5, max:479.25, avg:474, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉东湖学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取4，平均486", subject:"history", min:485.2, max:486.9, avg:486, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉东湖学院", province:"", level:"官方数据", year:2025, info:"动画，录取2，平均473", subject:"history", min:473.25, max:473.5, avg:473, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉东湖学院", province:"", level:"官方数据", year:2024, info:"动画，录取3，平均476", subject:"history", min:475.5, max:477, avg:476, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉东湖学院", province:"", level:"官方数据", year:2023, info:"动画，录取4，平均493", subject:"history", min:490.4, max:495.4, avg:493, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉东湖学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均469", subject:"history", min:464.5, max:474, avg:469, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉东湖学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均476", subject:"history", min:468.75, max:481.75, avg:476, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉东湖学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均498", subject:"history", min:487.4, max:513.1, avg:498, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉东湖学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均476", subject:"history", min:475.75, max:476, avg:476, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉东湖学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计 (中外合作办学)，录取2，平均457", subject:"history", min:454.75, max:462.75, avg:457, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"武汉东湖学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计 (中外合作办学)，录取3，平均477", subject:"history", min:473.25, max:481.5, avg:477, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"武汉东湖学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计 (中外合作办学)，录取3，平均496", subject:"history", min:492.6, max:502.6, avg:496, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"武汉东湖学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均478", subject:"history", min:475.75, max:479.75, avg:478, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉东湖学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取3，平均476", subject:"history", min:474.25, max:476.75, avg:476, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉纺织大学", province:"", level:"官方数据", year:2025, info:"服装与服饰设计 (中外合作办学)，录取2，平均532", subject:"history", min:523, max:540, avg:532, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"武汉纺织大学", province:"", level:"官方数据", year:2024, info:"服装与服饰设计 (中外合作办学)，录取2，平均523", subject:"history", min:521.5, max:523.75, avg:523, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"武汉纺织大学", province:"", level:"官方数据", year:2023, info:"服装与服饰设计 (中外合作办学)，录取2，平均536", subject:"history", min:533, max:538.1, avg:536, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"武汉纺织大学", province:"", level:"官方数据", year:2025, info:"环境设计 (中外合作办学)，录取2，平均511", subject:"history", min:508.25, max:513.25, avg:511, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"武汉纺织大学", province:"", level:"官方数据", year:2024, info:"环境设计 (中外合作办学)，录取2，平均511", subject:"history", min:510.75, max:511.75, avg:511, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"武汉纺织大学", province:"", level:"官方数据", year:2023, info:"环境设计 (中外合作办学)，录取2，平均527", subject:"history", min:527, max:527.8, avg:527, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"武汉纺织大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计 (中外合作办学)，录取2，平均515", subject:"history", min:514, max:515, avg:515, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"武汉纺织大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计 (中外合作办学)，录取2，平均513", subject:"history", min:512.5, max:514.25, avg:513, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"武汉纺织大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计 (中外合作办学)，录取2，平均532", subject:"history", min:529.3, max:533.8, avg:532, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"武汉纺织大学", province:"", level:"官方数据", year:2025, info:"数字媒体艺术 (中外合作办学)，录取2，平均520", subject:"history", min:517.5, max:521.75, avg:520, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"武汉纺织大学", province:"", level:"官方数据", year:2024, info:"数字媒体艺术 (中外合作办学)，录取2，平均516", subject:"history", min:515, max:516, avg:516, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"武汉纺织大学", province:"", level:"官方数据", year:2023, info:"数字媒体艺术 (中外合作办学)，录取2，平均531", subject:"history", min:528.2, max:532.8, avg:531, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"武汉工程大学", province:"湖北", level:"公办", year:2025, info:"产品设计，录取3，平均528", subject:"history", min:527.25, max:528, avg:528, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"武汉工程大学", province:"湖北", level:"公办", year:2024, info:"产品设计，录取3，平均523", subject:"history", min:521.75, max:524, avg:523, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"武汉工程大学", province:"湖北", level:"公办", year:2023, info:"产品设计，录取4，平均537", subject:"history", min:536, max:538.2, avg:537, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"武汉工程大学", province:"湖北", level:"公办", year:2025, info:"动画，录取3，平均529", subject:"history", min:525, max:529.75, avg:529, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"武汉工程大学", province:"湖北", level:"公办", year:2024, info:"动画，录取3，平均525", subject:"history", min:524.75, max:525.75, avg:525, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"武汉工程大学", province:"湖北", level:"公办", year:2023, info:"动画，录取4，平均540", subject:"history", min:538, max:542.1, avg:540, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"武汉工程大学", province:"湖北", level:"公办", year:2025, info:"环境设计，录取3，平均523", subject:"history", min:521, max:525, avg:523, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"武汉工程大学", province:"湖北", level:"公办", year:2024, info:"环境设计，录取3，平均520", subject:"history", min:518.25, max:521, avg:520, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"武汉工程大学", province:"湖北", level:"公办", year:2023, info:"环境设计，录取4，平均537", subject:"history", min:535, max:537.7, avg:537, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"武汉工程大学", province:"湖北", level:"公办", year:2025, info:"视觉传达设计，录取3，平均531", subject:"history", min:530.25, max:531.5, avg:531, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"武汉工程大学", province:"湖北", level:"公办", year:2024, info:"视觉传达设计，录取3，平均527", subject:"history", min:525, max:528, avg:527, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"武汉工程大学", province:"湖北", level:"公办", year:2023, info:"视觉传达设计，录取4，平均540", subject:"history", min:539, max:541.8, avg:540, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"武汉华夏理工学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取4，平均477", subject:"history", min:475.25, max:478.25, avg:477, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉华夏理工学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取4，平均479", subject:"history", min:476.75, max:481.75, avg:479, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉华夏理工学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均493", subject:"history", min:491.7, max:494.1, avg:493, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉华夏理工学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取4，平均480", subject:"history", min:476.75, max:482, avg:480, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉华夏理工学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取4，平均479", subject:"history", min:476.75, max:482.25, avg:479, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉华夏理工学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取3，平均494", subject:"history", min:491.6, max:496.7, avg:494, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉科技大学", province:"", level:"官方数据", year:2025, info:"设计学类，录取10，平均535", subject:"history", min:532.25, max:537.75, avg:535, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉科技大学", province:"", level:"官方数据", year:2024, info:"设计学类，录取12，平均529", subject:"history", min:527.75, max:532.75, avg:529, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉科技大学", province:"", level:"官方数据", year:2023, info:"设计学类，录取12，平均545", subject:"history", min:543.3, max:549.5, avg:545, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取4，平均481", subject:"history", min:480.25, max:481.5, avg:481, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取4，平均480", subject:"history", min:479.25, max:480.75, avg:480, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取4，平均499", subject:"history", min:496.8, max:500.6, avg:499, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2025, info:"动画，录取3，平均482", subject:"history", min:481.5, max:483.25, avg:482, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2024, info:"动画，录取3，平均482", subject:"history", min:479, max:484.5, avg:482, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2023, info:"动画，录取4，平均499", subject:"history", min:497.2, max:505.1, avg:499, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取4，平均473", subject:"history", min:466.25, max:480.75, avg:473, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取4，平均477", subject:"history", min:474.5, max:480, avg:477, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取4，平均492", subject:"history", min:489.2, max:495.5, avg:492, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2023, info:"工艺美术，录取4，平均494", subject:"history", min:490, max:495.5, avg:494, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2025, info:"公共艺术，录取4，平均476", subject:"history", min:470.25, max:485, avg:476, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2024, info:"公共艺术，录取4，平均473", subject:"history", min:469.5, max:474, avg:473, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2023, info:"公共艺术，录取5，平均491", subject:"history", min:489.4, max:492.8, avg:491, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取5，平均479", subject:"history", min:477.75, max:481.25, avg:479, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取5，平均479", subject:"history", min:477.75, max:480.75, avg:479, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取4，平均497", subject:"history", min:495.1, max:500.7, avg:497, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取4，平均485", subject:"history", min:483.5, max:486, avg:485, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取4，平均483", subject:"history", min:477.75, max:483.25, avg:483, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取4，平均505", subject:"history", min:502, max:508.5, avg:505, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均490", subject:"history", min:485, max:494.75, avg:490, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2025, info:"艺术与科技，录取3，平均479", subject:"history", min:478, max:479.5, avg:479, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2025, info:"影视摄影与制作，录取3，平均484", subject:"history", min:477.75, max:492.5, avg:484, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉设计工程学院", province:"", level:"官方数据", year:2024, info:"影视摄影与制作，录取3，平均481", subject:"history", min:474.5, max:494.5, avg:481, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉体育学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均512", subject:"history", min:510.75, max:513.5, avg:512, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"武汉体育学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均511", subject:"history", min:508.5, max:512.5, avg:511, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安工程大学", province:"", level:"官方数据", year:2025, info:"服装与服饰设计 (中外合作办学)，录取4，平均501", subject:"history", min:490, max:509.75, avg:501, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"西安工程大学", province:"", level:"官方数据", year:2024, info:"服装与服饰设计 (中外合作办学)，录取4，平均511", subject:"history", min:510.5, max:512, avg:511, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"西安工程大学", province:"", level:"官方数据", year:2023, info:"服装与服饰设计 (中外合作办学)，录取2，平均526", subject:"history", min:525.8, max:526.2, avg:526, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"西安工程大学", province:"", level:"官方数据", year:2025, info:"设计学类，录取12，平均521", subject:"history", min:519.5, max:522.5, avg:521, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"西安工程大学", province:"", level:"官方数据", year:2024, info:"设计学类，录取7，平均517", subject:"history", min:515.75, max:521.75, avg:517, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"西安工程大学", province:"", level:"官方数据", year:2023, info:"设计学类，录取10，平均531", subject:"history", min:530.2, max:534.7, avg:531, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official","coop"]},
      {school:"西安交通大学城市学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取5，平均479", subject:"history", min:476.25, max:481, avg:479, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安交通大学城市学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取5，平均482", subject:"history", min:480, max:489.75, avg:482, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安交通大学城市学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取5，平均500", subject:"history", min:496.1, max:503.1, avg:500, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安交通大学城市学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取5，平均484", subject:"history", min:482, max:484.5, avg:484, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安交通大学城市学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均483", subject:"history", min:482, max:487.25, avg:483, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安交通大学城市学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取5，平均502", subject:"history", min:500.3, max:508.1, avg:502, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安交通大学城市学院", province:"", level:"官方数据", year:2025, info:"中国画，录取5，平均478", subject:"history", min:473.75, max:486, avg:478, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安交通大学城市学院", province:"", level:"官方数据", year:2024, info:"中国画，录取5，平均479", subject:"history", min:477.5, max:481.5, avg:479, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安交通大学城市学院", province:"", level:"官方数据", year:2023, info:"中国画，录取5，平均496", subject:"history", min:491.7, max:501.6, avg:496, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安科技大学", province:"", level:"官方数据", year:2025, info:"设计学类，录取1，平均532", subject:"history", min:532.25, max:532.25, avg:532, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安科技大学", province:"", level:"官方数据", year:2024, info:"设计学类，录取2，平均525", subject:"history", min:524.75, max:525.75, avg:525, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安科技大学", province:"", level:"官方数据", year:2023, info:"设计学类，录取2，平均539", subject:"history", min:537.5, max:541.4, avg:539, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安科技大学高新学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均482", subject:"history", min:481.5, max:483.25, avg:482, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安科技大学高新学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均498", subject:"history", min:497.7, max:498.3, avg:498, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安科技大学高新学院", province:"", level:"官方数据", year:2025, info:"影视摄影与制作，录取2，平均476", subject:"history", min:474.75, max:476.25, avg:476, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2025, info:"产品设计，录取2，平均549", subject:"history", min:549, max:549.25, avg:549, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2024, info:"产品设计，录取4，平均548", subject:"history", min:545.25, max:552, avg:548, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2025, info:"动画，录取2，平均559", subject:"history", min:555.25, max:563.25, avg:559, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2024, info:"动画，录取3，平均560", subject:"history", min:546.25, max:571.25, avg:560, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2025, info:"服装与服饰设计，录取2，平均540", subject:"history", min:539.5, max:540, avg:540, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2024, info:"服装与服饰设计，录取2，平均540", subject:"history", min:538, max:542.5, avg:540, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2025, info:"工艺美术，录取2，平均544", subject:"history", min:542.25, max:546, avg:544, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2024, info:"工艺美术，录取4，平均541", subject:"history", min:539, max:541.5, avg:541, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2025, info:"环境设计，录取2，平均541", subject:"history", min:540.25, max:541.25, avg:541, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2024, info:"环境设计，录取4，平均536", subject:"history", min:531.75, max:540.75, avg:536, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2025, info:"数字媒体艺术，录取3，平均568", subject:"history", min:560.75, max:571.75, avg:568, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2024, info:"数字媒体艺术，录取2，平均566", subject:"history", min:564.75, max:567.75, avg:566, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2025, info:"戏剧影视美术设计，录取2，平均558", subject:"history", min:554.25, max:561.25, avg:558, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2024, info:"戏剧影视美术设计，录取2，平均556", subject:"history", min:555, max:561.25, avg:556, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2025, info:"艺术与科技，录取3，平均555", subject:"history", min:553.25, max:556.5, avg:555, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2024, info:"艺术与科技，录取5，平均558", subject:"history", min:553.5, max:564.75, avg:558, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安思源学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均466", subject:"history", min:464.25, max:468, avg:466, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安思源学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均472", subject:"history", min:469.25, max:474, avg:472, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安思源学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均497", subject:"history", min:495.9, max:497.2, avg:497, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安思源学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均477", subject:"history", min:476.25, max:477.25, avg:477, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安思源学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均481", subject:"history", min:480.5, max:481, avg:481, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西安思源学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均496", subject:"history", min:494.8, max:496.6, avg:496, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西北农林科技大学", province:"陕西", level:"985", year:2025, info:"环境设计，录取3，平均565", subject:"history", min:555.5, max:577.25, avg:565, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"西北农林科技大学", province:"陕西", level:"985", year:2024, info:"环境设计，录取3，平均560", subject:"history", min:559.25, max:560.25, avg:560, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"西北农林科技大学", province:"陕西", level:"985", year:2023, info:"环境设计，录取3，平均570", subject:"history", min:566.6, max:574, avg:570, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"西北师范大学", province:"甘肃", level:"公办师范", year:2025, info:"环境设计 (中外合作办学)，录取5，平均498", subject:"history", min:494.5, max:503.5, avg:498, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"西北师范大学", province:"甘肃", level:"公办师范", year:2024, info:"环境设计 (中外合作办学)，录取5，平均498", subject:"history", min:496.5, max:502, avg:498, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"西北师范大学", province:"甘肃", level:"公办师范", year:2023, info:"环境设计 (中外合作办学)，录取5，平均518", subject:"history", min:516.5, max:521.9, avg:518, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"西北师范大学", province:"甘肃", level:"公办师范", year:2025, info:"数字媒体艺术，录取2，平均521", subject:"history", min:520, max:521.75, avg:521, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"西北政法大学", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取1，平均545", subject:"history", min:544.5, max:544.5, avg:545, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西北政法大学", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取1，平均538", subject:"history", min:538.25, max:538.25, avg:538, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西京学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取2，平均472", subject:"history", min:469.75, max:474.25, avg:472, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西京学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取3，平均476", subject:"history", min:473.75, max:479.5, avg:476, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西京学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取3，平均487", subject:"history", min:482.7, max:494.2, avg:487, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西京学院", province:"", level:"官方数据", year:2025, info:"动画，录取2，平均466", subject:"history", min:465, max:466.25, avg:466, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西京学院", province:"", level:"官方数据", year:2024, info:"动画，录取2，平均467", subject:"history", min:466, max:467, avg:467, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西京学院", province:"", level:"官方数据", year:2023, info:"动画，录取5，平均486", subject:"history", min:483.4, max:488.6, avg:486, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西京学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均466", subject:"history", min:461.75, max:469, avg:466, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西京学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取4，平均466", subject:"history", min:464.25, max:467.25, avg:466, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西京学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取7，平均480", subject:"history", min:478.3, max:483.2, avg:480, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西京学院", province:"", level:"官方数据", year:2024, info:"美术学，录取2，平均473", subject:"history", min:472, max:473.5, avg:473, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西京学院", province:"", level:"官方数据", year:2023, info:"美术学，录取4，平均489", subject:"history", min:483, max:493.2, avg:489, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西京学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均471", subject:"history", min:468, max:474.25, avg:471, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西京学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均475", subject:"history", min:475, max:475, avg:475, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西京学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取6，平均489", subject:"history", min:486.3, max:495.8, avg:489, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"西南财经大学", province:"四川", level:"211/双一流", year:2025, info:"数字媒体艺术，录取2，平均575", subject:"history", min:571.75, max:577.25, avg:575, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南财经大学", province:"四川", level:"211/双一流", year:2024, info:"数字媒体艺术，录取3，平均564", subject:"history", min:562.5, max:566, avg:564, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南财经大学", province:"四川", level:"211/双一流", year:2023, info:"数字媒体艺术，录取3，平均565", subject:"history", min:563.1, max:566.7, avg:565, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南大学", province:"重庆", level:"211/双一流", year:2025, info:"雕塑，录取2，平均569", subject:"history", min:568.5, max:569.25, avg:569, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南大学", province:"重庆", level:"211/双一流", year:2024, info:"雕塑，录取2，平均559", subject:"history", min:558.5, max:560, avg:559, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南大学", province:"重庆", level:"211/双一流", year:2023, info:"雕塑，录取2，平均569", subject:"history", min:566.3, max:572.3, avg:569, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南大学", province:"重庆", level:"211/双一流", year:2025, info:"服装与服饰设计，录取2，平均581", subject:"history", min:580.25, max:581, avg:581, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南大学", province:"重庆", level:"211/双一流", year:2024, info:"服装与服饰设计，录取4，平均563", subject:"history", min:560.75, max:565.5, avg:563, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南大学", province:"重庆", level:"211/双一流", year:2023, info:"服装与服饰设计，录取5，平均569", subject:"history", min:567.8, max:570.4, avg:569, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南大学", province:"重庆", level:"211/双一流", year:2025, info:"绘画，录取2，平均562", subject:"history", min:560, max:561, avg:562, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南大学", province:"重庆", level:"211/双一流", year:2024, info:"绘画，录取2，平均572", subject:"history", min:570.25, max:574, avg:572, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南大学", province:"重庆", level:"211/双一流", year:2023, info:"绘画，录取5，平均575", subject:"history", min:574.3, max:574.7, avg:575, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南大学", province:"重庆", level:"211/双一流", year:2023, info:"美术学，录取7，平均591", subject:"history", min:589.4, max:592.1, avg:591, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南大学", province:"重庆", level:"211/双一流", year:2025, info:"美术学 (公费师范生)，录取1，平均642", subject:"history", min:641.5, max:641.5, avg:642, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南大学", province:"重庆", level:"211/双一流", year:2024, info:"美术学 (公费师范生)，录取10，平均582", subject:"history", min:577.5, max:592.25, avg:582, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南大学", province:"重庆", level:"211/双一流", year:2025, info:"视觉传达设计，录取4，平均585", subject:"history", min:583.25, max:586.5, avg:585, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南大学", province:"重庆", level:"211/双一流", year:2024, info:"视觉传达设计，录取2，平均576", subject:"history", min:575.25, max:577, avg:576, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南大学", province:"重庆", level:"211/双一流", year:2023, info:"视觉传达设计，录取2，平均582", subject:"history", min:581.6, max:582, avg:582, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南交通大学", province:"四川", level:"211/双一流", year:2023, info:"绘画，录取1，平均569", subject:"history", min:569.3, max:569.3, avg:569, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南交通大学", province:"四川", level:"211/双一流", year:2025, info:"设计学类，录取3，平均579", subject:"history", min:577, max:581, avg:579, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南交通大学", province:"四川", level:"211/双一流", year:2024, info:"设计学类，录取12，平均567", subject:"history", min:564, max:573, avg:567, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南交通大学", province:"四川", level:"211/双一流", year:2023, info:"设计学类，录取11，平均573", subject:"history", min:569.7, max:581.1, avg:573, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南林业大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均515", subject:"history", min:514.25, max:516.25, avg:515, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湘南学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取6，平均492", subject:"history", min:489.5, max:493.75, avg:492, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湘南学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取6，平均492", subject:"history", min:490.5, max:496.25, avg:492, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湘南学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取8，平均508", subject:"history", min:507.4, max:508, avg:508, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湘南学院", province:"", level:"官方数据", year:2025, info:"美术学，录取5，平均495", subject:"history", min:493.25, max:497.5, avg:495, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湘南学院", province:"", level:"官方数据", year:2024, info:"美术学，录取5，平均496", subject:"history", min:494, max:501.5, avg:496, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湘南学院", province:"", level:"官方数据", year:2023, info:"美术学，录取5，平均514", subject:"history", min:513.3, max:515.5, avg:514, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湘南学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取5，平均500", subject:"history", min:498.25, max:502.5, avg:500, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湘南学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均500", subject:"history", min:496.75, max:507.75, avg:500, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湘南学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取9，平均513", subject:"history", min:512.1, max:517.5, avg:513, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"忻州师范学院", province:"", level:"官方数据", year:2025, info:"美术学，录取3，平均488", subject:"history", min:486.75, max:489.5, avg:488, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"忻州师范学院", province:"", level:"官方数据", year:2024, info:"美术学，录取6，平均490", subject:"history", min:489, max:492.75, avg:490, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"忻州师范学院", province:"", level:"官方数据", year:2023, info:"美术学，录取6，平均510", subject:"history", min:507.1, max:515.3, avg:510, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"新疆大学", province:"新疆", level:"211/双一流", year:2025, info:"设计学类，录取1，平均534", subject:"history", min:534.25, max:534.25, avg:534, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"烟台科技学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取5，平均466", subject:"history", min:462.25, max:477.75, avg:466, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"烟台科技学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取5，平均475", subject:"history", min:471, max:479.25, avg:475, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"烟台科技学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取5，平均494", subject:"history", min:491.4, max:501, avg:494, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"扬州大学广陵学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取2，平均489", subject:"history", min:488, max:490.5, avg:489, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"扬州大学广陵学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取2，平均489", subject:"history", min:487.5, max:489.5, avg:489, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"扬州大学广陵学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取2，平均505", subject:"history", min:504.2, max:505.1, avg:505, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"扬州大学广陵学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均491", subject:"history", min:490, max:491.25, avg:491, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"扬州大学广陵学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均489", subject:"history", min:488.5, max:489.5, avg:489, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"扬州大学广陵学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均506", subject:"history", min:505.9, max:506.5, avg:506, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"扬州大学广陵学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均497", subject:"history", min:495.25, max:498.25, avg:497, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"扬州大学广陵学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均497", subject:"history", min:494.75, max:499.5, avg:497, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"扬州大学广陵学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均513", subject:"history", min:512.4, max:512.8, avg:513, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宜春学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均497", subject:"history", min:495.75, max:497.25, avg:497, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宜春学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均498", subject:"history", min:498, max:498.5, avg:498, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宜春学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均512", subject:"history", min:512, max:512.7, avg:512, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宜春学院", province:"", level:"官方数据", year:2025, info:"美术学，录取1，平均504", subject:"history", min:504.25, max:504.25, avg:504, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宜春学院", province:"", level:"官方数据", year:2024, info:"美术学，录取1，平均501", subject:"history", min:501, max:503, avg:501, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宜春学院", province:"", level:"官方数据", year:2023, info:"美术学，录取1，平均517", subject:"history", min:516.7, max:516.7, avg:517, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宜春学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均505", subject:"history", min:504.5, max:505.75, avg:505, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宜春学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均502", subject:"history", min:501, max:502.35, avg:502, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"宜春学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均517", subject:"history", min:516.5, max:516.7, avg:517, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"玉林师范学院", province:"广西", level:"公办师范", year:2025, info:"工艺美术，录取5，平均489", subject:"history", min:488, max:491.75, avg:489, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"玉林师范学院", province:"广西", level:"公办师范", year:2024, info:"工艺美术，录取5，平均488", subject:"history", min:487.25, max:488.5, avg:488, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"玉林师范学院", province:"广西", level:"公办师范", year:2023, info:"工艺美术，录取5，平均507", subject:"history", min:505.6, max:507.6, avg:507, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"玉林师范学院", province:"广西", level:"公办师范", year:2025, info:"环境设计，录取4，平均489", subject:"history", min:486.25, max:496.5, avg:489, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"玉林师范学院", province:"广西", level:"公办师范", year:2024, info:"环境设计，录取4，平均489", subject:"history", min:488, max:490.5, avg:489, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"玉林师范学院", province:"广西", level:"公办师范", year:2023, info:"环境设计，录取2，平均508", subject:"history", min:507, max:508, avg:508, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"玉林师范学院", province:"广西", level:"公办师范", year:2025, info:"美术学，录取4，平均492", subject:"history", min:491, max:494.25, avg:492, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"玉林师范学院", province:"广西", level:"公办师范", year:2024, info:"美术学，录取4，平均495", subject:"history", min:492.75, max:497, avg:495, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"玉林师范学院", province:"广西", level:"公办师范", year:2023, info:"美术学，录取3，平均512", subject:"history", min:511.2, max:512.1, avg:512, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"豫章师范学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均506", subject:"history", min:506, max:506.5, avg:506, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"豫章师范学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均504", subject:"history", min:503, max:505.25, avg:504, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"豫章师范学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均516", subject:"history", min:515.3, max:517.4, avg:516, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"豫章师范学院", province:"", level:"官方数据", year:2023, info:"绘画，录取2，平均516", subject:"history", min:513.7, max:518.1, avg:516, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"豫章师范学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均521", subject:"history", min:521.2, max:521.6, avg:521, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南财经大学", province:"", level:"官方数据", year:2025, info:"产品设计，录取2，平均516", subject:"history", min:515.25, max:516.25, avg:516, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南财经大学", province:"", level:"官方数据", year:2024, info:"产品设计，录取2，平均513", subject:"history", min:511.75, max:513.75, avg:513, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南财经大学", province:"", level:"官方数据", year:2023, info:"产品设计，录取2，平均529", subject:"history", min:528.8, max:529.1, avg:529, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南财经大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均511", subject:"history", min:509.75, max:512.5, avg:511, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南财经大学", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均511", subject:"history", min:510, max:511.5, avg:511, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南财经大学", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均527", subject:"history", min:523.7, max:528.6, avg:527, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南财经大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均520", subject:"history", min:518.5, max:520.75, avg:520, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南财经大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均515", subject:"history", min:514.75, max:514.75, avg:515, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南财经大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均530", subject:"history", min:529.7, max:530, avg:530, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南财经大学", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均520", subject:"history", min:519.25, max:520, avg:520, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南财经大学", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均517", subject:"history", min:515.5, max:517.75, avg:517, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南财经大学", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均531", subject:"history", min:530.4, max:530.9, avg:531, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南大学滇池学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取2，平均491", subject:"history", min:490.2, max:491.7, avg:491, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南大学滇池学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取2，平均487", subject:"history", min:484.9, max:488.5, avg:487, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南大学滇池学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均491", subject:"history", min:489.3, max:491.9, avg:491, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南大学滇池学院", province:"", level:"官方数据", year:2023, info:"绘画，录取2，平均491", subject:"history", min:489, max:491.6, avg:491, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南大学滇池学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均495", subject:"history", min:494, max:494.8, avg:495, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南大学滇池学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均499", subject:"history", min:498.3, max:499.7, avg:499, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南大学滇池学院", province:"", level:"官方数据", year:2023, info:"艺术与科技，录取2，平均490", subject:"history", min:488.3, max:492.4, avg:490, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2025, info:"产品设计，录取1，平均526", subject:"history", min:525.5, max:525.5, avg:526, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2024, info:"产品设计，录取1，平均518", subject:"history", min:517.5, max:517.5, avg:518, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2023, info:"产品设计，录取2，平均540", subject:"history", min:539.3, max:540.3, avg:540, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2025, info:"雕塑，录取1，平均516", subject:"history", min:515.5, max:515.5, avg:516, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2024, info:"雕塑，录取1，平均509", subject:"history", min:508.75, max:508.75, avg:509, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2025, info:"服装与服饰设计，录取1，平均516", subject:"history", min:515.75, max:515.75, avg:516, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2024, info:"服装与服饰设计，录取1，平均517", subject:"history", min:517, max:517, avg:517, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2023, info:"服装与服饰设计，录取1，平均550", subject:"history", min:549.8, max:549.8, avg:550, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2025, info:"环境设计，录取2，平均521", subject:"history", min:519.5, max:522.25, avg:521, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2024, info:"环境设计，录取2，平均521", subject:"history", min:519.75, max:520.75, avg:521, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2023, info:"环境设计，录取2，平均533", subject:"history", min:532.3, max:534.5, avg:533, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2025, info:"环境设计 (中外合作办学)，录取2，平均501", subject:"history", min:501, max:501.25, avg:501, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official","coop"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2024, info:"环境设计 (中外合作办学)，录取2，平均498", subject:"history", min:494.25, max:501, avg:498, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official","coop"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2025, info:"绘画，录取5，平均520", subject:"history", min:516.25, max:524, avg:520, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2024, info:"绘画，录取5，平均521", subject:"history", min:517.5, max:527.5, avg:521, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2023, info:"绘画，录取4，平均536", subject:"history", min:532.5, max:540.5, avg:536, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2025, info:"美术学 (史论)，录取1，平均522", subject:"history", min:521.75, max:521.75, avg:522, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2024, info:"美术学 (史论)，录取1，平均525", subject:"history", min:524.75, max:524.75, avg:525, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2025, info:"摄影，录取1，平均509", subject:"history", min:508.75, max:508.75, avg:509, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2024, info:"摄影，录取1，平均512", subject:"history", min:512.25, max:512.25, avg:512, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2023, info:"摄影，录取1，平均519", subject:"history", min:519, max:519.2, avg:519, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2025, info:"视觉传达设计，录取2，平均531", subject:"history", min:529, max:532.75, avg:531, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2024, info:"视觉传达设计，录取2，平均528", subject:"history", min:528.75, max:528.75, avg:528, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2023, info:"视觉传达设计，录取2，平均542", subject:"history", min:540.2, max:544.4, avg:542, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2025, info:"数字媒体艺术，录取1，平均535", subject:"history", min:535, max:535, avg:535, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2024, info:"数字媒体艺术，录取1，平均533", subject:"history", min:532.75, max:532.75, avg:533, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2023, info:"数字媒体艺术，录取2，平均550", subject:"history", min:547.8, max:551.9, avg:550, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2023, info:"戏剧影视美术设计，录取1，平均535", subject:"history", min:534.9, max:534.9, avg:535, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2024, info:"戏剧影视美术设计 (舞台设计)，录取1，平均532", subject:"history", min:532, max:532, avg:532, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2025, info:"戏剧影视美术设计 (化妆服装)，录取1，平均529", subject:"history", min:528.5, max:528.5, avg:529, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2025, info:"影视摄影与制作，录取1，平均519", subject:"history", min:518.5, max:518.5, avg:519, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2024, info:"影视摄影与制作，录取1，平均503", subject:"history", min:503, max:503, avg:503, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2025, info:"中国画，录取1，平均524", subject:"history", min:524.25, max:524.25, avg:524, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2024, info:"中国画，录取1，平均514", subject:"history", min:513.75, max:513.75, avg:514, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2023, info:"中国画，录取1，平均542", subject:"history", min:542, max:542, avg:542, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院文华学院", province:"", level:"官方数据", year:2023, info:"美术学 (师范类)，录取6，平均498", subject:"history", min:495.9, max:499.8, avg:498, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"云南艺术学院文华学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均490", subject:"history", min:489.5, max:491.4, avg:490, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湛江科技学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取1，平均477", subject:"history", min:477, max:477, avg:477, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湛江科技学院", province:"", level:"官方数据", year:2025, info:"动画，录取3，平均465", subject:"history", min:455.25, max:478.25, avg:465, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"湛江科技学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取1，平均434", subject:"history", min:434, max:434, avg:434, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"浙江传媒学院", province:"浙江", level:"公办/传媒艺术", year:2025, info:"动画，录取5，平均572", subject:"history", min:566, max:582.25, avg:572, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"浙江传媒学院", province:"浙江", level:"公办/传媒艺术", year:2024, info:"动画，录取2，平均567", subject:"history", min:565.75, max:567.5, avg:567, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"浙江传媒学院", province:"浙江", level:"公办/传媒艺术", year:2023, info:"动画，录取1，平均568", subject:"history", min:568.4, max:568.4, avg:568, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"浙江传媒学院", province:"浙江", level:"公办/传媒艺术", year:2025, info:"服装与服饰设计，录取1，平均563", subject:"history", min:563.25, max:563.25, avg:563, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"浙江科技大学", province:"", level:"官方数据", year:2025, info:"设计学类，录取10，平均534", subject:"history", min:532, max:537.5, avg:534, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"浙江科技大学", province:"", level:"官方数据", year:2024, info:"设计学类，录取5，平均527", subject:"history", min:525, max:528, avg:527, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"浙江科技学院", province:"", level:"官方数据", year:2023, info:"设计学类，录取5，平均533", subject:"history", min:531.5, max:535.3, avg:533, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"浙江理工大学", province:"浙江", level:"公办/设计服装强", year:2025, info:"服装与服饰设计 (中外合作办学)(中法合作)，录取6，平均540", subject:"history", min:532.75, max:552.25, avg:540, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official","coop"]},
      {school:"浙江理工大学", province:"浙江", level:"公办/设计服装强", year:2024, info:"服装与服饰设计 (中外合作办学)(中法合作)，录取6，平均531", subject:"history", min:524.5, max:542.5, avg:531, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official","coop"]},
      {school:"浙江理工大学", province:"浙江", level:"公办/设计服装强", year:2023, info:"服装与服饰设计 (中外合作办学)(中法合作)，录取2，平均542", subject:"history", min:538.4, max:544.6, avg:542, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official","coop"]},
      {school:"浙江理工大学", province:"浙江", level:"公办/设计服装强", year:2025, info:"设计学类，录取7，平均552", subject:"history", min:548.75, max:565, avg:552, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official","coop"]},
      {school:"浙江理工大学", province:"浙江", level:"公办/设计服装强", year:2024, info:"设计学类，录取7，平均540", subject:"history", min:537, max:549, avg:540, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official","coop"]},
      {school:"浙江理工大学", province:"浙江", level:"公办/设计服装强", year:2023, info:"数字媒体艺术 (中外合作办学)(中法合作)，录取2，平均538", subject:"history", min:535.8, max:539.8, avg:538, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official","coop"]},
      {school:"浙江师范大学", province:"浙江", level:"公办师范", year:2025, info:"动画，录取2，平均549", subject:"history", min:548.5, max:549.25, avg:549, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"浙江师范大学", province:"浙江", level:"公办师范", year:2025, info:"设计学类，录取3，平均545", subject:"history", min:542.5, max:547.5, avg:545, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"浙江师范大学", province:"浙江", level:"公办师范", year:2024, info:"设计学类，录取3，平均538", subject:"history", min:537, max:538.5, avg:538, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"浙江师范大学", province:"浙江", level:"公办师范", year:2023, info:"设计学类，录取3，平均551", subject:"history", min:550.1, max:553, avg:551, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"浙江师范大学", province:"浙江", level:"公办师范", year:2025, info:"数字媒体艺术，录取2，平均550", subject:"history", min:547.75, max:551.5, avg:550, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"浙江师范大学", province:"浙江", level:"公办师范", year:2024, info:"数字媒体艺术，录取2，平均550", subject:"history", min:548, max:557.25, avg:550, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"浙江师范大学", province:"浙江", level:"公办师范", year:2023, info:"数字媒体艺术，录取2，平均551", subject:"history", min:550.8, max:552, avg:551, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"浙江外国语学院", province:"", level:"官方数据", year:2025, info:"美术学 (师范)，录取1，平均530", subject:"history", min:530, max:530, avg:530, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"浙江外国语学院", province:"", level:"官方数据", year:2024, info:"美术学 (师范)，录取1，平均525", subject:"history", min:524.75, max:524.75, avg:525, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"浙江外国语学院", province:"", level:"官方数据", year:2023, info:"美术学 (师范)，录取2，平均536", subject:"history", min:536, max:536.3, avg:536, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"浙江外国语学院", province:"", level:"官方数据", year:2025, info:"艺术与科技，录取1，平均530", subject:"history", min:529.5, max:529.5, avg:530, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"浙江外国语学院", province:"", level:"官方数据", year:2024, info:"艺术与科技，录取1，平均520", subject:"history", min:519.5, max:519.5, avg:520, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"郑州经贸学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取15，平均469", subject:"history", min:463.25, max:479, avg:469, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"郑州经贸学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取15，平均471", subject:"history", min:466.25, max:475.25, avg:471, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"郑州经贸学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取25，平均487", subject:"history", min:481.8, max:492.3, avg:487, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"郑州经贸学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取15，平均474", subject:"history", min:468.5, max:479.25, avg:474, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"郑州经贸学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取13，平均474", subject:"history", min:467.75, max:481.25, avg:474, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"郑州美术学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取4，平均487", subject:"history", min:481.5, max:497.75, avg:487, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"郑州美术学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取4，平均483", subject:"history", min:475.5, max:505, avg:483, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"郑州美术学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取4，平均477", subject:"history", min:474.5, max:487, avg:477, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"郑州美术学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取4，平均481", subject:"history", min:469.25, max:486.25, avg:481, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"郑州美术学院", province:"", level:"官方数据", year:2025, info:"工艺美术，录取4，平均479", subject:"history", min:479, max:481, avg:479, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"郑州美术学院", province:"", level:"官方数据", year:2024, info:"工艺美术，录取4，平均484", subject:"history", min:477.25, max:491.5, avg:484, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"郑州美术学院", province:"", level:"官方数据", year:2025, info:"中国画，录取2，平均480", subject:"history", min:474.75, max:484.75, avg:480, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"郑州轻工业大学", province:"", level:"官方数据", year:2025, info:"设计学类，录取7，平均527", subject:"history", min:524, max:532.25, avg:527, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"郑州轻工业大学", province:"", level:"官方数据", year:2024, info:"设计学类，录取5，平均518", subject:"history", min:515, max:521.25, avg:518, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"郑州升达经贸管理学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均480", subject:"history", min:478.25, max:481.75, avg:480, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"郑州升达经贸管理学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均471", subject:"history", min:470.75, max:471.5, avg:471, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"郑州升达经贸管理学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均478", subject:"history", min:475, max:481, avg:478, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"中北大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均526", subject:"history", min:525, max:526.25, avg:526, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"中北大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均522", subject:"history", min:520.25, max:522.75, avg:522, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"中北大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均537", subject:"history", min:536.1, max:537.2, avg:537, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"中国地质大学 (北京)", province:"北京", level:"211/双一流", year:2025, info:"产品设计，录取1，平均586", subject:"history", min:586.25, max:586.25, avg:586, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"中国地质大学 (北京)", province:"北京", level:"211/双一流", year:2024, info:"产品设计，录取1，平均577", subject:"history", min:576.5, max:576.5, avg:577, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"中国地质大学 (北京)", province:"北京", level:"211/双一流", year:2023, info:"产品设计，录取1，平均590", subject:"history", min:589.7, max:589.7, avg:590, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"中国地质大学 (武汉)", province:"北京", level:"211/双一流", year:2025, info:"产品设计 (珠宝首饰设计)，录取2，平均581", subject:"history", min:579, max:582.5, avg:581, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"中国地质大学 (武汉)", province:"北京", level:"211/双一流", year:2024, info:"产品设计 (珠宝首饰设计)，录取2，平均574", subject:"history", min:572.75, max:575, avg:574, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"中国地质大学 (武汉)", province:"北京", level:"211/双一流", year:2023, info:"产品设计 (珠宝首饰设计)，录取2，平均579", subject:"history", min:577.6, max:580.2, avg:579, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"中国地质大学 (武汉)", province:"北京", level:"211/双一流", year:2025, info:"设计学类，录取9，平均575", subject:"history", min:572, max:582.25, avg:575, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"中国地质大学 (武汉)", province:"北京", level:"211/双一流", year:2024, info:"设计学类，录取10，平均571", subject:"history", min:569.25, max:573.5, avg:571, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"中国地质大学 (武汉)", province:"北京", level:"211/双一流", year:2023, info:"设计学类，录取11，平均574", subject:"history", min:571.6, max:576.8, avg:574, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"中国矿业大学", province:"江苏", level:"211/双一流", year:2025, info:"环境设计，录取2，平均561", subject:"history", min:560.25, max:562.25, avg:561, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"中国矿业大学", province:"江苏", level:"211/双一流", year:2024, info:"环境设计，录取2，平均564", subject:"history", min:561.25, max:567.5, avg:564, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"中国矿业大学", province:"江苏", level:"211/双一流", year:2023, info:"环境设计，录取4，平均568", subject:"history", min:566.7, max:568.8, avg:568, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"中国美术学院", province:"浙江", level:"双一流/专业艺术院校", year:2025, info:"产品设计 (中外合作办学)，录取1，平均591", subject:"history", min:591, max:591, avg:591, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","double","official","coop"]},
      {school:"中国美术学院", province:"浙江", level:"双一流/专业艺术院校", year:2024, info:"产品设计 (中外合作办学)，录取1，平均583", subject:"history", min:583.25, max:583.25, avg:583, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","double","official","coop"]},
      {school:"中国美术学院", province:"浙江", level:"双一流/专业艺术院校", year:2025, info:"环境设计 (中外合作办学)，录取1，平均576", subject:"history", min:575.75, max:575.75, avg:576, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","double","official","coop"]},
      {school:"中国美术学院", province:"浙江", level:"双一流/专业艺术院校", year:2024, info:"环境设计 (中外合作办学)，录取1，平均581", subject:"history", min:580.5, max:580.5, avg:581, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","double","official","coop"]},
      {school:"中国美术学院", province:"浙江", level:"双一流/专业艺术院校", year:2025, info:"艺术与科技 (中外合作办学)，录取1，平均597", subject:"history", min:596.75, max:596.75, avg:597, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","double","official","coop"]},
      {school:"中国美术学院", province:"浙江", level:"双一流/专业艺术院校", year:2024, info:"艺术与科技 (中外合作办学)，录取1，平均600", subject:"history", min:599.5, max:599.5, avg:600, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","double","official","coop"]},
      {school:"中国人民大学", province:"北京", level:"985", year:2025, info:"绘画，录取2，平均611", subject:"history", min:610.75, max:611.25, avg:611, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"中国人民大学", province:"北京", level:"985", year:2024, info:"绘画，录取2，平均606", subject:"history", min:604.75, max:606.25, avg:606, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"中国人民大学", province:"北京", level:"985", year:2023, info:"绘画，录取2，平均611", subject:"history", min:610.3, max:612.3, avg:611, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"中国人民大学", province:"北京", level:"985", year:2025, info:"设计学类，录取2，平均615", subject:"history", min:615, max:615.25, avg:615, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"中国人民大学", province:"北京", level:"985", year:2024, info:"设计学类，录取2，平均611", subject:"history", min:609.5, max:611.75, avg:611, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"中国人民大学", province:"北京", level:"985", year:2023, info:"设计学类，录取2，平均614", subject:"history", min:613.2, max:615.3, avg:614, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"中国戏曲学院", province:"北京", level:"专业艺术院校", year:2025, info:"动画，录取1，平均563", subject:"history", min:563.25, max:563.25, avg:563, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"中国戏曲学院", province:"北京", level:"专业艺术院校", year:2024, info:"动画，录取1，平均546", subject:"history", min:546, max:546, avg:546, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"中国戏曲学院", province:"北京", level:"专业艺术院校", year:2025, info:"服装与服饰设计 (戏曲服装设计)，录取1，平均570", subject:"history", min:569.5, max:569.5, avg:570, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"中国戏曲学院", province:"北京", level:"专业艺术院校", year:2024, info:"服装与服饰设计 (戏曲服装设计)，录取1，平均546", subject:"history", min:545.75, max:545.75, avg:546, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"中国戏曲学院", province:"北京", level:"专业艺术院校", year:2025, info:"戏剧影视美术设计 (舞台灯光设计)，录取1，平均578", subject:"history", min:578.25, max:578.25, avg:578, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"中国戏曲学院", province:"北京", level:"专业艺术院校", year:2024, info:"戏剧影视美术设计 (舞台灯光设计)，录取1，平均563", subject:"history", min:563.25, max:563.25, avg:563, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"中国戏曲学院", province:"北京", level:"专业艺术院校", year:2025, info:"戏剧影视美术设计 (戏曲舞台设计)，录取1，平均581", subject:"history", min:581.25, max:581.25, avg:581, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"中国戏曲学院", province:"北京", level:"专业艺术院校", year:2024, info:"戏剧影视美术设计 (戏曲舞台设计)，录取1，平均571", subject:"history", min:570.5, max:570.5, avg:571, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"中华女子学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取3，平均514", subject:"history", min:510.75, max:516.5, avg:514, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"中华女子学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取3，平均508", subject:"history", min:506.75, max:510.25, avg:508, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"中华女子学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均524", subject:"history", min:522.75, max:526, avg:524, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"中华女子学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均516", subject:"history", min:516, max:516, avg:516, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"中南大学", province:"湖南", level:"985", year:2023, info:"设计学类，录取9，平均590", subject:"history", min:583.3, max:605.1, avg:590, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official"]},
      {school:"中南大学", province:"湖南", level:"985", year:2025, info:"艺术与科技，录取9，平均594", subject:"history", min:590.25, max:601.75, avg:594, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official"]},
      {school:"中南大学", province:"湖南", level:"985", year:2024, info:"艺术与科技，录取9，平均586", subject:"history", min:579.75, max:598.25, avg:586, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","plan","official"]},
      {school:"中南林业科技大学", province:"湖南", level:"公办", year:2025, info:"产品设计，录取4，平均531", subject:"history", min:529.75, max:534.25, avg:531, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"中南林业科技大学", province:"湖南", level:"公办", year:2024, info:"产品设计，录取4，平均528", subject:"history", min:525.75, max:531.5, avg:528, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"中南林业科技大学", province:"湖南", level:"公办", year:2023, info:"产品设计，录取4，平均539", subject:"history", min:538.6, max:539.1, avg:539, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"中南林业科技大学", province:"湖南", level:"公办", year:2025, info:"环境设计，录取4，平均527", subject:"history", min:526, max:528.5, avg:527, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"中南林业科技大学", province:"湖南", level:"公办", year:2024, info:"环境设计，录取4，平均523", subject:"history", min:521.5, max:525, avg:523, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"中南林业科技大学", province:"湖南", level:"公办", year:2023, info:"环境设计，录取4，平均538", subject:"history", min:536, max:540.5, avg:538, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"中南林业科技大学", province:"湖南", level:"公办", year:2025, info:"视觉传达设计，录取2，平均536", subject:"history", min:535.75, max:536.75, avg:536, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"中南林业科技大学", province:"湖南", level:"公办", year:2024, info:"视觉传达设计，录取2，平均531", subject:"history", min:530.75, max:531.75, avg:531, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"中南林业科技大学", province:"湖南", level:"公办", year:2023, info:"视觉传达设计，录取2，平均544", subject:"history", min:543.4, max:544.1, avg:544, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","official"]},
      {school:"中南林业科技大学涉外学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均481", subject:"history", min:479.5, max:483, avg:481, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"中央民族大学", province:"北京", level:"985", year:2025, info:"服装与服饰设计 (中外合作办学)，录取2，平均536", subject:"history", min:534.25, max:536.75, avg:536, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","art","official","coop"]},
      {school:"中央民族大学", province:"北京", level:"985", year:2024, info:"服装与服饰设计 (中外合作办学)，录取2，平均530", subject:"history", min:529.5, max:529.75, avg:530, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","art","official","coop"]},
      {school:"中央民族大学", province:"北京", level:"985", year:2023, info:"服装与服饰设计 (中外合作办学)，录取3，平均542", subject:"history", min:541.8, max:542.4, avg:542, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","art","official","coop"]},
      {school:"中央民族大学", province:"北京", level:"985", year:2025, info:"视觉传达设计 (中外合作办学)，录取2，平均548", subject:"history", min:541, max:554, avg:548, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","art","official","coop"]},
      {school:"中央民族大学", province:"北京", level:"985", year:2024, info:"视觉传达设计 (中外合作办学)，录取2，平均539", subject:"history", min:537, max:541.75, avg:539, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","art","official","coop"]},
      {school:"中央民族大学", province:"北京", level:"985", year:2023, info:"视觉传达设计 (中外合作办学)，录取3，平均552", subject:"history", min:545.2, max:563.9, avg:552, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["public","985","art","official","coop"]},
      {school:"中原工学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取3，平均505", subject:"history", min:504.25, max:506.5, avg:505, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"中原工学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取4，平均520", subject:"history", min:519.5, max:521, avg:520, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"中原工学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取4，平均496", subject:"history", min:494.75, max:499.25, avg:496, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"中原工学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取7，平均518", subject:"history", min:515.2, max:529.9, avg:518, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"中原工学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均500", subject:"history", min:494.75, max:502.75, avg:500, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"中原工学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取4，平均519", subject:"history", min:516.5, max:523, avg:519, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"中原工学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均516", subject:"history", min:514, max:516.5, avg:516, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"中原工学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取4，平均525", subject:"history", min:523.5, max:528.2, avg:525, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"仲恺农业工程学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取1，平均526", subject:"history", min:526, max:526, avg:526, status:"省教委官方数据（待坐标复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"仲恺农业工程学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取1，平均525", subject:"history", min:525, max:525.2, avg:525, status:"省教委官方数据（机器粘连拆分待复核）", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"仲恺农业工程学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取1，平均529", subject:"history", min:529.2, max:529.2, avg:529, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"珠海科技学院", province:"", level:"官方数据", year:2025, info:"动画，录取10，平均478", subject:"history", min:475.5, max:481.25, avg:478, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"珠海科技学院", province:"", level:"官方数据", year:2024, info:"动画，录取10，平均478", subject:"history", min:476.5, max:481.75, avg:478, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"珠海科技学院", province:"", level:"官方数据", year:2023, info:"动画，录取10，平均497", subject:"history", min:493.9, max:515.2, avg:497, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"珠海科技学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取16，平均483", subject:"history", min:477.25, max:493.5, avg:483, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"珠海科技学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取17，平均480", subject:"history", min:476.75, max:488.75, avg:480, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"珠海科技学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取17，平均500", subject:"history", min:496.6, max:512, avg:500, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"珠海科技学院", province:"", level:"官方数据", year:2025, info:"艺术与科技，录取2，平均487", subject:"history", min:481, max:492.25, avg:487, status:"省教委官方数据", source:"福建省教委官方结构化数据（2023-2025，用户提供）", tags:["official"]},
      {school:"福建技术师范学院", province:"福建", level:"公办", year:2025, info:"工艺美术，录取15，平均477", subject:"physics", min:469.75, max:492.75, avg:477, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建技术师范学院", province:"福建", level:"公办", year:2024, info:"工艺美术，录取10，平均484", subject:"physics", min:478, max:493.5, avg:484, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建技术师范学院", province:"福建", level:"公办", year:2023, info:"工艺美术，录取10，平均499", subject:"physics", min:497.2, max:503.1, avg:499, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建江夏学院", province:"福建", level:"公办", year:2025, info:"动画，录取13，平均505", subject:"physics", min:501, max:524.5, avg:505, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建江夏学院", province:"福建", level:"公办", year:2024, info:"动画，录取11，平均503", subject:"physics", min:500.5, max:512, avg:503, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建江夏学院", province:"福建", level:"公办", year:2023, info:"动画，录取4，平均522", subject:"physics", min:517.2, max:529.6, avg:522, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建江夏学院", province:"福建", level:"公办", year:2024, info:"动画 (中外合作办学)，录取5，平均485", subject:"physics", min:479, max:498.5, avg:485, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"福建江夏学院", province:"福建", level:"公办", year:2025, info:"艺术设计学，录取13，平均499", subject:"physics", min:494.25, max:506.5, avg:499, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建江夏学院", province:"福建", level:"公办", year:2024, info:"艺术设计学，录取10，平均504", subject:"physics", min:500, max:510.25, avg:504, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建江夏学院", province:"福建", level:"公办", year:2023, info:"艺术设计学，录取10，平均517", subject:"physics", min:514.8, max:521.6, avg:517, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建江夏学院 (闽台合作)", province:"福建", level:"公办", year:2023, info:"艺术设计学，录取5，平均502", subject:"physics", min:499.5, max:503.4, avg:502, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建江夏学院 (中外合作)", province:"福建", level:"公办", year:2025, info:"动画，录取5，平均470", subject:"physics", min:467.75, max:472, avg:470, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"福建江夏学院 (中外合作)", province:"福建", level:"公办", year:2023, info:"动画，录取5，平均497", subject:"physics", min:494.8, max:498.6, avg:497, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2025, info:"产品设计，录取9，平均520", subject:"physics", min:518.75, max:523.25, avg:520, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2024, info:"产品设计，录取9，平均523", subject:"physics", min:521.5, max:528.5, avg:523, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2023, info:"产品设计，录取10，平均532", subject:"physics", min:530.3, max:534, avg:532, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2025, info:"环境设计，录取9，平均516", subject:"physics", min:514.5, max:518.25, avg:516, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2024, info:"环境设计，录取9，平均519", subject:"physics", min:516.75, max:521, avg:519, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2023, info:"环境设计，录取10，平均531", subject:"physics", min:528, max:534.6, avg:531, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2025, info:"视觉传达设计，录取9，平均524", subject:"physics", min:522, max:526.5, avg:524, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2024, info:"视觉传达设计，录取9，平均527", subject:"physics", min:524.25, max:532.75, avg:527, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2023, info:"视觉传达设计，录取10，平均537", subject:"physics", min:534.6, max:544.2, avg:537, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2024, info:"数字媒体艺术，录取9，平均533", subject:"physics", min:528.5, max:538.5, avg:533, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学", province:"福建", level:"公办", year:2023, info:"数字媒体艺术，录取10，平均539", subject:"physics", min:536.5, max:543.6, avg:539, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建理工大学 (中外合作)", province:"福建", level:"公办", year:2025, info:"数字媒体艺术，录取4，平均500", subject:"physics", min:485.25, max:513, avg:500, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2025, info:"产品设计，录取13，平均533", subject:"physics", min:525.75, max:538.25, avg:533, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2024, info:"产品设计，录取5，平均543", subject:"physics", min:537.5, max:548.5, avg:543, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2023, info:"产品设计，录取7，平均546", subject:"physics", min:543, max:554.6, avg:546, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2025, info:"动画，录取10，平均534", subject:"physics", min:532.75, max:537.25, avg:534, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2024, info:"动画，录取5，平均541", subject:"physics", min:537.25, max:543, avg:541, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2023, info:"动画，录取7，平均546", subject:"physics", min:543.2, max:549, avg:546, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2025, info:"环境设计，录取10，平均524", subject:"physics", min:521.5, max:527.25, avg:524, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2024, info:"环境设计，录取5，平均539", subject:"physics", min:534, max:546.5, avg:539, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2023, info:"环境设计，录取7，平均541", subject:"physics", min:539.9, max:541.5, avg:541, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2024, info:"视觉传达设计，录取5，平均548", subject:"physics", min:546.25, max:552.25, avg:548, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建农林大学", province:"福建", level:"公办", year:2023, info:"视觉传达设计，录取7，平均553", subject:"physics", min:549.3, max:560.5, avg:553, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建商学院", province:"福建", level:"公办", year:2025, info:"工艺美术，录取20，平均473", subject:"physics", min:467.5, max:485.75, avg:473, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建商学院", province:"福建", level:"公办", year:2024, info:"工艺美术，录取12，平均479", subject:"physics", min:475.25, max:490.5, avg:479, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建商学院", province:"福建", level:"公办", year:2023, info:"工艺美术，录取12，平均499", subject:"physics", min:495, max:509, avg:499, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建商学院", province:"福建", level:"公办", year:2025, info:"环境设计，录取14，平均476", subject:"physics", min:471, max:483.25, avg:476, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建商学院", province:"福建", level:"公办", year:2024, info:"环境设计，录取12，平均485", subject:"physics", min:479, max:490.25, avg:485, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建商学院", province:"福建", level:"公办", year:2023, info:"环境设计，录取10，平均502", subject:"physics", min:499.1, max:506.7, avg:502, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建商学院", province:"福建", level:"公办", year:2025, info:"视觉传达设计，录取20，平均491", subject:"physics", min:486, max:500.75, avg:491, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建商学院", province:"福建", level:"公办", year:2024, info:"视觉传达设计，录取14，平均495", subject:"physics", min:492, max:499.75, avg:495, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建商学院", province:"福建", level:"公办", year:2023, info:"视觉传达设计，录取10，平均510", subject:"physics", min:507.1, max:513.9, avg:510, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建师范大学", province:"福建", level:"公办师范", year:2023, info:"动画，录取4，平均565", subject:"physics", min:562.9, max:566.7, avg:565, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建师范大学", province:"福建", level:"公办师范", year:2025, info:"美术学，录取13，平均548", subject:"physics", min:544, max:553.25, avg:548, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建师范大学", province:"福建", level:"公办师范", year:2024, info:"美术学，录取13，平均564", subject:"physics", min:560.25, max:574, avg:564, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建师范大学", province:"福建", level:"公办师范", year:2023, info:"美术学，录取14，平均571", subject:"physics", min:563.1, max:590.2, avg:571, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建师范大学", province:"福建", level:"公办师范", year:2025, info:"设计学类 (包含视觉传达设计、服装与服饰设计专业)，录取11，平均550", subject:"physics", min:545, max:565.25, avg:550, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建师范大学", province:"福建", level:"公办师范", year:2024, info:"设计学类 (包含视觉传达设计、环境设计、服装与服饰设计专业)，录取11，平均562", subject:"physics", min:559.25, max:566.25, avg:562, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建师范大学", province:"福建", level:"公办师范", year:2023, info:"设计学类 (含视觉传达设计、环境设计、服装与服饰设计专业)，录取10，平均567", subject:"physics", min:560.6, max:581, avg:567, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"福建师范大学协和学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取2，平均476", subject:"physics", min:475.75, max:476.5, avg:476, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福建师范大学协和学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取4，平均480", subject:"physics", min:477, max:487, avg:480, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福建师范大学协和学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取5，平均496", subject:"physics", min:494.7, max:499.6, avg:496, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福建师范大学协和学院", province:"福建", level:"官方数据", year:2025, info:"动画，录取2，平均484", subject:"physics", min:479.5, max:488.75, avg:484, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福建师范大学协和学院", province:"福建", level:"官方数据", year:2024, info:"动画，录取6，平均482", subject:"physics", min:477, max:497, avg:482, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福建师范大学协和学院", province:"福建", level:"官方数据", year:2023, info:"动画，录取6，平均503", subject:"physics", min:499.5, max:513.1, avg:503, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福建师范大学协和学院", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取2，平均469", subject:"physics", min:467.25, max:470.5, avg:469, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福建师范大学协和学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取5，平均475", subject:"physics", min:473, max:476.75, avg:475, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福建师范大学协和学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取5，平均497", subject:"physics", min:495.4, max:498.6, avg:497, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州大学", province:"福建", level:"211", year:2025, info:"美术学类 (含绘画、雕塑专业)，录取2，平均569", subject:"physics", min:559.5, max:577.75, avg:569, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"福州大学", province:"福建", level:"211", year:2024, info:"美术学类 (含绘画、雕塑专业)，录取2，平均574", subject:"physics", min:566.75, max:582, avg:574, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"福州大学", province:"福建", level:"211", year:2023, info:"美术学类 (含绘画、雕塑专业)，录取2，平均574", subject:"physics", min:574.4, max:574.5, avg:574, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"福州大学", province:"福建", level:"211", year:2023, info:"设计学类 (包含视觉传达设计、环境设计、产品设计、服装与服饰设计、工艺美术、数字媒体艺术专业)，录取10，平均578", subject:"physics", min:574.9, max:582.7, avg:578, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"福州大学", province:"福建", level:"211", year:2025, info:"设计学类 (含视觉传达设计、环境设计、产品设计、工艺美术、数字媒体艺术专业)，录取30，平均564", subject:"physics", min:550.25, max:581.75, avg:564, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"福州大学", province:"福建", level:"211", year:2024, info:"设计学类 (含视觉传达设计、环境设计、产品设计、工艺美术、数字媒体艺术专业)，录取30，平均577", subject:"physics", min:566.25, max:597, avg:577, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"福州大学 (面向厦门)", province:"福建", level:"211", year:2025, info:"美术学类 (含绘画、雕塑专业)，录取2，平均544", subject:"physics", min:540.25, max:547.75, avg:544, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"福州大学 (面向厦门)", province:"福建", level:"211", year:2024, info:"美术学类 (含绘画、雕塑专业)，录取2，平均560", subject:"physics", min:555.25, max:565.5, avg:560, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"福州大学 (面向厦门)", province:"福建", level:"211", year:2023, info:"美术学类 (含绘画、雕塑专业)，录取2，平均560", subject:"physics", min:557.9, max:562.9, avg:560, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取3，平均433", subject:"physics", min:419, max:440.75, avg:433, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取15，平均450", subject:"physics", min:441, max:471.25, avg:450, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取20，平均472", subject:"physics", min:466.7, max:503.9, avg:472, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取5，平均438", subject:"physics", min:429.75, max:459.75, avg:438, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取20，平均447", subject:"physics", min:422.5, max:485, avg:447, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取25，平均469", subject:"physics", min:464, max:476.3, avg:469, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取5，平均453", subject:"physics", min:430, max:471.5, avg:453, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取20，平均439", subject:"physics", min:425.25, max:460.5, avg:439, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取30，平均480", subject:"physics", min:475.1, max:507.6, avg:480, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2025, info:"数字媒体艺术，录取5，平均435", subject:"physics", min:418.25, max:457.5, avg:435, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2024, info:"数字媒体艺术，录取20，平均451", subject:"physics", min:416, max:477.25, avg:451, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州工商学院", province:"福建", level:"官方数据", year:2023, info:"数字媒体艺术，录取25，平均474", subject:"physics", min:470.2, max:483.2, avg:474, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州理工学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取10，平均442", subject:"physics", min:420, max:476, avg:442, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州理工学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取40，平均455", subject:"physics", min:424.5, max:492.5, avg:455, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州理工学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取25，平均475", subject:"physics", min:469.1, max:489.8, avg:475, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取3，平均440", subject:"physics", min:433.75, max:451, avg:440, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取3，平均461", subject:"physics", min:460.25, max:462.25, avg:461, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取5，平均485", subject:"physics", min:483.4, max:487.4, avg:485, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2025, info:"动画，录取3，平均449", subject:"physics", min:447.25, max:449.5, avg:449, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2024, info:"动画，录取3，平均462", subject:"physics", min:459.5, max:463, avg:462, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2023, info:"动画，录取5，平均487", subject:"physics", min:484.7, max:493.7, avg:487, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2025, info:"服装与服饰设计，录取3，平均458", subject:"physics", min:429.75, max:478.75, avg:458, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2024, info:"服装与服饰设计，录取3，平均453", subject:"physics", min:451, max:455.5, avg:453, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2023, info:"服装与服饰设计，录取5，平均483", subject:"physics", min:480.4, max:484.8, avg:483, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取3，平均431", subject:"physics", min:416, max:443.75, avg:431, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取3，平均459", subject:"physics", min:457.25, max:460.25, avg:459, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取5，平均483", subject:"physics", min:482.2, max:484.7, avg:483, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均463", subject:"physics", min:452.75, max:472.25, avg:463, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均468", subject:"physics", min:465.75, max:470.75, avg:468, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取5，平均492", subject:"physics", min:489, max:498.6, avg:492, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2025, info:"数字媒体艺术，录取3，平均457", subject:"physics", min:451.75, max:463.5, avg:457, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2024, info:"数字媒体艺术，录取3，平均466", subject:"physics", min:465, max:467, avg:466, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"福州外语外贸学院", province:"福建", level:"官方数据", year:2023, info:"数字媒体艺术，录取5，平均489", subject:"physics", min:486.1, max:495.9, avg:489, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"华侨大学", province:"福建", level:"公办/双一流培育", year:2025, info:"产品设计 (产品艺设、家具与室内)，录取3，平均540", subject:"physics", min:540, max:541, avg:540, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"华侨大学", province:"福建", level:"公办/双一流培育", year:2024, info:"产品设计 (产品艺设、家具与室内)，录取3，平均555", subject:"physics", min:552.5, max:558.5, avg:555, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"华侨大学", province:"福建", level:"公办/双一流培育", year:2023, info:"设计学类，录取6，平均558", subject:"physics", min:556, max:559, avg:558, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"华侨大学", province:"福建", level:"公办/双一流培育", year:2025, info:"视觉传达设计 (视传、数媒)，录取3，平均543", subject:"physics", min:541.75, max:544.75, avg:543, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"华侨大学", province:"福建", level:"公办/双一流培育", year:2024, info:"视觉传达设计 (视传、数媒)，录取3，平均556", subject:"physics", min:555, max:556.5, avg:556, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"集美大学", province:"福建", level:"公办", year:2025, info:"环境设计，录取10，平均528", subject:"physics", min:525.25, max:538.5, avg:528, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"集美大学", province:"福建", level:"公办", year:2024, info:"环境设计，录取10，平均540", subject:"physics", min:537.5, max:545, avg:540, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"集美大学", province:"福建", level:"公办", year:2023, info:"环境设计，录取10，平均548", subject:"physics", min:544, max:554.6, avg:548, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"集美大学", province:"福建", level:"公办", year:2025, info:"美术学，录取15，平均533", subject:"physics", min:529.25, max:539.25, avg:533, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"集美大学", province:"福建", level:"公办", year:2024, info:"美术学，录取20，平均546", subject:"physics", min:540.25, max:555.25, avg:546, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"集美大学", province:"福建", level:"公办", year:2023, info:"美术学，录取25，平均551", subject:"physics", min:544.1, max:560.9, avg:551, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"集美大学诚毅学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取5，平均485", subject:"physics", min:482.75, max:488.25, avg:485, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"集美大学诚毅学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取3，平均507", subject:"physics", min:503.3, max:511.1, avg:507, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"集美大学诚毅学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取10，平均483", subject:"physics", min:477.75, max:495.25, avg:483, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"集美大学诚毅学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取8，平均492", subject:"physics", min:487, max:499.5, avg:492, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"集美大学诚毅学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取7，平均510", subject:"physics", min:506.4, max:512.7, avg:510, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取29，平均477", subject:"physics", min:471, max:488.25, avg:477, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取17，平均483", subject:"physics", min:478.25, max:494.25, avg:483, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取20，平均504", subject:"physics", min:498.4, max:517.3, avg:504, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院", province:"福建", level:"官方数据", year:2025, info:"美术学，录取33，平均478", subject:"physics", min:469.5, max:500, avg:478, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院", province:"福建", level:"官方数据", year:2024, info:"美术学，录取11，平均494", subject:"physics", min:489.75, max:511.75, avg:494, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院", province:"福建", level:"官方数据", year:2023, info:"美术学，录取11，平均508", subject:"physics", min:505.5, max:515.3, avg:508, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院 (面向龙岩)", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取3，平均488", subject:"physics", min:483.75, max:491.25, avg:488, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院 (面向龙岩)", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取3，平均498", subject:"physics", min:494.2, max:502.9, avg:498, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院 (面向龙岩)", province:"福建", level:"官方数据", year:2024, info:"美术学，录取4，平均482", subject:"physics", min:474, max:486.5, avg:482, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"龙岩学院 (面向龙岩)", province:"福建", level:"官方数据", year:2023, info:"美术学，录取4，平均509", subject:"physics", min:502.7, max:516.3, avg:509, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2023, info:"雕塑，录取5，平均522", subject:"physics", min:517.1, max:536.5, avg:522, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2025, info:"服装与服饰设计，录取14，平均502", subject:"physics", min:497.75, max:512.25, avg:502, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2024, info:"服装与服饰设计，录取15，平均505", subject:"physics", min:501.25, max:511, avg:505, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2023, info:"服装与服饰设计，录取15，平均520", subject:"physics", min:515.8, max:531.2, avg:520, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2025, info:"工艺美术，录取6，平均507", subject:"physics", min:504.25, max:510.5, avg:507, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2024, info:"工艺美术，录取6，平均509", subject:"physics", min:506, max:511.75, avg:509, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2025, info:"环境设计，录取6，平均510", subject:"physics", min:508.75, max:512.5, avg:510, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2024, info:"环境设计，录取7，平均514", subject:"physics", min:511.25, max:515.75, avg:514, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2023, info:"环境设计，录取15，平均523", subject:"physics", min:520.3, max:527, avg:523, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2025, info:"绘画，录取7，平均509", subject:"physics", min:506.25, max:514.25, avg:509, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2024, info:"绘画，录取4，平均515", subject:"physics", min:513.5, max:516.75, avg:515, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2023, info:"绘画，录取10，平均523", subject:"physics", min:518.5, max:528.2, avg:523, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2025, info:"视觉传达设计，录取6，平均516", subject:"physics", min:514.75, max:516.5, avg:516, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2024, info:"视觉传达设计，录取6，平均520", subject:"physics", min:518.5, max:522, avg:520, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2023, info:"视觉传达设计，录取6，平均530", subject:"physics", min:529, max:532, avg:530, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2025, info:"数字媒体艺术，录取7，平均518", subject:"physics", min:516.75, max:518.75, avg:518, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2024, info:"数字媒体艺术，录取8，平均523", subject:"physics", min:520.75, max:526, avg:523, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院", province:"福建", level:"公办", year:2023, info:"数字媒体艺术，录取6，平均532", subject:"physics", min:529.9, max:534.6, avg:532, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院 (闽台合作)", province:"福建", level:"公办", year:2025, info:"服装与服饰设计，录取10，平均483", subject:"physics", min:480.25, max:491.5, avg:483, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院 (闽台合作)", province:"福建", level:"公办", year:2024, info:"服装与服饰设计，录取15，平均489", subject:"physics", min:480.25, max:499, avg:489, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院 (闽台合作)", province:"福建", level:"公办", year:2023, info:"服装与服饰设计，录取15，平均502", subject:"physics", min:497.7, max:507.9, avg:502, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院 (闽台合作)", province:"福建", level:"公办", year:2025, info:"环境设计，录取10，平均487", subject:"physics", min:483.25, max:491, avg:487, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院 (闽台合作)", province:"福建", level:"公办", year:2024, info:"环境设计，录取20，平均491", subject:"physics", min:485, max:497.75, avg:491, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院 (闽台合作)", province:"福建", level:"公办", year:2023, info:"环境设计，录取25，平均509", subject:"physics", min:504.9, max:516.8, avg:509, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"闽江学院 (中外合作)", province:"福建", level:"公办", year:2025, info:"视觉传达设计，录取9，平均459", subject:"physics", min:437.5, max:471.5, avg:459, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"闽江学院 (中外合作)", province:"福建", level:"公办", year:2024, info:"视觉传达设计，录取15，平均464", subject:"physics", min:422, max:538.5, avg:464, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"闽江学院 (中外合作)", province:"福建", level:"公办", year:2023, info:"视觉传达设计，录取15，平均496", subject:"physics", min:484.7, max:522.2, avg:496, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"闽南科技学院", province:"福建", level:"官方数据", year:2023, info:"数字媒体艺术，录取10，平均482", subject:"physics", min:480.8, max:483.5, avg:482, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取3，平均443", subject:"physics", min:442, max:444.75, avg:443, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取5，平均447", subject:"physics", min:423.25, max:475, avg:447, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取15，平均467", subject:"physics", min:464.2, max:475.8, avg:467, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2025, info:"服装与服饰设计，录取2，平均432", subject:"physics", min:420.75, max:443.25, avg:432, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2024, info:"服装与服饰设计，录取3，平均465", subject:"physics", min:453.5, max:473.25, avg:465, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2023, info:"服装与服饰设计，录取6，平均463", subject:"physics", min:462.3, max:462.7, avg:463, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取4，平均438", subject:"physics", min:424, max:465, avg:438, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取6，平均459", subject:"physics", min:440.75, max:471, avg:459, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取27，平均465", subject:"physics", min:462.8, max:478.7, avg:465, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取8，平均450", subject:"physics", min:445, max:464.75, avg:450, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取8，平均437", subject:"physics", min:424.75, max:452.25, avg:437, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取25，平均474", subject:"physics", min:469.6, max:487, avg:474, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2025, info:"数字媒体艺术，录取8，平均448", subject:"physics", min:430.75, max:480, avg:448, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2024, info:"数字媒体艺术，录取8，平均440", subject:"physics", min:428, max:446.75, avg:440, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"闽南理工学院", province:"福建", level:"官方数据", year:2023, info:"数字媒体艺术，录取27，平均470", subject:"physics", min:466.2, max:480.2, avg:470, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"闽南师范大学", province:"福建", level:"公办师范", year:2025, info:"公共艺术，录取30，平均502", subject:"physics", min:496, max:517.5, avg:502, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"闽南师范大学", province:"福建", level:"公办师范", year:2024, info:"公共艺术，录取30，平均507", subject:"physics", min:502.5, max:514.75, avg:507, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"闽南师范大学", province:"福建", level:"公办师范", year:2023, info:"公共艺术，录取19，平均524", subject:"physics", min:519.6, max:531.8, avg:524, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"闽南师范大学", province:"福建", level:"公办师范", year:2025, info:"美术学，录取24，平均513", subject:"physics", min:454.5, max:536, avg:513, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"闽南师范大学", province:"福建", level:"公办师范", year:2024, info:"美术学，录取24，平均522", subject:"physics", min:515.5, max:540, avg:522, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"闽南师范大学", province:"福建", level:"公办师范", year:2023, info:"美术学，录取30，平均535", subject:"physics", min:529.3, max:562.1, avg:535, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2025, info:"工艺美术，录取5，平均496", subject:"physics", min:492.25, max:499.25, avg:496, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2024, info:"工艺美术，录取5，平均505", subject:"physics", min:496.75, max:532.25, avg:505, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2023, info:"工艺美术，录取5，平均513", subject:"physics", min:510.3, max:515.6, avg:513, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2025, info:"环境设计，录取5，平均495", subject:"physics", min:491.25, max:505.5, avg:495, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2024, info:"环境设计，录取5，平均503", subject:"physics", min:498.75, max:514.75, avg:503, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2023, info:"环境设计，录取5，平均515", subject:"physics", min:512.3, max:519.6, avg:515, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2025, info:"美术学，录取10，平均488", subject:"physics", min:493, max:498, avg:488, status:"省教委官方数据；需确认：平均分明显不在最低-最高区间", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official","todo"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2024, info:"美术学，录取8，平均502", subject:"physics", min:501.25, max:505, avg:502, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2023, info:"美术学，录取8，平均518", subject:"physics", min:516, max:520.4, avg:518, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2025, info:"视觉传达设计，录取5，平均511", subject:"physics", min:505, max:514.25, avg:511, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2024, info:"视觉传达设计，录取5，平均509", subject:"physics", min:505.75, max:512.5, avg:509, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"莆田学院", province:"福建", level:"公办", year:2023, info:"视觉传达设计，录取5，平均521", subject:"physics", min:518.3, max:524.8, avg:521, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2025, info:"产品设计，录取13，平均498", subject:"physics", min:494.75, max:504.75, avg:498, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2024, info:"产品设计，录取5，平均507", subject:"physics", min:504, max:511.5, avg:507, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2023, info:"产品设计，录取7，平均520", subject:"physics", min:518.5, max:523.3, avg:520, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2025, info:"服装与服饰设计，录取18，平均475", subject:"physics", min:455.75, max:498.5, avg:475, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2024, info:"服装与服饰设计，录取14，平均498", subject:"physics", min:494.75, max:506.75, avg:498, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2023, info:"服装与服饰设计，录取15，平均511", subject:"physics", min:507.8, max:518.2, avg:511, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2025, info:"美术学，录取12，平均503", subject:"physics", min:500.75, max:505.75, avg:503, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2024, info:"美术学，录取10，平均512", subject:"physics", min:507.75, max:515, avg:512, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2023, info:"美术学，录取10，平均526", subject:"physics", min:522.1, max:527.7, avg:526, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2025, info:"视觉传达设计，录取7，平均510", subject:"physics", min:506.25, max:514.5, avg:510, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2024, info:"视觉传达设计，录取7，平均510", subject:"physics", min:508.5, max:513.5, avg:510, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2023, info:"视觉传达设计，录取6，平均522", subject:"physics", min:520.3, max:526.8, avg:522, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2025, info:"数字媒体艺术，录取7，平均512", subject:"physics", min:508.75, max:515.75, avg:512, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2024, info:"数字媒体艺术，录取5，平均514", subject:"physics", min:511.5, max:520.5, avg:514, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院", province:"福建", level:"公办师范", year:2023, info:"数字媒体艺术，录取5，平均527", subject:"physics", min:524.1, max:529.4, avg:527, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院 (闽台合作)", province:"福建", level:"公办师范", year:2025, info:"环境设计，录取5，平均478", subject:"physics", min:475.25, max:482, avg:478, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院 (闽台合作)", province:"福建", level:"公办师范", year:2024, info:"环境设计，录取5，平均485", subject:"physics", min:481.75, max:491, avg:485, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州师范学院 (闽台合作)", province:"福建", level:"公办师范", year:2023, info:"环境设计，录取10，平均502", subject:"physics", min:499.9, max:503.5, avg:502, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取5，平均443", subject:"physics", min:440, max:445, avg:443, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取5，平均449", subject:"physics", min:443.75, max:456.25, avg:449, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取10，平均474", subject:"physics", min:473.3, max:475.1, avg:474, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取2，平均435", subject:"physics", min:427, max:442.75, avg:435, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取5，平均443", subject:"physics", min:440.25, max:444, avg:443, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取10，平均478", subject:"physics", min:474.8, max:481.1, avg:478, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取5，平均450", subject:"physics", min:445.25, max:460.5, avg:450, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均454", subject:"physics", min:452.75, max:454.5, avg:454, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取10，平均481", subject:"physics", min:478.2, max:484.9, avg:481, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2025, info:"数字媒体艺术，录取5，平均456", subject:"physics", min:451, max:460, avg:456, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2024, info:"数字媒体艺术，录取5，平均455", subject:"physics", min:449.5, max:463, avg:455, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"泉州信息工程学院", province:"福建", level:"官方数据", year:2023, info:"数字媒体艺术，录取10，平均480", subject:"physics", min:476.7, max:486.5, avg:480, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"泉州职业技术大学", province:"福建", level:"官方数据", year:2025, info:"服装与服饰设计，录取2，平均475", subject:"physics", min:458.5, max:491.5, avg:475, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"泉州职业技术大学", province:"福建", level:"官方数据", year:2024, info:"服装与服饰设计，录取3，平均450", subject:"physics", min:449.5, max:450, avg:450, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"泉州职业技术大学", province:"福建", level:"官方数据", year:2023, info:"工艺美术，录取3，平均481", subject:"physics", min:480.6, max:482.3, avg:481, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"泉州职业技术大学", province:"福建", level:"官方数据", year:2025, info:"数字媒体艺术，录取5，平均443", subject:"physics", min:440.75, max:445.75, avg:443, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"泉州职业技术大学", province:"福建", level:"官方数据", year:2024, info:"数字媒体艺术，录取5，平均458", subject:"physics", min:452.25, max:466, avg:458, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"泉州职业技术大学", province:"福建", level:"官方数据", year:2023, info:"数字媒体艺术，录取10，平均480", subject:"physics", min:478.5, max:483.5, avg:480, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取6，平均481", subject:"physics", min:478, max:483.5, avg:481, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取9，平均483", subject:"physics", min:477.5, max:495.75, avg:483, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取14，平均500", subject:"physics", min:496.1, max:508.7, avg:500, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2025, info:"动画，录取16，平均486", subject:"physics", min:482.25, max:494.5, avg:486, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2024, info:"动画，录取13，平均488", subject:"physics", min:481.5, max:497.75, avg:488, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2023, info:"动画，录取18，平均505", subject:"physics", min:500.6, max:511.8, avg:505, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2025, info:"服装与服饰设计，录取7，平均470", subject:"physics", min:466.5, max:473.75, avg:470, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2024, info:"服装与服饰设计，录取6，平均476", subject:"physics", min:474, max:479.75, avg:476, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2023, info:"服装与服饰设计，录取19，平均495", subject:"physics", min:491.5, max:501.3, avg:495, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取2，平均477", subject:"physics", min:476.5, max:478, avg:477, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取3，平均480", subject:"physics", min:479.25, max:480.5, avg:480, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取8，平均500", subject:"physics", min:498.2, max:505.9, avg:500, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2025, info:"美术学，录取4，平均487", subject:"physics", min:484.25, max:492.75, avg:487, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2024, info:"美术学，录取9，平均497", subject:"physics", min:494.25, max:500.25, avg:497, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2023, info:"美术学，录取11，平均512", subject:"physics", min:509.1, max:515, avg:512, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取4，平均503", subject:"physics", min:503, max:503.5, avg:503, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均503", subject:"physics", min:500.25, max:505, avg:503, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取8，平均516", subject:"physics", min:513.3, max:522.5, avg:516, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (面向三明)", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取2，平均480", subject:"physics", min:480, max:480.25, avg:480, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (面向三明)", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取5，平均473", subject:"physics", min:468.25, max:481.75, avg:473, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (面向三明)", province:"福建", level:"官方数据", year:2025, info:"动画，录取2，平均494", subject:"physics", min:493.5, max:494.75, avg:494, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (面向三明)", province:"福建", level:"官方数据", year:2024, info:"动画，录取5，平均481", subject:"physics", min:474, max:492.25, avg:481, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (面向三明)", province:"福建", level:"官方数据", year:2025, info:"服装与服饰设计，录取2，平均469", subject:"physics", min:464.25, max:474, avg:469, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (面向三明)", province:"福建", level:"官方数据", year:2024, info:"服装与服饰设计，录取8，平均448", subject:"physics", min:417.75, max:467.75, avg:448, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (面向三明)", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取2，平均474", subject:"physics", min:472, max:475.25, avg:474, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (面向三明)", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取5，平均467", subject:"physics", min:462.5, max:471.75, avg:467, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (面向三明)", province:"福建", level:"官方数据", year:2025, info:"美术学，录取2，平均483", subject:"physics", min:481, max:485.25, avg:483, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (面向三明)", province:"福建", level:"官方数据", year:2024, info:"美术学，录取2，平均491", subject:"physics", min:490.5, max:491, avg:491, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (面向三明)", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均491", subject:"physics", min:489, max:493.5, avg:491, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (面向三明)", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均486", subject:"physics", min:483.75, max:490, avg:486, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (闽台合作)", province:"福建", level:"官方数据", year:2025, info:"动画，录取13，平均464", subject:"physics", min:458.25, max:473.25, avg:464, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (闽台合作)", province:"福建", level:"官方数据", year:2024, info:"动画，录取13，平均468", subject:"physics", min:464.75, max:473, avg:468, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (闽台合作)", province:"福建", level:"官方数据", year:2023, info:"动画，录取13，平均491", subject:"physics", min:487.4, max:494.2, avg:491, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (闽台合作)", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取40，平均452", subject:"physics", min:447.25, max:462.5, avg:452, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (闽台合作)", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取27，平均463", subject:"physics", min:458.65, max:466.25, avg:463, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (闽台合作)", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取27，平均489", subject:"physics", min:486.9, max:492.6, avg:489, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (闽台合作)", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取40，平均463", subject:"physics", min:456.75, max:479, avg:463, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (闽台合作)", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取27，平均470", subject:"physics", min:466.5, max:487.25, avg:470, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三明学院 (闽台合作)", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取27，平均492", subject:"physics", min:489.4, max:498.9, avg:492, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取5，平均481", subject:"physics", min:475.5, max:496, avg:481, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取5，平均483", subject:"physics", min:477, max:489.75, avg:483, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取5，平均498", subject:"physics", min:495.7, max:501.4, avg:498, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2024, info:"动画，录取5，平均486", subject:"physics", min:481.25, max:492, avg:486, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2023, info:"动画，录取10，平均502", subject:"physics", min:499.7, max:506.9, avg:502, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取12，平均472", subject:"physics", min:466.5, max:484.5, avg:472, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取10，平均477", subject:"physics", min:475.25, max:478.5, avg:477, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取13，平均499", subject:"physics", min:496.1, max:506.3, avg:499, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2025, info:"美术学，录取5，平均481", subject:"physics", min:476.75, max:485.5, avg:481, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2024, info:"美术学，录取5，平均487", subject:"physics", min:483.75, max:489.75, avg:487, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2023, info:"美术学，录取8，平均502", subject:"physics", min:499.7, max:506.2, avg:502, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取5，平均493", subject:"physics", min:486.25, max:502, avg:493, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均500", subject:"physics", min:491.75, max:500.5, avg:500, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取6，平均506", subject:"physics", min:505, max:508.6, avg:506, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2025, info:"数字媒体艺术，录取11，平均491", subject:"physics", min:487.25, max:502.25, avg:491, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2024, info:"数字媒体艺术，录取5，平均496", subject:"physics", min:494.25, max:500.5, avg:496, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院", province:"福建", level:"官方数据", year:2023, info:"数字媒体艺术，录取6，平均510", subject:"physics", min:505.2, max:519.5, avg:510, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院 (闽台合作)", province:"福建", level:"官方数据", year:2025, info:"美术学，录取10，平均460", subject:"physics", min:458.75, max:465.5, avg:460, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院 (闽台合作)", province:"福建", level:"官方数据", year:2024, info:"美术学，录取10，平均472", subject:"physics", min:468.75, max:477, avg:472, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院 (闽台合作)", province:"福建", level:"官方数据", year:2023, info:"美术学，录取10，平均492", subject:"physics", min:490.1, max:495, avg:492, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院 (闽台合作)", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取10，平均468", subject:"physics", min:464.25, max:476, avg:468, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院 (闽台合作)", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取10，平均474", subject:"physics", min:470.75, max:484.75, avg:474, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武夷学院 (闽台合作)", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取14，平均493", subject:"physics", min:491.2, max:501, avg:493, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学", province:"福建", level:"985", year:2025, info:"环境设计 (中外合作办学)，录取2，平均541", subject:"physics", min:538, max:543, avg:541, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2023, info:"环境设计 (中外合作办学)，录取3，平均491", subject:"physics", min:472.3, max:513.4, avg:491, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2025, info:"绘画，录取4，平均593", subject:"physics", min:589, max:599.75, avg:593, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2024, info:"绘画，录取6，平均603", subject:"physics", min:595.5, max:608.25, avg:603, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2023, info:"绘画，录取6，平均591", subject:"physics", min:587.1, max:594.3, avg:591, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2025, info:"视觉传达设计 (中外合作办学)，录取2，平均559", subject:"physics", min:549.75, max:568.25, avg:559, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2024, info:"视觉传达设计 (中外合作办学)，录取5，平均521", subject:"physics", min:547.25, max:553.25, avg:521, status:"省教委官方数据；需确认：平均分明显不在最低-最高区间", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","plan","official","coop","todo"]},
      {school:"厦门大学", province:"福建", level:"985", year:2023, info:"视觉传达设计 (中外合作办学)，录取3，平均535", subject:"physics", min:514.9, max:559.8, avg:535, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2025, info:"数字媒体艺术 (中外合作办学)，录取4，平均559", subject:"physics", min:548, max:566.75, avg:559, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2024, info:"数字媒体艺术 (中外合作办学)，录取7，平均532", subject:"physics", min:507.25, max:553.75, avg:532, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学", province:"福建", level:"985", year:2023, info:"数字媒体艺术 (中外合作办学)，录取9，平均545", subject:"physics", min:508.8, max:569.7, avg:545, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","plan","official","coop"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取11，平均483", subject:"physics", min:483.75, max:491.25, avg:483, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取11，平均491", subject:"physics", min:487, max:497.25, avg:491, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取11，平均511", subject:"physics", min:506.9, max:523.2, avg:511, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2025, info:"动画，录取11，平均491", subject:"physics", min:482.75, max:506.25, avg:491, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2024, info:"动画，录取11，平均495", subject:"physics", min:490.75, max:499.75, avg:495, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2023, info:"动画，录取11，平均515", subject:"physics", min:510.3, max:518.6, avg:515, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取2，平均495", subject:"physics", min:488.75, max:500.75, avg:495, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取2，平均500", subject:"physics", min:499.25, max:500.75, avg:500, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门大学嘉庚学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取2，平均517", subject:"physics", min:514.3, max:519.1, avg:517, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门工学院", province:"福建", level:"官方数据", year:2025, info:"产品设计，录取12，平均449", subject:"physics", min:440.25, max:469, avg:449, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门工学院", province:"福建", level:"官方数据", year:2024, info:"产品设计，录取8，平均457", subject:"physics", min:445.75, max:481.5, avg:457, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门工学院", province:"福建", level:"官方数据", year:2023, info:"产品设计，录取8，平均485", subject:"physics", min:480.5, max:493.9, avg:485, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门工学院", province:"福建", level:"官方数据", year:2025, info:"动画，录取8，平均441", subject:"physics", min:428.25, max:474.5, avg:441, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门工学院", province:"福建", level:"官方数据", year:2024, info:"动画，录取8，平均456", subject:"physics", min:449.25, max:469.25, avg:456, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门工学院", province:"福建", level:"官方数据", year:2023, info:"动画，录取8，平均488", subject:"physics", min:483.7, max:494.7, avg:488, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门华厦学院", province:"福建", level:"官方数据", year:2025, info:"环境设计，录取5，平均448", subject:"physics", min:425.5, max:463, avg:448, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门华厦学院", province:"福建", level:"官方数据", year:2024, info:"环境设计，录取5，平均460", subject:"physics", min:453.5, max:471.75, avg:460, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门华厦学院", province:"福建", level:"官方数据", year:2023, info:"环境设计，录取5，平均483", subject:"physics", min:481.6, max:483.3, avg:483, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门华厦学院", province:"福建", level:"官方数据", year:2025, info:"视觉传达设计，录取5，平均449", subject:"physics", min:445.25, max:456.25, avg:449, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门华厦学院", province:"福建", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均464", subject:"physics", min:456, max:470.25, avg:464, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门华厦学院", province:"福建", level:"官方数据", year:2023, info:"视觉传达设计，录取5，平均489", subject:"physics", min:485.5, max:494.6, avg:489, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门华厦学院", province:"福建", level:"官方数据", year:2025, info:"数字媒体艺术，录取5，平均456", subject:"physics", min:449.75, max:463.75, avg:456, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门华厦学院", province:"福建", level:"官方数据", year:2024, info:"数字媒体艺术，录取5，平均458", subject:"physics", min:456.5, max:462.25, avg:458, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门华厦学院", province:"福建", level:"官方数据", year:2023, info:"数字媒体艺术，录取5，平均487", subject:"physics", min:484.9, max:493.4, avg:487, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2025, info:"产品设计，录取2，平均522", subject:"physics", min:521.75, max:522, avg:522, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2024, info:"产品设计，录取2，平均531", subject:"physics", min:529, max:533.75, avg:531, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2025, info:"服装与服饰设计，录取3，平均518", subject:"physics", min:517, max:520.25, avg:518, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2024, info:"服装与服饰设计，录取2，平均527", subject:"physics", min:525.75, max:528, avg:527, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2023, info:"服装与服饰设计，录取2，平均536", subject:"physics", min:533.8, max:537.8, avg:536, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2025, info:"环境设计，录取3，平均518", subject:"physics", min:516.75, max:518.75, avg:518, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2023, info:"设计学类 (含视觉传达设计、环境设计、产品设计专业)，录取4，平均539", subject:"physics", min:538.3, max:539.3, avg:539, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2025, info:"视觉传达设计，录取2，平均525", subject:"physics", min:524.75, max:525, avg:525, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2025, info:"数字媒体艺术，录取5，平均531", subject:"physics", min:526.75, max:538, avg:531, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2024, info:"数字媒体艺术，录取4，平均534", subject:"physics", min:530.5, max:536.25, avg:534, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2023, info:"数字媒体艺术，录取3，平均538", subject:"physics", min:537.4, max:539.1, avg:538, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院", province:"福建", level:"公办", year:2024, info:"影视摄影与制作，录取2，平均527", subject:"physics", min:523.5, max:529.75, avg:527, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院 (面向厦门)", province:"福建", level:"公办", year:2025, info:"服装与服饰设计，录取2，平均514", subject:"physics", min:513, max:515.5, avg:514, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院 (面向厦门)", province:"福建", level:"公办", year:2025, info:"数字媒体艺术，录取2，平均525", subject:"physics", min:524.25, max:524.75, avg:525, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院 (面向厦门)", province:"福建", level:"公办", year:2024, info:"数字媒体艺术，录取2，平均527", subject:"physics", min:526.75, max:527.75, avg:527, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"厦门理工学院 (面向厦门)", province:"福建", level:"公办", year:2023, info:"数字媒体艺术，录取1，平均543", subject:"physics", min:542.9, max:542.9, avg:543, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"阳光学院", province:"福建", level:"官方数据", year:2025, info:"美术学，录取6，平均449", subject:"physics", min:434.75, max:472, avg:449, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"阳光学院", province:"福建", level:"官方数据", year:2024, info:"美术学，录取5，平均459", subject:"physics", min:449, max:476, avg:459, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"阳光学院", province:"福建", level:"官方数据", year:2023, info:"美术学，录取10，平均482", subject:"physics", min:480.1, max:484.5, avg:482, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"阳光学院", province:"福建", level:"官方数据", year:2025, info:"数字媒体艺术，录取5，平均442", subject:"physics", min:431.5, max:464.75, avg:442, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"阳光学院", province:"福建", level:"官方数据", year:2024, info:"数字媒体艺术，录取3，平均454", subject:"physics", min:451.25, max:457.25, avg:454, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"阳光学院", province:"福建", level:"官方数据", year:2023, info:"数字媒体艺术，录取15，平均480", subject:"physics", min:477.3, max:485.7, avg:480, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2025, info:"环境设计，录取1，平均519", subject:"physics", min:518.5, max:518.5, avg:519, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2024, info:"环境设计，录取1，平均526", subject:"physics", min:526, max:526, avg:526, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工程大学", province:"安徽", level:"公办", year:2023, info:"环境设计，录取1，平均530", subject:"physics", min:529.5, max:529.5, avg:530, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"安徽工业大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均514", subject:"physics", min:508.75, max:519, avg:514, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"安徽工业大学", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均520", subject:"physics", min:515.75, max:526.25, avg:520, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"安徽工业大学", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均526", subject:"physics", min:525.9, max:527.1, avg:526, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"安徽工业大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均521", subject:"physics", min:520.25, max:520.75, avg:521, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"安徽工业大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均531", subject:"physics", min:526.5, max:534.5, avg:531, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"安徽工业大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均538", subject:"physics", min:538, max:538.4, avg:538, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"安徽工业大学", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均530", subject:"physics", min:527.75, max:531.25, avg:530, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"安徽工业大学", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均541", subject:"physics", min:536.5, max:546.25, avg:541, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"安徽工业大学", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均541", subject:"physics", min:539.1, max:542.6, avg:541, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取2，平均477", subject:"physics", min:470.75, max:483, avg:477, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2025, info:"动画，录取2，平均435", subject:"physics", min:413.25, max:455.75, avg:435, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2024, info:"动画，录取2，平均467", subject:"physics", min:447.75, max:486, avg:467, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取2，平均419", subject:"physics", min:409.5, max:428.5, avg:419, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均445", subject:"physics", min:444.5, max:445, avg:445, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2025, info:"绘画，录取1，平均426", subject:"physics", min:426.25, max:426.25, avg:426, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2024, info:"绘画，录取2，平均454", subject:"physics", min:440.25, max:467.25, avg:454, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2025, info:"美术学，录取1，平均420", subject:"physics", min:419.5, max:419.5, avg:420, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2024, info:"美术学，录取2，平均444", subject:"physics", min:439.25, max:449.5, avg:444, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2024, info:"摄影，录取2，平均412", subject:"physics", min:409.75, max:413.25, avg:412, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均444", subject:"physics", min:441.5, max:447, avg:444, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均452", subject:"physics", min:449.75, max:454.75, avg:452, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均423", subject:"physics", min:421, max:431.25, avg:423, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均433", subject:"physics", min:425.25, max:441, avg:433, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"北海艺术设计学院", province:"", level:"官方数据", year:2025, info:"艺术与科技，录取1，平均420", subject:"physics", min:419.75, max:419.75, avg:420, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"北京服装学院", province:"北京", level:"公办/设计强校", year:2025, info:"产品设计，录取1，平均563", subject:"physics", min:563, max:563, avg:563, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京服装学院", province:"北京", level:"公办/设计强校", year:2024, info:"产品设计，录取1，平均584", subject:"physics", min:584, max:584, avg:584, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京服装学院", province:"北京", level:"公办/设计强校", year:2025, info:"环境设计，录取1，平均551", subject:"physics", min:551.25, max:551.25, avg:551, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京服装学院", province:"北京", level:"公办/设计强校", year:2024, info:"环境设计，录取1，平均575", subject:"physics", min:575, max:575, avg:575, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"北京航空航天大学", province:"北京", level:"985", year:2025, info:"设计学类，录取1，平均620", subject:"physics", min:620, max:620, avg:620, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"北京航空航天大学", province:"北京", level:"985", year:2024, info:"设计学类，录取1，平均626", subject:"physics", min:626.25, max:626.25, avg:626, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"北京航空航天大学", province:"北京", level:"985", year:2023, info:"设计学类，录取1，平均613", subject:"physics", min:612.6, max:612.6, avg:613, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"北京林业大学", province:"北京", level:"211/双一流", year:2025, info:"设计学类，录取2，平均585", subject:"physics", min:584.75, max:585.5, avg:585, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"北京林业大学", province:"北京", level:"211/双一流", year:2024, info:"设计学类，录取2，平均592", subject:"physics", min:591, max:592, avg:592, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"北京林业大学", province:"北京", level:"211/双一流", year:2023, info:"设计学类，录取2，平均587", subject:"physics", min:586.4, max:587.1, avg:587, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"长江师范学院", province:"", level:"官方数据", year:2024, info:"雕塑，录取2，平均495", subject:"physics", min:486.5, max:502.5, avg:495, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"长江师范学院", province:"", level:"官方数据", year:2023, info:"雕塑，录取2，平均511", subject:"physics", min:509.8, max:511.2, avg:511, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"长江师范学院", province:"", level:"官方数据", year:2025, info:"美术学，录取1，平均503", subject:"physics", min:503.25, max:503.25, avg:503, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"长江师范学院", province:"", level:"官方数据", year:2024, info:"美术学，录取2，平均505", subject:"physics", min:503.25, max:507.5, avg:505, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"长江师范学院", province:"", level:"官方数据", year:2023, info:"美术学，录取2，平均518", subject:"physics", min:516.8, max:518.7, avg:518, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"长沙学院", province:"", level:"官方数据", year:2025, info:"动画，录取2，平均526", subject:"physics", min:523.75, max:527.25, avg:526, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"长沙学院", province:"", level:"官方数据", year:2024, info:"动画，录取2，平均526", subject:"physics", min:518, max:534, avg:526, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"长沙学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均492", subject:"physics", min:491.5, max:491.5, avg:492, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"长沙学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取1，平均498", subject:"physics", min:497.5, max:497.5, avg:498, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"长沙学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均517", subject:"physics", min:514.5, max:518.75, avg:517, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"长沙学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均508", subject:"physics", min:507, max:508.75, avg:508, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"成都大学", province:"四川", level:"公办", year:2025, info:"数字媒体艺术，录取1，平均541", subject:"physics", min:540.5, max:540.5, avg:541, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"成都大学", province:"四川", level:"公办", year:2024, info:"数字媒体艺术，录取1，平均551", subject:"physics", min:551.25, max:551.25, avg:551, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"成都锦城学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取2，平均474", subject:"physics", min:469.5, max:478, avg:474, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"成都锦城学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取2，平均471", subject:"physics", min:470, max:472.75, avg:471, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"成都锦城学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取2，平均496", subject:"physics", min:495.3, max:496.8, avg:496, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"成都锦城学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取2，平均446", subject:"physics", min:444.75, max:447, avg:446, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"成都锦城学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取2，平均472", subject:"physics", min:466.75, max:476.75, avg:472, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"成都锦城学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取2，平均484", subject:"physics", min:483.7, max:484, avg:484, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"成都锦城学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取1，平均497", subject:"physics", min:497.4, max:497.4, avg:497, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"成都锦城学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取1，平均505", subject:"physics", min:504.7, max:504.7, avg:505, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"成都师范学院", province:"", level:"官方数据", year:2025, info:"艺术设计学，录取2，平均522", subject:"physics", min:521.75, max:522.25, avg:522, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"成都师范学院", province:"", level:"官方数据", year:2024, info:"艺术设计学，录取2，平均508", subject:"physics", min:506.5, max:509.5, avg:508, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"成都师范学院", province:"", level:"官方数据", year:2023, info:"艺术设计学，录取3，平均519", subject:"physics", min:518.7, max:520.4, avg:519, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"重庆城市科技学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取1，平均476", subject:"physics", min:476, max:476, avg:476, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"重庆城市科技学院", province:"", level:"官方数据", year:2024, info:"摄影，录取1，平均448", subject:"physics", min:447.75, max:447.75, avg:448, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"重庆城市科技学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取1，平均460", subject:"physics", min:459.75, max:459.75, avg:460, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"重庆城市科技学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取1，平均471", subject:"physics", min:470.75, max:470.75, avg:471, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"重庆城市科技学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取1，平均460", subject:"physics", min:460, max:460, avg:460, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"重庆城市科技学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取1，平均468", subject:"physics", min:467.75, max:467.75, avg:468, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"重庆城市科技学院", province:"", level:"官方数据", year:2025, info:"新媒体艺术，录取1，平均470", subject:"physics", min:470, max:470, avg:470, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"重庆城市科技学院", province:"", level:"官方数据", year:2024, info:"新媒体艺术，录取1，平均470", subject:"physics", min:469.75, max:469.75, avg:470, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"重庆师范大学", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取1，平均534", subject:"physics", min:534.25, max:534.25, avg:534, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"重庆师范大学", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均543", subject:"physics", min:539.25, max:546.5, avg:543, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"重庆文理学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均499", subject:"physics", min:497.75, max:501, avg:499, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"重庆文理学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均518", subject:"physics", min:517.5, max:517.7, avg:518, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"重庆文理学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均516", subject:"physics", min:510.25, max:521.75, avg:516, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"重庆文理学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均524", subject:"physics", min:524.4, max:524.5, avg:524, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"电子科技大学成都学院", province:"", level:"官方数据", year:2025, info:"动画，录取2，平均486", subject:"physics", min:465.75, max:505.5, avg:486, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"电子科技大学成都学院", province:"", level:"官方数据", year:2024, info:"动画，录取2，平均487", subject:"physics", min:486.5, max:487.75, avg:487, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"电子科技大学成都学院", province:"", level:"官方数据", year:2023, info:"动画，录取2，平均501", subject:"physics", min:500.2, max:501.9, avg:501, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"电子科技大学成都学院", province:"", level:"官方数据", year:2025, info:"艺术与科技，录取2，平均463", subject:"physics", min:457.5, max:469.25, avg:463, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"电子科技大学成都学院", province:"", level:"官方数据", year:2024, info:"艺术与科技，录取2，平均469", subject:"physics", min:467.75, max:470.25, avg:469, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"电子科技大学成都学院", province:"", level:"官方数据", year:2023, info:"艺术与科技，录取2，平均491", subject:"physics", min:489.6, max:491.5, avg:491, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2024, info:"服装与服饰设计，录取1，平均591", subject:"physics", min:591.25, max:591.25, avg:591, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2025, info:"服装与服饰设计 (中外合作办学)(中英合作)，录取1，平均572", subject:"physics", min:572, max:572, avg:572, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2024, info:"服装与服饰设计 (中外合作办学)(中英合作)，录取1，平均590", subject:"physics", min:590, max:590, avg:590, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2025, info:"环境设计 (中外合作办学)(中英合作)，录取2，平均561", subject:"physics", min:552.75, max:568.25, avg:561, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2024, info:"环境设计 (中外合作办学)(中英合作)，录取1，平均580", subject:"physics", min:579.75, max:579.75, avg:580, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东华大学", province:"上海", level:"211/双一流", year:2024, info:"视觉传达设计，录取1，平均601", subject:"physics", min:601.25, max:601.25, avg:601, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","coop","official"]},
      {school:"东南大学", province:"江苏", level:"985", year:2025, info:"设计学类，录取1，平均620", subject:"physics", min:620, max:620, avg:620, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","plan","official"]},
      {school:"东南大学", province:"江苏", level:"985", year:2024, info:"设计学类，录取1，平均613", subject:"physics", min:613, max:613, avg:613, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","plan","official"]},
      {school:"东南大学", province:"江苏", level:"985", year:2023, info:"设计学类，录取1，平均600", subject:"physics", min:600.3, max:600.3, avg:600, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","plan","official"]},
      {school:"赣东学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取1，平均467", subject:"physics", min:467.25, max:467.25, avg:467, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"赣东学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取1，平均474", subject:"physics", min:473.75, max:473.75, avg:474, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"赣东学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取1，平均494", subject:"physics", min:494.3, max:494.3, avg:494, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"赣东学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均496", subject:"physics", min:494.5, max:497.5, avg:496, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"赣东学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均492", subject:"physics", min:492, max:492, avg:492, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"赣东学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均500", subject:"physics", min:498.8, max:500.9, avg:500, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"赣南科技学院", province:"", level:"官方数据", year:2025, info:"设计学类，录取5，平均481", subject:"physics", min:477.5, max:487, avg:481, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"赣南科技学院", province:"", level:"官方数据", year:2024, info:"设计学类，录取5，平均481", subject:"physics", min:476, max:498.25, avg:481, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"赣南科技学院", province:"", level:"官方数据", year:2023, info:"设计学类，录取5，平均499", subject:"physics", min:496.8, max:504, avg:499, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"广西艺术学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均514", subject:"physics", min:513.75, max:513.75, avg:514, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"广西艺术学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取1，平均522", subject:"physics", min:521.5, max:521.5, avg:522, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"广西艺术学院", province:"", level:"官方数据", year:2025, info:"绘画，录取1，平均510", subject:"physics", min:509.5, max:509.5, avg:510, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"广西艺术学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取1，平均532", subject:"physics", min:532.25, max:532.25, avg:532, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"广西艺术学院", province:"", level:"官方数据", year:2025, info:"影视摄影与制作，录取1，平均518", subject:"physics", min:518, max:518, avg:518, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"广西艺术学院", province:"", level:"官方数据", year:2025, info:"中国画，录取1，平均528", subject:"physics", min:527.5, max:527.5, avg:528, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"广西艺术学院", province:"", level:"官方数据", year:2024, info:"中国画，录取1，平均544", subject:"physics", min:544, max:544, avg:544, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"桂林理工大学", province:"", level:"官方数据", year:2025, info:"工艺美术，录取3，平均496", subject:"physics", min:495, max:497.25, avg:496, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"哈尔滨工业大学", province:"", level:"官方数据", year:2023, info:"数字媒体艺术 (中外合作办学)，录取3，平均574", subject:"physics", min:571.9, max:575.3, avg:574, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official","coop"]},
      {school:"哈尔滨师范大学", province:"", level:"官方数据", year:2025, info:"雕塑，录取1，平均501", subject:"physics", min:501.25, max:501.25, avg:501, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"哈尔滨师范大学", province:"", level:"官方数据", year:2024, info:"雕塑，录取1，平均507", subject:"physics", min:506.75, max:506.75, avg:507, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"哈尔滨师范大学", province:"", level:"官方数据", year:2023, info:"雕塑，录取1，平均528", subject:"physics", min:528.1, max:528.1, avg:528, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"哈尔滨师范大学", province:"", level:"官方数据", year:2025, info:"绘画 (版画)，录取1，平均508", subject:"physics", min:508.25, max:508.25, avg:508, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"哈尔滨师范大学", province:"", level:"官方数据", year:2024, info:"绘画 (版画)，录取1，平均510", subject:"physics", min:510, max:510, avg:510, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"哈尔滨师范大学", province:"", level:"官方数据", year:2023, info:"绘画 (版画)，录取1，平均528", subject:"physics", min:527.6, max:527.6, avg:528, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"哈尔滨师范大学", province:"", level:"官方数据", year:2025, info:"绘画 (油画)，录取1，平均511", subject:"physics", min:511.25, max:511.25, avg:511, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"哈尔滨师范大学", province:"", level:"官方数据", year:2024, info:"绘画 (油画)，录取1，平均517", subject:"physics", min:517, max:517, avg:517, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"哈尔滨师范大学", province:"", level:"官方数据", year:2023, info:"绘画 (油画)，录取1，平均526", subject:"physics", min:526.1, max:526.1, avg:526, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"海口经济学院", province:"", level:"官方数据", year:2024, info:"摄影，录取2，平均450", subject:"physics", min:440, max:460, avg:450, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"海南师范大学", province:"", level:"官方数据", year:2023, info:"环境设计 (中外合作办学)，录取2，平均527", subject:"physics", min:518.7, max:535, avg:527, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official","coop"]},
      {school:"河北工程大学", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均503", subject:"physics", min:502.5, max:502.5, avg:503, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"河北美术学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均456", subject:"physics", min:456.25, max:456.25, avg:456, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"河北美术学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均440", subject:"physics", min:428.25, max:458.75, avg:440, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"河北美术学院", province:"", level:"官方数据", year:2025, info:"新媒体艺术，录取2，平均458", subject:"physics", min:445, max:470.75, avg:458, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"河北美术学院", province:"", level:"官方数据", year:2024, info:"新媒体艺术，录取2，平均495", subject:"physics", min:482.75, max:507.5, avg:495, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"河南工业大学", province:"", level:"官方数据", year:2024, info:"设计学类，录取2，平均539", subject:"physics", min:537, max:540.75, avg:539, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"河南工业大学", province:"", level:"官方数据", year:2023, info:"设计学类，录取2，平均543", subject:"physics", min:539.5, max:547.4, avg:543, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"黑龙江财经学院", province:"", level:"官方数据", year:2024, info:"动画，录取1，平均435", subject:"physics", min:435, max:435, avg:435, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"黑龙江财经学院", province:"", level:"官方数据", year:2024, info:"工艺美术，录取2，平均410", subject:"physics", min:408.75, max:411.5, avg:410, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"黑龙江财经学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取1，平均429", subject:"physics", min:428.75, max:428.75, avg:429, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"黑龙江财经学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取1，平均460", subject:"physics", min:459.5, max:459.5, avg:460, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖北大学", province:"湖北", level:"公办重点", year:2025, info:"数字媒体艺术 (中外合作办学)，录取6，平均513", subject:"physics", min:506.75, max:524.25, avg:513, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"湖北大学", province:"湖北", level:"公办重点", year:2024, info:"数字媒体艺术 (中外合作办学)，录取3，平均533", subject:"physics", min:518.5, max:543.25, avg:533, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official","coop"]},
      {school:"湖北恩施学院", province:"", level:"官方数据", year:2023, info:"美术学，录取2，平均483", subject:"physics", min:481, max:485.5, avg:483, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖北工业大学", province:"湖北", level:"公办/设计强校", year:2025, info:"产品设计，录取3，平均540", subject:"physics", min:536.75, max:542.75, avg:540, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"湖北工业大学", province:"湖北", level:"公办/设计强校", year:2024, info:"产品设计，录取3，平均550", subject:"physics", min:543.75, max:562, avg:550, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"湖北工业大学", province:"湖北", level:"公办/设计强校", year:2023, info:"产品设计，录取3，平均549", subject:"physics", min:545.6, max:555.1, avg:549, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"湖北工业大学工程技术学院", province:"", level:"官方数据", year:2025, info:"动画，录取1，平均451", subject:"physics", min:451.25, max:451.25, avg:451, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2025, info:"产品设计，录取1，平均550", subject:"physics", min:550, max:550, avg:550, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"产品设计，录取1，平均574", subject:"physics", min:574, max:574, avg:574, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2025, info:"动画 (中外合作办学)，录取1，平均541", subject:"physics", min:540.5, max:540.5, avg:541, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official","coop"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"动画 (中外合作办学)，录取1，平均552", subject:"physics", min:552, max:552, avg:552, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official","coop"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2025, info:"服装与服饰设计，录取1，平均532", subject:"physics", min:531.75, max:531.75, avg:532, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北美术学院", province:"湖北", level:"专业艺术院校", year:2024, info:"服装与服饰设计，录取1，平均571", subject:"physics", min:570.5, max:570.5, avg:571, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"湖北文理学院理工学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取1，平均558", subject:"physics", min:557.5, max:557.5, avg:558, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖北文理学院理工学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取1，平均584", subject:"physics", min:584, max:584, avg:584, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南城市学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均454", subject:"physics", min:452.75, max:454.5, avg:454, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南城市学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均459", subject:"physics", min:455, max:462.25, avg:459, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南城市学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均487", subject:"physics", min:485.6, max:487.4, avg:487, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南城市学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均467", subject:"physics", min:455.25, max:477.5, avg:467, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南城市学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均467", subject:"physics", min:465.75, max:468.25, avg:467, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南城市学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均489", subject:"physics", min:486.3, max:492, avg:489, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南城市学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计 (中外合作办学)，录取2，平均480", subject:"physics", min:472.25, max:487.5, avg:480, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official","coop"]},
      {school:"湖南城市学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计 (中外合作办学)，录取2，平均473", subject:"physics", min:471.75, max:473.5, avg:473, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official","coop"]},
      {school:"湖南城市学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计 (中外合作办学)，录取2，平均499", subject:"physics", min:494.1, max:504.5, avg:499, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official","coop"]},
      {school:"湖南工程学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取1，平均525", subject:"physics", min:525.2, max:525.2, avg:525, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工程学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取1，平均519", subject:"physics", min:519.1, max:519.1, avg:519, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工程学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取1，平均521", subject:"physics", min:520.9, max:520.9, avg:521, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工程学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均507", subject:"physics", min:503, max:511.75, avg:507, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工程学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均513", subject:"physics", min:512.5, max:513.75, avg:513, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工程学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取1，平均519", subject:"physics", min:519.1, max:519.1, avg:519, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工业大学", province:"", level:"官方数据", year:2023, info:"包装设计，录取1，平均562", subject:"physics", min:561.8, max:561.8, avg:562, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工业大学", province:"", level:"官方数据", year:2023, info:"产品设计，录取1，平均547", subject:"physics", min:547, max:547, avg:547, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工业大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均558", subject:"physics", min:551.2, max:565.7, avg:558, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工业大学", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取1，平均557", subject:"physics", min:557.2, max:557.2, avg:557, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工业大学", province:"", level:"官方数据", year:2023, info:"陶瓷艺术设计，录取1，平均538", subject:"physics", min:538, max:538, avg:538, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工业大学科技学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取2，平均468", subject:"physics", min:467, max:469.25, avg:468, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南工业大学科技学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取2，平均489", subject:"physics", min:487.1, max:491.5, avg:489, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取1，平均503", subject:"physics", min:503, max:503, avg:503, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取1，平均508", subject:"physics", min:507.75, max:507.75, avg:508, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取1，平均520", subject:"physics", min:520.1, max:520.1, avg:520, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均477", subject:"physics", min:473.5, max:478.25, avg:477, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均490", subject:"physics", min:485.5, max:493, avg:490, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均506", subject:"physics", min:505.5, max:507.1, avg:506, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2025, info:"美术学，录取2，平均488", subject:"physics", min:487, max:489.25, avg:488, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2024, info:"美术学，录取2，平均493", subject:"physics", min:493.25, max:492.25, avg:493, status:"省教委官方数据；需确认：最高分小于最低分", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official","todo","special"]},
      {school:"湖南科技学院", province:"", level:"官方数据", year:2023, info:"美术学，录取2，平均509", subject:"physics", min:507.1, max:511.8, avg:509, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南师范大学", province:"", level:"官方数据", year:2025, info:"艺术设计学，录取1，平均571", subject:"physics", min:571.25, max:571.25, avg:571, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南师范大学", province:"", level:"官方数据", year:2024, info:"艺术设计学，录取1，平均590", subject:"physics", min:589.75, max:589.75, avg:590, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南师范大学", province:"", level:"官方数据", year:2023, info:"艺术设计学，录取1，平均581", subject:"physics", min:581, max:581, avg:581, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖南师范大学", province:"", level:"官方数据", year:2025, info:"艺术设计学 (中外合作办学)，录取3，平均541", subject:"physics", min:536, max:546.25, avg:541, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official","coop"]},
      {school:"湖南师范大学", province:"", level:"官方数据", year:2024, info:"艺术设计学 (中外合作办学)，录取3，平均553", subject:"physics", min:549.5, max:557.5, avg:553, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official","coop"]},
      {school:"湖南师范大学", province:"", level:"官方数据", year:2023, info:"艺术设计学 (中外合作办学)，录取3，平均558", subject:"physics", min:552.4, max:563.3, avg:558, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official","coop"]},
      {school:"湖州师范学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取1，平均526", subject:"physics", min:526.1, max:526.1, avg:526, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖州师范学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取1，平均524", subject:"physics", min:523.7, max:523.7, avg:524, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湖州师范学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取1，平均531", subject:"physics", min:531.4, max:531.4, avg:531, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"华东师范大学", province:"", level:"官方数据", year:2025, info:"美术学，录取2，平均610", subject:"physics", min:607.25, max:612.25, avg:610, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"华东师范大学", province:"", level:"官方数据", year:2024, info:"美术学，录取1，平均617", subject:"physics", min:616.75, max:616.75, avg:617, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"华东师范大学", province:"", level:"官方数据", year:2023, info:"美术学，录取1，平均607", subject:"physics", min:606.8, max:606.8, avg:607, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"华东师范大学", province:"", level:"官方数据", year:2024, info:"美术学 (美教)，录取1，平均617", subject:"physics", min:616.75, max:616.75, avg:617, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"华东师范大学", province:"", level:"官方数据", year:2023, info:"美术学类，录取1，平均611", subject:"physics", min:611.2, max:611.2, avg:611, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"华东师范大学", province:"", level:"官方数据", year:2025, info:"设计学类，录取1，平均620", subject:"physics", min:619.75, max:619.75, avg:620, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"华东师范大学", province:"", level:"官方数据", year:2024, info:"设计学类，录取2，平均615", subject:"physics", min:614.5, max:614.75, avg:615, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"华东师范大学", province:"", level:"官方数据", year:2023, info:"设计学类，录取2，平均616", subject:"physics", min:612, max:620.4, avg:616, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取1，平均499", subject:"physics", min:498.5, max:498.5, avg:499, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取1，平均501", subject:"physics", min:500.9, max:500.9, avg:501, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2024, info:"美术学，录取2，平均495", subject:"physics", min:494.25, max:495.75, avg:495, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2023, info:"美术学，录取1，平均515", subject:"physics", min:514.5, max:514.5, avg:515, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取1，平均503", subject:"physics", min:502.5, max:502.5, avg:503, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取1，平均513", subject:"physics", min:513.1, max:513.1, avg:513, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取1，平均503", subject:"physics", min:503.25, max:503.25, avg:503, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"怀化学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取1，平均523", subject:"physics", min:523.4, max:523.4, avg:523, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2024, info:"动画，录取2，平均506", subject:"physics", min:505.5, max:505, avg:506, status:"省教委官方数据；需确认：最高分小于最低分", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official","todo","special"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2023, info:"动画，录取2，平均512", subject:"physics", min:509.7, max:519.3, avg:512, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均461", subject:"physics", min:460.75, max:462, avg:461, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均488", subject:"physics", min:482.25, max:492.75, avg:488, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均499", subject:"physics", min:499.2, max:499.7, avg:499, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"吉林动画学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均476", subject:"physics", min:476, max:476.75, avg:476, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2025, info:"动画，录取1，平均523", subject:"physics", min:523, max:523, avg:523, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2024, info:"动画，录取1，平均528", subject:"physics", min:528.25, max:528.25, avg:528, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2025, info:"绘画，录取1，平均499", subject:"physics", min:499.25, max:499.25, avg:499, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2024, info:"绘画，录取1，平均510", subject:"physics", min:509.75, max:509.75, avg:510, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取1，平均536", subject:"physics", min:527.5, max:527.5, avg:536, status:"省教委官方数据；需确认：平均分明显不在最低-最高区间", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official","todo"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取1，平均535", subject:"physics", min:535.5, max:535.5, avg:535, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2025, info:"艺术与科技，录取1，平均514", subject:"physics", min:513.75, max:513.75, avg:514, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2024, info:"艺术与科技，录取1，平均522", subject:"physics", min:521.5, max:521.5, avg:522, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2025, info:"中国画，录取1，平均511", subject:"physics", min:495.75, max:495.75, avg:511, status:"省教委官方数据；需确认：平均分明显不在最低-最高区间", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official","todo"]},
      {school:"吉林艺术学院", province:"", level:"官方数据", year:2024, info:"中国画，录取1，平均511", subject:"physics", min:510.75, max:510.75, avg:511, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江南大学", province:"江苏", level:"211/双一流/设计强", year:2025, info:"产品设计，录取1，平均596", subject:"physics", min:596.25, max:596.25, avg:596, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"江南大学", province:"江苏", level:"211/双一流/设计强", year:2024, info:"产品设计，录取1，平均601", subject:"physics", min:600.5, max:600.5, avg:601, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"江南大学", province:"江苏", level:"211/双一流/设计强", year:2023, info:"产品设计，录取1，平均594", subject:"physics", min:594.2, max:594.2, avg:594, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"江南大学", province:"江苏", level:"211/双一流/设计强", year:2024, info:"服装与服饰设计，录取1，平均589", subject:"physics", min:589, max:589, avg:589, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"江南大学", province:"江苏", level:"211/双一流/设计强", year:2023, info:"环境设计，录取1，平均586", subject:"physics", min:585.8, max:585.8, avg:586, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"江南大学", province:"江苏", level:"211/双一流/设计强", year:2025, info:"视觉传达设计，录取1，平均611", subject:"physics", min:610.75, max:610.75, avg:611, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","plan","official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取1，平均520", subject:"physics", min:519.75, max:519.75, avg:520, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取1，平均533", subject:"physics", min:532.8, max:532.8, avg:533, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取1，平均514", subject:"physics", min:514.25, max:514.25, avg:514, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取4，平均514", subject:"physics", min:510.6, max:516.7, avg:514, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2024, info:"美术学，录取2，平均517", subject:"physics", min:513.5, max:526.5, avg:517, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2023, info:"美术学，录取2，平均525", subject:"physics", min:523.6, max:526.5, avg:525, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均529", subject:"physics", min:528.8, max:529.7, avg:529, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均524", subject:"physics", min:523, max:524.75, avg:524, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江苏理工学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均542", subject:"physics", min:531.8, max:551.8, avg:542, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西财经大学", province:"江西", level:"公办", year:2025, info:"环境设计，录取1，平均530", subject:"physics", min:529.75, max:529.75, avg:530, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西财经大学", province:"江西", level:"公办", year:2024, info:"环境设计，录取1，平均547", subject:"physics", min:547, max:547, avg:547, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西财经大学", province:"江西", level:"公办", year:2023, info:"环境设计，录取1，平均550", subject:"physics", min:550.3, max:550.3, avg:550, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西财经大学", province:"江西", level:"公办", year:2025, info:"数字媒体艺术，录取1，平均543", subject:"physics", min:542.75, max:542.75, avg:543, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西财经大学", province:"江西", level:"公办", year:2024, info:"数字媒体艺术，录取2，平均554", subject:"physics", min:550.25, max:558, avg:554, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西财经大学", province:"江西", level:"公办", year:2023, info:"数字媒体艺术，录取1，平均558", subject:"physics", min:557.9, max:557.9, avg:558, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西财经大学", province:"江西", level:"公办", year:2025, info:"数字媒体艺术 (VR 艺术设计)，录取1，平均544", subject:"physics", min:544, max:544, avg:544, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西财经大学", province:"江西", level:"公办", year:2024, info:"数字媒体艺术 (VR 艺术设计)，录取1，平均549", subject:"physics", min:548.75, max:548.75, avg:549, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"江西财经大学现代经济管理学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取5，平均488", subject:"physics", min:486.4, max:489, avg:488, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西财经大学现代经济管理学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取5，平均490", subject:"physics", min:467.25, max:559.75, avg:490, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西财经大学现代经济管理学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均494", subject:"physics", min:491.6, max:496, avg:494, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取1，平均413", subject:"physics", min:412.75, max:412.75, avg:413, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取2，平均468", subject:"physics", min:468.1, max:468.2, avg:468, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2025, info:"动画，录取1，平均414", subject:"physics", min:414, max:414, avg:414, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取4，平均422", subject:"physics", min:412.5, max:443.25, avg:422, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取4，平均437", subject:"physics", min:425.75, max:443.75, avg:437, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取4，平均483", subject:"physics", min:477, max:494.1, avg:483, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均468", subject:"physics", min:468.3, max:468.4, avg:468, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2024, info:"美术学，录取1，平均443", subject:"physics", min:443, max:443, avg:443, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取1，平均427", subject:"physics", min:427.25, max:427.25, avg:427, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均451", subject:"physics", min:448.5, max:454.25, avg:451, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均472", subject:"physics", min:471.2, max:473.1, avg:472, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均428", subject:"physics", min:425.5, max:430.5, avg:428, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西服装学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取1，平均440", subject:"physics", min:439.5, max:439.5, avg:440, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2025, info:"动画，录取2，平均450", subject:"physics", min:426, max:474, avg:450, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2024, info:"动画，录取2，平均443", subject:"physics", min:435.75, max:450.75, avg:443, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2023, info:"动画，录取2，平均476", subject:"physics", min:474.2, max:478.2, avg:476, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取2，平均430", subject:"physics", min:425, max:435.25, avg:430, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取3，平均444", subject:"physics", min:431, max:457, avg:444, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取3，平均467", subject:"physics", min:465.5, max:467.1, avg:467, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均418", subject:"physics", min:413.75, max:422.5, avg:418, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取6，平均444", subject:"physics", min:433, max:456, avg:444, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取6，平均467", subject:"physics", min:468.5, max:470.7, avg:467, status:"省教委官方数据；需确认：平均分明显不在最低-最高区间", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official","todo"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均443", subject:"physics", min:424.25, max:449.75, avg:443, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取5，平均444", subject:"physics", min:420, max:463.5, avg:444, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取6，平均475", subject:"physics", min:471.3, max:482.7, avg:475, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2025, info:"影视摄影与制作，录取3，平均425", subject:"physics", min:420.5, max:427.5, avg:425, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西科技学院", province:"", level:"官方数据", year:2024, info:"影视摄影与制作，录取3，平均442", subject:"physics", min:429, max:456, avg:442, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西农业大学南昌商学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取4，平均445", subject:"physics", min:441.5, max:449, avg:445, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西农业大学南昌商学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取4，平均462", subject:"physics", min:458, max:466, avg:462, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西农业大学南昌商学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取4，平均485", subject:"physics", min:482.7, max:486.5, avg:485, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西应用科技学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取6，平均453", subject:"physics", min:449.5, max:459.5, avg:453, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西应用科技学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取5，平均447", subject:"physics", min:433.5, max:457.25, avg:447, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"江西应用科技学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取6，平均476", subject:"physics", min:472.9, max:478.6, avg:476, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"井冈山大学", province:"", level:"官方数据", year:2025, info:"美术学，录取2，平均503", subject:"physics", min:503, max:503.75, avg:503, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"井冈山大学", province:"", level:"官方数据", year:2024, info:"美术学，录取3，平均513", subject:"physics", min:512.25, max:514.5, avg:513, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"井冈山大学", province:"", level:"官方数据", year:2023, info:"美术学，录取2，平均525", subject:"physics", min:521.4, max:529.2, avg:525, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"喀什大学", province:"", level:"官方数据", year:2025, info:"美术学，录取2，平均487", subject:"physics", min:485.25, max:488.25, avg:487, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取1，平均416", subject:"physics", min:415.75, max:415.75, avg:416, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取3，平均462", subject:"physics", min:460.9, max:463.7, avg:462, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2024, info:"动画，录取2，平均419", subject:"physics", min:415.75, max:422.5, avg:419, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2023, info:"动画，录取6，平均462", subject:"physics", min:460.4, max:465, avg:462, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取1，平均433", subject:"physics", min:433.25, max:433.25, avg:433, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取2，平均465", subject:"physics", min:464.7, max:465, avg:465, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取6，平均415", subject:"physics", min:407.75, max:423.75, avg:415, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取13，平均461", subject:"physics", min:459.9, max:468.2, avg:461, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2024, info:"美术学，录取3，平均432", subject:"physics", min:426.5, max:440, avg:432, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2023, info:"美术学，录取2，平均470", subject:"physics", min:466, max:473.2, avg:470, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取1，平均420", subject:"physics", min:420, max:420, avg:420, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取13，平均465", subject:"physics", min:461.4, max:473.3, avg:465, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取2，平均418", subject:"physics", min:414, max:422, avg:418, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"丽江文化旅游学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取2，平均473", subject:"physics", min:473.1, max:473.3, avg:473, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"陇东学院", province:"", level:"官方数据", year:2023, info:"美术学，录取1，平均497", subject:"physics", min:496.8, max:496.8, avg:497, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"陇东学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取1，平均498", subject:"physics", min:497.9, max:497.9, avg:498, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学科技学院", province:"", level:"官方数据", year:2025, info:"动画，录取1，平均488", subject:"physics", min:488, max:488, avg:488, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学科技学院", province:"", level:"官方数据", year:2024, info:"动画，录取1，平均497", subject:"physics", min:497.25, max:497.25, avg:497, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学科技学院", province:"", level:"官方数据", year:2023, info:"动画，录取1，平均514", subject:"physics", min:514.3, max:514.3, avg:514, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学科技学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均471", subject:"physics", min:470.75, max:470.75, avg:471, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学科技学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取1，平均474", subject:"physics", min:474.25, max:474.25, avg:474, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"南昌航空大学科技学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取1，平均494", subject:"physics", min:494.3, max:494.3, avg:494, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"南京工业大学", province:"江苏", level:"公办", year:2024, info:"产品设计，录取1，平均555", subject:"physics", min:554.75, max:554.75, avg:555, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京工业大学", province:"江苏", level:"公办", year:2025, info:"环境设计，录取1，平均536", subject:"physics", min:535.75, max:535.75, avg:536, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京工业大学", province:"江苏", level:"公办", year:2023, info:"设计学类，录取3，平均563", subject:"physics", min:560.4, max:567.2, avg:563, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京工业大学", province:"江苏", level:"公办", year:2025, info:"视觉传达设计，录取1，平均556", subject:"physics", min:555.5, max:555.5, avg:556, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京工业大学", province:"江苏", level:"公办", year:2024, info:"视觉传达设计，录取1，平均577", subject:"physics", min:577.25, max:577.25, avg:577, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京工业大学", province:"江苏", level:"公办", year:2025, info:"艺术与科技，录取1，平均545", subject:"physics", min:545, max:545, avg:545, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京工业大学", province:"江苏", level:"公办", year:2024, info:"艺术与科技，录取1，平均554", subject:"physics", min:553.75, max:553.75, avg:554, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"南京航空航天大学金城学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均496", subject:"physics", min:495.6, max:496.6, avg:496, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"南宁学院", province:"", level:"官方数据", year:2023, info:"工艺美术，录取3，平均471", subject:"physics", min:469.4, max:474.5, avg:471, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"南阳理工学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均502", subject:"physics", min:501.9, max:502, avg:502, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"平顶山学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均474", subject:"physics", min:473.5, max:474, avg:474, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"平顶山学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均493", subject:"physics", min:492.8, max:493.6, avg:493, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"平顶山学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均469", subject:"physics", min:465.25, max:476, avg:469, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"平顶山学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均477", subject:"physics", min:477.25, max:477.5, avg:477, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"平顶山学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均495", subject:"physics", min:494.9, max:495.9, avg:495, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"平顶山学院", province:"", level:"官方数据", year:2025, info:"陶瓷艺术设计，录取3，平均468", subject:"physics", min:465, max:472.75, avg:468, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"平顶山学院", province:"", level:"官方数据", year:2024, info:"陶瓷艺术设计，录取2，平均470", subject:"physics", min:469.75, max:470.5, avg:470, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"平顶山学院", province:"", level:"官方数据", year:2023, info:"陶瓷艺术设计，录取2，平均493", subject:"physics", min:492.7, max:493.7, avg:493, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"齐鲁工业大学", province:"", level:"官方数据", year:2023, info:"设计学类，录取2，平均543", subject:"physics", min:542.6, max:543.7, avg:543, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"青岛理工大学", province:"", level:"官方数据", year:2024, info:"产品设计，录取2，平均534", subject:"physics", min:531.75, max:535.75, avg:534, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"青岛理工大学", province:"", level:"官方数据", year:2023, info:"产品设计，录取2，平均539", subject:"physics", min:538.7, max:539.4, avg:539, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"青岛理工大学", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均525", subject:"physics", min:524.75, max:526, avg:525, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"青岛理工大学", province:"", level:"官方数据", year:2023, info:"环境设计，录取3，平均538", subject:"physics", min:535.3, max:539.2, avg:538, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"青岛理工大学", province:"", level:"官方数据", year:2024, info:"绘画，录取2，平均520", subject:"physics", min:517.25, max:523.5, avg:520, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"青岛理工大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取3，平均533", subject:"physics", min:530.75, max:535.75, avg:533, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"青岛理工大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取1，平均550", subject:"physics", min:550, max:550, avg:550, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"青岛理工大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取1，平均553", subject:"physics", min:553.1, max:553.1, avg:553, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"青岛农业大学", province:"", level:"官方数据", year:2023, info:"动画，录取2，平均535", subject:"physics", min:534.4, max:535.1, avg:535, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"青岛农业大学", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均531", subject:"physics", min:530.4, max:530.8, avg:531, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三江学院", province:"", level:"官方数据", year:2025, info:"动画，录取5，平均444", subject:"physics", min:437.25, max:455.75, avg:444, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三江学院", province:"", level:"官方数据", year:2024, info:"动画，录取5，平均465", subject:"physics", min:463.5, max:466.75, avg:465, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三江学院", province:"", level:"官方数据", year:2023, info:"动画，录取6，平均485", subject:"physics", min:483.4, max:488.2, avg:485, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三江学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均433", subject:"physics", min:433.25, max:433.25, avg:433, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三江学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取5，平均449", subject:"physics", min:443.25, max:454, avg:449, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"三江学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取6，平均481", subject:"physics", min:479.4, max:481.8, avg:481, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"山东交通学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取3，平均490", subject:"physics", min:487.75, max:491.75, avg:490, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"山东交通学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均475", subject:"physics", min:474.5, max:474.75, avg:475, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2025, info:"动画，录取2，平均533", subject:"physics", min:531.5, max:533.75, avg:533, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2024, info:"动画，录取2，平均537", subject:"physics", min:535, max:539.25, avg:537, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2025, info:"工艺美术，录取1，平均531", subject:"physics", min:530.75, max:530.75, avg:531, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2024, info:"工艺美术，录取1，平均540", subject:"physics", min:540, max:540, avg:540, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2025, info:"环境设计，录取1，平均509", subject:"physics", min:508.75, max:508.75, avg:509, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2024, info:"环境设计，录取1，平均533", subject:"physics", min:533, max:533, avg:533, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2025, info:"绘画，录取1，平均517", subject:"physics", min:516.75, max:516.75, avg:517, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2024, info:"绘画，录取1，平均522", subject:"physics", min:522.25, max:522.25, avg:522, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2025, info:"视觉传达设计，录取1，平均542", subject:"physics", min:542.25, max:542.25, avg:542, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2024, info:"视觉传达设计，录取1，平均565", subject:"physics", min:565.25, max:565.25, avg:565, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2025, info:"中国画，录取1，平均461", subject:"physics", min:460.75, max:460.75, avg:461, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"山东艺术学院", province:"山东", level:"专业艺术院校", year:2024, info:"中国画，录取1，平均542", subject:"physics", min:542.25, max:542.25, avg:542, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"陕西师范大学", province:"", level:"官方数据", year:2024, info:"美术学，录取1，平均592", subject:"physics", min:591.5, max:591.5, avg:592, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"陕西师范大学", province:"", level:"官方数据", year:2025, info:"美术学类，录取1，平均587", subject:"physics", min:586.75, max:586.75, avg:587, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"上海交通大学", province:"上海", level:"985", year:2025, info:"环境设计，录取2，平均627", subject:"physics", min:621.75, max:631.5, avg:627, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"上海交通大学", province:"上海", level:"985", year:2024, info:"环境设计，录取2，平均621", subject:"physics", min:615.25, max:627.5, avg:621, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"上海交通大学", province:"上海", level:"985", year:2025, info:"人居设计，录取2，平均627", subject:"physics", min:621.75, max:631.5, avg:627, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取2，平均506", subject:"physics", min:504, max:508.25, avg:506, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取2，平均524", subject:"physics", min:523.5, max:524.25, avg:524, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取2，平均522", subject:"physics", min:519.2, max:524.3, avg:522, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取2，平均492", subject:"physics", min:489, max:494.25, avg:492, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取2，平均507", subject:"physics", min:504.75, max:509.75, avg:507, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取2，平均512", subject:"physics", min:507.6, max:516.5, avg:512, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2025, info:"工艺美术，录取2，平均494", subject:"physics", min:481.25, max:506, avg:494, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2024, info:"工艺美术，录取2，平均505", subject:"physics", min:504.25, max:505.75, avg:505, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2023, info:"工艺美术，录取2，平均520", subject:"physics", min:506.3, max:533.9, avg:520, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均477", subject:"physics", min:475.25, max:479.5, avg:477, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均494", subject:"physics", min:489.5, max:497.75, avg:494, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均516", subject:"physics", min:513.6, max:517.6, avg:516, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"上海视觉艺术学院", province:"", level:"官方数据", year:2025, info:"摄影，录取2，平均481", subject:"physics", min:477, max:485.25, avg:481, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川传媒学院", province:"", level:"官方数据", year:2025, info:"跨媒体艺术，录取1，平均492", subject:"physics", min:492, max:492, avg:492, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川传媒学院", province:"", level:"官方数据", year:2024, info:"跨媒体艺术，录取1，平均509", subject:"physics", min:509, max:509, avg:509, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川传媒学院", province:"", level:"官方数据", year:2025, info:"影视摄影与制作 (中外合作办学)，录取1，平均479", subject:"physics", min:478.5, max:478.5, avg:479, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official","coop"]},
      {school:"四川大学", province:"四川", level:"985", year:2023, info:"服装与服饰设计，录取2，平均595", subject:"physics", min:584.6, max:604.9, avg:595, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"四川大学", province:"四川", level:"985", year:2023, info:"绘画，录取1，平均597", subject:"physics", min:596.7, max:596.7, avg:597, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"四川大学", province:"四川", level:"985", year:2025, info:"美术学类，录取2，平均590", subject:"physics", min:587, max:592.25, avg:590, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"四川大学", province:"四川", level:"985", year:2024, info:"美术学类，录取1，平均600", subject:"physics", min:599.5, max:599.5, avg:600, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"四川大学", province:"四川", level:"985", year:2025, info:"设计学类，录取3，平均607", subject:"physics", min:604.75, max:609.25, avg:607, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"四川大学", province:"四川", level:"985", year:2024, info:"设计学类，录取2，平均608", subject:"physics", min:606.75, max:608.75, avg:608, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"四川大学", province:"四川", level:"985", year:2023, info:"视觉传达设计，录取1，平均606", subject:"physics", min:605.6, max:605.6, avg:606, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"四川大学锦江学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取3，平均450", subject:"physics", min:448, max:453.25, avg:450, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川大学锦江学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取3，平均463", subject:"physics", min:458.25, max:467.5, avg:463, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川大学锦江学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取3，平均486", subject:"physics", min:484.5, max:486.8, avg:486, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川大学锦江学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取3，平均444", subject:"physics", min:440.75, max:450.5, avg:444, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川大学锦江学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均460", subject:"physics", min:457, max:463, avg:460, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川大学锦江学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取7，平均485", subject:"physics", min:483.6, max:486.6, avg:485, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川大学锦江学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取5，平均458", subject:"physics", min:451.5, max:466.75, avg:458, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川大学锦江学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均469", subject:"physics", min:465.75, max:473, avg:469, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川大学锦江学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取3，平均493", subject:"physics", min:492, max:495, avg:493, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川电影电视学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取1，平均517", subject:"physics", min:516.9, max:516.9, avg:517, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川电影电视学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术 (中外合作办学)，录取2，平均473", subject:"physics", min:471.1, max:475.3, avg:473, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official","coop"]},
      {school:"四川工商学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取2，平均444", subject:"physics", min:443, max:445, avg:444, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川工商学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取2，平均458", subject:"physics", min:457.5, max:458.5, avg:458, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川工商学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取2，平均484", subject:"physics", min:483.7, max:484.3, avg:484, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川工商学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均426", subject:"physics", min:421, max:431.5, avg:426, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川工商学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均462", subject:"physics", min:460.75, max:462.25, avg:462, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川工商学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均490", subject:"physics", min:486.3, max:492.9, avg:490, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川工商学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均449", subject:"physics", min:447.75, max:450.75, avg:449, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川工商学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均464", subject:"physics", min:463.25, max:464, avg:464, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川工商学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均493", subject:"physics", min:486.9, max:498.3, avg:493, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"四川旅游学院", province:"四川", level:"公办", year:2025, info:"工艺美术，录取3，平均468", subject:"physics", min:465, max:473.25, avg:468, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"四川旅游学院", province:"四川", level:"公办", year:2024, info:"工艺美术，录取3，平均481", subject:"physics", min:471.5, max:494.75, avg:481, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"四川美术学院", province:"重庆", level:"专业艺术院校", year:2025, info:"美术教育，录取1，平均570", subject:"physics", min:570, max:570, avg:570, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"四川文化艺术学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计 (中外合作办学)，录取2，平均477", subject:"physics", min:473.4, max:481.5, avg:477, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official","coop"]},
      {school:"天津城建大学", province:"", level:"官方数据", year:2025, info:"设计学类，录取4，平均511", subject:"physics", min:502.5, max:527.5, avg:511, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"天津大学", province:"天津", level:"985", year:2023, info:"环境设计，录取1，平均594", subject:"physics", min:594.3, max:594.3, avg:594, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","plan","official"]},
      {school:"天津工业大学", province:"天津", level:"双一流/设计强", year:2025, info:"服装与服饰设计，录取2，平均538", subject:"physics", min:537, max:538.5, avg:538, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"天津工业大学", province:"天津", level:"双一流/设计强", year:2024, info:"服装与服饰设计，录取2，平均568", subject:"physics", min:557.25, max:579, avg:568, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","double","official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取1，平均432", subject:"physics", min:432.25, max:432.25, avg:432, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取1，平均470", subject:"physics", min:469.5, max:469.5, avg:470, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2023, info:"产品设计，录取1，平均484", subject:"physics", min:484, max:484, avg:484, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2025, info:"动画，录取1，平均468", subject:"physics", min:467.5, max:467.5, avg:468, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2024, info:"动画，录取1，平均437", subject:"physics", min:437.25, max:437.25, avg:437, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2023, info:"动画，录取1，平均487", subject:"physics", min:487.4, max:487.4, avg:487, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取1，平均440", subject:"physics", min:439.75, max:439.75, avg:440, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取1，平均480", subject:"physics", min:479.6, max:479.6, avg:480, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取1，平均429", subject:"physics", min:429.25, max:429.25, avg:429, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取1，平均450", subject:"physics", min:450, max:450, avg:450, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"天津仁爱学院", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取1，平均483", subject:"physics", min:483, max:483, avg:483, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"天津外国语大学", province:"", level:"官方数据", year:2025, info:"动画，录取1，平均524", subject:"physics", min:524.25, max:524.25, avg:524, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"天津外国语大学", province:"", level:"官方数据", year:2024, info:"动画，录取1，平均535", subject:"physics", min:534.75, max:534.75, avg:535, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"天津外国语大学", province:"", level:"官方数据", year:2023, info:"动画，录取1，平均540", subject:"physics", min:540, max:540, avg:540, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"天津外国语大学", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取1，平均538", subject:"physics", min:538, max:538, avg:538, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"天津外国语大学", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取1，平均546", subject:"physics", min:546.25, max:546.25, avg:546, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"天津外国语大学", province:"", level:"官方数据", year:2023, info:"数字媒体艺术，录取1，平均543", subject:"physics", min:542.7, max:542.7, avg:543, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"温州商学院", province:"", level:"官方数据", year:2025, info:"设计学类，录取1，平均434", subject:"physics", min:433.5, max:433.5, avg:434, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"温州商学院", province:"", level:"官方数据", year:2024, info:"设计学类，录取2，平均441", subject:"physics", min:431.5, max:450.25, avg:441, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"温州商学院", province:"", level:"官方数据", year:2023, info:"设计学类，录取5，平均478", subject:"physics", min:472.4, max:487.8, avg:478, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"温州商学院", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取1，平均453", subject:"physics", min:453, max:453, avg:453, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"五邑大学", province:"", level:"官方数据", year:2025, info:"产品设计，录取1，平均524", subject:"physics", min:523.75, max:523.75, avg:524, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"五邑大学", province:"", level:"官方数据", year:2024, info:"产品设计，录取1，平均532", subject:"physics", min:531.5, max:531.5, avg:532, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"五邑大学", province:"", level:"官方数据", year:2023, info:"产品设计，录取1，平均541", subject:"physics", min:541.4, max:541.4, avg:541, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"五邑大学", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取1，平均507", subject:"physics", min:506.5, max:506.5, avg:507, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"五邑大学", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取1，平均507", subject:"physics", min:507.25, max:507.25, avg:507, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"五邑大学", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取1，平均523", subject:"physics", min:523.4, max:523.4, avg:523, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武昌首义学院", province:"", level:"官方数据", year:2025, info:"动画 (数字媒体)，录取2，平均456", subject:"physics", min:455.25, max:456, avg:456, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武昌首义学院", province:"", level:"官方数据", year:2024, info:"动画 (数字媒体)，录取2，平均468", subject:"physics", min:465.75, max:471, avg:468, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武昌首义学院", province:"", level:"官方数据", year:2023, info:"动画 (数字媒体)，录取2，平均482", subject:"physics", min:482.2, max:482.3, avg:482, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武昌首义学院", province:"", level:"官方数据", year:2025, info:"设计学类，录取2，平均446", subject:"physics", min:442.75, max:447.25, avg:446, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武昌首义学院", province:"", level:"官方数据", year:2024, info:"设计学类，录取2，平均460", subject:"physics", min:454.25, max:456.5, avg:460, status:"省教委官方数据；需确认：平均分明显不在最低-最高区间", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official","todo"]},
      {school:"武昌首义学院", province:"", level:"官方数据", year:2023, info:"设计学类，录取2，平均488", subject:"physics", min:483.4, max:493.1, avg:488, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武汉城市学院", province:"", level:"官方数据", year:2025, info:"产品设计，录取1，平均446", subject:"physics", min:446.25, max:446.25, avg:446, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武汉城市学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取1，平均460", subject:"physics", min:460, max:460, avg:460, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武汉城市学院", province:"", level:"官方数据", year:2025, info:"动画，录取1，平均443", subject:"physics", min:442.75, max:442.75, avg:443, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"武汉城市学院", province:"", level:"官方数据", year:2024, info:"动画，录取1，平均458", subject:"physics", min:457.5, max:457.5, avg:458, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2023, info:"服装与服饰设计，录取1，平均485", subject:"physics", min:484.8, max:484.8, avg:485, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2023, info:"环境设计，录取1，平均495", subject:"physics", min:494.7, max:494.7, avg:495, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2025, info:"产品设计，录取1，平均556", subject:"physics", min:555.75, max:555.75, avg:556, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2024, info:"产品设计，录取1，平均589", subject:"physics", min:589, max:589, avg:589, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2025, info:"环境设计，录取1，平均554", subject:"physics", min:554, max:554, avg:554, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西安美术学院", province:"陕西", level:"专业艺术院校", year:2024, info:"环境设计，录取1，平均578", subject:"physics", min:577.75, max:577.75, avg:578, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"西北农林科技大学", province:"陕西", level:"985", year:2025, info:"环境设计，录取1，平均570", subject:"physics", min:569.5, max:569.5, avg:570, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"西北农林科技大学", province:"陕西", level:"985", year:2024, info:"环境设计，录取1，平均590", subject:"physics", min:589.75, max:589.75, avg:590, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"西北农林科技大学", province:"陕西", level:"985", year:2023, info:"环境设计，录取1，平均582", subject:"physics", min:582.3, max:582.3, avg:582, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","official"]},
      {school:"西北政法大学", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取1，平均544", subject:"physics", min:544, max:544, avg:544, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"西北政法大学", province:"", level:"官方数据", year:2024, info:"数字媒体艺术，录取1，平均549", subject:"physics", min:549, max:549, avg:549, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"西南财经大学", province:"四川", level:"211/双一流", year:2023, info:"数字媒体艺术，录取1，平均590", subject:"physics", min:590.1, max:590.1, avg:590, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南交通大学", province:"四川", level:"211/双一流", year:2023, info:"绘画，录取1，平均576", subject:"physics", min:576.4, max:576.4, avg:576, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南交通大学", province:"四川", level:"211/双一流", year:2025, info:"设计学类，录取2，平均581", subject:"physics", min:579.5, max:583.25, avg:581, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南交通大学", province:"四川", level:"211/双一流", year:2024, info:"设计学类，录取4，平均586", subject:"physics", min:583.25, max:587.25, avg:586, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南交通大学", province:"四川", level:"211/双一流", year:2023, info:"设计学类，录取3，平均583", subject:"physics", min:581.4, max:584.2, avg:583, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"西南林业大学", province:"", level:"官方数据", year:2024, info:"环境设计，录取2，平均517", subject:"physics", min:517.25, max:517.5, avg:517, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"西南林业大学", province:"", level:"官方数据", year:2023, info:"环境设计，录取2，平均550", subject:"physics", min:535.6, max:564.6, avg:550, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湘南学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均483", subject:"physics", min:483, max:483, avg:483, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湘南学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取1，平均486", subject:"physics", min:485.75, max:485.75, avg:486, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湘南学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取1，平均507", subject:"physics", min:506.6, max:506.6, avg:507, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湘南学院", province:"", level:"官方数据", year:2025, info:"美术学，录取1，平均509", subject:"physics", min:508.5, max:508.5, avg:509, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湘南学院", province:"", level:"官方数据", year:2024, info:"美术学，录取1，平均498", subject:"physics", min:497.75, max:497.75, avg:498, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湘南学院", province:"", level:"官方数据", year:2023, info:"美术学，录取1，平均509", subject:"physics", min:508.6, max:508.6, avg:509, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湘南学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均491", subject:"physics", min:490.75, max:491.75, avg:491, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湘南学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均499", subject:"physics", min:498.5, max:498.75, avg:499, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"湘南学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均515", subject:"physics", min:512.8, max:516.7, avg:515, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"新疆大学", province:"新疆", level:"211/双一流", year:2025, info:"设计学类，录取1，平均524", subject:"physics", min:523.75, max:523.75, avg:524, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"扬州大学广陵学院", province:"", level:"官方数据", year:2025, info:"服装与服饰设计，录取1，平均450", subject:"physics", min:449.5, max:449.5, avg:450, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"扬州大学广陵学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取1，平均459", subject:"physics", min:459, max:459, avg:459, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"扬州大学广陵学院", province:"", level:"官方数据", year:2023, info:"服装与服饰设计，录取1，平均488", subject:"physics", min:487.7, max:487.7, avg:488, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"扬州大学广陵学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均460", subject:"physics", min:459.75, max:459.75, avg:460, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"扬州大学广陵学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取1，平均472", subject:"physics", min:471.5, max:471.5, avg:472, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"扬州大学广陵学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取1，平均497", subject:"physics", min:497.1, max:497.1, avg:497, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"扬州大学广陵学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取1，平均475", subject:"physics", min:474.75, max:474.75, avg:475, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"扬州大学广陵学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取1，平均485", subject:"physics", min:484.5, max:484.5, avg:485, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"扬州大学广陵学院", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取1，平均503", subject:"physics", min:502.5, max:502.5, avg:503, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"豫章师范学院", province:"", level:"官方数据", year:2025, info:"绘画，录取2，平均478", subject:"physics", min:478, max:478.75, avg:478, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"豫章师范学院", province:"", level:"官方数据", year:2024, info:"绘画，录取2，平均485", subject:"physics", min:480.25, max:489, avg:485, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"豫章师范学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均490", subject:"physics", min:488.25, max:492, avg:490, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"豫章师范学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均496", subject:"physics", min:492.25, max:496.5, avg:496, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2023, info:"环境设计，录取1，平均552", subject:"physics", min:552.4, max:552.4, avg:552, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2023, info:"绘画，录取2，平均537", subject:"physics", min:532.4, max:542, avg:537, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院", province:"云南", level:"专业艺术院校", year:2023, info:"视觉传达设计，录取1，平均545", subject:"physics", min:544.8, max:544.8, avg:545, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","art","official"]},
      {school:"云南艺术学院文华学院", province:"", level:"官方数据", year:2023, info:"美术学 (师范类)，录取1，平均485", subject:"physics", min:485, max:485, avg:485, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"浙江传媒学院", province:"浙江", level:"公办/传媒艺术", year:2025, info:"动画，录取1，平均583", subject:"physics", min:583, max:583, avg:583, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"浙江传媒学院", province:"浙江", level:"公办/传媒艺术", year:2024, info:"动画，录取1，平均583", subject:"physics", min:583, max:583, avg:583, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"浙江传媒学院", province:"浙江", level:"公办/传媒艺术", year:2023, info:"动画，录取1，平均572", subject:"physics", min:571.5, max:571.5, avg:572, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"浙江理工大学", province:"浙江", level:"公办/设计服装强", year:2023, info:"服装与服饰设计 (中外合作办学)(中法合作)，录取2，平均530", subject:"physics", min:522.9, max:537.5, avg:530, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official","coop"]},
      {school:"浙江理工大学", province:"浙江", level:"公办/设计服装强", year:2023, info:"数字媒体艺术 (中外合作办学)(中法合作)，录取2，平均540", subject:"physics", min:538.6, max:541.4, avg:540, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","plan","official","coop"]},
      {school:"中北大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均521", subject:"physics", min:520.25, max:521, avg:521, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"中北大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均531", subject:"physics", min:527.75, max:533.25, avg:531, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"中北大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均542", subject:"physics", min:537.9, max:546.1, avg:542, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"中国地质大学 (北京)", province:"北京", level:"211/双一流", year:2025, info:"产品设计，录取1，平均589", subject:"physics", min:588.5, max:588.5, avg:589, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"中国地质大学 (北京)", province:"北京", level:"211/双一流", year:2024, info:"产品设计，录取1，平均593", subject:"physics", min:592.75, max:592.75, avg:593, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"中国地质大学 (北京)", province:"北京", level:"211/双一流", year:2023, info:"产品设计，录取1，平均587", subject:"physics", min:587.3, max:587.3, avg:587, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"中国矿业大学", province:"江苏", level:"211/双一流", year:2025, info:"环境设计，录取3，平均556", subject:"physics", min:551.75, max:562, avg:556, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"中国矿业大学", province:"江苏", level:"211/双一流", year:2024, info:"环境设计，录取2，平均584", subject:"physics", min:581.5, max:586, avg:584, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","211","official"]},
      {school:"中南大学", province:"湖南", level:"985", year:2023, info:"设计学类，录取3，平均591", subject:"physics", min:588, max:592.7, avg:591, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","plan","official"]},
      {school:"中南大学", province:"湖南", level:"985", year:2025, info:"艺术与科技，录取3，平均600", subject:"physics", min:590.75, max:605.75, avg:600, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","plan","official"]},
      {school:"中南大学", province:"湖南", level:"985", year:2024, info:"艺术与科技，录取3，平均599", subject:"physics", min:597.25, max:600.25, avg:599, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","985","plan","official"]},
      {school:"中南林业科技大学", province:"湖南", level:"公办", year:2025, info:"产品设计，录取1，平均544", subject:"physics", min:543.5, max:543.5, avg:544, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"中南林业科技大学", province:"湖南", level:"公办", year:2024, info:"产品设计，录取1，平均559", subject:"physics", min:558.75, max:558.75, avg:559, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"中南林业科技大学", province:"湖南", level:"公办", year:2023, info:"产品设计，录取1，平均555", subject:"physics", min:555.4, max:555.4, avg:555, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"中南林业科技大学", province:"湖南", level:"公办", year:2025, info:"环境设计，录取1，平均527", subject:"physics", min:527, max:527, avg:527, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"中南林业科技大学", province:"湖南", level:"公办", year:2024, info:"环境设计，录取1，平均549", subject:"physics", min:549.25, max:549.25, avg:549, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"中南林业科技大学", province:"湖南", level:"公办", year:2023, info:"环境设计，录取1，平均552", subject:"physics", min:552, max:552, avg:552, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"中南林业科技大学", province:"湖南", level:"公办", year:2025, info:"视觉传达设计，录取1，平均544", subject:"physics", min:544, max:544, avg:544, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"中南林业科技大学", province:"湖南", level:"公办", year:2024, info:"视觉传达设计，录取1，平均557", subject:"physics", min:556.75, max:556.75, avg:557, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"中南林业科技大学", province:"湖南", level:"公办", year:2023, info:"视觉传达设计，录取1，平均557", subject:"physics", min:557.4, max:557.4, avg:557, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["public","official"]},
      {school:"中南林业科技大学涉外学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取2，平均477", subject:"physics", min:455, max:498.25, avg:477, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"中原工学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取3，平均500", subject:"physics", min:497.5, max:502, avg:500, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"中原工学院", province:"", level:"官方数据", year:2024, info:"服装与服饰设计，录取4，平均475", subject:"physics", min:469, max:481.75, avg:475, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"中原工学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取3，平均492", subject:"physics", min:484.75, max:502, avg:492, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"中原工学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取3，平均520", subject:"physics", min:509.25, max:526.25, avg:520, status:"省教委官方数据", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"南昌理工学院", province:"", level:"官方数据", year:2024, info:"产品设计，录取1，平均460", subject:"physics", min:460, max:460, avg:460, status:"省教委官方数据（人工已核（用户按原表确认））", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"南昌理工学院", province:"", level:"官方数据", year:2025, info:"环境设计，录取1，平均432", subject:"physics", min:431.5, max:431.5, avg:432, status:"省教委官方数据（人工已核（用户按原表确认））", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"南昌理工学院", province:"", level:"官方数据", year:2024, info:"环境设计，录取1，平均444", subject:"physics", min:443.75, max:443.75, avg:444, status:"省教委官方数据（人工已核（用户按原表确认））", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"南昌理工学院", province:"", level:"官方数据", year:2023, info:"环境设计，录取1，平均477", subject:"physics", min:477, max:477, avg:477, status:"省教委官方数据（人工已核（用户按原表确认））", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"南昌理工学院", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均445", subject:"physics", min:440.5, max:448.5, avg:445, status:"省教委官方数据（人工已核（用户按原表确认））", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"南昌理工学院", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取1，平均462", subject:"physics", min:461.75, max:461.75, avg:462, status:"省教委官方数据（人工已核（用户按原表确认））", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"南昌职业大学", province:"", level:"官方数据", year:2025, info:"视觉传达设计，录取2，平均432", subject:"physics", min:428, max:436.75, avg:432, status:"省教委官方数据（人工已核（用户按原表确认））", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"南昌职业大学", province:"", level:"官方数据", year:2025, info:"数字媒体艺术，录取2，平均429", subject:"physics", min:428, max:430.5, avg:429, status:"省教委官方数据（人工已核（用户按原表确认））", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"南昌职业大学", province:"", level:"官方数据", year:2024, info:"视觉传达设计，录取2，平均453", subject:"physics", min:450.75, max:456, avg:453, status:"省教委官方数据（人工已核（用户按原表确认））", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]},
      {school:"南昌职业大学", province:"", level:"官方数据", year:2023, info:"视觉传达设计，录取2，平均480", subject:"physics", min:479.6, max:480.3, avg:480, status:"省教委官方数据（人工已核（用户按原表确认））", source:"福建省教委官方结构化数据（物理组，2023-2025，用户提供）", tags:["official"]}
    ];

    const admissionHistoryColleges = colleges.slice();
    const planColleges2026 = Array.isArray(window.FujianArtPlan2026?.items) ? window.FujianArtPlan2026.items : [];
    if (planColleges2026.length) colleges.push(...planColleges2026);
    window.FujianArtSchoolMetadata?.enrichAll(colleges);
    let cachedCurrentCandidateRows = null;

    const schoolLinks = {
      "厦门大学": "https://zs.xmu.edu.cn/info/1051/32812.htm",
      "福州大学": "https://zsks.fzu.edu.cn/info/1068/2346.htm",
      "福建理工大学": "https://join.fjut.edu.cn/2025/0603/c4011a254799/page.htm",
      "福建江夏学院": "https://zsb.fjjxu.edu.cn/",
      "福建农林大学": "https://zsb.fafu.edu.cn/2026/0311/c515a94559/page.htm",
      "华侨大学": "https://zsc.hqu.edu.cn/info/1024/7692.htm",
      "福建商学院": "https://zsb.fjbu.edu.cn/__local/B/E6/2D/6C47B0340EC69F6A1512868BBBB_E993F87F_12687.pdf",
      "福建技术师范学院": "https://zsb.fpnu.edu.cn/info/1068/2678.htm",
      "闽南师范大学": "https://zsb.mnnu.edu.cn/info/1032/2801.htm",
      "福建师范大学": "https://zsb.fjnu.edu.cn/_web/_apps/commonquery/commonquery/api/queryMatch/9.rst?_p=YXM9MTImdD0xNTYzJnA9MSZtPU4m&mongo=false",
      "集美大学": "https://zsb.jmu.edu.cn/bkszs.htm",
      "闽江学院": "https://zsb.mju.edu.cn/2025/0713/c2134a205778/page.htm",
      "厦门理工学院": "https://zsb.xmut.edu.cn/",
      "泉州师范学院": "https://www.qztc.edu.cn/_upload/article/files/d6/a6/e972e90e41178ac02aaca8e47f3a/888970f5-a764-437d-986f-674ce045be34.pdf",
      "莆田学院": "https://www.ptu.edu.cn/zhaosheng/info/1007/2143.htm",
      "福州大学至诚学院": "https://zsb.fdzcxy.edu.cn/",
      "东华大学": "https://zs.dhu.edu.cn/2025/0508/c9563a361538/page.htm",
      "上海大学": "https://mp.weixin.qq.com/s/wANz1RUArTorfrhbva5wfA",
      "华东师范大学": "https://zsb.ecnu.edu.cn/83/fc/c37592a689148/page.htm",
      "天津大学": "https://zs.tju.edu.cn/info/1147/2499.htm",
      "天津工业大学": "https://zsb.tiangong.edu.cn/197/list.htm",
      "江南大学": "https://admission.jiangnan.edu.cn/info/1007/2714.htm",
      "南京传媒学院": "https://zsb.cucn.edu.cn/",
      "东南大学": "https://zsb.seu.edu.cn/2025/0527/c23610a529763/pagem.htm",
      "浙江理工大学": "https://zs.zstu.edu.cn/zszt/yslzs.htm",
      "浙江理工大学科技与艺术学院": "https://zs.ky.zstu.edu.cn/info/1005/1683.htm",
      "浙江师范大学": "https://zs.zjnu.edu.cn/2025/0530/c6886a519397/page.htm",
      "温州大学": "https://zs.wzu.edu.cn/__local/E/F4/40/B8317F165F236881E6F1049CE9D_51507622_39EB5.pdf",
      "湖州师范学院": "https://zsw.zjhu.edu.cn/2025/0613/c3210a234930/page.htm",
      "海南大学": "https://bkzs.hainanu.edu.cn/info/1003/5347.htm",
      "华南师范大学": "https://zsb.scnu.edu.cn/zhaoshenggonggao/yslzs/",
      "湖北大学": "https://zsxx.hubu.edu.cn/info/1015/2071.htm",
      "华中师范大学": "https://zs.ccnu.edu.cn/info/1006/9293.htm",
      "武昌理工学院": "https://zs.wut.edu.cn/info/1048/3051.htm",
      "中南大学": "https://zhaosheng.csu.edu.cn/info/1245/2224.htm",
      "重庆大学": "https://zhaosheng.cqu.edu.cn/pub/desktopend/contentpage/1157",
      "西南大学": "https://bkzsw.swu.edu.cn/info/1076/1985.htm",
      "四川旅游学院": "https://www.sctu.edu.cn/zsjyc/info/1017/1937.htm",
      "山东工艺美术学院": "https://zs.sdada.edu.cn/info/1007/2522.htm",
      "济南大学": "https://admission.ujn.edu.cn/info/1007/10775.htm",
      "景德镇陶瓷大学": "https://zs.jci.edu.cn/info/1010/2033.htm",
      "玉林师范学院": "https://zjw.ylu.edu.cn/zsw/zszc.htm",
      "宁夏大学": "https://zs.nxu.edu.cn/info/1021/3204.htm",
      "中央民族大学": "https://zb.muc.edu.cn/content/zs/ysl/67d5a895-5e27-11f0-98a5-6c92bf4353bb.htm"
    };

    let subject = "history";
    let recommendMode = "score";
    const embeddedRankData2025BySubject = (window.FujianArtRank2025 && window.FujianArtRank2025.rankData2025BySubject) || { history: [], physics: [] };
    const embeddedRankDataByYearSubject = (window.FujianArtRank2025 && window.FujianArtRank2025.rankDataByYearSubject) || { 2025: embeddedRankData2025BySubject };
    let rankData2025 = [];
    let rankData2026 = [];
    const VOLUNTEER_LIMIT = 50;
    const DEFAULT_COUNTS = { rush: 12, steady: 23, safe: 15 };
    const MANUAL_INITIAL_VISIBLE = 160;
    const MANUAL_LOAD_STEP = 100;
    let latestRecommendations = [];
    let manualSelections = [];
    let manualCandidateCache = [];
    let manualVisibleCount = MANUAL_INITIAL_VISIBLE;
    let recommendationsGenerated = false;
    let recommendationNotice = "";
    let exportObjectUrl = "";
    const RANK_2026_STORAGE_PREFIX = "fujian_art_rank_2026_";
    let quotaState = { loaded: false, unlimited: false, remaining: null, scoreTrialRemaining: null, rankAccess: false, manualAccess: false, pdfAccess: false, paidActive: false };
    let savedPlans = [];
    let currentSavedPlanId = "";
    let savedPlanUpdateTimer = 0;
    let html2PdfPromise = null;
    let generationConfirmResolver = null;
    let generationConfirmTrigger = null;
    let quotaBusy = false;
    let confirmedScoreState = { loaded: false, rows: {}, pending: null };
    let scoreInputSnapshot = null;

    const $ = id => document.getElementById(id);
    const fmt = n => n == null ? "待补" : Number(n).toFixed(2).replace(/\\.00$/, "");
    const hasAny = (item, tags) => tags.some(t => item.tags.includes(t));

    function rankSubjectForItem(item) {
      return item?.subject === "physics" || item?.subject === "history" ? item.subject : subject;
    }

    function rankYearForItem(item) {
      const year = Number(item?.referenceYear || item?.year);
      return Number.isFinite(year) ? year : 2025;
    }

    function rankDataForYearSubject(year, rankSubject = subject) {
      const data = embeddedRankDataByYearSubject[String(year)] || embeddedRankDataByYearSubject[Number(year)];
      return data?.[rankSubject] || [];
    }

    function rankDataForItem(item) {
      const itemYear = rankYearForItem(item);
      const itemSubject = rankSubjectForItem(item);
      const sameYear = rankDataForYearSubject(itemYear, itemSubject);
      if (sameYear.length) return sameYear;
      return rankDataForYearSubject(2025, itemSubject);
    }

    function rankTableYearForItem(item) {
      const itemYear = rankYearForItem(item);
      const itemSubject = rankSubjectForItem(item);
      if (rankDataForYearSubject(itemYear, itemSubject).length) return itemYear;
      if (rankDataForYearSubject(2025, itemSubject).length) return 2025;
      return itemYear;
    }

    function availableOfficialRankYears(rankSubject = subject) {
      return Object.keys(embeddedRankDataByYearSubject)
        .filter(year => (embeddedRankDataByYearSubject[year]?.[rankSubject] || []).length)
        .map(Number)
        .sort((a, b) => a - b);
    }

    function hasOfficialRankDataForSubject(rankSubject = subject) {
      return availableOfficialRankYears(rankSubject).length > 0;
    }

    function setRankData2025ForSubject() {
      rankData2025 = rankDataForYearSubject(2025, subject);
      const status = $("rank2025Status");
      if (!status) return;
      const subjectText = subject === "history" ? "\u5386\u53f2\u7ec4" : "\u7269\u7406\u7ec4";
      const years = availableOfficialRankYears(subject);
      status.textContent = years.length
        ? "\u5df2\u5185\u7f6e 2025 \u798f\u5efa\u7f8e\u672f\u4e0e\u8bbe\u8ba1\u7c7b" + subjectText + "\u7efc\u5408\u5206\u4e00\u5206\u4e00\u6bb5\u8868\u3002\u6309\u4f4d\u6b21\u63a8\u8350\u5c06\u76f4\u63a5\u7528\u8003\u751f\u8f93\u5165\u4f4d\u6b21\u5bf9\u6bd4 2025 \u5f55\u53d6\u4f4d\u6b21\u3002"
        : "\u672a\u52a0\u8f7d" + subjectText + "\u4e00\u5206\u4e00\u6bb5\u8868\uff0c\u8bf7\u68c0\u67e5 shared/fujian-art-rank-2025.js";
    }

    function rankMatchForScore(score, data) {
      if (!data.length || !Number.isFinite(score)) return { rank: null, status: "missing" };
      const sorted = [...data]
        .filter(row => Number.isFinite(Number(row.score)) && Number.isFinite(Number(row.rank)))
        .map(row => ({ ...row, score: Number(row.score), rank: Number(row.rank) }))
        .sort((a, b) => b.score - a.score || a.rank - b.rank);
      if (!sorted.length) return { rank: null, status: "missing" };
      const epsilon = 0.000001;
      const exact = sorted.find(row => Math.abs(row.score - score) < epsilon);
      if (exact) return { rank: exact.rank, status: "exact", upper: exact, lower: exact };
      const top = sorted[0];
      const bottom = sorted[sorted.length - 1];
      if (score > top.score) return { rank: top.rank, status: "boundary-high", upper: top, lower: top };
      if (score < bottom.score) return { rank: bottom.rank, status: "boundary-low", upper: bottom, lower: bottom };
      for (let i = 0; i < sorted.length - 1; i += 1) {
        const upper = sorted[i];
        const lower = sorted[i + 1];
        if (score < upper.score && score > lower.score) {
          const scoreSpan = upper.score - lower.score;
          const ratio = scoreSpan ? (upper.score - score) / scoreSpan : 0;
          const rank = Math.round(upper.rank + ratio * (lower.rank - upper.rank));
          return { rank, status: "estimated", upper, lower };
        }
      }
      return { rank: bottom.rank, status: "estimated", upper: bottom, lower: bottom };
    }

    function rankForScore(score, data) {
      return rankMatchForScore(score, data).rank;
    }

    function rankTextFromMatch(match) {
      if (!match || !match.rank) return "";
      if (match.status === "estimated") return "\u7ea6 " + match.rank + "\uff08\u533a\u95f4\u4f30\u7b97\uff09";
      if (match.status === "boundary-high") return "\u7ea6 " + match.rank + "\uff08\u9ad8\u5206\u6bb5\u8fb9\u754c\u4f30\u7b97\uff09";
      if (match.status === "boundary-low") return "\u7ea6 " + match.rank + "\uff08\u4f4e\u5206\u6bb5\u8fb9\u754c\u4f30\u7b97\uff09";
      return String(match.rank);
    }

    function scoreForRank(rank, data) {
      if (!data.length || !Number.isFinite(rank)) return null;
      const sorted = [...data].sort((a, b) => a.rank - b.rank);
      const row = sorted.find(r => rank <= r.rank);
      return row ? row.score : sorted[sorted.length - 1].score;
    }

    function estimatedRank(score) {
      return null;
    }

    function calculateCompositeScore() {
      const culture = Number($("cultureInput").value);
      const major = Number($("majorInput").value);
      if (!Number.isFinite(culture) || !Number.isFinite(major) || !$("cultureInput").value || !$("majorInput").value) return null;
      return culture * 0.5 + major * 2.5 * 0.5;
    }

    function updateCompositeScore() {
      const composite = calculateCompositeScore();
      if (composite == null) return;
      $("scoreInput").value = composite.toFixed(2).replace(/\.00$/, "");
    }

    function currentScoreValues() {
      const culture = Number($("cultureInput").value);
      const major = Number($("majorInput").value);
      const rankValue = String($("rankInput")?.value || "").trim();
      const rank = rankValue ? Number(rankValue) : null;
      if (!Number.isFinite(culture) || !Number.isFinite(major) || !$("cultureInput").value || !$("majorInput").value) return null;
      if (rankValue && (!Number.isFinite(rank) || rank <= 0)) return null;
      const composite = culture * 0.5 + major * 2.5 * 0.5;
      return { culture, major, composite, rank: rankValue ? Math.round(rank) : null };
    }

    function updateScoreLockStatus(message, error = false) {
      const element = $("scoreLockStatus");
      if (!element) return;
      element.textContent = message;
      element.style.color = error ? "#b8413b" : "";
    }

    function scoreRowForCurrentSubject() {
      return confirmedScoreState.rows?.[subject] || null;
    }


    function captureScoreInputSnapshot() {
      scoreInputSnapshot = {
        culture: $("cultureInput")?.value || "",
        major: $("majorInput")?.value || "",
        composite: $("scoreInput")?.value || "",
        rank: $("rankInput")?.value || "",
      };
      return scoreInputSnapshot;
    }

    function restoreScoreInputSnapshot(snapshot = scoreInputSnapshot) {
      if (!snapshot) return false;
      if ($("cultureInput")) $("cultureInput").value = snapshot.culture || "";
      if ($("majorInput")) $("majorInput").value = snapshot.major || "";
      if ($("scoreInput")) {
        if (snapshot.composite) $("scoreInput").value = snapshot.composite;
        else updateCompositeScore();
      }
      if ($("rankInput")) $("rankInput").value = snapshot.rank || "";
      updateCompositeScore();
      resetRecommendations();
      return true;
    }

    function scoreValuesSame(row, values) {
      if (!row || !values) return false;
      const rowRank = row.candidate_rank == null || row.candidate_rank === "" ? null : Math.round(Number(row.candidate_rank));
      const valueRank = values.rank == null || values.rank === "" ? null : Math.round(Number(values.rank));
      return Math.abs(Number(row.culture_score) - values.culture) < 0.0001 &&
        Math.abs(Number(row.major_score) - values.major) < 0.0001 &&
        rowRank === valueRank;
    }

    function renderScoreLockStatus() {
      const row = scoreRowForCurrentSubject();
      if (!row) {
        updateScoreLockStatus("\u6587\u5316\u5206\u3001\u7edf\u8003\u5206\u548c\u4f4d\u6b21\u786e\u8ba4\u540e\uff0c\u672c\u8d26\u53f7\u6700\u591a\u53ef\u4fee\u6539 3 \u6b21\u3002");
        return;
      }
      const used = Number(row.change_count || 0);
      updateScoreLockStatus("\u5df2\u786e\u8ba4\u6210\u7ee9\u548c\u4f4d\u6b21\uff0c\u5df2\u4fee\u6539 " + used + "/3 \u6b21\uff0c\u5269\u4f59 " + Math.max(3 - used, 0) + " \u6b21\u3002");
    }


    async function loadCandidateScoresDirect() {
      const session = await withTimeout(
        FujianArtAuth.getSession(),
        8000,
        "\u8bfb\u53d6\u767b\u5f55\u72b6\u6001\u8d85\u65f6\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u540e\u91cd\u8bd5\u3002"
      );
      if (!session) throw new Error("\u767b\u5f55\u72b6\u6001\u5df2\u5931\u6548\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55");
      const client = FujianArtAuth.getClient();
      const request = client.from("candidate_scores").select("*").eq("user_id", session.user.id);
      const { data, error } = await withTimeout(
        request,
        12000,
        "\u8bfb\u53d6\u6210\u7ee9\u8bb0\u5f55\u8d85\u65f6\uff0c\u8bf7\u68c0\u67e5\u6570\u636e\u5e93 SQL \u662f\u5426\u5df2\u6267\u884c\u3002"
      );
      if (error) throw error;
      return data || [];
    }

    async function saveCandidateScoreDirect(values) {
      const session = await withTimeout(
        FujianArtAuth.getSession(),
        8000,
        "\u8bfb\u53d6\u767b\u5f55\u72b6\u6001\u8d85\u65f6\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u540e\u91cd\u8bd5\u3002"
      );
      if (!session) throw new Error("\u767b\u5f55\u72b6\u6001\u5df2\u5931\u6548\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55");
      const client = FujianArtAuth.getClient();
      const payload = {
        user_id: session.user.id,
        subject,
        culture_score: values.culture,
        major_score: values.major,
        composite_score: values.composite,
        candidate_rank: values.rank
      };
      const request = client.from("candidate_scores")
        .upsert(payload, { onConflict: "user_id,subject" })
        .select("*")
        .single();
      const { data, error } = await withTimeout(
        request,
        12000,
        "\u6210\u7ee9\u4fdd\u5b58\u8d85\u65f6\uff0c\u8bf7\u786e\u8ba4 Supabase SQL \u5df2\u6267\u884c\u540e\u5237\u65b0\u91cd\u8bd5\u3002"
      );
      if (error) throw error;
      return data;
    }

    async function loadCandidateScores() {
      try {
        const rows = await loadCandidateScoresDirect();
        confirmedScoreState.rows = {};
        rows.forEach(row => { confirmedScoreState.rows[row.subject] = row; });
        const row = scoreRowForCurrentSubject();
        if (row && !$("cultureInput").value && !$("majorInput").value) {
          $("cultureInput").value = Number(row.culture_score);
          $("majorInput").value = Number(row.major_score);
          if ($("rankInput") && row.candidate_rank != null) $("rankInput").value = Number(row.candidate_rank);
          updateCompositeScore();
        }
        confirmedScoreState.loaded = true;
        renderScoreLockStatus();
      } catch (error) {
        updateScoreLockStatus("\u6210\u7ee9\u786e\u8ba4\u529f\u80fd\u6682\u4e0d\u53ef\u7528\uff1a" + (error?.message || "\u8bf7\u786e\u8ba4\u6570\u636e\u5e93 SQL \u5df2\u6267\u884c"), true);
      }
    }

    function showScoreConfirm(values, row) {
      return new Promise(resolve => {
        const used = Number(row?.change_count || 0);
        const remaining = row ? Math.max(3 - used, 0) : 3;
        $("scoreConfirmTitle").textContent = row ? "\u786e\u8ba4\u4fee\u6539\u6210\u7ee9" : "\u786e\u8ba4\u4fdd\u5b58\u6210\u7ee9";
        $("scoreConfirmMessage").textContent = row
          ? "\u6210\u7ee9\u548c\u4f4d\u6b21\u5df2\u786e\u8ba4\u540e\u6700\u591a\u53ea\u80fd\u4fee\u6539 3 \u6b21\u3002\u672c\u6b21\u786e\u8ba4\u540e\u5c06\u4f7f\u7528 1 \u6b21\u4fee\u6539\u673a\u4f1a\uff0c\u8bf7\u6838\u5bf9\u65e0\u8bef\u3002"
          : "\u8bf7\u8ba4\u771f\u6838\u5bf9\u6587\u5316\u5206\u3001\u7edf\u8003\u5206\u548c\u4f4d\u6b21\u3002\u9996\u6b21\u786e\u8ba4\u540e\uff0c\u540e\u7eed\u6700\u591a\u53ea\u80fd\u4fee\u6539 3 \u6b21\u3002";
        $("scoreConfirmCulture").textContent = fmt(values.culture);
        $("scoreConfirmMajor").textContent = fmt(values.major);
        $("scoreConfirmComposite").textContent = fmt(values.composite);
        $("scoreConfirmRank").textContent = values.rank || "\u672a\u586b\u5199";
        $("scoreConfirmRemaining").textContent = row ? (remaining + " \u6b21") : "3 \u6b21";
        $("scoreConfirmStatus").textContent = "";
        confirmedScoreState.pending = { values, resolve };
        $("scoreConfirmDialog").showModal();
      });
    }

    function withTimeout(promise, ms, message) {
      let timer = 0;
      const timeout = new Promise((_, reject) => {
        timer = window.setTimeout(() => reject(new Error(message)), ms);
      });
      return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timer));
    }

    async function saveConfirmedScore(values) {
      const row = await saveCandidateScoreDirect(values);
      if (!row) throw new Error("\u6210\u7ee9\u4fdd\u5b58\u540e\u672a\u8fd4\u56de\u8bb0\u5f55");
      confirmedScoreState.rows[subject] = row;
      renderScoreLockStatus();
      return row;
    }

    async function maybeConfirmCandidateScore() {
      const values = currentScoreValues();
      if (!values) return;
      const row = scoreRowForCurrentSubject();
      if (scoreValuesSame(row, values)) { renderScoreLockStatus(); return; }
      if (row && Number(row.change_count || 0) >= 3) {
        $("cultureInput").value = Number(row.culture_score);
        $("majorInput").value = Number(row.major_score);
        if ($("rankInput") && row.candidate_rank != null) $("rankInput").value = Number(row.candidate_rank);
        updateCompositeScore();
        updateScoreLockStatus("\u6210\u7ee9\u548c\u4f4d\u6b21\u4fee\u6539\u6b21\u6570\u5df2\u7528\u5b8c\uff0c\u5df2\u6062\u590d\u4e3a\u4e0a\u6b21\u786e\u8ba4\u6210\u7ee9\u548c\u4f4d\u6b21\u3002", true);
        return;
      }
      const beforeConfirmSnapshot = scoreInputSnapshot ? { ...scoreInputSnapshot } : {
        culture: row?.culture_score != null ? String(Number(row.culture_score)) : "",
        major: row?.major_score != null ? String(Number(row.major_score)) : "",
        composite: row?.composite_score != null ? String(Number(row.composite_score)) : "",
        rank: row?.candidate_rank != null ? String(Number(row.candidate_rank)) : "",
      };
      const confirmed = await showScoreConfirm(values, row);
      if (!confirmed) {
        restoreScoreInputSnapshot(beforeConfirmSnapshot);
        renderScoreLockStatus();
        return;
      }
      captureScoreInputSnapshot();
    }

    async function submitScoreConfirmation(event) {
      event?.preventDefault?.();
      const pending = confirmedScoreState.pending;
      if (!pending) return;
      const button = $("scoreConfirmSaveBtn");
      if (button) button.disabled = true;
      $("scoreConfirmStatus").className = "dialog-status";
      $("scoreConfirmStatus").textContent = "\u6b63\u5728\u4fdd\u5b58\u6210\u7ee9...";
      let finished = false;
      const watchdog = window.setTimeout(() => {
        if (finished) return;
        $("scoreConfirmStatus").className = "dialog-status error";
        $("scoreConfirmStatus").textContent = "\u4fdd\u5b58\u8d85\u65f6\u3002\u8bf7\u786e\u8ba4 Supabase SQL \u5df2\u6267\u884c\uff0c\u6216\u6539\u7528 http://127.0.0.1:4174/index.html \u6d4b\u8bd5\u3002";
        if (button) button.disabled = false;
      }, 15000);
      try {
        await saveConfirmedScore(pending.values);
        finished = true;
        window.clearTimeout(watchdog);
        $("scoreConfirmDialog").close();
        pending.resolve(true);
        confirmedScoreState.pending = null;
      } catch (error) {
        finished = true;
        window.clearTimeout(watchdog);
        $("scoreConfirmStatus").className = "dialog-status error";
        const message = error?.message || "\u6210\u7ee9\u4fdd\u5b58\u5931\u8d25";
        $("scoreConfirmStatus").textContent = /candidate_rank|candidate_scores|schema cache|relation|PGRST204|PGRST205/i.test(message)
          ? "\u6210\u7ee9\u8868\u9700\u66f4\u65b0\uff0c\u8bf7\u5728 Supabase \u6267\u884c 20260628150000_candidate_scores_rank_change_limit.sql\u3002"
          : message;
      } finally {
        if (finished && button) button.disabled = false;
      }
    }

    async function submitPasswordChange(event) {
      event.preventDefault();
      const password = $("accountNewPassword").value;
      const password2 = $("accountNewPassword2").value;
      const status = $("changePasswordStatus");
      status.className = "dialog-status";
      if (password.length < 8) { status.className = "dialog-status error"; status.textContent = "\u65b0\u5bc6\u7801\u81f3\u5c11\u9700\u8981 8 \u4f4d\u3002"; return; }
      if (password !== password2) { status.className = "dialog-status error"; status.textContent = "\u4e24\u6b21\u8f93\u5165\u7684\u65b0\u5bc6\u7801\u4e0d\u4e00\u81f4\u3002"; return; }
      status.textContent = "\u6b63\u5728\u4fee\u6539\u5bc6\u7801...";
      try {
        await FujianArtAuth.updatePassword(password);
        status.textContent = "\u5bc6\u7801\u5df2\u4fee\u6539\uff0c\u8bf7\u7262\u8bb0\u65b0\u5bc6\u7801\u3002";
        $("changePasswordForm").reset();
        window.setTimeout(() => $("changePasswordDialog").close(), 700);
      } catch (error) {
        status.className = "dialog-status error";
        status.textContent = error?.message || "\u5bc6\u7801\u4fee\u6539\u5931\u8d25";
      }
    }


    function defaultPaymentPaidAtValue() {
      const date = new Date();
      const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      return local.toISOString().slice(0, 16);
    }

    function setPaymentRequestStatus(message, type = '') {
      const element = document.getElementById('paymentRequestStatus');
      if (!element) return;
      element.textContent = message || '';
      element.className = 'payment-request-status' + (type ? ' ' + type : '');
    }

    function showPaymentUnlock(message) {
      const modal = document.getElementById('paymentUnlockModal');
      const dialog = document.getElementById('paymentUnlockDialog');
      const paidAtInput = document.getElementById('paymentPaidAt');
      if (paidAtInput && !paidAtInput.value) paidAtInput.value = defaultPaymentPaidAtValue();
      setPaymentRequestStatus('');
      const text = document.getElementById('paymentUnlockMessage');
      if (text) text.textContent = message || '该功能需要正式授权，请扫码付费后联系管理员开通。';
      if (!modal) return;
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('dialog-open');
      window.setTimeout(() => dialog?.focus(), 0);
    }

    function closePaymentUnlock() {
      const modal = document.getElementById('paymentUnlockModal');
      if (!modal) return;
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      if (document.getElementById('generationConfirm')?.classList.contains('hidden')) document.body.classList.remove('dialog-open');
    }

    async function submitPaymentRequest(event) {
      event.preventDefault();
      const button = document.getElementById('paymentRequestBtn');
      const contact = document.getElementById('paymentContact')?.value.trim() || '';
      const paidAtValue = document.getElementById('paymentPaidAt')?.value || '';
      const note = document.getElementById('paymentNote')?.value.trim() || '';
      if (!contact) {
        setPaymentRequestStatus('\u8bf7\u586b\u5199\u5fae\u4fe1\u53f7\u6216\u624b\u673a\u53f7\u3002', 'error');
        return;
      }
      button.disabled = true;
      setPaymentRequestStatus('\u6b63\u5728\u63d0\u4ea4\u7533\u8bf7...');
      try {
        const data = await invokeQuotaService('submitPaymentRequest', {
          contact,
          paidAt: paidAtValue ? new Date(paidAtValue).toISOString() : null,
          note,
          requestedFeatures: ['rank', 'manual', 'pdf']
        });
        setPaymentRequestStatus(data.duplicate ? '\u5df2\u6709\u5f85\u5904\u7406\u7533\u8bf7\uff0c\u8bf7\u7b49\u5f85\u7ba1\u7406\u5458\u5ba1\u6838\u3002' : '\u7533\u8bf7\u5df2\u63d0\u4ea4\uff0c\u8bf7\u7b49\u5f85\u7ba1\u7406\u5458\u5ba1\u6838\u5f00\u901a\u3002', 'success');
      } catch (error) {
        const message = error?.message || '\u7533\u8bf7\u63d0\u4ea4\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002';
        setPaymentRequestStatus(/payment_requests|schema cache|PGRST205|relation/i.test(message)
          ? '\u4ed8\u6b3e\u7533\u8bf7\u8868\u5c1a\u672a\u90e8\u7f72\uff0c\u8bf7\u7ba1\u7406\u5458\u5728 Supabase SQL Editor \u6267\u884c 20260625090000_payment_requests.sql\uff0c\u7136\u540e\u5237\u65b0\u9875\u9762\u91cd\u8bd5\u3002'
          : message, 'error');
      } finally {
        button.disabled = false;
      }
    }

    function paymentRequiredMessage(reason) {
      const messages = {
        rank_paid_required: '按位次推荐为正式授权功能，请扫码付费后联系管理员开通。',
        score_trial_exhausted: '免费按分数试用已用完，请扫码付费开通正式授权。',
        paid_required: '当前功能需要正式授权，请扫码付费后联系管理员开通。',
        manual_paid_required: '手动选志愿保存为正式授权功能，请扫码付费后联系管理员开通。',
        pdf_paid_required: '导出 PDF 为正式授权功能，请扫码付费后联系管理员开通。'
      };
      return messages[reason] || messages.paid_required;
    }

    function renderAuthorizationStatus() {
      const metric = document.getElementById("authMetric");
      const hint = document.getElementById("authHint");
      if (!metric || !hint) return;
      if (!quotaState.loaded) {
        metric.textContent = "\u8bfb\u53d6\u4e2d";
        hint.textContent = "\u6b63\u5728\u68c0\u67e5\u6388\u6743";
        return;
      }
      const enabled = [];
      if (quotaState.rankAccess) enabled.push("\u4f4d\u6b21");
      if (quotaState.manualAccess) enabled.push("\u624b\u52a8");
      if (quotaState.pdfAccess) enabled.push("PDF");
      if (quotaState.unlimited) {
        metric.textContent = "\u4e0d\u9650\u6b21";
        hint.textContent = enabled.length ? "\u5df2\u5f00\u901a " + enabled.join("\u3001") : "\u6b63\u5f0f\u6388\u6743";
      } else if (quotaState.paidActive) {
        metric.textContent = "\u6b63\u5f0f\u6388\u6743";
        hint.textContent = "\u5269\u4f59 " + (quotaState.remaining ?? 0) + " \u6b21" + (enabled.length ? "\uff0c" + enabled.join("\u3001") : "\uff0c\u5df2\u5f00\u901a");
      } else {
        metric.textContent = "\u514d\u8d39\u8bd5\u7528";
        hint.textContent = "\u6309\u5206\u6570\u5269\u4f59 " + (quotaState.scoreTrialRemaining ?? 0) + " \u6b21";
      }
    }
    function updateQuotaStatus(message, error = false) {
      const element = $("quotaStatus");
      if (!element) return;
      element.textContent = message;
      element.style.color = error ? "#b42318" : "";
    }

    function applyQuotaResult(data) {
      quotaState.loaded = true;
      quotaState.unlimited = Boolean(data?.unlimited);
      quotaState.remaining = data?.remaining == null ? null : Number(data.remaining);
      quotaState.scoreTrialRemaining = data?.scoreTrialRemaining == null ? null : Number(data.scoreTrialRemaining);
      const explicitFeatureAccess = Boolean(data?.rankAccess || data?.manualAccess || data?.pdfAccess);
      const legacyPaidAccess = Boolean(data?.paidActive && data?.paidUntil && !explicitFeatureAccess);
      quotaState.rankAccess = Boolean(data?.rankAccess || legacyPaidAccess);
      quotaState.manualAccess = Boolean(data?.manualAccess || legacyPaidAccess);
      quotaState.pdfAccess = Boolean(data?.pdfAccess || legacyPaidAccess);
      quotaState.paidActive = Boolean(data?.paidActive || quotaState.unlimited || quotaState.rankAccess || quotaState.manualAccess || quotaState.pdfAccess);
      const parts = [];
      if (quotaState.unlimited) parts.push('当前账号生成次数不限');
      else if (quotaState.paidActive) parts.push('正式授权剩余 ' + (quotaState.remaining ?? 0) + ' 次');
      else parts.push('免费按分数试用剩余 ' + (quotaState.scoreTrialRemaining ?? 0) + ' 次');
      if (!quotaState.rankAccess && recommendMode === 'rank') parts.push('按位次需付费开通');
      renderAuthorizationStatus();
      updateQuotaStatus(parts.join('；') + '。');
    }

    function hasSavedPlanAccess() {
      return Boolean(quotaState.unlimited || quotaState.paidActive || quotaState.rankAccess || quotaState.manualAccess || quotaState.pdfAccess);
    }

    async function invokeQuotaService(action, values = {}) {
      const session = await withTimeout(
        FujianArtAuth.getSession(),
        8000,
        "\u8bfb\u53d6\u767b\u5f55\u72b6\u6001\u8d85\u65f6\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u540e\u91cd\u8bd5\u3002"
      );
      if (!session) throw new Error("\u767b\u5f55\u72b6\u6001\u5df2\u5931\u6548\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55");
      const config = window.FujianArtSupabaseConfig;
      if (!config?.url || !config?.anonKey) throw new Error("\u6388\u6743\u670d\u52a1\u914d\u7f6e\u4e0d\u5b8c\u6574");
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch(config.url + "/functions/v1/user-admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: config.anonKey,
            Authorization: "Bearer " + session.access_token
          },
          body: JSON.stringify({ action, ...values }),
          signal: controller.signal
        });
        const raw = await response.text();
        let data = {};
        try { data = raw ? JSON.parse(raw) : {}; } catch (_) {}
        if (!response.ok) throw new Error(data.error || raw || ("\u670d\u52a1\u8bf7\u6c42\u5931\u8d25\uff08" + response.status + "\uff09"));
        return data;
      } catch (error) {
        if (error?.name === "AbortError") throw new Error("\u670d\u52a1\u8bf7\u6c42\u8d85\u65f6\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u6216\u786e\u8ba4 user-admin \u5df2\u90e8\u7f72\u3002");
        throw error;
      } finally {
        window.clearTimeout(timer);
      }
    }

    async function loadQuota() {
      try {
        const data = await invokeQuotaService("getQuota");
        if (!data?.ok) throw new Error(data?.error || "账号授权无效");
        applyQuotaResult(data);
        return true;
      } catch (error) {
        quotaState.loaded = false;
        updateQuotaStatus("读取生成次数失败：" + (error?.message || "未知错误"), true);
        return false;
      }
    }

    function setFeatureStatus(targetId, message, error = false) {
      if (targetId === "quotaStatus") {
        updateQuotaStatus(message, error);
        return;
      }
      const element = document.getElementById(targetId);
      if (!element) return;
      element.textContent = message;
      element.style.color = error ? "#b42318" : "";
    }

    async function ensureFeatureAccess(feature, reason, statusId = "quotaStatus") {
      const accessKey = feature + "Access";
      if (!quotaState.loaded || !quotaState[accessKey]) {
        setFeatureStatus(statusId, "正在读取最新授权...");
        const ok = await loadQuota();
        if (!ok) {
          setFeatureStatus(statusId, "授权读取失败，请刷新页面后重试；若后台刚开通，请确认 user-admin 已部署最新版本。", true);
          return false;
        }
      }
      if (quotaState[accessKey]) return true;
      const message = paymentRequiredMessage(reason);
      setFeatureStatus(statusId, message, true);
      showPaymentUnlock(message);
      return false;
    }


    function createRequestId() {
      if (window.crypto?.randomUUID) return window.crypto.randomUUID();
      return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    async function consumeQuota(score, rank) {
      const data = await invokeQuotaService("consumeQuota", {
        requestId: createRequestId(),
        subject,
        score: Number.isFinite(score) ? score : null,
        rank: Number.isFinite(rank) && rank > 0 ? Math.round(rank) : null,
        recommendMode
      });
      if (data?.ok) applyQuotaResult(data);
      return data || { ok: false, reason: "service_unavailable" };
    }

        function validateGenerationInputs() {
      updateCompositeScore();
      let score = Number($("scoreInput").value);
      const userRank = Number($("rankInput").value);
      if ((!Number.isFinite(score) || score <= 0) && recommendMode === "score") {
        updateQuotaStatus("\u8bf7\u5148\u586b\u5199\u6709\u6548\u5206\u6570\u3002", true);
        $("scoreInput").focus();
        return null;
      }
      if (!Number.isFinite(score) || score <= 0) score = null;
      if (recommendMode === "rank" && !hasOfficialRankDataForSubject()) {
        updateQuotaStatus("\u672a\u52a0\u8f7d\u5230\u5f53\u524d\u79d1\u7c7b 2025 \u5b98\u65b9\u4e00\u5206\u4e00\u6bb5\u8868\uff0c\u6682\u65f6\u4e0d\u80fd\u6309\u4f4d\u6b21\u751f\u6210\u3002", true);
        return null;
      }
      if (recommendMode === "rank" && (!Number.isFinite(userRank) || userRank <= 0)) {
        updateQuotaStatus("\u8bf7\u5148\u586b\u5199\u6709\u6548\u4f4d\u6b21/\u6392\u540d\u3002", true);
        $("rankInput").focus();
        return null;
      }
      return { score, userRank, counts: selectedCounts() };
    }

    function closeGenerationConfirmation(confirmed = false, restoreFocus = true) {
      if (!generationConfirmResolver) return;
      const resolve = generationConfirmResolver;
      generationConfirmResolver = null;
      $("generationConfirm").classList.add("hidden");
      $("generationConfirm").setAttribute("aria-hidden", "true");
      document.body.classList.remove("dialog-open");
      resolve(confirmed);
      const trigger = generationConfirmTrigger;
      generationConfirmTrigger = null;
      if (restoreFocus) window.setTimeout(() => trigger?.focus?.(), 0);
    }

    function confirmGeneration(context) {
      if (generationConfirmResolver) return Promise.resolve(false);
      const rankMode = recommendMode === "rank";
      const subjectText = subject === "history" ? "历史组" : "物理组";
      const quotaText = quotaState.unlimited
        ? "当前账号生成次数不限；确认后方案将自动保存到“我的志愿”。"
        : quotaState.loaded && Number.isFinite(quotaState.remaining)
          ? "确认后将使用1次生成次数，预计剩余 " + Math.max(0, quotaState.remaining - 1) + " 次；方案将自动保存。"
          : "确认后将使用1次生成次数，并自动保存到“我的志愿”。";
      $("generationConfirmBadge").textContent = rankMode ? "按位次 · 正式推荐" : "按分数 · 模拟";
      $("generationConfirmBadge").className = "confirm-mode-badge " + (rankMode ? "rank" : "score");
      $("generationConfirmTitle").textContent = rankMode ? "确认按位次生成志愿？" : "确认生成模拟志愿？";
      $("generationConfirmMessage").textContent = rankMode
        ? "系统将以当前位次为主要依据，参考往年院校录取位次生成冲、稳、保志愿。位次和招生计划变化仍可能影响结果，请结合官方信息复核。"
        : "当前选择“按分数”模式。艺术类录取和正式填报应以位次为主要参考；按分数生成仅适用于位次尚未公布时的模拟测算，不建议直接作为最终填报方案。";
      $("generationConfirmMessage").className = "generation-confirm-message" + (rankMode ? "" : " score");
      $("generationConfirmSubject").textContent = subjectText;
      $("generationConfirmScore").textContent = fmt(context.score);
      $("generationConfirmRank").textContent = context.userRank ? Math.round(context.userRank) : "暂未确定";
      $("generationConfirmCounts").textContent = context.counts.rush + " 冲 / " + context.counts.steady + " 稳 / " + context.counts.safe + " 保";
      $("generationConfirmQuota").textContent = quotaText;
      $("generationSwitchBtn").hidden = rankMode;
      $("generationConfirmBtn").textContent = rankMode ? "确认生成" : "继续模拟";
      generationConfirmTrigger = document.activeElement;
      $("generationConfirm").classList.remove("hidden");
      $("generationConfirm").setAttribute("aria-hidden", "false");
      document.body.classList.add("dialog-open");
      window.setTimeout(() => $("generationConfirmDialog").focus(), 0);
      return new Promise(resolve => { generationConfirmResolver = resolve; });
    }

    async function generateFromInputs() {
      if (quotaBusy || generationConfirmResolver) return false;
      const context = validateGenerationInputs();
      if (!context) return false;
      if (recommendMode === "rank" && !(await ensureFeatureAccess("rank", "rank_paid_required", "quotaStatus"))) return false;
      const confirmed = await confirmGeneration(context);
      if (!confirmed) return false;
      const { score, userRank } = context;
      quotaBusy = true;
      $("generateBtn").disabled = true;
      $("mobileGenerateBtn").disabled = true;
      updateQuotaStatus("正在核验生成次数...");
      try {
        const result = await consumeQuota(score, userRank);
        if (!result?.ok) {
          const reasonMessages = {
            quota_exhausted: '正式授权生成次数已用完，请联系管理员增加次数。',
            score_trial_exhausted: '免费按分数试用已用完，请付费开通正式授权。',
            rank_paid_required: '按位次推荐为正式授权功能，请付费开通后使用。',
            paid_required: '当前功能需要正式授权，请付费开通后使用。'
          };
          const message = reasonMessages[result?.reason] || '暂时无法核验生成次数，请稍后重试。';
          updateQuotaStatus(message, true);
          if (['score_trial_exhausted', 'rank_paid_required', 'paid_required'].includes(result?.reason)) showPaymentUnlock(message);
          return false;
        }
        recommendationsGenerated = true;
        makeRecommendations();
        if (latestRecommendations.length && hasSavedPlanAccess()) await saveCurrentPlan();
        else if (latestRecommendations.length) document.getElementById('savePlanStatus').textContent = '免费试用方案仅供本次查看，不自动保存；正式授权后可保存到我的志愿。';
        return true;
      } catch (error) {
        updateQuotaStatus("生成次数核验失败：" + (error?.message || "未知错误"), true);
        return false;
      } finally {
        quotaBusy = false;
        $("generateBtn").disabled = false;
        $("mobileGenerateBtn").disabled = false;
      }
    }

    function activeTabName() {
      return document.querySelector(".tabs button.active")?.dataset.tab || "recommend";
    }

    function isManualTabActive() {
      return activeTabName() === "manual";
    }

    function resetRecommendations() {
      recommendationsGenerated = false;
      latestRecommendations = [];
      recommendationNotice = "\u8bf7\u586b\u5199\u5206\u6570\u5e76\u70b9\u51fb\u751f\u6210\u5fd7\u613f\u3002";
      resetManualVisibleCount();
      const score = Number($("scoreInput").value) || 0;
      const userRank = Number($("rankInput").value) || estimatedRank(score);
      if (isManualTabActive()) {
        renderManualSelection();
      } else {
        render(score, userRank, false);
      }
    }

    function refreshRecommendationsIfGenerated() {
      resetManualVisibleCount();
      if (isManualTabActive()) {
        renderManualSelection();
        return;
      }
      if (recommendationsGenerated) {
        makeRecommendations();
        scheduleCurrentPlanUpdate();
      } else {
        resetRecommendations();
      }
    }

    let filterRefreshTimer = 0;
    function scheduleFilterRefresh() {
      clearTimeout(filterRefreshTimer);
      filterRefreshTimer = setTimeout(refreshRecommendationsIfGenerated, 140);
    }

    function collegeRankMatch(item) {
      const table = rankDataForItem(item);
      return item.min == null ? { rank: null, status: "missing" } : rankMatchForScore(item.min, table);
    }

    function collegeRank(item) {
      return collegeRankMatch(item).rank;
    }

    function equivalentScore2026(item) {
      const rank = collegeRank(item);
      return rank ? scoreForRank(rank, rankData2026) : null;
    }

    function referenceText(item) {
      if (item.min == null) return item.planYear === 2026 ? "\u0032\u0030\u0032\u0036\u62db\u751f\u8ba1\u5212\uff1b\u6682\u65e0\u0032\u0030\u0032\u0035\u5f55\u53d6\u53c2\u8003" : "";
      const referenceYear = Number(item.referenceYear || item.year || 2025);
      const planText = item.planYear === 2026 && item.planCount ? `2026\u8ba1\u5212 ${item.planCount} \u4eba\uff1b` : "";
      const scoreText = referenceYear + "\u53c2\u8003\u6700\u4f4e\u5206 " + fmt(item.min) + (item.max ? "-" + fmt(item.max) : "");
      const match = collegeRankMatch(item);
      const rank = match.rank;
      const tableYear = rankTableYearForItem(item);
      const sourceLabel = tableYear === rankYearForItem(item) ? tableYear + "\u5f55\u53d6\u4f4d\u6b21" : "\u501f" + tableYear + "\u4f4d\u6b21";
      const rankText = rankTextFromMatch(match);
      if (rank) return planText + scoreText + "\uff1b" + sourceLabel + " " + rankText;
      return planText + scoreText + "\uff1b\u6682\u65e0\u53ef\u5339\u914d\u4f4d\u6b21";
    }

    function selectedCounts() {
      const rush = Math.max(0, Number($("rushCount").value || 0));
      const steady = Math.max(0, Number($("steadyCount").value || 0));
      const safe = Math.max(0, Number($("safeCount").value || 0));
      const total = rush + steady + safe;
      if (total === VOLUNTEER_LIMIT) return { rush, steady, safe };
      if (total === 0) return { ...DEFAULT_COUNTS };
      const scale = VOLUNTEER_LIMIT / total;
      const r = Math.round(rush * scale);
      const s = Math.round(steady * scale);
      return { rush: r, steady: s, safe: VOLUNTEER_LIMIT - r - s };
    }

    function itemMatches(item) {
      const includeUnverified = $("includeUnverified").checked;
      const includePrivate = $("includePrivate").checked;
      const includeCoop = $("includeCoop").checked;
      const includePublic = $("includePublic").checked;
      const include985 = $("include985").checked;
      const include211 = $("include211").checked;
      const includeDouble = $("includeDouble").checked;
      const keyword = $("keywordInput").value.trim().toLowerCase();
      const subjectOk = item.subject === "both" || item.subject === subject;
      if (!subjectOk) return false;
      const isCurrentPlanWithoutReference = Number(item?.planYear) === 2026 && item.min == null;
      if (!includeUnverified && item.min == null && !isCurrentPlanWithoutReference) return false;
      const ownershipTags = item.tags.filter(tag => tag === "public" || tag === "private");
      const selectedOwnership = [includePublic && "public", includePrivate && "private"].filter(Boolean);
      if (!includeCoop && (item.tags.includes("coop") || /中外|合作办学/.test(item.info))) return false;
      const tierTags = item.tags.filter(tag => ["985", "211", "double"].includes(tag));
      const selectedTiers = [include985 && "985", include211 && "211", includeDouble && "double"].filter(Boolean);
      const tierFilterActive = selectedTiers.length > 0;
      const matchesSelectedTier = tierTags.some(tag => selectedTiers.includes(tag));
      const ownershipOk = !ownershipTags.length || ownershipTags.some(tag => selectedOwnership.includes(tag));
      if (!ownershipOk && !(tierFilterActive && matchesSelectedTier)) return false;
      if (selectedTiers.length !== 3) {
        if (!selectedTiers.length && tierTags.length) return false;
        if (selectedTiers.length && !tierTags.some(tag => selectedTiers.includes(tag))) return false;
      }
      if (keyword) {
        const hay = [item.school, item.province, item.level, item.info, item.status].join(" ").toLowerCase();
        if (!hay.includes(keyword)) return false;
      }
      return true;
    }

    function classifyByScore(item, score) {
      if (item.min == null) return "info";
      const diff = item.min - score;
      if (diff > 0 && diff <= 20) return "rush";
      if (diff <= 0 && diff >= -12) return "steady";
      if (diff < -12) return "safe";
      return "info";
    }

    function rankDifference(item, userRank) {
      const rank = collegeRank(item);
      if (!Number.isFinite(rank) || !Number.isFinite(userRank) || userRank <= 0) return null;
      return rank - userRank;
    }

    function rankDistance(item, userRank) {
      const diff = rankDifference(item, userRank);
      return diff == null ? Number.POSITIVE_INFINITY : Math.abs(diff);
    }

    function classifyByRank(item, userRank) {
      const rank = collegeRank(item);
      if (!Number.isFinite(rank) || !Number.isFinite(userRank) || userRank <= 0) return "info";
      if (rank < userRank) return rank >= userRank * 0.7 ? "rush" : "info";
      if (rank <= userRank * 1.2) return "steady";
      if (rank <= userRank * 2.2) return "safe";
      return "info";
    }

    function rankRiskText(item, userRank) {
      const match = collegeRankMatch(item);
      const rank = match.rank;
      if (!rank || !Number.isFinite(userRank) || userRank <= 0) return "";
      const diff = rank - userRank;
      const diffText = diff === 0 ? "\u4e0e\u4f60\u7684\u4f4d\u6b21\u6301\u5e73" : (diff > 0 ? "\u6bd4\u4f60\u9760\u540e " + diff + " \u540d" : "\u6bd4\u4f60\u9760\u524d " + Math.abs(diff) + " \u540d");
      return "\u6309\u4f4d\u6b21\u53c2\u8003\uff1a2025\u5f55\u53d6\u4f4d\u6b21 " + rankTextFromMatch(match) + "\uff0c" + diffText;
    }

    function sortGroup(items, band, score, useRank, userRank) {
      if (!useRank) {
        if (band === "rush") items.sort((a, b) => a.min - b.min);
        if (band === "steady") items.sort((a, b) => Math.abs(a.min - score) - Math.abs(b.min - score));
        if (band === "safe") items.sort((a, b) => b.min - a.min);
        return;
      }
      if (band === "rush") items.sort((a, b) => rankDistance(a, userRank) - rankDistance(b, userRank));
      if (band === "steady") items.sort((a, b) => rankDistance(a, userRank) - rankDistance(b, userRank));
      if (band === "safe") items.sort((a, b) => rankDistance(a, userRank) - rankDistance(b, userRank));
    }

    function riskText(item, band, score, userRank) {
      const bits = [];
      if (item.min != null || Number(item?.planYear) === 2026) bits.push(referenceText(item));
      if (recommendMode === "rank" && item.min != null && rankRiskText(item, userRank)) bits.push(rankRiskText(item, userRank));
      const previousYears = (item.historyRecords || []).filter(record => record.year !== item.year && record.min != null);
      if (previousYears.length) bits.push(`\u5f80\u5e74\u53c2\u8003\uff1a${previousYears.map(record => `${record.year}\u6700\u4f4e${fmt(record.min)}`).join("\uff0c")}`);
      bits.push(`\u6570\u636e\u72b6\u6001\uff1a${publicDataStatus(item)}`);
      if (hasAny(item, ["985", "211", "double"])) bits.push("\u9ad8\u5c42\u7ea7\u9662\u6821\uff0c\u5c0f\u8ba1\u5212\u6ce2\u52a8\u9700\u653e\u5927\u5b89\u5168\u57ab");
      if (item.tags.includes("coop")) bits.push("\u4e2d\u5916\u5408\u4f5c\u9700\u6838\u5b66\u8d39\u3001\u5916\u8bed\u548c\u57f9\u517b\u65b9\u5f0f");
      if (item.tags.includes("private")) bits.push("\u6c11\u529e/\u72ec\u7acb\u5b66\u9662\u9700\u6838\u5b66\u8d39\u548c\u6821\u533a");
      if (Number(item?.planYear) === 2026 && item.min == null) bits.push("\u65b0\u589e\u4e13\u4e1a\u6682\u65e0\u53bb\u5e74\u5f55\u53d6\u53c2\u8003\uff0c\u5efa\u8bae\u7ed3\u5408\u540c\u6821\u76f8\u8fd1\u4e13\u4e1a\u3001\u5b66\u6821\u5c42\u6b21\u548c\u62db\u751f\u8ba1\u5212\u4eba\u6570\u590d\u6838");
      if (!bits.length) bits.push("\u5f85\u5b98\u65b9\u5f55\u53d6\u5206\u8865\u9f50\u540e\u518d\u5224\u5b9a\u51b2\u7a33\u4fdd");
      return bits.join("\uff1b");
    }

    function publicDataStatus(item) {
      const status = String(item.status || "");
      if (/\u9700\u786e\u8ba4|\u6700\u9ad8\u5206\u5c0f\u4e8e\u6700\u4f4e\u5206|\u5e73\u5747\u5206\u660e\u663e\u4e0d\u5728|\u5f02\u5e38/.test(status)) return "\u5b98\u65b9\u6570\u636e\uff08\u6570\u503c\u5f85\u6838\uff09";
      if (Number(item?.planYear) === 2026 && item.min == null) return "\u0032\u0030\u0032\u0036\u65b0\u589e/\u6682\u65e0\u0032\u0030\u0032\u0035\u53c2\u8003";
      if ((item.tags || []).includes("official") || status.includes("\u5b98\u65b9\u6570\u636e") || status.includes("\u0032\u0030\u0032\u0036\u62db\u751f\u8ba1\u5212")) return "\u5b98\u65b9\u6570\u636e";
      return status || "\u6570\u636e\u5f85\u6838";
    }

    const CURRENT_CANDIDATE_YEAR = 2026;

    function isCurrentCandidateRecord(item) {
      return Number(item?.year) === CURRENT_CANDIDATE_YEAR;
    }

    function currentCandidateRows(rows) {
      if (rows === colleges && cachedCurrentCandidateRows) return cachedCurrentCandidateRows;
      const result = (Array.isArray(rows) ? rows : []).filter(isCurrentCandidateRecord);
      if (rows === colleges) cachedCurrentCandidateRows = result;
      return result;
    }

    function pool() {
      const rows = colleges.filter(itemMatches);
      if ($("preferFujian").checked) {
        rows.sort((a, b) => (b.province === "福建") - (a.province === "福建") || (b.min || 0) - (a.min || 0));
      } else {
        rows.sort((a, b) => (b.min || -1) - (a.min || -1));
      }
      return rows;
    }

    function programName(item) {
      const explicit = String(item?.program || item?.major || "").trim();
      if (explicit) return explicit;
      const info = String(item?.info || "").trim();
      const match = info.match(/^(.+?)[\uFF0C,]\s*(?:\u5F55\u53D6|\u8BA1\u5212)/);
      return (match ? match[1] : info || "\u4E13\u4E1A\u5F85\u6838").trim();
    }

    function recommendationKey(item) {
      const normalize = value => String(value || "").normalize("NFKC").trim().toLowerCase().replace(/\s+/g, "").replace(/[\u3014\u3010]/g, "(").replace(/[\u3015\u3011]/g, ")");
      return [normalize(item?.school), normalize(programName(item)), normalize(item?.subject)].join("|");
    }

    function sortAdmissionRecords(records) {
      return [...records].sort((a, b) =>
        Number(b.year || 0) - Number(a.year || 0) ||
        Number((b.tags || []).includes("official")) - Number((a.tags || []).includes("official")) ||
        Number(b.min || 0) - Number(a.min || 0)
      );
    }

    let cachedHistoryRecordsByKey = null;

    function historyRecordsByKey(historySourceRows = admissionHistoryColleges) {
      if (historySourceRows === admissionHistoryColleges && cachedHistoryRecordsByKey) return cachedHistoryRecordsByKey;
      const map = new Map();
      (Array.isArray(historySourceRows) ? historySourceRows : []).forEach(record => {
        if (record.min == null || Number(record.planYear) === 2026) return;
        const key = recommendationKey(record);
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(record);
      });
      map.forEach((records, key) => map.set(key, sortAdmissionRecords(records)));
      if (historySourceRows === admissionHistoryColleges) cachedHistoryRecordsByKey = map;
      return map;
    }

    function aggregateRecommendationRows(rows, historySourceRows = admissionHistoryColleges) {
      const groups = new Map();
      const historyMap = historyRecordsByKey(historySourceRows);
      currentCandidateRows(rows).forEach(item => {
        const key = recommendationKey(item);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(item);
      });
      return [...groups.entries()].map(([key, records]) => {
        const sorted = sortAdmissionRecords(records);
        const historyRecords = historyMap.get(key) || [];
        const byYear = new Map();
        historyRecords.forEach(record => { if (!byYear.has(record.year)) byYear.set(record.year, record); });
        sorted.forEach(record => { if (!byYear.has(record.year)) byYear.set(record.year, record); });
        const primary = sorted[0];
        return {
          ...primary,
          recommendationKey: key,
          program: programName(primary),
          historyRecords: [...byYear.values()].map(record => ({
            year: record.year,
            min: record.min,
            max: record.max,
            avg: record.avg,
            info: record.info,
            status: record.status,
            source: record.source
          }))
        };
      });
    }

    function dedupePlanRecommendations(rows) {
      const seen = new Set();
      return (Array.isArray(rows) ? rows : []).filter(row => {
        const key = recommendationKey(row.item || {});
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).map((row, index) => ({ ...row, index: index + 1 }));
    }

    function sortVolunteerRowsByBandAndRank(rows) {
      const bandOrder = { rush: 0, steady: 1, safe: 2, info: 3 };
      return [...(Array.isArray(rows) ? rows : [])]
        .sort((a, b) => {
          const bandDiff = (bandOrder[a.band] ?? 9) - (bandOrder[b.band] ?? 9);
          if (bandDiff) return bandDiff;
          const rankA = collegeRank(a.item || {}) ?? Number.POSITIVE_INFINITY;
          const rankB = collegeRank(b.item || {}) ?? Number.POSITIVE_INFINITY;
          if (rankA !== rankB) return rankA - rankB;
          return Number(b.item?.min || 0) - Number(a.item?.min || 0);
        })
        .map((row, index) => ({ ...row, index: index + 1 }));
    }

    function normalizeSavedRecommendations(plan) {
      const rows = dedupePlanRecommendations(plan?.recommendations || []);
      return plan?.filters?.manual ? sortVolunteerRowsByBandAndRank(rows) : rows;
    }

    function makeRecommendations() {
      const score = Number($("scoreInput").value);
      const inputRank = Number($("rankInput").value);
      const userRank = inputRank || estimatedRank(score);
      const useRank = recommendMode === "rank" && !!userRank && hasOfficialRankDataForSubject();
      const counts = selectedCounts();
      const allRows = pool().filter(r => !r.tags.includes("special"));
      recommendationNotice = "";

      if (recommendMode === "rank" && !hasOfficialRankDataForSubject()) {
        latestRecommendations = [];
        recommendationNotice = "\u672a\u52a0\u8f7d\u5230\u5f53\u524d\u79d1\u7c7b 2025 \u5b98\u65b9\u4e00\u5206\u4e00\u6bb5\u8868\uff0c\u8bf7\u68c0\u67e5 shared/fujian-art-rank-2025.js\u3002";
        render(score, userRank, false);
        return;
      }
      if (recommendMode === "rank" && !userRank) {
        latestRecommendations = [];
        recommendationNotice = "\u6309\u4f4d\u6b21\u751f\u6210\u9700\u8981\u586b\u5199\u8003\u751f\u81ea\u5df1\u7684\u5168\u7701\u7efc\u5408\u5206\u4f4d\u6b21/\u6392\u540d\u3002";
        render(score, userRank, false);
        return;
      }

      const rows = aggregateRecommendationRows(allRows.filter(r => r.min != null));
      const grouped = { rush: [], steady: [], safe: [] };

      rows.forEach(item => {
        const band = useRank ? classifyByRank(item, userRank) : classifyByScore(item, score);
        if (grouped[band]) grouped[band].push(item);
      });

      sortGroup(grouped.rush, "rush", score, useRank, userRank);
      sortGroup(grouped.steady, "steady", score, useRank, userRank);
      sortGroup(grouped.safe, "safe", score, useRank, userRank);

      const picked = [];
      const take = (band, count) => {
        for (const item of grouped[band]) {
          if (picked.length >= VOLUNTEER_LIMIT || picked.filter(x => x.band === band).length >= count) break;
          if (!picked.some(x => x.item === item)) picked.push({ item, band });
        }
      };
      take("rush", counts.rush);
      take("steady", counts.steady);
      take("safe", counts.safe);

      const actualCounts = {
        rush: picked.filter(x => x.band === "rush").length,
        steady: picked.filter(x => x.band === "steady").length,
        safe: picked.filter(x => x.band === "safe").length
      };
      const shortages = ["rush", "steady", "safe"]
        .filter(band => counts[band] > 0 && actualCounts[band] < counts[band])
        .map(band => `${bandLabel(band)} ${actualCounts[band]}/${counts[band]}`);
      recommendationNotice = shortages.length
        ? `\u5f53\u524d\u7b5b\u9009\u4e0b\u90e8\u5206\u6863\u4f4d\u9662\u6821\u4e0d\u8db3\uff0c\u5df2\u7559\u7a7a\u4e14\u672a\u8de8\u6863\u8865\u4f4d\uff1a${shortages.join("\uff0c")}\u3002`
        : "";

      latestRecommendations = picked.slice(0, VOLUNTEER_LIMIT).map((x, i) => ({ index: i + 1, ...x }));
      render(score, userRank, useRank);
    }

    function bandLabel(band, item = null) {
      if (band === "rush") return "\u51b2";
      if (band === "steady") return "\u7a33";
      if (band === "safe") return "\u4fdd";
      if (Number(item?.planYear) === 2026 && item?.min == null) return "\u65b0\u589e";
      return "\u5f85\u53c2\u8003";
    }

    function schoolLink(item, prefix = "") {
      const label = `${prefix}${item.school}`;
      const site = window.FujianArtAdmissionSites?.getSite(item.school);
      if (!site) return label;
      const siteLabel = site.type === "official" ? "学校官网" : "官方招生网";
      return `<a class="school-link" href="${site.url}" target="_blank" rel="noopener noreferrer" title="访问${item.school}${siteLabel}">${label}<span class="official-site-label">${siteLabel}</span></a>`;
    }

    function render(score, userRank, useRank) {
      const rows = currentCandidateRows(pool());
      $("poolMetric").textContent = rows.length;
      $("countMetric").textContent = latestRecommendations.length || "0";
      $("modeMetric").textContent = recommendMode === "rank" ? "位次" : "分数";
      $("modeHint").textContent = recommendMode === "rank" ? "\u6309\u8f93\u5165\u4f4d\u6b21\u5bf9\u6bd42025\u5f55\u53d6\u4f4d\u6b21" : "\u5f53\u524d\u6309\u7efc\u5408\u5206\u5dee\u503c";
      $("rankMetric").textContent = userRank || "暂无";
      $("rankHint").textContent = userRank ? "\u8003\u751f\u8f93\u5165" : "\u8bf7\u586b\u5199\u4f4d\u6b21";
      $("collegeRows").innerHTML = rows.map(item => `
        <tr>
          <td><strong>${schoolLink(item)}</strong><br><span class="muted-pill pill">${item.year}</span></td>
          <td>${item.province}</td>
          <td>${item.level}</td>
          <td>${item.info}</td>
          <td>${item.subject === "both" ? "不限/待分" : item.subject === "history" ? "历史" : "物理"}</td>
          <td>${fmt(item.min)}${item.max ? `-${fmt(item.max)}` : ""}</td>
          <td>${publicDataStatus(item)}</td>
        </tr>
      `).join("");

      const recommendationCards = latestRecommendations.map(({ index, item, band }) => `
        <article class="volunteer">
          <div class="volunteer-head">
            <h3>${schoolLink(item, `${index}. `)}</h3>
            <span class="pill ${band}">${bandLabel(band, item)}</span>
          </div>
          <div class="meta">${item.province} · ${item.level} · ${item.year} · ${item.info}</div>
          <div class="risk">${riskText(item, band, score, userRank)}</div>
        </article>
      `).join("");
      $("recommendList").innerHTML = latestRecommendations.length
        ? `${recommendationNotice ? `<div class="notice">${recommendationNotice}</div>` : ""}${recommendationCards}`
        : `<div class="notice">${recommendationNotice || "\u5f53\u524d\u7b5b\u9009\u4e0b\u6ca1\u6709\u5408\u9002\u9662\u6821\uff0c\u5df2\u7559\u7a7a\uff1b\u53ef\u8c03\u6574\u7b5b\u9009\u6761\u4ef6\u540e\u91cd\u65b0\u751f\u6210\u3002"}</div>`;
    }

    function manualSelectionKey(row) {
      return recommendationKey(row.item || row || {});
    }

    function manualSelectedKeySet() {
      return new Set(manualSelections.map(row => row.key || manualSelectionKey(row)));
    }

    function buildManualCandidates() {
      const score = Number($("scoreInput").value);
      const inputRank = Number($("rankInput").value);
      const userRank = inputRank || estimatedRank(score);
      const useRank = recommendMode === "rank" && !!userRank && hasOfficialRankDataForSubject();
      if (recommendMode === "rank" && (!userRank || !hasOfficialRankDataForSubject())) {
        return { candidates: [], score, userRank, useRank: false };
      }
      if (recommendMode !== "rank" && (!Number.isFinite(score) || score <= 0)) {
        return { candidates: [], score, userRank, useRank: false };
      }
      const rows = aggregateRecommendationRows(pool().filter(r => !r.tags.includes("special") && (r.min != null || Number(r.planYear) === 2026)));
      const candidates = [];
      rows.forEach(item => {
        const band = item.min == null ? "info" : (useRank ? classifyByRank(item, userRank) : classifyByScore(item, score));
        if (["rush", "steady", "safe"].includes(band) || (band === "info" && Number(item.planYear) === 2026 && item.min == null)) {
          candidates.push({ item, band, key: recommendationKey(item) });
        }
      });
      candidates.sort((a, b) => {
        const order = { rush: 0, steady: 1, safe: 2, info: 3 };
        if (order[a.band] !== order[b.band]) return order[a.band] - order[b.band];
        if (a.band === "info") return String(a.item.school || "").localeCompare(String(b.item.school || ""), "zh-CN") || String(a.item.program || a.item.info || "").localeCompare(String(b.item.program || b.item.info || ""), "zh-CN");
        if (useRank) return rankDistance(a.item, userRank) - rankDistance(b.item, userRank);
        return Math.abs((a.item.min || 0) - score) - Math.abs((b.item.min || 0) - score);
      });
      return { candidates, score, userRank, useRank };
    }

    function renumberManualSelections() {
      manualSelections = manualSelections.slice(0, VOLUNTEER_LIMIT).map((row, index) => ({ ...row, index: index + 1 }));
    }

    function renderManualSelection() {
      const { candidates, score, userRank } = buildManualCandidates();
      manualCandidateCache = candidates;
      renumberManualSelections();
      const selected = manualSelectedKeySet();
      const counts = candidates.reduce((result, row) => {
        result[row.band] = (result[row.band] || 0) + 1;
        return result;
      }, { rush: 0, steady: 0, safe: 0, info: 0 });
      $("manualCount").textContent = `${manualSelections.length} / ${VOLUNTEER_LIMIT}`;
      const visibleCount = Math.min(manualVisibleCount, candidates.length);
      const statusBits = [`\u53ef\u9009\uff1a\u51b2 ${counts.rush || 0}\u3001\u7a33 ${counts.steady || 0}\u3001\u4fdd ${counts.safe || 0}\u3001\u65b0\u589e/\u65e0\u53c2\u8003 ${counts.info || 0}`];
      if (candidates.length) statusBits.push(`\u5f53\u524d\u663e\u793a ${visibleCount}/${candidates.length} \u6761`);
      if (recommendMode === "rank" && !userRank) statusBits.push("\u8bf7\u5148\u586b\u5199\u8003\u751f\u4f4d\u6b21/\u6392\u540d\u3002 ");
      if (!candidates.length) statusBits.push("\u5f53\u524d\u6761\u4ef6\u4e0b\u6682\u65e0\u53ef\u9009\u9662\u6821\u4e13\u4e1a\uff0c\u53ef\u8c03\u6574\u7b5b\u9009\u6216\u5206\u6570\u3002");
      $("manualStatus").textContent = statusBits.join("；");
      const cards = candidates.slice(0, visibleCount).map((row, offset) => {
        const key = row.key || recommendationKey(row.item);
        const isAdded = selected.has(key);
        return `
          <article class="volunteer">
            <div class="volunteer-head">
              <h3>${schoolLink(row.item, `${offset + 1}. `)}</h3>
              <span class="pill ${row.band}">${bandLabel(row.band, row.item)}</span>
            </div>
            <div class="meta">${row.item.province} · ${row.item.level} · ${row.item.year} · ${row.item.info}</div>
            <div class="risk">${riskText(row.item, row.band, score, userRank)}</div>
            <div class="manual-actions-row">
              <button class="action ${isAdded ? "secondary manual-add added" : "primary manual-add"}" data-manual-action="${isAdded ? "remove" : "add"}" data-key="${escapeHtml(key)}" type="button">${isAdded ? "已加入，移出" : "+ 加入志愿表"}</button>
            </div>
          </article>
        `;
      }).join("");
      const loadMore = candidates.length > visibleCount
        ? `<button class="action secondary manual-load-more" id="manualLoadMoreBtn" type="button">加载更多（剩余 ${candidates.length - visibleCount} 条）</button>`
        : "";
      $("manualList").innerHTML = cards ? `${cards}${loadMore}` : '<div class="notice">暂无可选院校专业。</div>';
    }

    function resetManualVisibleCount() {
      manualVisibleCount = MANUAL_INITIAL_VISIBLE;
    }

    function loadMoreManualCandidates() {
      manualVisibleCount += MANUAL_LOAD_STEP;
      renderManualSelection();
    }

    function addManualSelection(key) {
      if (manualSelections.length >= VOLUNTEER_LIMIT) {
        $("manualStatus").textContent = `手动志愿最多 ${VOLUNTEER_LIMIT} 个，请先移出部分志愿。`;
        return;
      }
      if (manualSelectedKeySet().has(key)) return;
      const row = manualCandidateCache.find(candidate => (candidate.key || recommendationKey(candidate.item)) === key);
      if (!row) return;
      manualSelections.push({ index: manualSelections.length + 1, band: row.band, item: row.item, key: row.key || recommendationKey(row.item) });
      renderManualSelection();
    }

    function removeManualSelection(key) {
      manualSelections = manualSelections.filter(row => (row.key || manualSelectionKey(row)) !== key);
      renumberManualSelections();
      renderManualSelection();
    }

        async function saveManualPlan() {
      if (!(await ensureFeatureAccess("manual", "manual_paid_required", "manualStatus"))) return false;
      if (!manualSelections.length) {
        $("manualStatus").textContent = "请先加入至少一个志愿。";
        return false;
      }
      manualSelections = sortVolunteerRowsByBandAndRank(manualSelections);
      const score = Number($("scoreInput").value);
      const rank = Number($("rankInput").value) || null;
      const subjectText = subject === "history" ? "历史组" : "物理组";
      const basisText = Number.isFinite(rank) && rank > 0 ? "位次" + Math.round(rank) : "综合分" + fmt(score);
      $("manualStatus").textContent = "正在保存手动志愿...";
      try {
        const session = await FujianArtAuth.getSession();
        if (!session) throw new Error("登录状态已失效");
        const payload = {
          name: subjectText + " \u00b7 \u624b\u52a8\u5fd7\u613f \u00b7 " + basisText,
          subject,
          recommend_mode: "score",
          composite_score: Number.isFinite(score) ? score : null,
          candidate_rank: Number.isFinite(rank) && rank > 0 ? Math.round(rank) : null,
          filters: { ...planFilters(), manual: true },
          recommendations: sortVolunteerRowsByBandAndRank(manualSelections).map(({ index, band, item }) => ({ index, band, item: { ...item, tags: [...(item.tags || [])], historyRecords: (item.historyRecords || []).map(record => ({ ...record })) } })),
          updated_at: new Date().toISOString()
        };
        const localPlan = makeClientSavedPlan({}, payload);
        savedPlans = [localPlan, ...savedPlans.filter(plan => savedPlanIdentity(plan) !== savedPlanIdentity(localPlan))].slice(0, 50);
        await cacheSavedPlans();
        renderSavedPlans();
        document.querySelector('[data-tab="saved"]').click();
        $("manualStatus").textContent = "\u5df2\u4fdd\u5b58\u5230\u6211\u7684\u5fd7\u613f\uff0c\u6b63\u5728\u540c\u6b65\u670d\u52a1\u5668...";
        try {
          const data = await invokeQuotaService("saveMyPlan", { plan: payload });
          if (!data?.plan) throw new Error("\u672a\u8fd4\u56de\u4fdd\u5b58\u65b9\u6848");
          const serverPlan = makeClientSavedPlan(data.plan, localPlan);
          savedPlans = [serverPlan, ...savedPlans.filter(plan => savedPlanIdentity(plan) !== savedPlanIdentity(localPlan) && savedPlanIdentity(plan) !== savedPlanIdentity(serverPlan))].slice(0, 50);
          await cacheSavedPlans();
          renderSavedPlans();
          $("manualStatus").textContent = "\u5df2\u4fdd\u5b58\u5230\u6211\u7684\u5fd7\u613f\u3002";
          return true;
        } catch (error) {
          renderSavedPlans();
          $("manualStatus").textContent = "\u5df2\u6682\u5b58\u5230\u672c\u673a\uff0c\u670d\u52a1\u5668\u540c\u6b65\u5931\u8d25\uff1a" + (error?.message || "\u672a\u77e5\u9519\u8bef");
          return false;
        }
      } catch (error) {
        $("manualStatus").textContent = "\u4fdd\u5b58\u5931\u8d25\uff1a" + (error?.message || "\u672a\u77e5\u9519\u8bef");
        return false;
      }
    }

    function renderRanks() {
      if (!$("rankRows")) return;
      const builtInTables = Object.keys(embeddedRankDataByYearSubject)
        .map(Number)
        .sort((a, b) => a - b)
        .flatMap(year => [
          { year, label: "历史组", rows: rankDataForYearSubject(year, "history") },
          { year, label: "物理组", rows: rankDataForYearSubject(year, "physics") },
        ]);
      if (!builtInTables.some((table) => table.rows.length) && !rankData2026.length) {
        $("rankRows").innerHTML = `<tr><td colspan="3">暂无一分一段数据</td></tr>`;
        return;
      }
      const rows = [];
      builtInTables.forEach((table) => {
        if (!table.rows.length) return;
        rows.push(`<tr><td colspan="3"><strong>${table.year} ${table.label}官方表（${table.rows.length} 行）</strong></td></tr>`);
        rows.push(...[...table.rows].sort((a, b) => b.score - a.score).slice(0, 120).map(r => `<tr><td>${fmt(r.score)}</td><td>${r.rank}</td><td>${r.count || ""}</td></tr>`));
      });
      if (rankData2026.length) {
        rows.push(`<tr><td colspan="3"><strong>2026 ${subject === "history" ? "历史组" : "物理组"}表</strong></td></tr>`);
        rows.push(...[...rankData2026].sort((a, b) => b.score - a.score).slice(0, 120).map(r => `<tr><td>${fmt(r.score)}</td><td>${r.rank}</td><td>${r.count || ""}</td></tr>`));
      }
      $("rankRows").innerHTML = rows.join("");
    }

    function parseRankData(text) {
      text = text.trim();
      if (!text) return [];
      return text.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(line => {
        const parts = line.split(/[,，\t\s]+/).filter(Boolean);
        if (parts[0].toLowerCase() === "score") return null;
        const score = Number(parts[0]);
        const rank = Number(parts[1]);
        const count = Number(parts[2] || "");
        if (!Number.isFinite(score) || !Number.isFinite(rank)) return null;
        return { score, rank, count: Number.isFinite(count) ? count : "" };
      }).filter(Boolean);
    }

    function escapeHtml(value) {
      return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
    }

    function cleanSavedPlanText(value) {
      return String(value ?? "")
        .replace(/\s*\?\s*/g, " \u00b7 ")
        .replace(/(?:\s*\u00b7\s*){2,}/g, " \u00b7 ")
        .replace(/^\s*\u00b7\s*|\s*\u00b7\s*$/g, "")
        .trim();
    }

    function planFilters() {
      const checkboxIds = ["includePrivate", "includeCoop", "preferFujian", "includePublic", "include985", "include211", "includeDouble"];
      const filters = { keyword: $("keywordInput").value, culture: $("cultureInput").value, major: $("majorInput").value };
      checkboxIds.forEach(id => { filters[id] = $(id).checked; });
      Object.assign(filters, selectedCounts());
      return filters;
    }

    function planRecommendations() {
      return latestRecommendations.map(({ index, band, item }) => ({ index, band, item: { ...item, tags: [...(item.tags || [])], historyRecords: (item.historyRecords || []).map(record => ({ ...record })) } }));
    }

    async function savedPlansCacheKey() {
      try {
        const session = await FujianArtAuth.getSession();
        const identity = session?.user?.id || session?.user?.email || "anonymous";
        return "fujian-art-saved-plans:" + identity;
      } catch (error) {
        return "fujian-art-saved-plans:anonymous";
      }
    }

    async function readCachedSavedPlans() {
      try {
        const raw = localStorage.getItem(await savedPlansCacheKey());
        const plans = raw ? JSON.parse(raw) : [];
        return Array.isArray(plans) ? plans : [];
      } catch (error) {
        return [];
      }
    }

    async function cacheSavedPlans(plans = savedPlans) {
      try {
        localStorage.setItem(await savedPlansCacheKey(), JSON.stringify((plans || []).slice(0, 50)));
      } catch (error) {}
    }

    function savedPlanIdentity(plan, fallbackIndex = 0) {
      return String(plan?.id || plan?.local_id || [plan?.name, plan?.created_at, plan?.updated_at, fallbackIndex].filter(Boolean).join("|") || ("local-" + fallbackIndex));
    }

    function makeClientSavedPlan(plan = {}, fallback = {}) {
      const now = new Date().toISOString();
      const merged = { ...fallback, ...plan };
      if (!merged.id) merged.id = fallback.id || fallback.local_id || ("local-" + Date.now() + "-" + Math.random().toString(36).slice(2));
      if (!merged.local_id && String(merged.id).startsWith("local-")) merged.local_id = merged.id;
      if (!merged.created_at) merged.created_at = fallback.created_at || now;
      if (!merged.updated_at) merged.updated_at = fallback.updated_at || now;
      if (!Array.isArray(merged.recommendations)) merged.recommendations = [];
      if (!merged.filters || typeof merged.filters !== "object") merged.filters = {};
      return merged;
    }

    function mergeSavedPlans(primary = [], secondary = []) {
      const map = new Map();
      [...primary, ...secondary].forEach((plan, index) => {
        if (!plan) return;
        const normalized = makeClientSavedPlan(plan);
        const key = savedPlanIdentity(normalized, index);
        if (!map.has(key)) map.set(key, normalized);
      });
      return [...map.values()].sort((a, b) => new Date(b.created_at || b.updated_at || 0) - new Date(a.created_at || a.updated_at || 0)).slice(0, 50);
    }

    function renderSavedPlans() {
      const container = $("savedPlanList");
      if (!container) return;
      try {
        savedPlans = mergeSavedPlans(savedPlans);
        if (!savedPlans.length) {
          container.innerHTML = '<div class="notice">\u6682\u65e0\u4fdd\u5b58\u65b9\u6848\u3002</div>';
          return;
        }
        container.innerHTML = savedPlans.map((rawPlan, index) => {
          const plan = makeClientSavedPlan(rawPlan || {}, { id: savedPlanIdentity(rawPlan, index) });
          const date = new Date(plan.created_at || plan.updated_at || "");
          const dateText = Number.isNaN(date.getTime()) ? "" : date.toLocaleString("zh-CN", { hour12: false });
          const count = normalizeSavedRecommendations(plan).length;
          const basis = plan.filters?.manual ? "\u624b\u52a8\u9009\u62e9" : (plan.recommend_mode === "rank" ? "\u4f4d\u6b21 " + (plan.candidate_rank || "-") : "\u7efc\u5408\u5206 " + fmt(plan.composite_score));
          const emptyNotice = count ? "" : '<div class="saved-plan-meta">\u8fd9\u4efd\u65b9\u6848\u6ca1\u6709\u4fdd\u5b58\u5230\u5fd7\u613f\u660e\u7ec6\uff0c\u8bf7\u91cd\u65b0\u751f\u6210\u6216\u91cd\u65b0\u4fdd\u5b58\u3002</div>';
          const id = escapeHtml(savedPlanIdentity(plan, index));
          return '<article class="saved-plan">' +
            '<div class="saved-plan-head"><h3>' + escapeHtml(cleanSavedPlanText(plan.name) || "\u672a\u547d\u540d\u65b9\u6848") + '</h3><span class="pill ' + (count ? 'info' : 'muted-pill') + '">' + count + ' \u4e2a\u5fd7\u613f</span></div>' +
            '<div class="saved-plan-meta">' + (plan.subject === "physics" ? "\u7269\u7406\u7ec4" : "\u5386\u53f2\u7ec4") + ' \u00b7 ' + escapeHtml(basis) + ' \u00b7 ' + escapeHtml(dateText) + '</div>' +
            emptyNotice +
            '<div class="saved-plan-actions">' +
              '<button class="action secondary" data-plan-action="open" data-id="' + id + '" type="button" ' + (count ? '' : 'disabled') + '>\u67e5\u770b\u65b9\u6848</button>' +
              '<button class="action secondary" data-plan-action="pdf" data-id="' + id + '" type="button" ' + (count ? '' : 'disabled') + '>\u5bfc\u51fa PDF</button>' +
              '<button class="action ghost" data-plan-action="delete" data-id="' + id + '" type="button">\u5220\u9664</button>' +
            '</div></article>';
        }).join("");
      } catch (error) {
        container.innerHTML = '<div class="notice">\u6211\u7684\u5fd7\u613f\u6e32\u67d3\u5931\u8d25\uff1a' + escapeHtml(error?.message || "\u672a\u77e5\u9519\u8bef") + '</div>';
      }
    }


    function planFilterText(plan) {
      const filters = plan.filters || {};
      const labels = [
        ["includePublic", "公办"],
        ["includePrivate", "民办/独立"],
        ["includeCoop", "中外合作"],
        ["preferFujian", "优先省内"],
        ["include985", "985"],
        ["include211", "211"],
        ["includeDouble", "双一流"]
      ];
      const selected = labels.filter(([key]) => filters[key] !== false).map(([, label]) => label);
      if (filters.keyword) selected.push("关键词：" + filters.keyword);
      return selected.length ? selected.join("、") : "未设置筛选偏好";
    }

    function loadHtml2Pdf() {
      if (typeof window.html2pdf === "function") return Promise.resolve(window.html2pdf);
      if (html2PdfPromise) return html2PdfPromise;
      html2PdfPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "./assets/vendor/html2pdf.bundle.min.js";
        script.async = true;
        script.onload = () => typeof window.html2pdf === "function"
          ? resolve(window.html2pdf)
          : reject(new Error("PDF组件加载不完整"));
        script.onerror = () => {
          html2PdfPromise = null;
          reject(new Error("PDF组件加载失败"));
        };
        document.head.appendChild(script);
      });
      return html2PdfPromise;
    }

    async function exportSavedPlanPdf(plan, button) {
      if (!(await ensureFeatureAccess("pdf", "pdf_paid_required", "savedExportStatus"))) return;
      const recommendations = normalizeSavedRecommendations(plan);
      if (!recommendations.length) {
        $("savedExportStatus").textContent = "该方案没有可导出的志愿数据。";
        return;
      }
      const counts = recommendations.reduce((result, row) => {
        result[row.band] = (result[row.band] || 0) + 1;
        return result;
      }, { rush: 0, steady: 0, safe: 0 });
      const subjectText = plan.subject === "physics" ? "物理组" : "历史组";
      const basisText = plan.filters?.manual
        ? "手动选择"
        : (plan.recommend_mode === "rank"
          ? "位次 " + (plan.candidate_rank || "-")
          : "综合分 " + fmt(plan.composite_score));
      const savedDate = new Date(plan.created_at);
      const savedText = Number.isNaN(savedDate.getTime()) ? "-" : savedDate.toLocaleString("zh-CN", { hour12: false });
      const rows = recommendations.map((row, position) => {
        const item = row.item || {};
        const rank = item.min == null ? null : rankForScore(item.min, rankDataForItem(item));
        const range = item.min == null ? "待补" : fmt(item.min) + (item.max != null ? "-" + fmt(item.max) : "");
        const site = window.FujianArtAdmissionSites?.getSite(item.school || "");
        const school = site
          ? '<a href="' + escapeHtml(site.url) + '">' + escapeHtml(item.school) + '</a>'
          : escapeHtml(item.school || "-");
        return '<tr>' +
          '<td>' + escapeHtml(row.index || position + 1) + '</td>' +
          '<td><span class="pdf-band ' + escapeHtml(row.band || "") + '">' + escapeHtml(bandLabel(row.band, item)) + '</span></td>' +
          '<td>' + school + '<br><small>' + escapeHtml(item.province || "") + ' · ' + escapeHtml(item.level || "") + '</small></td>' +
          '<td>' + escapeHtml(item.info || "-") + '</td>' +
          '<td>' + escapeHtml(item.year || "-") + '</td>' +
          '<td>' + escapeHtml(range) + '</td>' +
          '<td>' + escapeHtml(rank || "-") + '</td>' +
          '<td>' + escapeHtml(publicDataStatus(item)) + '</td>' +
        '</tr>';
      }).join("");
      const title = plan.name || subjectText + "志愿方案";
      $("pdfPrintArea").innerHTML =
        '<header class="pdf-print-header"><h1>福建美术与设计类志愿方案</h1><p>' + escapeHtml(title) + ' · 保存于 ' + escapeHtml(savedText) + '</p></header>' +
        '<div class="pdf-print-summary">' +
          '<div><span>科类</span><strong>' + subjectText + '</strong></div>' +
          '<div><span>推荐依据</span><strong>' + escapeHtml(basisText) + '</strong></div>' +
          '<div><span>志愿数量</span><strong>' + recommendations.length + ' 个</strong></div>' +
          '<div><span>冲稳保</span><strong>' + counts.rush + ' / ' + counts.steady + ' / ' + counts.safe + '</strong></div>' +
        '</div>' +
        '<div class="pdf-print-filters"><strong>筛选偏好：</strong>' + escapeHtml(planFilterText(plan)) + '</div>' +
        '<table class="pdf-print-table"><colgroup>' +
          '<col style="width:5%"><col style="width:6%"><col style="width:17%"><col style="width:25%">' +
          '<col style="width:7%"><col style="width:12%"><col style="width:10%"><col style="width:18%">' +
        '</colgroup><thead><tr><th>序号</th><th>类别</th><th>院校</th><th>专业</th><th>年份</th><th>参考分</th><th>对应年份位次</th><th>数据状态</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<footer class="pdf-print-footer">本方案依据系统保存时的数据生成，仅供志愿填报参考。最终招生计划、专业要求和录取规则，以福建省教育考试院及院校官方公布为准。PDF文件由系统直接生成并保存。</footer>';
      const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const filename = ("福建美术志愿方案_" + subjectText + "_" + basisText + "_" + datePart).replace(/[\/:*?"<>|\s]+/g, "_") + ".pdf";
      const area = $("pdfPrintArea");
      const originalButtonText = button?.textContent || "导出 PDF";
      if (button) { button.disabled = true; button.textContent = "正在生成..."; }
      area.classList.add("pdf-exporting");
      area.setAttribute("aria-hidden", "false");
      $("savedExportStatus").textContent = "正在生成 PDF，请稍候...";
      try {
        const html2pdf = await loadHtml2Pdf();
        if (document.fonts?.ready) await document.fonts.ready;
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const bounds = area.getBoundingClientRect();
        if (!area.textContent.trim() || bounds.width < 100 || bounds.height < 100) {
          throw new Error("\u5bfc\u51fa\u5185\u5bb9\u4e3a\u7a7a\uff0c\u8bf7\u5148\u6253\u5f00\u4e00\u4efd\u5fd7\u613f\u65b9\u6848\u3002");
        }
        const worker = html2pdf().set({
          margin: [9, 8, 11, 8],
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff", scrollX: 0, scrollY: 0 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait", compress: true },
          pagebreak: { mode: ["css", "legacy"], avoid: ["tr"] },
          enableLinks: true
        }).from(area).toCanvas();
        let canvas = null;
        await worker.get("canvas", value => { canvas = value; });
        if (!canvas || canvas.width < 100 || canvas.height < 100) {
          throw new Error("PDF\u751f\u6210\u5185\u5bb9\u4e3a\u7a7a\uff0c\u8bf7\u91cd\u8bd5\u3002");
        }
        await worker.toPdf().save();
        $("savedExportStatus").textContent = "PDF 已保存，仍停留在当前页面。";
      } catch (error) {
        $("savedExportStatus").textContent = "PDF 保存失败：" + (error?.message || "未知错误");
      } finally {
        area.classList.remove("pdf-exporting");
        area.setAttribute("aria-hidden", "true");
        if (button) { button.disabled = false; button.textContent = originalButtonText; }
      }
    }

    function renderSavedTabShell(message) {
      const tab = $("savedTab");
      if (!tab) return null;
      tab.innerHTML = '<div class="toolbar saved-tab-toolbar"><p>\u6210\u529f\u751f\u6210\u6216\u624b\u52a8\u4fdd\u5b58\u7684\u65b9\u6848\uff0c\u4f1a\u4fdd\u5b58\u5230\u5f53\u524d\u8d26\u53f7\u3002</p><div class="save-tools"><span class="save-status" id="savedExportStatus" aria-live="polite"></span><button class="action secondary" id="refreshSavedBtn" type="button">\u5237\u65b0</button></div></div><div class="saved-plan-list" id="savedPlanList"><div class="notice">' + escapeHtml(message || "\u6b63\u5728\u8bfb\u53d6\u6211\u7684\u5fd7\u613f...") + '</div></div>';
      $("refreshSavedBtn")?.addEventListener("click", loadSavedPlans);
      $("savedPlanList")?.addEventListener("click", handleSavedPlanListClick);
      return $("savedPlanList");
    }

    function handleSavedPlanListClick(event) {
      const button = event.target.closest("button[data-plan-action]");
      if (!button) return;
      const plan = savedPlans.find(item => item.id === button.dataset.id);
      if (button.dataset.planAction === "open" && plan) openSavedPlan(plan);
      if (button.dataset.planAction === "pdf" && plan) exportSavedPlanPdf(plan, button);
      if (button.dataset.planAction === "delete") deleteSavedPlan(button.dataset.id);
    }

    async function loadSavedPlans() {
      const list = renderSavedTabShell("\u6b63\u5728\u8bfb\u53d6\u6211\u7684\u5fd7\u613f...");
      const setStatus = (message) => {
        const status = $("savedExportStatus");
        if (status) status.textContent = message;
      };
      try {
        const data = await invokeQuotaService("mySavedPlans", { limit: 50 });
        const cachedPlans = await readCachedSavedPlans();
        const serverPlans = Array.isArray(data?.plans) ? data.plans : [];
        savedPlans = mergeSavedPlans(serverPlans, cachedPlans);
        await cacheSavedPlans(savedPlans);
        renderSavedPlans();
        setStatus("");
        if (!savedPlans.length) {
          const target = $("savedPlanList") || list;
          if (target) target.innerHTML = '<div class="notice">\u6682\u65e0\u4fdd\u5b58\u65b9\u6848\u3002</div>';
        }
      } catch (error) {
        const target = $("savedPlanList") || list;
        if (target) target.innerHTML = '<div class="notice">\u8bfb\u53d6\u6211\u7684\u5fd7\u613f\u5931\u8d25\uff1a' + escapeHtml(error?.message || "\u672a\u77e5\u9519\u8bef") + '</div>';
        setStatus("\u8bfb\u53d6\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u767b\u5f55\u72b6\u6001\u6216\u7f51\u7edc\u3002");
      }
    }

    function currentPlanPayload() {
      const score = Number($("scoreInput").value);
      const rank = Number($("rankInput").value) || null;
      const subjectText = subject === "history" ? "历史组" : "物理组";
      const modeText = recommendMode === "rank" ? "位次" + (rank || "-") : "综合分" + fmt(score);
      return {
        name: subjectText + " · " + modeText,
        subject,
        recommend_mode: recommendMode,
        composite_score: Number.isFinite(score) ? score : null,
        candidate_rank: Number.isFinite(rank) && rank > 0 ? Math.round(rank) : null,
        filters: planFilters(),
        recommendations: planRecommendations(),
        updated_at: new Date().toISOString()
      };
    }

    async function saveCurrentPlan() {
      if (!latestRecommendations.length) {
        $("savePlanStatus").textContent = "\u8bf7\u5148\u751f\u6210\u5fd7\u613f\u3002";
        return false;
      }
      $("savePlanStatus").textContent = "\u6b63\u5728\u81ea\u52a8\u4fdd\u5b58...";
      try {
        const payload = currentPlanPayload();
        const localPlan = makeClientSavedPlan({}, payload);
        currentSavedPlanId = localPlan.id;
        savedPlans = [localPlan, ...savedPlans.filter(plan => savedPlanIdentity(plan) !== savedPlanIdentity(localPlan))].slice(0, 50);
        await cacheSavedPlans();
        renderSavedPlans();
        $("savePlanStatus").textContent = "\u5df2\u81ea\u52a8\u4fdd\u5b58\u5230\u6211\u7684\u5fd7\u613f\uff0c\u6b63\u5728\u540c\u6b65\u670d\u52a1\u5668...";
        try {
          const data = await invokeQuotaService("saveMyPlan", { plan: payload });
          if (!data?.plan) throw new Error("\u672a\u8fd4\u56de\u4fdd\u5b58\u65b9\u6848");
          const serverPlan = makeClientSavedPlan(data.plan, localPlan);
          currentSavedPlanId = serverPlan.id;
          savedPlans = [serverPlan, ...savedPlans.filter(plan => savedPlanIdentity(plan) !== savedPlanIdentity(localPlan) && savedPlanIdentity(plan) !== savedPlanIdentity(serverPlan))].slice(0, 50);
          await cacheSavedPlans();
          renderSavedPlans();
          $("savePlanStatus").textContent = "\u5df2\u81ea\u52a8\u4fdd\u5b58\u5230\u6211\u7684\u5fd7\u613f\u3002";
          return true;
        } catch (error) {
          renderSavedPlans();
          $("savePlanStatus").textContent = "\u5df2\u6682\u5b58\u5230\u672c\u673a\uff0c\u670d\u52a1\u5668\u540c\u6b65\u5931\u8d25\uff1a" + (error?.message || "\u672a\u77e5\u9519\u8bef");
          return false;
        }
      } catch (error) {
        $("savePlanStatus").textContent = "\u4fdd\u5b58\u5931\u8d25\uff1a" + (error?.message || "\u672a\u77e5\u9519\u8bef");
        return false;
      }
    }

    function scheduleCurrentPlanUpdate() {
      window.clearTimeout(savedPlanUpdateTimer);
      if (!currentSavedPlanId || !recommendationsGenerated || !latestRecommendations.length) return;
      const planId = currentSavedPlanId;
      savedPlanUpdateTimer = window.setTimeout(() => updateCurrentSavedPlan(planId), 600);
    }

    async function updateCurrentSavedPlan(planId) {
      if (!planId || planId !== currentSavedPlanId) return;
      $("savePlanStatus").textContent = "\u6b63\u5728\u66f4\u65b0\u5f53\u524d\u65b9\u6848...";
      try {
        const data = await invokeQuotaService("updateMyPlan", { planId, plan: currentPlanPayload() });
        const updated = data?.plan;
        if (!updated) throw new Error("\u672a\u8fd4\u56de\u66f4\u65b0\u65b9\u6848");
        savedPlans = savedPlans.map(plan => plan.id === planId ? updated : plan);
        await cacheSavedPlans();
        renderSavedPlans();
        $("savePlanStatus").textContent = "\u5f53\u524d\u65b9\u6848\u5df2\u81ea\u52a8\u66f4\u65b0\u3002";
      } catch (error) {
        $("savePlanStatus").textContent = "\u81ea\u52a8\u66f4\u65b0\u5931\u8d25\uff1a" + (error?.message || "\u672a\u77e5\u9519\u8bef");
      }
    }

    function openSavedPlan(plan) {
      const savedRows = normalizeSavedRecommendations(plan);
      if (!savedRows.length) {
        $("savePlanStatus").textContent = "\u8fd9\u4efd\u65b9\u6848\u6ca1\u6709\u4fdd\u5b58\u5230\u5fd7\u613f\u660e\u7ec6\uff0c\u8bf7\u5220\u9664\u540e\u91cd\u65b0\u751f\u6210\u3002";
        document.querySelector('[data-tab="saved"]').click();
        return;
      }
      currentSavedPlanId = plan.id;
      subject = plan.subject || "history";
      recommendMode = plan.recommend_mode || "score";
      document.querySelectorAll("#subjectSeg button").forEach(button => button.classList.toggle("active", button.dataset.value === subject));
      document.querySelectorAll("#methodSeg button").forEach(button => button.classList.toggle("active", button.dataset.value === recommendMode));
      $("scoreInput").value = plan.composite_score == null ? "" : plan.composite_score;
      $("rankInput").value = plan.candidate_rank || "";
      latestRecommendations = savedRows;
      recommendationsGenerated = true;
      setRankData2025ForSubject();
      loadManagedRankData2026();
      render(Number(plan.composite_score) || 0, Number(plan.candidate_rank) || null, recommendMode === "rank");
      document.querySelector('[data-tab="recommend"]').click();
      $("recommendTab").scrollIntoView({ behavior: "smooth", block: "start" });
      $("savePlanStatus").textContent = "\u5df2\u6253\u5f00\u4fdd\u5b58\u7684\u65b9\u6848\u3002";
    }

    async function deleteSavedPlan(id) {
      if (!confirm("\u786e\u8ba4\u5220\u9664\u8fd9\u4efd\u5fd7\u613f\u65b9\u6848\uff1f")) return;
      try {
        await invokeQuotaService("deleteMySavedPlan", { planId: id });
      } catch (error) {
        $("savePlanStatus").textContent = "\u5220\u9664\u5931\u8d25\uff1a" + (error?.message || "\u672a\u77e5\u9519\u8bef");
        return;
      }
      savedPlans = savedPlans.filter(plan => plan.id !== id);
      await cacheSavedPlans();
      if (currentSavedPlanId === id) currentSavedPlanId = "";
      renderSavedPlans();
    }

    function loadManagedRankData2026() {
      const text = localStorage.getItem(RANK_2026_STORAGE_PREFIX + subject) || "";
      rankData2026 = parseRankData(text);
      $("rankText2026").value = text;
    }

    function copyRecommendations() {
      const lines = [["序号","冲稳保","院校","省份","层级","专业/信息","年份","最低分","状态"]];
      latestRecommendations.forEach(({ index, item, band }) => {
        lines.push([index, bandLabel(band), item.school, item.province, item.level, item.info, item.year, fmt(item.min), publicDataStatus(item)]);
      });
      const text = lines.map(row => row.join("\\t")).join("\\n");
      navigator.clipboard?.writeText(text);
    }

    function buildCsv() {
      const rows = [["index","band","school","province","level","info","year","min","status"]];
      latestRecommendations.forEach(({ index, item, band }) => rows.push([index, bandLabel(band), item.school, item.province, item.level, item.info, item.year, fmt(item.min), publicDataStatus(item)]));
      return rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\\n");
    }

    function showExportFallback(csv, href) {
      $("csvOutput").value = csv;
      $("csvDownloadLink").href = href;
      $("exportStatus").textContent = "已生成 CSV。如果浏览器没有弹出下载，请使用备用链接或复制内容。";
      $("exportFallback").classList.remove("hidden");
    }

    function copyCsvText() {
      const csv = $("csvOutput").value || buildCsv();
      $("csvOutput").value = csv;
      navigator.clipboard?.writeText(csv);
      $("exportStatus").textContent = "CSV 内容已复制；如果系统拦截剪贴板，也可以直接选中文本保存。";
      $("exportFallback").classList.remove("hidden");
    }

    function downloadCsv() {
      const csv = buildCsv();
      const filename = "fujian-art-volunteers.csv";
      const staticCsvUrl = new URL(filename, window.location.href).href;
      showExportFallback(csv, staticCsvUrl);
      $("exportStatus").textContent = "CSV 已生成。若没有自动下载，请点“备用下载 CSV”或复制下方内容。";
      $("exportFallback").scrollIntoView({ behavior: "smooth", block: "nearest" });

      const a = document.createElement("a");
      a.download = filename;
      a.href = staticCsvUrl;
      a.style.display = "none";
      document.body.appendChild(a);
      a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
      window.setTimeout(() => a.remove(), 0);
    }

    function downloadGeneratedCsv() {
      const csv = buildCsv();
      const filename = "fujian-art-volunteers.csv";
      const a = document.createElement("a");
      a.download = filename;
      a.style.display = "none";

      try {
        const blob = new Blob(["\\ufeff" + csv], { type: "text/csv;charset=utf-8" });
        if (navigator.msSaveOrOpenBlob) {
          navigator.msSaveOrOpenBlob(blob, filename);
          showExportFallback(csv, "#");
          return;
        }
        if (exportObjectUrl) URL.revokeObjectURL(exportObjectUrl);
        const url = URL.createObjectURL(blob);
        exportObjectUrl = url;
        a.href = url;
        document.body.appendChild(a);
        a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
        showExportFallback(csv, url);
        window.setTimeout(() => {
          a.remove();
        }, 0);
      } catch (error) {
        const dataUrl = "data:text/csv;charset=utf-8," + encodeURIComponent("\\ufeff" + csv);
        a.href = dataUrl;
        document.body.appendChild(a);
        a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
        a.remove();
        showExportFallback(csv, dataUrl);
      }
    }

    document.querySelectorAll("#subjectSeg button").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#subjectSeg button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        subject = btn.dataset.value;
        setRankData2025ForSubject();
        loadManagedRankData2026();
        renderRanks();
        loadCandidateScores();
        resetRecommendations();
      });
    });

    document.querySelectorAll("#methodSeg button").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#methodSeg button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        recommendMode = btn.dataset.value;
        if (recommendMode === 'score') closePaymentUnlock();
        if (quotaState.loaded) applyQuotaResult(quotaState);
        resetRecommendations();
      });
    });

    document.querySelectorAll(".tabs button").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        ["recommend", "manual", "college", "saved"].forEach(name => { const tab = $(name + "Tab"); if (tab) tab.classList.toggle("hidden", name !== btn.dataset.tab); });
        if (btn.dataset.tab === "recommend" && recommendationsGenerated) makeRecommendations();
        if (btn.dataset.tab === "manual") renderManualSelection();
        if (btn.dataset.tab === "saved") {
          loadSavedPlans();
        }
      });
    });

    ["cultureInput","majorInput"].forEach(id => {
      $(id).addEventListener("focus", () => {
        captureScoreInputSnapshot();
      });
      $(id).addEventListener("keydown", event => {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") event.preventDefault();
      });
      $(id).addEventListener("input", () => {
        updateCompositeScore();
        resetRecommendations();
      });
      $(id).addEventListener("change", () => {
        updateCompositeScore();
        resetRecommendations();
        maybeConfirmCandidateScore();
      });
    });

    if ($("rankInput")) {
      $("rankInput").addEventListener("focus", () => {
        captureScoreInputSnapshot();
      });
      $("rankInput").addEventListener("keydown", event => {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") event.preventDefault();
      });
      $("rankInput").addEventListener("change", () => {
        resetRecommendations();
        maybeConfirmCandidateScore();
      });
    }

    ["scoreInput","rankInput"].forEach(id => {
      $(id).addEventListener("input", resetRecommendations);
      $(id).addEventListener("change", resetRecommendations);
    });
    ["rushCount","steadyCount","safeCount","includeUnverified","includePrivate","includeCoop","preferFujian","includePublic","include985","include211","includeDouble"].forEach(id => {
      $(id).addEventListener("input", refreshRecommendationsIfGenerated);
      $(id).addEventListener("change", refreshRecommendationsIfGenerated);
    });
    $("keywordInput").addEventListener("input", scheduleFilterRefresh);
    $("keywordInput").addEventListener("change", refreshRecommendationsIfGenerated);
    $("generateBtn").addEventListener("click", generateFromInputs);
    $("generationCancelBtn").addEventListener("click", () => closeGenerationConfirmation(false));
    $("paymentUnlockClose").addEventListener("click", closePaymentUnlock);
    $("paymentUnlockOk").addEventListener("click", closePaymentUnlock);
    $("paymentRequestForm").addEventListener("submit", submitPaymentRequest);
    if ($("changePasswordBtn")) $("changePasswordBtn").addEventListener("click", () => { $("changePasswordStatus").textContent = ""; $("changePasswordDialog").showModal(); });
    $("changePasswordForm").addEventListener("submit", submitPasswordChange);
    $("scoreConfirmForm").addEventListener("submit", submitScoreConfirmation);
    $("scoreConfirmSaveBtn").addEventListener("click", submitScoreConfirmation);
    document.querySelectorAll("[data-close-dialog]").forEach(button => button.addEventListener("click", () => { const dialog = $(button.dataset.closeDialog); if (dialog?.open) dialog.close(); if (confirmedScoreState.pending && button.dataset.closeDialog === "scoreConfirmDialog") { confirmedScoreState.pending.resolve(false); confirmedScoreState.pending = null; } }));
    $("paymentUnlockModal").addEventListener("click", event => {
      if (event.target === $("paymentUnlockModal")) closePaymentUnlock();
    });
    $("generationConfirmClose").addEventListener("click", () => closeGenerationConfirmation(false));
    $("generationConfirmBtn").addEventListener("click", () => closeGenerationConfirmation(true));
    $("generationSwitchBtn").addEventListener("click", () => {
      closeGenerationConfirmation(false, false);
      document.querySelector('#methodSeg button[data-value="rank"]').click();
      updateQuotaStatus("已切换到按位次，请确认位次后再生成。");
      $("rankInput").focus();
    });
    $("generationConfirm").addEventListener("click", event => {
      if (event.target === $("generationConfirm")) closeGenerationConfirmation(false);
    });
    $("generationConfirm").addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeGenerationConfirmation(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...$("generationConfirmDialog").querySelectorAll('button:not([hidden]):not(:disabled)')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    window.setTimeout(loadQuota, 0);
    window.setTimeout(loadSavedPlans, 0);
    window.setTimeout(loadCandidateScores, 0);
    $("copyBtn").addEventListener("click", copyRecommendations);
    $("refreshSavedBtn").addEventListener("click", loadSavedPlans);
    $("saveManualBtn").addEventListener("click", saveManualPlan);
    $("manualList").addEventListener("click", event => {
      const loadMoreButton = event.target.closest("#manualLoadMoreBtn");
      if (loadMoreButton) {
        event.preventDefault();
        loadMoreManualCandidates();
        return;
      }
      const button = event.target.closest("button[data-manual-action]");
      if (!button) return;
      event.preventDefault();
      const key = button.dataset.key || "";
      button.disabled = true;
      if (button.dataset.manualAction === "add") addManualSelection(key);
      if (button.dataset.manualAction === "remove") removeManualSelection(key);
    });
    $("mobileGenerateBtn").addEventListener("click", async () => {
      if (await generateFromInputs()) $("recommendTab").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    $("mobileCopyBtn").addEventListener("click", copyRecommendations);
    $("exportBtn").addEventListener("click", downloadCsv);
    $("copyCsvBtn").addEventListener("click", copyCsvText);
    $("loadRankBtn").addEventListener("click", () => {
      rankData2026 = parseRankData($("rankText2026").value);
      setRankData2025ForSubject();
      renderRanks();
      resetRecommendations();
    });
    $("clearRankBtn").addEventListener("click", () => {
      rankData2026 = [];
      $("rankText2026").value = "";
      setRankData2025ForSubject();
      renderRanks();
      resetRecommendations();
    });

    setRankData2025ForSubject();
    loadManagedRankData2026();
    resetRecommendations();
    renderRanks();

    const plannerAside = document.querySelector("#planner > aside");
    const plannerResults = document.querySelector("#planner > .planner-results");
    function syncPlannerColumns() {
      plannerResults.style.height = window.innerWidth > 1080 ? `${plannerAside.offsetHeight}px` : "";
    }
    window.addEventListener("resize", syncPlannerColumns);
    if (window.ResizeObserver) new ResizeObserver(syncPlannerColumns).observe(plannerAside);
    syncPlannerColumns();
  