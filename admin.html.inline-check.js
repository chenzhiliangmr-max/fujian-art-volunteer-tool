
    (async function initializeAdminAuthorization() {
      const result = await FujianArtAuth.guard({ admin: true });
      const body = document.body;
      if (!result.ok) {
        body.classList.remove("auth-pending");
        body.classList.add("auth-denied");
        document.getElementById("authGateTitle").textContent = "无后台访问权限";
        const messages = {
          admin: "当前账号不是管理员。",
          config: "授权已启用，但 Supabase 配置不完整。",
          inactive: "该管理员账号已停用。",
          expired: "该管理员账号授权已到期。",
          network: "无法连接授权服务，请检查网络后刷新页面。"
        };
        document.getElementById("authGateMessage").textContent = messages[result.reason] || "权限验证失败。";
        return;
      }
      body.classList.remove("auth-pending");
      if (!result.bypass) {
        const button = document.getElementById("signOutBtn");
        button.hidden = false;
        button.addEventListener("click", FujianArtAuth.signOut);
      }
    })();
  
;

    const STORAGE_KEY = "fujian_art_web_admin_colleges";
    const AUDIT_KEY = "fujian_art_web_admin_audit";
    const RANK_2026_STORAGE_PREFIX = "fujian_art_rank_2026_";
    const $ = id => document.getElementById(id);

    let baseColleges = window.FujianArtData.colleges.map((item, index) => withId(window.FujianArtSchoolMetadata.enrich(item), index));
    let colleges = loadColleges();
    let selectedId = "";

    function withId(item, index) {
      const verifiedSite = window.FujianArtAdmissionSites?.getSite(item.school);
      return {
        ...item,
        admissionUrl: item.admissionUrl || verifiedSite?.url || "",
        urlStatus: item.urlStatus || verifiedSite?.status || "pending",
        urlCheckedAt: item.urlCheckedAt || verifiedSite?.checkedAt || "",
        id: item.id || [item.school, item.year, item.subject, item.info, index].join("|")
      };
    }

    function fmt(value) {
      if (value == null || value === "") return "待补";
      return Number(value).toFixed(2).replace(/\.00$/, "");
    }

    function loadColleges() {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [...baseColleges];
      try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed.map((item, index) => withId(item, index)) : [...baseColleges];
      } catch (error) {
        return [...baseColleges];
      }
    }

    function saveColleges() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(colleges));
    }

    function loadAudit() {
      try {
        return JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]");
      } catch (error) {
        return [];
      }
    }

    function addAudit(action, detail) {
      const logs = loadAudit();
      logs.unshift({ action, detail, time: new Date().toLocaleString("zh-CN") });
      localStorage.setItem(AUDIT_KEY, JSON.stringify(logs.slice(0, 80)));
      renderAudit();
    }

    function parseRankAdminData(text) {
      return text.trim().split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(line => {
        const parts = line.split(/[,，\t\s]+/).filter(Boolean);
        const score = Number(parts[0]);
        const rank = Number(parts[1]);
        const count = Number(parts[2] || "");
        if (!Number.isFinite(score) || !Number.isFinite(rank)) return null;
        return { score, rank, count: Number.isFinite(count) ? count : "" };
      }).filter(Boolean);
    }

    function loadRankAdminData() {
      const subject = $("rankSubjectAdmin").value;
      const text = localStorage.getItem(RANK_2026_STORAGE_PREFIX + subject) || "";
      const rows = parseRankAdminData(text);
      $("rankDataAdmin").value = text;
      $("rankAdminStatus").textContent = rows.length
        ? `${subject === "history" ? "历史组" : "物理组"}已保存 ${rows.length} 行。`
        : `当前${subject === "history" ? "历史组" : "物理组"}尚未导入 2026 数据。`;
    }

    function saveRankAdminData() {
      const subject = $("rankSubjectAdmin").value;
      const text = $("rankDataAdmin").value.trim();
      const rows = parseRankAdminData(text);
      if (!rows.length) {
        alert("未识别到有效数据，请检查综合分和位次两列。");
        return;
      }
      localStorage.setItem(RANK_2026_STORAGE_PREFIX + subject, text);
      addAudit("保存一分一段表", `${subject === "history" ? "历史组" : "物理组"} · ${rows.length} 行`);
      loadRankAdminData();
    }

    function renderAudit() {
      const logs = loadAudit().slice(0, 20);
      $("auditList").innerHTML = logs.length ? logs.map(log => `
        <div class="audit-item">
          <strong>${escapeHtml(log.action)}</strong>
          <div>${escapeHtml(log.detail)}</div>
          <div class="muted">${escapeHtml(log.time)}</div>
        </div>
      `).join("") : `<div class="muted small">暂无维护记录</div>`;
    }

    function escapeHtml(value) {
      return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      }[char]));
    }

    function subjectText(subject) {
      return subject === "history" ? "历史" : subject === "physics" ? "物理" : "不限/待分";
    }

    function statusKind(item) {
      const status = item.status || "";
      if (status.includes("已核")) return "verified";
      if (status.includes("计划") || status.includes("待分数")) return "plan";
      return "pending";
    }

    function tagPills(item) {
      return (item.tags || []).map(tag => {
        const cls = tag === "private" ? "private" : tag === "coop" ? "coop" : ["985", "211", "double"].includes(tag) ? "high" : "";
        return `<span class="pill ${cls}">${escapeHtml(tag)}</span>`;
      }).join("");
    }

    function filteredRows() {
      const keyword = $("keywordInput").value.trim().toLowerCase();
      const subject = $("subjectFilter").value;
      const status = $("statusFilter").value;
      const tag = $("tagFilter").value;
      return colleges.filter(item => {
        if (subject && item.subject !== subject) return false;
        if (status && statusKind(item) !== status) return false;
        if (tag && !(item.tags || []).includes(tag)) return false;
        if (keyword) {
          const hay = [item.school, item.province, item.level, item.info, item.status, (item.tags || []).join(" ")].join(" ").toLowerCase();
          if (!hay.includes(keyword)) return false;
        }
        return true;
      });
    }

    function renderMetrics() {
      $("totalMetric").textContent = colleges.length;
      $("verifiedMetric").textContent = colleges.filter(item => statusKind(item) === "verified").length;
      $("pendingMetric").textContent = colleges.filter(item => statusKind(item) === "pending").length;
      $("fujianMetric").textContent = colleges.filter(item => item.province === "福建").length;
      $("highMetric").textContent = colleges.filter(item => (item.tags || []).some(tag => ["985", "211", "double"].includes(tag))).length;
    }

    function renderRows() {
      const rows = filteredRows();
      $("filteredText").textContent = `显示 ${rows.length} 条`;
      $("rows").innerHTML = rows.map(item => `
        <tr class="${item.id === selectedId ? "active-row" : ""}">
          <td>
            <div class="school">${escapeHtml(item.school)}</div>
            <div class="muted small">${escapeHtml(item.year)}</div>
          </td>
          <td>${escapeHtml(item.province)}<br><span class="muted">${escapeHtml(item.level)}</span></td>
          <td>${escapeHtml(item.info)}</td>
          <td>${subjectText(item.subject)}</td>
          <td>${fmt(item.min)}${item.max ? `-${fmt(item.max)}` : ""}</td>
          <td><span class="pill ${statusKind(item) === "verified" ? "ok" : "warn"}">${escapeHtml(item.status)}</span></td>
          <td>${item.urlStatus === "verified" && item.admissionUrl ? `<a href="${escapeHtml(item.admissionUrl)}" target="_blank" rel="noopener noreferrer">官方招生网</a>` : `<span class="muted">${item.admissionUrl ? "待核验" : "未录入"}</span>`}</td>
          <td>${tagPills(item)}</td>
          <td>
            <div class="row-actions">
              <button class="btn mini" data-action="edit" data-id="${escapeHtml(item.id)}" type="button">编辑</button>
              <button class="btn mini danger" data-action="delete" data-id="${escapeHtml(item.id)}" type="button">删除</button>
            </div>
          </td>
        </tr>
      `).join("");
    }

    function renderAll() {
      $("versionText").textContent = `数据版本 ${window.FujianArtData.dataVersion} · 当前本地管理 ${colleges.length} 条`;
      renderMetrics();
      renderRows();
      renderAudit();
    }

    function clearForm() {
      selectedId = "";
      $("recordId").value = "";
      $("schoolInput").value = "";
      $("provinceInput").value = "福建";
      $("levelInput").value = "公办";
      $("yearInput").value = "2025";
      $("subjectInput").value = "both";
      $("infoInput").value = "";
      $("minInput").value = "";
      $("maxInput").value = "";
      $("statusInput").value = "待复核";
      $("tagsInput").value = "public,plan";
      $("admissionUrlInput").value = "";
      $("urlStatusInput").value = "pending";
      $("urlCheckedAtInput").value = "";
      renderRows();
    }

    function fillForm(item) {
      selectedId = item.id;
      $("recordId").value = item.id;
      $("schoolInput").value = item.school || "";
      $("provinceInput").value = item.province || "";
      $("levelInput").value = item.level || "";
      $("yearInput").value = item.year || 2025;
      $("subjectInput").value = item.subject || "both";
      $("infoInput").value = item.info || "";
      $("minInput").value = item.min == null ? "" : item.min;
      $("maxInput").value = item.max == null ? "" : item.max;
      $("statusInput").value = item.status || "";
      $("tagsInput").value = (item.tags || []).join(",");
      $("admissionUrlInput").value = item.admissionUrl || "";
      $("urlStatusInput").value = item.urlStatus || "pending";
      $("urlCheckedAtInput").value = item.urlCheckedAt || "";
      renderRows();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function readForm() {
      const school = $("schoolInput").value.trim();
      const info = $("infoInput").value.trim();
      if (!school || !info) {
        alert("请填写院校和专业/计划信息");
        return null;
      }
      const id = $("recordId").value || [school, $("yearInput").value, $("subjectInput").value, info, Date.now()].join("|");
      const minValue = $("minInput").value;
      const maxValue = $("maxInput").value;
      const admissionUrl = $("admissionUrlInput").value.trim();
      if (admissionUrl && !/^https:\/\//i.test(admissionUrl)) {
        alert("招生网址必须使用 https:// 官方地址");
        return null;
      }
      return {
        id,
        school,
        province: $("provinceInput").value.trim() || "福建",
        level: $("levelInput").value.trim() || "待补",
        year: Number($("yearInput").value || 2025),
        info,
        subject: $("subjectInput").value,
        min: minValue === "" ? null : Number(minValue),
        max: maxValue === "" ? undefined : Number(maxValue),
        status: $("statusInput").value.trim() || "待复核",
        admissionUrl,
        urlStatus: $("urlStatusInput").value,
        urlCheckedAt: $("urlCheckedAtInput").value,
        tags: $("tagsInput").value.split(/[,，、\s]+/).map(tag => tag.trim()).filter(Boolean)
      };
    }

    function saveRecord() {
      const record = readForm();
      if (!record) return;
      const index = colleges.findIndex(item => item.id === record.id);
      if (index >= 0) {
        colleges.splice(index, 1, record);
        addAudit("更新记录", `${record.school} · ${record.info}`);
      } else {
        colleges.unshift(record);
        addAudit("新增记录", `${record.school} · ${record.info}`);
      }
      colleges = colleges.map(item => item.school === record.school ? {
        ...item,
        admissionUrl: record.admissionUrl,
        urlStatus: record.urlStatus,
        urlCheckedAt: record.urlCheckedAt
      } : item);
      selectedId = record.id;
      saveColleges();
      renderAll();
    }

    function deleteRecord(id) {
      const item = colleges.find(row => row.id === id);
      if (!item) return;
      if (!confirm(`确认删除：${item.school} · ${item.info}？`)) return;
      colleges = colleges.filter(row => row.id !== id);
      if (selectedId === id) clearForm();
      saveColleges();
      addAudit("删除记录", `${item.school} · ${item.info}`);
      renderAll();
    }

    function exportJson() {
      const text = JSON.stringify(colleges, null, 2);
      navigator.clipboard?.writeText(text);
      $("importText").value = text;
      addAudit("导出数据", `复制 ${colleges.length} 条记录到剪贴板`);
      alert("已复制 JSON 到剪贴板，并填入导入框。");
    }

    function importJson() {
      try {
        const parsed = JSON.parse($("importText").value);
        if (!Array.isArray(parsed)) throw new Error("not array");
        colleges = parsed.map((item, index) => withId({
          ...item,
          year: Number(item.year || 2025),
          min: item.min === "" || item.min == null ? null : Number(item.min),
          max: item.max === "" || item.max == null ? undefined : Number(item.max),
          tags: Array.isArray(item.tags) ? item.tags : String(item.tags || "").split(/[,，、\s]+/).filter(Boolean)
        }, index));
        saveColleges();
        clearForm();
        addAudit("导入数据", `导入 ${colleges.length} 条记录`);
        renderAll();
      } catch (error) {
        alert("JSON 格式不正确，请粘贴院校数组。");
      }
    }

    function resetData() {
      if (!confirm("确认恢复到内置共享数据？本浏览器里的后台改动会清空。")) return;
      localStorage.removeItem(STORAGE_KEY);
      colleges = [...baseColleges];
      clearForm();
      addAudit("恢复内置", `恢复 ${colleges.length} 条记录`);
      renderAll();
    }

    ["keywordInput", "subjectFilter", "statusFilter", "tagFilter"].forEach(id => {
      $(id).addEventListener("input", renderRows);
      $(id).addEventListener("change", renderRows);
    });

    $("rows").addEventListener("click", event => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const item = colleges.find(row => row.id === button.dataset.id);
      if (button.dataset.action === "edit" && item) fillForm(item);
      if (button.dataset.action === "delete") deleteRecord(button.dataset.id);
    });

    $("newBtn").addEventListener("click", clearForm);
    $("clearBtn").addEventListener("click", clearForm);
    $("saveBtn").addEventListener("click", saveRecord);
    $("exportBtn").addEventListener("click", exportJson);
    $("importBtn").addEventListener("click", importJson);
    $("resetBtn").addEventListener("click", resetData);
    $("rankSubjectAdmin").addEventListener("change", loadRankAdminData);
    $("saveRankBtn").addEventListener("click", saveRankAdminData);
    $("clearRankAdminBtn").addEventListener("click", () => {
      const subject = $("rankSubjectAdmin").value;
      if (!confirm(`确认清空 2026 ${subject === "history" ? "历史组" : "物理组"}一分一段表？`)) return;
      localStorage.removeItem(RANK_2026_STORAGE_PREFIX + subject);
      addAudit("清空一分一段表", subject === "history" ? "历史组" : "物理组");
      loadRankAdminData();
    });
    $("testAdmissionUrlBtn").addEventListener("click", () => {
      const url = $("admissionUrlInput").value.trim();
      if (!/^https:\/\//i.test(url)) {
        alert("请先填写 https:// 官方招生网址");
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    });

    renderAll();
    loadRankAdminData();
  