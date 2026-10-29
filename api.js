/* Supabase helpers for the Durga Samiti website.
 * This file intentionally does not pretend that localStorage data is synced.
 * Read/write functions require a real Supabase Auth access token and database RLS.
 */
export function getSupabaseConfig() {
  const c = window.DURGA_SUPABASE_CONFIG || {};
  const url = String(c.url || "").replace(/\/$/, "");
  const key = String(c.publishableKey || "");
  if (!/^https:\/\/[a-z0-9.-]+\.supabase\.co$/i.test(url) || !key || key.includes("PASTE_YOUR_")) {
    throw new Error("config.js-এ Supabase URL ও Publishable Key বসান।");
  }
  return { url, key, functionUrl: c.functionUrl || `${url}/functions/v1/durga-samiti-api` };
}

export async function testEdgeFunction() {
  const { key, functionUrl } = getSupabaseConfig();
  const response = await fetch(functionUrl, {
    method: "GET",
    headers: { apikey: key }
  });
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { throw new Error(`Function JSON উত্তর দেয়নি (HTTP ${response.status})`); }
  if (!response.ok || data.success !== true) throw new Error(data.error || `সংযোগ ব্যর্থ (HTTP ${response.status})`);
  return data;
}

export async function selectTable(table, accessToken, query = "select=*") {
  if (!accessToken) throw new Error("Supabase Auth access token প্রয়োজন।");
  if (!/^[a-z_]+$/i.test(table)) throw new Error("Invalid table name");
  const { url, key } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${accessToken}` }
  });
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { throw new Error(`Database JSON উত্তর দেয়নি (HTTP ${response.status})`); }
  if (!response.ok) throw new Error(data?.message || data?.hint || `Database request failed (HTTP ${response.status})`);
  return data;
}

export const apiStatus = { configured: true, syncEnabled: false };
