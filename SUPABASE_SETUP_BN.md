# Supabase সেটআপ (বাংলা)

1. Supabase Dashboard → Project Settings → API Keys থেকে Project URL ও Publishable key নিন।
2. `config.js`-এ URL এবং `publishableKey` বসান। `service_role`/Secret key এখানে দেবেন না।
3. SQL Editor-এ `supabase-policies.sql` চালান। এটি ধরে নেয় আগের সেটআপের `public.is_current_user_admin()` ফাংশন আছে এবং প্রয়োজনীয় টেবিল তৈরি হয়েছে।
4. Authentication → Users-এ সদস্যদের Auth user তৈরি করুন। `public.members.id`-এ Auth user UUID, `member_id`-এ সমিতির সদস্য নম্বর, `name`, `role`, `status` দিন।
5. অ্যাডমিন row-তে `role=admin`, `status=active` থাকতে হবে। `is_current_user_admin()` ফাংশন এই row দেখে অনুমতি দেয়।
6. GitHub Pages-এ `index.html`, `app.js`, `config.js`, `durga-samiti-logo.png` প্রকাশ করুন।

## নিরাপত্তা ও ডেটা
- Frontend-এ কেবল Publishable key ব্যবহার করুন; database access RLS policy দ্বারা নিয়ন্ত্রিত।
- অ্যাপ নিজে `localStorage`, `sessionStorage` বা `data.json` ব্যবহার করে না। Supabase auth session-ও persist করা হয় না, তাই refresh-এ আবার লগইন করতে হবে।
- কোনো Secret/service_role key browser code বা GitHub repository-তে রাখবেন না।
