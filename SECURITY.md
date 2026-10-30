# Security notes
- Never commit a Supabase service_role/secret key. Keep it only in Supabase Edge Function Secrets.
- Browser code contains only the publishable key. RLS protects table access.
- Passwords are never stored in public.members or client-side storage. Auth accounts are created through the Edge Function.
- Do not reuse any password previously pasted into chat or embedded in the old demo code. Rotate it before live use.
- Admin access is checked server-side against active members.role='admin'; hiding buttons is not authorization.
- The Edge Function is deployed with --no-verify-jwt to allow member-ID login; protected actions manually validate the bearer token and admin role.
- Keep member personal information to the minimum needed. Do not expose addresses or dates of birth in public reports.
