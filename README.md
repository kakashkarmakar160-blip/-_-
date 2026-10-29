# দুর্গা সমিতি — Supabase Database Edition

বাংলা responsive website starter. অ্যাপের business data browser storage বা `data.json`-এ নয়, Supabase Database-এ থাকে। লগইন ফর্মে সদস্য ID ও পাসওয়ার্ড ব্যবহার করা হয়; Supabase Auth-এর ইমেলটি ব্যাকএন্ডে অভ্যন্তরীণভাবে ম্যাপ করা হয়।

## শুরু করার আগে
1. `config.js`-এ Project URL ও Publishable key যাচাই করুন। `service_role` key সেখানে দেবেন না।
2. `SUPABASE_SETUP_BN.md` পড়ুন। Edge Function-এর কোড Supabase Dashboard-এ আলাদাভাবে deploy এবং Secrets সেট করতে হবে।
3. প্রতিটি `public.members.id`-এর জন্য একই UUID-র Supabase Auth user থাকতে হবে। `member_id`-ই লগইন ID।
4. টেবিল ও RLS policies আপনার বর্তমান schema-র সঙ্গে মিলিয়ে নিন।

## GitHub Pages
Root-এ `index.html`, `app.js`, `config.js`, `durga-samiti-logo.png` রাখুন। Commit করার পরে GitHub Pages deploy শেষ হলে সাইট রিফ্রেশ করুন।

## নিরাপত্তা
কোনো Secret/service-role key ব্রাউজার বা GitHub-এ রাখবেন না। লগইন সেশন শুধু মেমরিতে থাকে; রিফ্রেশের পর আবার লগইন করতে হবে।
