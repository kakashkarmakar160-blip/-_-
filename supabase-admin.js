// Server-only Supabase client goes here; read secrets from process.env. Never expose them to the browser.
export function getSupabaseAdmin(){ throw new Error("Configure server-side Supabase secret in hosting environment first."); }
