(function () {
  "use strict";

  const config = window.FujianArtSupabaseConfig || {};
  let client = null;

  function isEnabled() {
    return config.enabled === true;
  }

  function isConfigured() {
    return Boolean(config.url && config.anonKey && window.supabase && window.supabase.createClient);
  }

  function getClient() {
    if (!isConfigured()) return null;
    if (!client) {
      client = window.supabase.createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    }
    return client;
  }

  function loginUrl() {
    const next = encodeURIComponent(window.location.href);
    return `./login.html?next=${next}`;
  }

  function isExpired(expiresAt) {
    if (!expiresAt) return false;
    const value = new Date(expiresAt).getTime();
    return !Number.isFinite(value) || value <= Date.now();
  }

  async function getSession() {
    const supabaseClient = getClient();
    if (!supabaseClient) return null;
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    return data.session || null;
  }

  async function getProfile(userId) {
    const supabaseClient = getClient();
    const { data, error } = await supabaseClient
      .from("profiles")
      .select("id,email,display_name,role,active,expires_at")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return data || null;
  }

  async function getAuthorization() {
    if (!isEnabled()) return { ok: true, bypass: true, role: "setup" };
    if (!isConfigured()) return { ok: false, reason: "config" };

    const session = await getSession();
    if (!session) return { ok: false, reason: "login" };

    const profile = await getProfile(session.user.id);
    if (!profile) return { ok: false, reason: "profile", session };
    if (!profile.active) return { ok: false, reason: "inactive", session, profile };
    if (isExpired(profile.expires_at)) return { ok: false, reason: "expired", session, profile };

    return {
      ok: true,
      bypass: false,
      session,
      profile,
      role: profile.role || "user",
      isAdmin: ["admin", "superadmin"].includes(profile.role)
    };
  }

  async function guard(options) {
    const settings = options || {};
    let authorization;
    try {
      authorization = await getAuthorization();
    } catch (error) {
      return { ok: false, reason: "network", error };
    }

    if (authorization.reason === "login") {
      window.location.replace(loginUrl());
      return authorization;
    }
    if (authorization.ok && settings.admin && !authorization.bypass && !authorization.isAdmin) {
      return { ...authorization, ok: false, reason: "admin" };
    }
    return authorization;
  }

  async function signIn(email, password) {
    const supabaseClient = getClient();
    if (!supabaseClient) throw new Error("Supabase 尚未配置");
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const supabaseClient = getClient();
    if (supabaseClient) await supabaseClient.auth.signOut();
    window.location.replace("./login.html");
  }

  window.FujianArtAuth = {
    getClient,
    getSession,
    getAuthorization,
    guard,
    isConfigured,
    isEnabled,
    signIn,
    signOut
  };
})();
