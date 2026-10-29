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

  // Health check: does not parse a request body or access private records.
  if (req.method === "GET") {
    return respond({ success: true, service: "durga-samiti-api", message: "Edge Function is running" });
  }

  if (req.method !== "POST") {
    return respond({ success: false, error: "Method not allowed" }, 405);
  }

  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return respond({ success: false, error: "Login required" }, 401);
  }

  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
  if (!url || !key) return respond({ success: false, error: "Supabase environment configuration missing" }, 500);

  const supabase = createClient(url, key, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return respond({ success: false, error: "Invalid or expired login" }, 401);

  let body: Record<string, unknown>;
  try {
    const value: unknown = await req.json();
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return respond({ success: false, error: "Request body must be a JSON object" }, 400);
    }
    body = value as Record<string, unknown>;
  } catch {
    return respond({ success: false, error: "Invalid JSON body" }, 400);
  }

  // Deliberately no data mutations here until each action has explicit RLS-backed authorization.
  return respond({
    success: true,
    message: "Login verified; no data changes were made",
    userId: data.user.id,
    action: typeof body.action === "string" ? body.action : null,
  });
});
