# দুর্গা সমিতি — Database-only সেটআপ (বাংলা)

## এই ZIP-এ কী বদলেছে
- লগইন স্ক্রিনে ইমেলের বদলে **সদস্য ID + পাসওয়ার্ড** চাওয়া হয়।
- সদস্য/চাঁদা/খরচ/গ্যালারি/চ্যাট ডেটা Supabase Database থেকে পড়ে/লেখে।
- অ্যাপের ডেটা, লগইন সেশন `localStorage`, `sessionStorage` বা `data.json`-এ রাখা হয় না। রিফ্রেশ করলে আবার লগইন করতে হবে।
- ব্রাউজারে `service_role` বা Secret key রাখা হয়নি।

## ১. config.js
`publishableKey`-এ নিজের Supabase Dashboard → Project Settings → API Keys-এর **Publishable key** বসান। `service_role`/Secret key এখানে কখনো বসাবেন না।

## ২. Edge Function কোড আপডেট
এই ফাইলটি Supabase-এ deploy করতে হবে:
`supabase/functions/durga-samiti-api/index.ts`

Supabase Dashboard → Edge Functions → `durga-samiti-api` → Code-এ এই ফাইলের সম্পূর্ণ কোড বসিয়ে Deploy করুন। `config.toml`-এ login endpoint-এর জন্য `verify_jwt = false` রাখা হয়েছে, কারণ লগইনের আগে JWT থাকে না। Function নিজে শুধু `action=login` গ্রহণ করে।

## ৩. Edge Function Secrets
Supabase Dashboard → Edge Functions → Secrets-এ এই তিনটি secret থাকতে হবে:
- `SUPABASE_URL` — Project URL
- `SUPABASE_ANON_KEY` অথবা `SUPABASE_PUBLISHABLE_KEY` — Publishable/anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Project-এর Secret/service-role key

**গুরুত্বপূর্ণ:** `SUPABASE_SERVICE_ROLE_KEY` শুধু Supabase Edge Function Secrets-এ থাকবে; GitHub, `config.js`, HTML বা ব্রাউজারে কখনো নয়।

## ৪. সদস্য ID দিয়ে লগইন কীভাবে কাজ করে
প্রত্যেক সদস্যের জন্য Supabase Authentication-এ একটি Auth user থাকতে হবে এবং তার UUID অবশ্যই `public.members.id`-এর সঙ্গে মিলতে হবে। `public.members.member_id`-এ যে ID আছে, সেটিই লগইন স্ক্রিনে ব্যবহার করবে। Auth user-এর ইমেলটি ব্যাকএন্ডে অভ্যন্তরীণভাবে ব্যবহৃত হয়; সদস্যকে লগইন স্ক্রিনে ইমেল লিখতে হয় না।

ইমেল confirmation/verification চালু না রাখতে চাইলে Supabase Dashboard → Authentication → Sign In / Providers → Email-এ **Confirm email** বন্ধ করুন (ড্যাশবোর্ডের লেবেল বদলাতে পারে)। এটি বন্ধ করলেও Auth user তৈরি থাকা এবং UUID মিল থাকা আবশ্যক।

## ৫. Database/RLS
বর্তমান টেবিলগুলো ও `public.is_current_user_admin()` ফাংশন আগে থেকেই থাকতে হবে। `supabase-policies.sql`-এ থাকা নীতিগুলো বর্তমান স্কিমার জন্য; স্কিমা আলাদা হলে অন্ধভাবে চালাবেন না।

## ৬. GitHub Pages
`index.html`, `app.js`, `config.js`, `durga-samiti-logo.png` এবং প্রয়োজনীয় ছবি রিপোজিটরির root-এ রাখুন। Supabase Edge Function কোড আলাদাভাবে Supabase-এ deploy করতে হবে; শুধু GitHub-এ ফাইল আপলোড করলেই Edge Function আপডেট হয় না।

## সীমাবদ্ধতা
এই ZIP বর্তমান Database-only starter UI-কে ঠিক করে; এটি পুরোনো Local Storage-ভিত্তিক সব স্ক্রিন/ফিচারের হুবহু পুনর্নির্মাণ নয়। নতুন সদস্যের Auth user তৈরি করা এখনও Supabase Dashboard বা নিরাপদ admin workflow থেকে করতে হবে।
