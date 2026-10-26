import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
serve((_req) => new Response(JSON.stringify({ ok: true, message: "Durga Samiti API scaffold; database actions not implemented yet." }), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }));
