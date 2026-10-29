import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};
function respond(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method === "GET") return respond({ success: true, service: "durga-samiti-api", message: "Edge Function is running" });
  if (req.method !== "POST") return respond({ success: false, error: "Method not allowed" }, 405);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return respond({ success: false, error: "Invalid JSON object" }, 400);
    body = parsed as Record<string, unknown>;
  } catch { return respond({ success: false, error: "Invalid JSON body" }, 400); }

  if (body.action !== "login") {
    return respond({ success: false, error: "Unsupported action" }, 400);
  }
  const memberId = typeof body.memberId === "string" ? body.memberId.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!memberId || !password || memberId.length > 100 || password.length > 256) {
    return respond({ success: false, error: "সদস্য ID ও পাসওয়ার্ড দিন।" }, 400);
  }

  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !anonKey || !serviceKey) return respond({ success: false, error: "Edge Function Secrets অসম্পূর্ণ। SUPABASE_URL, SUPABASE_ANON_KEY এবং SUPABASE_SERVICE_ROLE_KEY সেট করুন।" }, 500);

  // Service-role key is used only inside the Edge Function; never send it to the browser.
  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: member, error: memberError } = await admin.from("members")
    .select("id, member_id, name, role, status")
    .eq("member_id", memberId).maybeSingle();
  if (memberError) return respond({ success: false, error: "সদস্যের তথ্য যাচাই করা যায়নি।" }, 500);
  if (!member || member.status !== "active") return respond({ success: false, error: "সদস্য ID অথবা পাসওয়ার্ড সঠিক নয়, অথবা অ্যাকাউন্ট নিষ্ক্রিয়।" }, 401);

  const { data: authUser, error: authUserError } = await admin.auth.admin.getUserById(member.id);
  if (authUserError || !authUser.user?.email) return respond({ success: false, error: "এই সদস্যের Auth অ্যাকাউন্ট তৈরি/সংযুক্ত করা নেই।" }, 401);

  const publicClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: signedIn, error: signInError } = await publicClient.auth.signInWithPassword({ email: authUser.user.email, password });
  if (signInError || !signedIn.session || !signedIn.user) return respond({ success: false, error: "সদস্য ID অথবা পাসওয়ার্ড সঠিক নয়।" }, 401);
  return respond({ success: true, session: { access_token: signedIn.session.access_token, refresh_token: signedIn.session.refresh_token }, userId: signedIn.user.id });
});
