
    const state = { users: [], callerId: "", paymentRequests: [], savedPlans: [], selectedPlanIds: new Set() };
    const $ = id => document.getElementById(id);
    const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[char]);

    function showStatus(message, error = false) {
      $("status").textContent = message;
      $("status").className = error ? "error" : "";
    }

    async function invoke(action, values = {}) {
      const session = await FujianArtAuth.getSession();
      if (!session) throw new Error("登录状态已失效，请重新登录");
      const config = window.FujianArtSupabaseConfig;
      if (!config?.url || !config?.anonKey) throw new Error("Supabase 配置不完整");
      let response;
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 12000);
      try {
        response = await fetch(config.url + "/functions/v1/user-admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: config.anonKey,
            Authorization: "Bearer " + session.access_token
          },
          body: JSON.stringify({ action, ...values }),
          signal: controller.signal
        });
      } catch (error) {
        if (error?.name === "AbortError") throw new Error("用户管理服务响应超时：请确认数据库 SQL 已执行，并且 user-admin 已成功 Deploy updates。");
        throw new Error("无法连接用户管理服务，请确认 user-admin Edge Function 已部署");
      } finally {
        window.clearTimeout(timer);
      }
      const raw = await response.text();
      let data = {};
      try { data = raw ? JSON.parse(raw) : {}; } catch (_) {}
      if (!response.ok) {
        if (response.status === 404) throw new Error("用户管理服务尚未部署，请部署 user-admin Edge Function");
        throw new Error(data.error || raw || ("服务请求失败（" + response.status + "）"));
      }
      return data;
    }

    function formatDate(value) {
      if (!value) return "长期";
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("zh-CN", { hour12: false });
    }

    function toLocalInput(value) {
      if (!value) return "";
      const date = new Date(value);
      const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      return local.toISOString().slice(0, 16);
    }

    function userStatus(user) {
      if (!user.active) return { key: "inactive", label: "已停用" };
      if (user.expires_at && new Date(user.expires_at).getTime() <= Date.now()) return { key: "expired", label: "已到期" };
      return { key: "active", label: "有效" };
    }

    function paymentRequestStatusLabel(status) {
      if (status === "approved") return "\u5df2\u901a\u8fc7";
      if (status === "rejected") return "\u5df2\u62d2\u7edd";
      return "\u5f85\u5904\u7406";
    }

    function defaultPaidUntilInputValue() {
      return "2026-08-31T23:59";
    }

    function openApproveDialog(request) {
      document.getElementById("approveRequestId").value = request.id;
      document.getElementById("approveUserText").textContent = (request.display_name || request.email || "-") + " / " + (request.contact || "-");
      document.getElementById("approveGenerationLimit").value = "50";
      document.getElementById("approvePaidUntil").value = defaultPaidUntilInputValue();
      document.getElementById("approveRankAccess").checked = true;
      document.getElementById("approveManualAccess").checked = true;
      document.getElementById("approvePdfAccess").checked = true;
      document.getElementById("approveUnlimited").checked = false;
      document.getElementById("approveResetUsed").checked = false;
      document.getElementById("approveAdminNote").value = "approved from payment request";
      document.getElementById("approveDialog").showModal();
    }
    function defaultPaidUntilValue() {
      return "2026-08-31T23:59:00+08:00";
    }

    function bandText(band) {
      return band === "rush" ? "\u51b2" : band === "steady" ? "\u7a33" : band === "safe" ? "\u4fdd" : "\u63d0\u793a";
    }

    function planBasis(plan) {
      if (plan.filters?.manual) return "\u624b\u52a8\u9009\u62e9";
      return plan.recommend_mode === "rank" ? "\u4f4d\u6b21 " + (plan.candidate_rank || "-") : "\u7efc\u5408\u5206 " + (plan.composite_score ?? "-");
    }

    function planUserText(plan) {
      return plan.user_display_name || plan.user_email || plan.user_id || "-";
    }

    function visibleSavedPlans() {
      const keyword = ($("planKeyword")?.value || "").trim().toLowerCase();
      return (state.savedPlans || []).filter(plan => {
        if (!keyword) return true;
        const text = [planUserText(plan), plan.user_email, plan.name, JSON.stringify(plan.recommendations || [])].join(" ").toLowerCase();
        return text.includes(keyword);
      });
    }

    function updateSavedPlanBulkUi(visibleRows = visibleSavedPlans()) {
      const selectedCount = state.selectedPlanIds.size;
      const countEl = $("selectedPlanCount");
      if (countEl) countEl.textContent = "\u5df2\u9009 " + selectedCount + " \u9879";
      const deleteBtn = $("deleteSelectedPlansBtn");
      if (deleteBtn) deleteBtn.disabled = selectedCount === 0;
      const allBox = $("selectSavedPlansAll");
      if (allBox) {
        const visibleIds = visibleRows.map(plan => plan.id).filter(Boolean);
        const checkedVisible = visibleIds.filter(id => state.selectedPlanIds.has(id)).length;
        allBox.checked = visibleIds.length > 0 && checkedVisible === visibleIds.length;
        allBox.indeterminate = checkedVisible > 0 && checkedVisible < visibleIds.length;
        allBox.disabled = visibleIds.length === 0;
      }
    }

    function renderSavedPlansAdmin() {
      const rows = visibleSavedPlans();
      const visibleIds = new Set(rows.map(plan => plan.id).filter(Boolean));
      for (const id of Array.from(state.selectedPlanIds)) {
        if (!visibleIds.has(id) && !(state.savedPlans || []).some(plan => plan.id === id)) state.selectedPlanIds.delete(id);
      }
      const summary = $("planSummary");
      if (summary) summary.textContent = rows.length ? "\u5171 " + rows.length + " \u4efd\u65b9\u6848" : "\u6682\u65e0\u5339\u914d\u65b9\u6848";
      const target = $("savedPlanRows");
      if (!target) return;
      target.innerHTML = rows.length ? rows.map(plan => {
        const count = Number(plan.recommendation_count ?? (Array.isArray(plan.recommendations) ? plan.recommendations.length : 0));
        const checked = state.selectedPlanIds.has(plan.id) ? " checked" : "";
        return "<tr>" +
          "<td class='select-col'><input class='saved-plan-select' data-plan-action='select' data-id='" + escapeHtml(plan.id) + "' type='checkbox'" + checked + " /></td>" +
          "<td><strong>" + escapeHtml(planUserText(plan)) + "</strong><br><span class='sub'>" + escapeHtml(plan.user_email || "") + "</span></td>" +
          "<td>" + escapeHtml(plan.name || "-") + "</td>" +
          "<td>" + (plan.subject === "physics" ? "\u7269\u7406" : "\u5386\u53f2") + "</td>" +
          "<td>" + escapeHtml(planBasis(plan)) + "</td>" +
          "<td>" + count + "</td>" +
          "<td>" + escapeHtml(formatDate(plan.created_at)) + "</td>" +
          "<td><div class='request-actions'><button data-plan-action='view' data-id='" + escapeHtml(plan.id) + "' type='button' " + (count ? "" : "disabled") + ">\u67e5\u770b\u660e\u7ec6</button><button class='danger' data-plan-action='delete' data-id='" + escapeHtml(plan.id) + "' type='button'>\u5220\u9664</button></div></td>" +
        "</tr>";
      }).join("") : "<tr><td class='request-empty' colspan='8'>\u6682\u65e0\u4fdd\u5b58\u5fd7\u613f\u65b9\u6848</td></tr>";
      updateSavedPlanBulkUi(rows);
    }

    async function loadSavedPlansAdmin() {
      const button = $("refreshPlansBtn");
      if (button) button.disabled = true;
      try {
        const data = await invoke("savedPlans", { limit: 200 });
        state.savedPlans = data.plans || [];
        state.selectedPlanIds.clear();
        renderSavedPlansAdmin();
      } catch (error) {
        const target = $("savedPlanRows");
        if (target) target.innerHTML = "<tr><td colspan='7'>" + escapeHtml(error.message) + "</td></tr>";
      } finally {
        if (button) button.disabled = false;
      }
    }

    function savedPlanDeleteError(error) {
      const message = error?.message || "\u672a\u77e5\u9519\u8bef";
      if (message.includes("\u7f3a\u5c11\u7528\u6237\u7f16\u53f7")) {
        alert("\u5220\u9664\u5931\u8d25\uff1a\u7ebf\u4e0a user-admin Edge Function \u8fd8\u662f\u65e7\u7248\u672c\uff0c\u8bf7\u91cd\u65b0 Deploy updates \u540e\u518d\u8bd5\u3002");
      } else {
        alert("\u5220\u9664\u5931\u8d25\uff1a" + message);
      }
    }

    async function deleteSavedPlansAdmin(ids) {
      const planIds = [...new Set((ids || []).filter(Boolean))];
      if (!planIds.length) return;
      if (!confirm("\u786e\u8ba4\u5220\u9664\u5df2\u9009 " + planIds.length + " \u4efd\u5fd7\u613f\u65b9\u6848\uff1f\n\u5220\u9664\u540e\u4e0d\u53ef\u6062\u590d\u3002")) return;
      const button = $("deleteSelectedPlansBtn");
      if (button) button.disabled = true;
      try {
        await invoke("deleteSavedPlan", { planIds });
        const deleted = new Set(planIds);
        state.savedPlans = state.savedPlans.filter(item => !deleted.has(item.id));
        for (const id of planIds) state.selectedPlanIds.delete(id);
        renderSavedPlansAdmin();
      } catch (error) {
        savedPlanDeleteError(error);
        updateSavedPlanBulkUi();
      }
    }

    async function deleteSavedPlanAdmin(id) {
      const plan = state.savedPlans.find(item => item.id === id);
      const label = plan ? (planUserText(plan) + " / " + (plan.name || "")) : id;
      if (!confirm("\u786e\u8ba4\u5220\u9664\u8be5\u5fd7\u613f\u65b9\u6848\uff1f\n" + label)) return;
      try {
        await invoke("deleteSavedPlan", { planId: id });
        state.savedPlans = state.savedPlans.filter(item => item.id !== id);
        state.selectedPlanIds.delete(id);
        renderSavedPlansAdmin();
      } catch (error) {
        savedPlanDeleteError(error);
      }
    }

    function openPlanDialog(plan) {
      const rows = Array.isArray(plan.recommendations) ? plan.recommendations : [];
      $("planDialogTitle").textContent = plan.name || "\u5fd7\u613f\u65b9\u6848\u660e\u7ec6";
      $("planDialogMeta").textContent = planUserText(plan) + " ? " + (plan.subject === "physics" ? "\u7269\u7406\u7ec4" : "\u5386\u53f2\u7ec4") + " ? " + planBasis(plan) + " ? " + formatDate(plan.created_at);
      $("planDialogDetail").innerHTML = "<table><thead><tr><th>\u5e8f\u53f7</th><th>\u7c7b\u522b</th><th>\u9662\u6821</th><th>\u4e13\u4e1a</th><th>\u5e74\u4efd</th><th>\u53c2\u8003\u5206</th><th>\u6570\u636e\u72b6\u6001</th></tr></thead><tbody>" + rows.map((row, index) => {
        const item = row.item || {};
        const range = item.min == null ? "\u5f85\u8865" : String(item.min) + (item.max != null ? "-" + item.max : "");
        return "<tr>" +
          "<td>" + escapeHtml(row.index || index + 1) + "</td>" +
          "<td>" + escapeHtml(bandText(row.band)) + "</td>" +
          "<td>" + escapeHtml(item.school || "-") + "<br><span class='sub'>" + escapeHtml((item.province || "") + " ? " + (item.level || "")) + "</span></td>" +
          "<td>" + escapeHtml(item.info || "-") + "</td>" +
          "<td>" + escapeHtml(item.year || "-") + "</td>" +
          "<td>" + escapeHtml(range) + "</td>" +
          "<td>" + escapeHtml(item.status || "-") + "</td>" +
        "</tr>";
      }).join("") + "</tbody></table>";
      $("planDialog").showModal();
    }


    function renderPaymentRequests() {
      const rows = state.paymentRequests || [];
      const pendingCount = rows.filter(item => item.status === "pending").length;
      const summary = document.getElementById("paymentRequestSummary");
      if (summary) summary.textContent = pendingCount ? "\u5f85\u5904\u7406 " + pendingCount + " \u6761" : "\u6682\u65e0\u5f85\u5904\u7406\u7533\u8bf7";
      const target = document.getElementById("paymentRequestsRows");
      if (!target) return;
      target.innerHTML = rows.length ? rows.map(request => {
        const canReview = request.status === "pending";
        const badgeClass = request.status === "approved" ? "active" : request.status === "rejected" ? "inactive" : "free";
        return "<tr>" +
          "<td><strong>" + escapeHtml(request.display_name || request.email || "-") + "</strong><br><span class='sub'>" + escapeHtml(request.email || "") + "</span></td>" +
          "<td>" + escapeHtml(request.contact || "-") + "</td>" +
          "<td>" + escapeHtml(formatDate(request.paid_at)) + "</td>" +
          "<td><div class='request-note'>" + escapeHtml(request.note || "-") + "</div></td>" +
          "<td>" + escapeHtml(formatDate(request.created_at)) + "</td>" +
          "<td><span class='badge " + badgeClass + "'>" + paymentRequestStatusLabel(request.status) + "</span></td>" +
          "<td><div class='request-actions'>" +
            "<button data-request-action='approve' data-id='" + escapeHtml(request.id) + "' type='button' " + (canReview ? "" : "disabled") + ">\u786e\u8ba4\u5f00\u901a</button>" +
            "<button class='danger' data-request-action='reject' data-id='" + escapeHtml(request.id) + "' type='button' " + (canReview ? "" : "disabled") + ">\u62d2\u7edd</button>" +
          "</div></td>" +
        "</tr>";
      }).join("") : "<tr><td class='request-empty' colspan='7'>\u6682\u65e0\u4ed8\u6b3e\u5f00\u901a\u7533\u8bf7</td></tr>";
    }

    async function loadPaymentRequests() {
      const button = document.getElementById("refreshPaymentRequestsBtn");
      if (button) button.disabled = true;
      try {
        const data = await invoke("paymentRequests", { status: "all" });
        state.paymentRequests = data.requests || [];
        renderPaymentRequests();
      } catch (error) {
        const target = document.getElementById("paymentRequestsRows");
        if (target) target.innerHTML = "<tr><td colspan='7'>" + escapeHtml(error.message) + "</td></tr>";
      } finally {
        if (button) button.disabled = false;
      }
    }
    function render() {
      const keyword = $("keyword").value.trim().toLowerCase();
      const visible = state.users.filter(user => `${user.email} ${user.display_name || ""}`.toLowerCase().includes(keyword));
      $("totalCount").textContent = state.users.length;
      $("activeCount").textContent = state.users.filter(user => userStatus(user).key === "active").length;
      $("expiredCount").textContent = state.users.filter(user => userStatus(user).key === "expired").length;
      $("disabledCount").textContent = state.users.filter(user => userStatus(user).key === "inactive").length;
      $("rows").innerHTML = visible.length ? visible.map(user => {
        const status = userStatus(user);
        const isSelf = user.id === state.callerId;
        const legacyPaidAccess = Boolean(user.paid_active && user.paid_until && !user.rank_access && !user.manual_access && !user.pdf_access);
        const effectiveRankAccess = Boolean(user.rank_access || legacyPaidAccess);
        const effectiveManualAccess = Boolean(user.manual_access || legacyPaidAccess);
        const effectivePdfAccess = Boolean(user.pdf_access || legacyPaidAccess);
        return `<tr>
          <td><strong>${escapeHtml(user.display_name || user.email)}</strong><br><span class="sub">${escapeHtml(user.email)}</span></td>
          <td><span class="badge">${escapeHtml(user.role || "user")}</span></td>
          <td><span class="badge ${status.key}">${status.label}</span></td>
          <td>${user.unlimited ? '不限' : (Number(user.generation_used || 0) + ' / ' + Number(user.generation_limit || 0))}</td>
          <td>${Number(user.score_trial_used || 0)} / ${Number(user.score_trial_limit ?? 1)}</td>
          <td>${effectiveRankAccess ? '<span class=\'badge paid\'>&#20301;&#27425;</span>' : '<span class=\'badge free\'>&#20301;&#27425;&#26410;&#24320;</span>'} ${effectiveManualAccess ? '<span class=\'badge paid\'>&#25163;&#21160;</span>' : ''} ${effectivePdfAccess ? '<span class=\'badge paid\'>PDF</span>' : ''}</td>
          <td>${escapeHtml(formatDate(user.expires_at))}</td>
          <td>${escapeHtml(user.lastSignInAt ? formatDate(user.lastSignInAt) : "尚未登录")}</td>
          <td><div class="row-actions">
            <button data-action="quota" data-id="${user.id}" type="button">次数</button>
            <button data-action="expiry" data-id="${user.id}" type="button">续期</button>
            <button data-action="password" data-id="${user.id}" type="button">重置密码</button>
            <button class="${user.active ? "danger" : ""}" data-action="toggle" data-id="${user.id}" type="button" ${isSelf ? "disabled" : ""}>${user.active ? "停用" : "启用"}</button>
          </div></td>
        </tr>`;
      }).join("") : '<tr><td colspan="9">没有匹配的账号</td></tr>';
    }

    async function loadUsers() {
      $("refreshBtn").disabled = true;
      try {
        const data = await invoke("list");
        state.users = data.users || [];
        state.callerId = data.callerId || "";
        render();
        if (data.quotaWarning) {
          showStatus("账号已加载，但生成次数数据暂不可用：" + data.quotaWarning, true);
        }
      } catch (error) {
        showStatus(error.message, true);
        $("rows").innerHTML = `<tr><td colspan="9">${escapeHtml(error.message)}</td></tr>`;
      } finally {
        $("refreshBtn").disabled = false;
      }
    }

    $("createForm").addEventListener("submit", async event => {
      event.preventDefault();
      const email = $("email").value.trim().toLowerCase();
      const password = $("password").value;
      if (!/^\S+@\S+\.\S+$/.test(email)) { showStatus("请输入有效的邮箱地址。", true); $("email").focus(); return; }
      if (password.length < 8) { showStatus("初始密码至少需要 8 位。", true); $("password").focus(); return; }
      $("createBtn").disabled = true;
      showStatus("正在创建账号...");
      const createPaidFeature = document.getElementById('unlimitedQuota').checked || document.getElementById('rankAccess').checked || document.getElementById('manualAccess').checked || document.getElementById('pdfAccess').checked;
      if (createPaidFeature && Number(document.getElementById('generationLimit').value) <= 0) document.getElementById('generationLimit').value = '3';
      try {
        const data = await invoke("create", {
          email,
          displayName: $("displayName").value,
          password,
          expiresAt: $("expiresAt").value ? new Date($("expiresAt").value).toISOString() : null,
          generationLimit: Number($("generationLimit").value),
          scoreTrialLimit: Number(document.getElementById('scoreTrialLimit').value),
          paidUntil: document.getElementById('paidUntil').value ? new Date(document.getElementById('paidUntil').value).toISOString() : null,
          rankAccess: document.getElementById('rankAccess').checked,
          manualAccess: document.getElementById('manualAccess').checked,
          pdfAccess: document.getElementById('pdfAccess').checked,
          unlimited: $("unlimitedQuota").checked
        });
        event.target.reset();
        showStatus(data.warning || "账号已创建并自动确认邮箱。请将初始密码安全地告知用户。", Boolean(data.warning));
        await loadUsers();
      } catch (error) {
        showStatus(error.message, true);
      } finally {
        $("createBtn").disabled = false;
      }
    });

    document.getElementById("paymentRequestsRows")?.addEventListener("click", async event => {
      const button = event.target.closest("button[data-request-action]");
      if (!button) return;
      const request = state.paymentRequests.find(item => item.id === button.dataset.id);
      if (!request) return;
      button.disabled = true;
      try {
        if (button.dataset.requestAction === "approve") {
          openApproveDialog(request);
          button.disabled = false;
          return;
        } else {
          const reason = prompt("\u586b\u5199\u62d2\u7edd\u539f\u56e0\uff08\u53ef\u7559\u7a7a\uff09");
          if (reason === null) { button.disabled = false; return; }
          await invoke("rejectPaymentRequest", { requestId: request.id, adminNote: reason });
          showStatus("\u5df2\u6807\u8bb0\u4e3a\u62d2\u7edd\u3002");
        }
        await loadPaymentRequests();
        await loadUsers();
      } catch (error) {
        showStatus(error.message, true);
        button.disabled = false;
      }
    });
    $("rows").addEventListener("click", async event => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const user = state.users.find(item => item.id === button.dataset.id);
      if (!user) return;
      if (button.dataset.action === "quota") {
        $("quotaUserId").value = user.id;
        $("quotaLimit").value = Number(user.generation_limit || 0);
        $("quotaUnlimited").checked = Boolean(user.unlimited);
        document.getElementById('quotaScoreTrialLimit').value = Number(user.score_trial_limit ?? 1);
        document.getElementById('quotaPaidUntil').value = toLocalInput(user.paid_until);
        const legacyPaidAccess = Boolean(user.paid_active && user.paid_until && !user.rank_access && !user.manual_access && !user.pdf_access);
        document.getElementById('quotaRankAccess').checked = Boolean(user.rank_access || legacyPaidAccess);
        document.getElementById('quotaManualAccess').checked = Boolean(user.manual_access || legacyPaidAccess);
        document.getElementById('quotaPdfAccess').checked = Boolean(user.pdf_access || legacyPaidAccess);
        $("quotaResetUsed").checked = false;
        document.getElementById('quotaResetTrial').checked = false;
        $("quotaDialog").showModal();
      } else if (button.dataset.action === "expiry") {
        $("expiryUserId").value = user.id;
        $("newExpiresAt").value = toLocalInput(user.expires_at);
        $("expiryDialog").showModal();
      } else if (button.dataset.action === "password") {
        $("passwordUserId").value = user.id;
        $("newPassword").value = "";
        $("passwordDialog").showModal();
      } else if (button.dataset.action === "toggle") {
        button.disabled = true;
        try {
          await invoke("update", { userId: user.id, active: !user.active });
          await loadUsers();
        } catch (error) { showStatus(error.message, true); button.disabled = false; }
      }
    });

    $("expiryForm").addEventListener("submit", async event => {
      event.preventDefault();
      try {
        const value = $("newExpiresAt").value;
        await invoke("update", { userId: $("expiryUserId").value, expiresAt: value ? new Date(value).toISOString() : null });
        $("expiryDialog").close();
        await loadUsers();
      } catch (error) { showStatus(error.message, true); }
    });
    $("clearExpiryBtn").addEventListener("click", () => { $("newExpiresAt").value = ""; });

    $("passwordForm").addEventListener("submit", async event => {
      event.preventDefault();
      try {
        await invoke("resetPassword", { userId: $("passwordUserId").value, password: $("newPassword").value });
        $("passwordDialog").close();
        showStatus("临时密码已更新。");
      } catch (error) { showStatus(error.message, true); }
    });

    $("approveForm").addEventListener("submit", async event => {
      event.preventDefault();
      const paidUntilValue = document.getElementById("approvePaidUntil").value;
      try {
        await invoke("approvePaymentRequest", {
          requestId: document.getElementById("approveRequestId").value,
          paidUntil: paidUntilValue ? new Date(paidUntilValue).toISOString() : null,
          generationLimit: Number(document.getElementById("approveGenerationLimit").value),
          rankAccess: document.getElementById("approveRankAccess").checked,
          manualAccess: document.getElementById("approveManualAccess").checked,
          pdfAccess: document.getElementById("approvePdfAccess").checked,
          unlimited: document.getElementById("approveUnlimited").checked,
          resetUsed: document.getElementById("approveResetUsed").checked,
          adminNote: document.getElementById("approveAdminNote").value
        });
        $("approveDialog").close();
        showStatus("\u5df2\u5f00\u901a\u7528\u6237\u4ed8\u8d39\u529f\u80fd\u3002");
        await loadPaymentRequests();
        await loadUsers();
      } catch (error) {
        showStatus(error.message, true);
      }
    });
    $("quotaForm").addEventListener("submit", async event => {
      event.preventDefault();
      const quotaPaidFeature = document.getElementById('quotaUnlimited').checked || document.getElementById('quotaRankAccess').checked || document.getElementById('quotaManualAccess').checked || document.getElementById('quotaPdfAccess').checked;
      if (quotaPaidFeature && Number(document.getElementById('quotaLimit').value) <= 0) document.getElementById('quotaLimit').value = '3';
      try {
        await invoke("quota", {
          userId: $("quotaUserId").value,
          generationLimit: Number($("quotaLimit").value),
          scoreTrialLimit: Number(document.getElementById('quotaScoreTrialLimit').value),
          paidUntil: document.getElementById('quotaPaidUntil').value ? new Date(document.getElementById('quotaPaidUntil').value).toISOString() : null,
          rankAccess: document.getElementById('quotaRankAccess').checked,
          manualAccess: document.getElementById('quotaManualAccess').checked,
          pdfAccess: document.getElementById('quotaPdfAccess').checked,
          unlimited: $("quotaUnlimited").checked,
          resetUsed: $("quotaResetUsed").checked,
          resetTrial: document.getElementById('quotaResetTrial').checked
        });
        $("quotaDialog").close();
        showStatus("生成次数已更新。");
        await loadUsers();
      } catch (error) { showStatus(error.message, true); }
    });

    document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => $(button.dataset.close).close()));
    $("keyword").addEventListener("input", render);
    $("refreshBtn").addEventListener("click", loadUsers);
    $("refreshPaymentRequestsBtn").addEventListener("click", loadPaymentRequests);
    $("signOutBtn").addEventListener("click", FujianArtAuth.signOut);
    $("refreshPlansBtn")?.addEventListener("click", loadSavedPlansAdmin);
    $("deleteSelectedPlansBtn")?.addEventListener("click", () => deleteSavedPlansAdmin(Array.from(state.selectedPlanIds)));
    $("selectSavedPlansAll")?.addEventListener("change", event => {
      const rows = visibleSavedPlans();
      for (const plan of rows) {
        if (!plan.id) continue;
        if (event.target.checked) state.selectedPlanIds.add(plan.id);
        else state.selectedPlanIds.delete(plan.id);
      }
      renderSavedPlansAdmin();
    });
    $("planKeyword")?.addEventListener("input", renderSavedPlansAdmin);
    $("savedPlansPanel")?.addEventListener("toggle", event => { if (event.target.open && !state.savedPlans.length) loadSavedPlansAdmin(); });
    $("savedPlanRows")?.addEventListener("click", event => {
      const button = event.target.closest("button[data-plan-action]");
      if (!button) return;
      const plan = state.savedPlans.find(item => item.id === button.dataset.id);
      if (button.dataset.planAction === "delete") { deleteSavedPlanAdmin(button.dataset.id); return; }
      if (plan && button.dataset.planAction === "view") openPlanDialog(plan);
    });
    $("savedPlanRows")?.addEventListener("change", event => {
      const checkbox = event.target.closest("input[data-plan-action=\"select\"]");
      if (!checkbox) return;
      if (checkbox.checked) state.selectedPlanIds.add(checkbox.dataset.id);
      else state.selectedPlanIds.delete(checkbox.dataset.id);
      updateSavedPlanBulkUi();
    });


    (async function initialize() {
      const result = await FujianArtAuth.guard({ admin: true });
      if (!result.ok) {
        document.body.classList.remove("auth-pending");
        document.body.classList.add("auth-denied");
        $("gateTitle").textContent = "无用户管理权限";
        $("gateMessage").textContent = result.reason === "admin" ? "当前账号不是管理员。" : "授权验证失败，请重新登录。";
        return;
      }
      document.body.classList.remove("auth-pending");
      await loadUsers();
      await loadPaymentRequests();
    })();
  