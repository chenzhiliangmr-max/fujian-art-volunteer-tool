const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" }
  });
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function quotaLimit(value) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 3;
}

function trialLimit(value) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 1;
}

function errorMessage(error) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object") {
    return [error.message, error.details, error.hint, error.code].filter(Boolean).map(String).join(" | ");
  }
  return String(error || "服务器处理失败");
}

function isPaidActive(quota) {
  if (!quota) return false;
  if (quota.unlimited === true) return true;
  const hasPaidFeature = quota.rank_access === true || quota.manual_access === true || quota.pdf_access === true;
  const hasPaidQuota = Number(quota.generation_limit || 0) > 0;
  if (!quota.paid_until) return hasPaidFeature || hasPaidQuota;
  return new Date(quota.paid_until).getTime() > Date.now();
}

function quotaAccess(quota) {
  const paidActive = isPaidActive(quota);
  const unlimited = quota?.unlimited === true;
  const noFeatureFlags = quota?.rank_access !== true && quota?.manual_access !== true && quota?.pdf_access !== true;
  const legacyPaidAccess = Boolean(paidActive && quota?.paid_until && noFeatureFlags);
  return {
    paidActive,
    rankAccess: unlimited || (paidActive && (quota?.rank_access === true || legacyPaidAccess)),
    manualAccess: unlimited || (paidActive && (quota?.manual_access === true || legacyPaidAccess)),
    pdfAccess: unlimited || (paidActive && (quota?.pdf_access === true || legacyPaidAccess))
  };
}

function quotaResponse(quota) {
  const generationLimit = Number(quota?.generation_limit ?? 0);
  const generationUsed = Number(quota?.generation_used ?? 0);
  const scoreTrialLimit = Number(quota?.score_trial_limit ?? 1);
  const scoreTrialUsed = Number(quota?.score_trial_used ?? 0);
  return {
    unlimited: quota?.unlimited === true,
    limit: generationLimit,
    used: generationUsed,
    remaining: quota?.unlimited === true ? null : Math.max(generationLimit - generationUsed, 0),
    scoreTrialLimit,
    scoreTrialUsed,
    scoreTrialRemaining: Math.max(scoreTrialLimit - scoreTrialUsed, 0),
    paidUntil: quota?.paid_until ?? null,
    ...quotaAccess(quota)
  };
}

function makeApi(supabaseUrl, serviceRoleKey) {
  const base = supabaseUrl.replace(/\/$/, "");
  const serviceHeaders = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json"
  };

  async function readBody(response) {
    const raw = await response.text();
    try { return raw ? JSON.parse(raw) : null; } catch (_) { return raw; }
  }

  async function request(url, options = {}) {
    const response = await fetch(url, options);
    const body = await readBody(response);
    if (!response.ok) {
      const message = body?.msg || body?.message || body?.error_description || body?.error || response.statusText;
      const error = new Error(message);
      error.status = response.status;
      error.body = body;
      throw error;
    }
    return body;
  }

  function restUrl(table, params = {}) {
    const url = new URL(`${base}/rest/v1/${table}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    });
    return url.toString();
  }

  return {
    async getUser(token) {
      return request(`${base}/auth/v1/user`, {
        headers: { apikey: serviceRoleKey, Authorization: `Bearer ${token}` }
      });
    },
    async listUsers() {
      const data = await request(`${base}/auth/v1/admin/users?page=1&per_page=1000`, { headers: serviceHeaders });
      return Array.isArray(data?.users) ? data.users : [];
    },
    async createUser(payload) {
      return request(`${base}/auth/v1/admin/users`, {
        method: "POST",
        headers: serviceHeaders,
        body: JSON.stringify(payload)
      });
    },
    async updateUser(userId, payload) {
      return request(`${base}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
        method: "PUT",
        headers: serviceHeaders,
        body: JSON.stringify(payload)
      });
    },
    async deleteUser(userId) {
      return request(`${base}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
        method: "DELETE",
        headers: serviceHeaders
      }).catch(() => null);
    },
    async select(table, params) {
      return request(restUrl(table, params), { headers: serviceHeaders });
    },
    async insert(table, body, params = {}, prefer = "return=representation") {
      return request(restUrl(table, params), {
        method: "POST",
        headers: { ...serviceHeaders, Prefer: prefer },
        body: JSON.stringify(body)
      });
    },
    async upsert(table, body, params = {}) {
      return request(restUrl(table, params), {
        method: "POST",
        headers: { ...serviceHeaders, Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify(body)
      });
    },
    async patch(table, params, body, prefer = "return=representation") {
      return request(restUrl(table, params), {
        method: "PATCH",
        headers: { ...serviceHeaders, Prefer: prefer },
        body: JSON.stringify(body)
      });
    },
    async remove(table, params) {
      return request(restUrl(table, params), { method: "DELETE", headers: serviceHeaders });
    }
  };
}

async function getProfile(api, userId) {
  const rows = await api.select("profiles", { select: "id,email,display_name,role,active,expires_at,created_at", id: `eq.${userId}` });
  return rows?.[0] || null;
}

async function ensureQuota(api, userId) {
  let rows = await api.select("user_quotas", {
    select: "user_id,generation_limit,generation_used,unlimited,score_trial_limit,score_trial_used,rank_access,manual_access,pdf_access,paid_until,updated_at",
    user_id: `eq.${userId}`
  });
  if (rows?.[0]) return rows[0];
  rows = await api.upsert("user_quotas", { user_id: userId }, { on_conflict: "user_id" });
  return rows?.[0] || { user_id: userId, generation_limit: 0, generation_used: 0, unlimited: false, score_trial_limit: 1, score_trial_used: 0 };
}

function userStatusAllowed(profile) {
  if (!profile?.active) return false;
  if (profile.expires_at && new Date(profile.expires_at).getTime() <= Date.now()) return false;
  return true;
}

Deno.serve(async request => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) return json({ error: "Server configuration is incomplete" }, 500);

    const token = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "请先登录" }, 401);

    const api = makeApi(supabaseUrl, serviceRoleKey);
    const authUser = await api.getUser(token);
    if (!authUser?.id) return json({ error: "登录状态已失效" }, 401);

    const callerId = authUser.id;
    const caller = await getProfile(api, callerId);
    if (!userStatusAllowed(caller)) return json({ error: "账号已停用或授权已到期" }, 403);

    const payload = await request.json().catch(() => ({}));
    const action = text(payload.action);
    const isAdmin = ["admin", "superadmin"].includes(caller.role);

    if (action === "getQuota") {
      if (isAdmin) return json({ ok: true, unlimited: true, remaining: null, paidActive: true, rankAccess: true, manualAccess: true, pdfAccess: true });
      const quota = await ensureQuota(api, callerId);
      return json({ ok: true, ...quotaResponse(quota) });
    }

    if (action === "consumeQuota") {
      if (isAdmin) return json({ ok: true, unlimited: true, remaining: null, paidActive: true, rankAccess: true, manualAccess: true, pdfAccess: true });
      const requestId = text(payload.requestId);
      const recommendMode = text(payload.recommendMode) === "rank" ? "rank" : "score";
      if (!requestId) return json({ error: "缺少生成请求编号" }, 400);

      const existing = await api.select("recommendation_usage", { select: "remaining_after,unlimited,recommend_mode", user_id: `eq.${callerId}`, request_id: `eq.${requestId}` });
      if (existing?.[0]) return json({ ok: true, duplicate: true, unlimited: existing[0].unlimited, remaining: existing[0].remaining_after, recommendMode: existing[0].recommend_mode });

      const quota = await ensureQuota(api, callerId);
      const access = quotaAccess(quota);
      if (recommendMode === "rank" && !access.rankAccess) return json({ ok: false, reason: "rank_paid_required", ...quotaResponse(quota) });
      if (quota.unlimited === true) {
        await api.insert("recommendation_usage", { user_id: callerId, request_id: requestId, subject: text(payload.subject) || null, score: Number.isFinite(Number(payload.score)) ? Number(payload.score) : null, rank: Number.isFinite(Number(payload.rank)) ? Math.round(Number(payload.rank)) : null, recommend_mode: recommendMode, unlimited: true }, {}, "return=minimal");
        return json({ ok: true, unlimited: true, remaining: null, ...access });
      }

      if (recommendMode === "score" && !access.paidActive) {
        const used = Number(quota.score_trial_used || 0);
        const limit = Number(quota.score_trial_limit ?? 1);
        if (used >= limit) return json({ ok: false, reason: "score_trial_exhausted", ...quotaResponse(quota) });
        const rows = await api.patch("user_quotas", { user_id: `eq.${callerId}` }, { score_trial_used: used + 1, updated_at: new Date().toISOString() });
        const updated = rows?.[0] || { ...quota, score_trial_used: used + 1 };
        await api.insert("recommendation_usage", { user_id: callerId, request_id: requestId, subject: text(payload.subject) || null, score: Number.isFinite(Number(payload.score)) ? Number(payload.score) : null, rank: Number.isFinite(Number(payload.rank)) ? Math.round(Number(payload.rank)) : null, recommend_mode: recommendMode, remaining_after: Math.max(Number(updated.score_trial_limit ?? 1) - Number(updated.score_trial_used ?? 0), 0), unlimited: false }, {}, "return=minimal");
        return json({ ok: true, ...quotaResponse(updated) });
      }

      if (!access.paidActive) return json({ ok: false, reason: "paid_required", ...quotaResponse(quota) });
      const used = Number(quota.generation_used || 0);
      const limit = Number(quota.generation_limit || 0);
      if (used >= limit) return json({ ok: false, reason: "quota_exhausted", ...quotaResponse(quota) });
      const rows = await api.patch("user_quotas", { user_id: `eq.${callerId}` }, { generation_used: used + 1, updated_at: new Date().toISOString() });
      const updated = rows?.[0] || { ...quota, generation_used: used + 1 };
      await api.insert("recommendation_usage", { user_id: callerId, request_id: requestId, subject: text(payload.subject) || null, score: Number.isFinite(Number(payload.score)) ? Number(payload.score) : null, rank: Number.isFinite(Number(payload.rank)) ? Math.round(Number(payload.rank)) : null, recommend_mode: recommendMode, remaining_after: Math.max(Number(updated.generation_limit || 0) - Number(updated.generation_used || 0), 0), unlimited: false }, {}, "return=minimal");
      return json({ ok: true, ...quotaResponse(updated) });
    }


    if (action === "saveCandidateScore") {
      const scoreSubject = text(payload.subject) === "physics" ? "physics" : "history";
      const cultureScore = Number(payload.cultureScore);
      const majorScore = Number(payload.majorScore);
      const compositeScore = Number(payload.compositeScore);
      const candidateRank = Number(payload.candidateRank ?? payload.rank);
      const normalizedRank = Number.isFinite(candidateRank) && candidateRank > 0 ? Math.round(candidateRank) : null;
      if (!Number.isFinite(cultureScore) || cultureScore < 0 || cultureScore > 750) return json({ error: "\u6587\u5316\u5206\u4e0d\u6b63\u786e" }, 400);
      if (!Number.isFinite(majorScore) || majorScore < 0 || majorScore > 300) return json({ error: "\u7edf\u8003\u5206\u4e0d\u6b63\u786e" }, 400);
      const rows = await api.upsert("candidate_scores", {
        user_id: callerId,
        subject: scoreSubject,
        culture_score: cultureScore,
        major_score: majorScore,
        composite_score: Number.isFinite(compositeScore) ? compositeScore : cultureScore * 0.5 + majorScore * 2.5 * 0.5,
        candidate_rank: normalizedRank
      }, { on_conflict: "user_id,subject" });
      return json({ ok: true, score: rows?.[0] || null });
    }

    if (action === "candidateScores") {
      const rows = await api.select("candidate_scores", { select: "*", user_id: "eq." + callerId });
      return json({ ok: true, scores: rows || [] });
    }

    if (action === "submitPaymentRequest") {
      const contact = text(payload.contact);
      const note = text(payload.note);
      const paidAt = payload.paidAt || null;
      if (!contact) return json({ error: "\u8bf7\u586b\u5199\u5fae\u4fe1\u53f7\u6216\u624b\u673a\u53f7" }, 400);
      const existing = await api.select("payment_requests", { select: "id,status,created_at", user_id: `eq.${callerId}`, status: "eq.pending", order: "created_at.desc", limit: "1" });
      if (existing?.[0]) return json({ ok: true, duplicate: true, request: existing[0] });
      const rows = await api.insert("payment_requests", {
        user_id: callerId,
        email: caller.email || authUser.email || "",
        display_name: caller.display_name || "",
        contact,
        paid_at: paidAt,
        note,
        requested_features: Array.isArray(payload.requestedFeatures) && payload.requestedFeatures.length ? payload.requestedFeatures : ["rank", "manual", "pdf"],
        status: "pending"
      });
      return json({ ok: true, request: rows?.[0] || null });
    }

    if (action === "mySavedPlans") {
      const limit = Math.min(Math.max(Math.floor(Number(payload.limit || 50)), 1), 100);
      const email = text(caller.email || authUser.email).toLowerCase();
      let userIds = [callerId];
      if (email) {
        const profiles = await api.select("profiles", { select: "id,email", limit: "1000" }).catch(() => []);
        const sameEmailProfiles = (profiles || []).filter(profile => text(profile.email).toLowerCase() === email);
        userIds = [...new Set([...userIds, ...sameEmailProfiles.map(profile => profile.id).filter(Boolean)])];
      }
      let plans = userIds.length > 1
        ? await api.select("saved_volunteer_plans", { select: "*", user_id: "in.(" + userIds.join(",") + ")", order: "created_at.desc", limit: String(limit) })
        : await api.select("saved_volunteer_plans", { select: "*", user_id: "eq." + callerId, order: "created_at.desc", limit: String(limit) });
      plans = plans || [];
      return json({ ok: true, plans, linkedUserIds: userIds, email });
    }

    if (action === "saveMyPlan") {
      const plan = payload.plan && typeof payload.plan === "object" ? payload.plan : {};
      const name = text(plan.name) || "\u672a\u547d\u540d\u65b9\u6848";
      const planSubject = plan.subject === "physics" ? "physics" : "history";
      const mode = plan.recommend_mode === "rank" ? "rank" : "score";
      const rows = await api.insert("saved_volunteer_plans", {
        user_id: callerId,
        name,
        subject: planSubject,
        recommend_mode: mode,
        composite_score: plan.composite_score ?? null,
        candidate_rank: plan.candidate_rank ?? null,
        filters: plan.filters && typeof plan.filters === "object" ? plan.filters : {},
        recommendations: Array.isArray(plan.recommendations) ? plan.recommendations : [],
        updated_at: new Date().toISOString()
      });
      return json({ ok: true, plan: rows?.[0] || null });
    }

    if (action === "updateMyPlan") {
      const planId = text(payload.planId);
      if (!planId) return json({ error: "\u7f3a\u5c11\u65b9\u6848\u7f16\u53f7" }, 400);
      const plan = payload.plan && typeof payload.plan === "object" ? payload.plan : {};
      const rows = await api.patch("saved_volunteer_plans", { id: "eq." + planId, user_id: "eq." + callerId }, {
        name: text(plan.name) || "\u672a\u547d\u540d\u65b9\u6848",
        subject: plan.subject === "physics" ? "physics" : "history",
        recommend_mode: plan.recommend_mode === "rank" ? "rank" : "score",
        composite_score: plan.composite_score ?? null,
        candidate_rank: plan.candidate_rank ?? null,
        filters: plan.filters && typeof plan.filters === "object" ? plan.filters : {},
        recommendations: Array.isArray(plan.recommendations) ? plan.recommendations : [],
        updated_at: new Date().toISOString()
      });
      return json({ ok: true, plan: rows?.[0] || null });
    }

    if (action === "deleteMySavedPlan") {
      const planId = text(payload.planId);
      if (!planId) return json({ error: "\u7f3a\u5c11\u65b9\u6848\u7f16\u53f7" }, 400);
      await api.remove("saved_volunteer_plans", { id: "eq." + planId, user_id: "eq." + callerId });
      return json({ ok: true });
    }

    if (!isAdmin) return json({ error: "没有用户管理权限" }, 403);


    if (action === "paymentRequests") {
      const status = text(payload.status) || "pending";
      const params = { select: "*", order: "created_at.desc", limit: "200", status: status !== "all" ? `eq.${status}` : undefined };
      const requests = await api.select("payment_requests", params);
      return json({ ok: true, requests: requests || [] });
    }

    if (action === "approvePaymentRequest") {
      const requestId = text(payload.requestId);
      if (!requestId) return json({ error: "\u7f3a\u5c11\u7533\u8bf7\u7f16\u53f7" }, 400);
      const rows = await api.select("payment_requests", { select: "*", id: `eq.${requestId}`, limit: "1" });
      const requestRow = rows?.[0];
      if (!requestRow) return json({ error: "\u7533\u8bf7\u4e0d\u5b58\u5728" }, 404);
      const targetUserId = requestRow.user_id;
      const generationLimit = Math.max(quotaLimit(payload.generationLimit), 3);
      const paidUntil = payload.paidUntil || null;
      const quotaUpdate = {
        user_id: targetUserId,
        generation_limit: generationLimit,
        rank_access: payload.rankAccess !== false,
        manual_access: payload.manualAccess !== false,
        pdf_access: payload.pdfAccess !== false,
        paid_until: paidUntil,
        unlimited: payload.unlimited === true,
        updated_at: new Date().toISOString()
      };
      if (payload.resetUsed === true) quotaUpdate.generation_used = 0;
      await api.upsert("user_quotas", quotaUpdate, { on_conflict: "user_id" });
      const profileUpdates = { active: true, expires_at: Object.prototype.hasOwnProperty.call(payload, "paidUntil") ? paidUntil : undefined };
      await api.patch("profiles", { id: `eq.${targetUserId}` }, profileUpdates, "return=minimal").catch(() => null);
      await api.patch("payment_requests", { id: `eq.${requestId}` }, {
        status: "approved",
        admin_note: text(payload.adminNote),
        reviewed_by: callerId,
        reviewed_at: new Date().toISOString()
      }, "return=minimal");
      return json({ ok: true });
    }

    if (action === "rejectPaymentRequest") {
      const requestId = text(payload.requestId);
      if (!requestId) return json({ error: "\u7f3a\u5c11\u7533\u8bf7\u7f16\u53f7" }, 400);
      await api.patch("payment_requests", { id: `eq.${requestId}` }, {
        status: "rejected",
        admin_note: text(payload.adminNote),
        reviewed_by: callerId,
        reviewed_at: new Date().toISOString()
      }, "return=minimal");
      return json({ ok: true });
    }

    if (action === "savedPlans") {
      const limit = Math.min(Math.max(Math.floor(Number(payload.limit || 100)), 1), 300);
      const plans = await api.select("saved_volunteer_plans", { select: "*", order: "created_at.desc", limit: String(limit) });
      const ids = [...new Set((plans || []).map(plan => plan.user_id).filter(Boolean))];
      const profiles = ids.length ? await api.select("profiles", { select: "id,email,display_name", id: `in.(${ids.join(",")})` }) : [];
      const profileMap = new Map((profiles || []).map(profile => [profile.id, profile]));
      return json({ ok: true, plans: (plans || []).map(plan => {
        const profile = profileMap.get(plan.user_id) || {};
        const recommendations = Array.isArray(plan.recommendations) ? plan.recommendations : [];
        return {
          ...plan,
          user_email: profile.email || "",
          user_display_name: profile.display_name || "",
          recommendation_count: recommendations.length
        };
      }) });
    }

    if (action === "deleteSavedPlan") {
      const planIds = Array.isArray(payload.planIds)
        ? payload.planIds.map((id) => text(id)).filter(Boolean)
        : [text(payload.planId)].filter(Boolean);
      const uniqueIds = [...new Set(planIds)].slice(0, 100);
      if (!uniqueIds.length) return json({ error: "\u7f3a\u5c11\u65b9\u6848\u7f16\u53f7" }, 400);
      if (uniqueIds.length === 1) {
        await api.remove("saved_volunteer_plans", { id: "eq." + uniqueIds[0] });
      } else {
        await api.remove("saved_volunteer_plans", { id: "in.(" + uniqueIds.join(",") + ")" });
      }
      return json({ ok: true, deleted: uniqueIds.length });
    }

    if (action === "list") {
      const authUsers = await api.listUsers();
      const ids = authUsers.map(user => user.id).filter(Boolean);
      const profiles = ids.length ? await api.select("profiles", { select: "id,email,display_name,role,active,expires_at,created_at", id: `in.(${ids.join(",")})` }) : [];
      let quotas = [];
      let quotaWarning = "";
      if (ids.length) {
        try {
          quotas = await api.select("user_quotas", { select: "user_id,generation_limit,generation_used,unlimited,score_trial_limit,score_trial_used,rank_access,manual_access,pdf_access,paid_until,updated_at", user_id: `in.(${ids.join(",")})` });
        } catch (error) {
          quotaWarning = errorMessage(error);
        }
      }
      const profileMap = new Map((profiles || []).map(profile => [profile.id, profile]));
      const quotaMap = new Map((quotas || []).map(quota => [quota.user_id, quota]));
      const users = authUsers.map(user => {
        const profile = profileMap.get(user.id) || { display_name: user.user_metadata?.display_name || "", role: "user", active: true, expires_at: null };
        const quota = quotaMap.get(user.id);
        const adminUser = ["admin", "superadmin"].includes(profile.role);
        return {
          id: user.id,
          email: user.email || "",
          lastSignInAt: user.last_sign_in_at || null,
          createdAt: user.created_at,
          ...profile,
          generation_limit: quota?.generation_limit ?? 0,
          generation_used: quota?.generation_used ?? 0,
          score_trial_limit: quota?.score_trial_limit ?? 1,
          score_trial_used: quota?.score_trial_used ?? 0,
          rank_access: adminUser || quotaAccess(quota).rankAccess,
          manual_access: adminUser || quotaAccess(quota).manualAccess,
          pdf_access: adminUser || quotaAccess(quota).pdfAccess,
          paid_until: quota?.paid_until ?? null,
          paid_active: adminUser || quotaAccess(quota).paidActive,
          unlimited: adminUser || quota?.unlimited === true
        };
      });
      return json({ users, callerId, quotaWarning });
    }

    if (action === "create") {
      const email = text(payload.email).toLowerCase();
      const password = text(payload.password);
      const displayName = text(payload.displayName);
      const role = payload.role === "admin" && caller.role === "superadmin" ? "admin" : "user";
      const expiresAt = payload.expiresAt || null;
      if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: "邮箱格式不正确" }, 400);
      if (password.length < 8) return json({ error: "初始密码至少需要 8 位" }, 400);
      const data = await api.createUser({ email, password, email_confirm: true, user_metadata: { display_name: displayName } });
      try {
        await api.upsert("profiles", { id: data.id, email, display_name: displayName, role, active: true, expires_at: expiresAt }, { on_conflict: "id" });
      } catch (error) {
        await api.deleteUser(data.id);
        throw error;
      }
      const accessRequested = payload.unlimited === true || payload.rankAccess === true || payload.manualAccess === true || payload.pdfAccess === true;
      const generationLimit = accessRequested ? Math.max(quotaLimit(payload.generationLimit), 3) : quotaLimit(payload.generationLimit);
      await api.upsert("user_quotas", { user_id: data.id, generation_limit: generationLimit, generation_used: 0, score_trial_limit: trialLimit(payload.scoreTrialLimit), score_trial_used: 0, rank_access: payload.rankAccess === true, manual_access: payload.manualAccess === true, pdf_access: payload.pdfAccess === true, paid_until: payload.paidUntil || null, unlimited: payload.unlimited === true }, { on_conflict: "user_id" });
      return json({ ok: true, id: data.id });
    }

    const userId = text(payload.userId);
    if (!userId) return json({ error: "缺少用户编号" }, 400);

    if (action === "quota") {
      const accessRequested = payload.unlimited === true || payload.rankAccess === true || payload.manualAccess === true || payload.pdfAccess === true;
      const generationLimit = accessRequested ? Math.max(quotaLimit(payload.generationLimit), 3) : quotaLimit(payload.generationLimit);
      const updates = { user_id: userId, generation_limit: generationLimit, score_trial_limit: trialLimit(payload.scoreTrialLimit), rank_access: payload.rankAccess === true, manual_access: payload.manualAccess === true, pdf_access: payload.pdfAccess === true, paid_until: payload.paidUntil || null, unlimited: payload.unlimited === true, updated_at: new Date().toISOString() };
      if (payload.resetUsed === true) updates.generation_used = 0;
      if (payload.resetTrial === true) updates.score_trial_used = 0;
      await api.upsert("user_quotas", updates, { on_conflict: "user_id" });
      return json({ ok: true });
    }

    if (action === "update") {
      if (userId === callerId && payload.active === false) return json({ error: "不能停用当前登录账号" }, 400);
      const updates = {};
      if (typeof payload.active === "boolean") updates.active = payload.active;
      if (Object.prototype.hasOwnProperty.call(payload, "expiresAt")) updates.expires_at = payload.expiresAt || null;
      if (Object.prototype.hasOwnProperty.call(payload, "displayName")) updates.display_name = text(payload.displayName);
      if (payload.role && caller.role === "superadmin" && userId !== callerId) updates.role = ["user", "admin"].includes(payload.role) ? payload.role : "user";
      await api.patch("profiles", { id: `eq.${userId}` }, updates, "return=minimal");
      return json({ ok: true });
    }

    if (action === "resetPassword") {
      const password = text(payload.password);
      if (password.length < 8) return json({ error: "新密码至少需要 8 位" }, 400);
      await api.updateUser(userId, { password });
      return json({ ok: true });
    }

    return json({ error: "未知操作" }, 400);
  } catch (error) {
    const message = errorMessage(error);
    if (/payment_requests|schema cache|PGRST205|relation/i.test(message)) {
      return json({ error: "\u4ed8\u6b3e\u7533\u8bf7\u8868\u5c1a\u672a\u90e8\u7f72\uff0c\u8bf7\u5148\u5728 Supabase SQL Editor \u6267\u884c 20260625090000_payment_requests.sql" }, 500);
    }
    return json({ error: message }, error?.status || 500);
  }
});
