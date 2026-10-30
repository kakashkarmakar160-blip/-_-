# দুর্গা সমিতি — Supabase সংযুক্ত সংস্করণ

এই প্যাকেজটি একটি নতুন, ছোট ও Supabase-ভিত্তিক ওয়েব ইন্টারফেস। ব্যবসার হিসাব আর browser Local Storage-এ রাখা হয় না। সদস্যরা Supabase Auth দিয়ে লগইন করবেন; হিসাবের তালিকা Supabase থেকে পড়বে এবং Realtime চালু থাকলে অন্য ডিভাইসেও নতুন হিসাব দেখা যাবে।

## আগে যা বুঝে নেবেন
- `config.js`-এ কেবল Project URL ও Publishable Key থাকবে। `service_role`/secret key কখনো GitHub, HTML, JavaScript বা চ্যাটে দেবেন না।
- Edge Function-এ `SUPABASE_SERVICE_ROLE_KEY` Secret হিসেবে রাখতে হবে।
- পুরোনো ডেমো পাসওয়ার্ডগুলো `app.js`-এ রাখা হয়নি। আগের ডেমো পাসওয়ার্ডগুলো প্রকাশিত হয়েছে ধরে নিয়ে নতুন পাসওয়ার্ড দিন।
- এই প্যাকেজের রিপোর্ট `ds_transactions` টেবিল ব্যবহার করে। পুরোনো `contributions` ও `expenses` ডেটা কপি করতে চাইলে ঐচ্ছিক `002_import_old_finance.sql` একবার চালাতে হবে।

## ধাপ ১ — Database
1. Supabase Dashboard → SQL Editor খুলুন।
2. `supabase/migrations/001_supabase_sync.sql`-এর সম্পূর্ণ SQL চালান। এটি পুরোনো `members` রেকর্ড মুছে না দিয়ে `auth_user_id` ও `auth_email` কলাম যোগ করে এবং `ds_transactions` তৈরি করে।
3. SQL-এ যদি duplicate `member_id` বা পুরোনো টেবিল/কলাম না থাকার error আসে, থামুন—error-এর screenshot পাঠান। অনুমান করে অন্য SQL চালাবেন না।
4. পুরোনো অর্থের হিসাব কপি করতে চাইলে আগে `002_import_old_finance.sql`-এর preview SELECT চালিয়ে ফল দেখুন; তারপর insert অংশ একবার চালান। পুনরায় চালালে duplicate এড়ানোর চেষ্টা আছে, তবু আগে backup নিন।
5. Supabase → Authentication → Users-এ নিশ্চিত করুন অ্যাডমিনের Auth user আছে। Migration স্বয়ংক্রিয়ভাবে একই UUID-র member row-কে Auth user-এর সঙ্গে যুক্ত করে এবং `auth_email` পূরণ করে।

## ধাপ ২ — Edge Function Secret ও Deploy
Supabase Dashboard → Edge Functions → Secrets-এ এই Secret যোগ করুন:
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: Project Settings → API থেকে Secret/service_role key (শুধু Supabase Secrets-এ; কখনো GitHub বা চ্যাটে নয়)।

`SUPABASE_URL` এবং `SUPABASE_ANON_KEY` সাধারণত Function runtime-এ আগে থেকেই থাকে। না থাকলে Dashboard Secrets-এ যথাযথ project URL এবং anon/publishable key যোগ করুন।

এই ফোল্ডারটি `supabase/functions/durga-samiti-api/` নামে Supabase CLI দিয়ে deploy করুন। Login action অননুমোদিত অবস্থায় শুরু হয় বলে deploy command-এ `--no-verify-jwt` ব্যবহার করতে হবে; Function-এর ভেতরে login ও admin action-এর যাচাই করা আছে:

```bash
supabase functions deploy durga-samiti-api --no-verify-jwt
```

## ধাপ ৩ — Publishable Key বসান
`config.js` খুলে `publishableKey`-এর placeholder-এর জায়গায় Project-এর Publishable Key বসান। `service_role` key এখানে দেবেন না। Project URL আগে থেকেই সেট করা আছে; নিজের project আলাদা হলে সেটিও মিলিয়ে নিন।

## ধাপ ৪ — GitHub Pages
`index.html`, `style.css`, `app.js`, `config.js`, `assets/` এবং `supabase/` GitHub repository-তে আপলোড করুন। GitHub Pages root folder থেকে publish হবে এমনভাবে রাখুন। Edge Function source আলাদা করে Supabase-এ deploy করতে হবে; GitHub Pages সেটি নিজে deploy করে না।

## ধাপ ৫ — পুরোনো সদস্যদের Auth চালু করা
- Migration যদি অ্যাডমিনের Auth UID-কে `members.id`-এর সঙ্গে মেলায়, অ্যাডমিনের `auth_user_id` ও `auth_email` পূরণ হবে।
- পুরোনো অন্য সদস্যদের row-তে `auth_user_id` ফাঁকা থাকলে অ্যাডমিন লগইন করে **সদস্য পরিচালনা → লগইন তৈরি** চাপবেন এবং নতুন অস্থায়ী পাসওয়ার্ড দেবেন। পাসওয়ার্ড সদস্যকে আলাদা নিরাপদ মাধ্যমে দিন।
- নতুন সদস্য যোগ করলে Auth user ও member row একসঙ্গে তৈরি হবে।

## কী কী কাজ করে
- সদস্য ID + পাসওয়ার্ড দিয়ে লগইন (Edge Function ID-কে Auth email-এ map করে)।
- সদস্যরা Supabase-এর রিপোর্ট/হিসাব দেখতে পারেন।
- অ্যাডমিন হিসাব যোগ, বিবরণ/টাকার পরিমাণ সম্পাদনা ও মুছতে পারেন।
- অ্যাডমিন সদস্য যোগ করতে পারেন; পুরোনো সদস্যের নাম, জন্মতারিখ, ঠিকানা ও সক্রিয়/নিষ্ক্রিয় অবস্থা সম্পাদনা করতে পারেন।
- নতুন/পুরোনো সদস্যের Auth login provision করা যায়।
- Realtime subscription থাকায় নতুন হিসাব অন্য লগইন করা ডিভাইসে আপডেট হয়।

## সীমাবদ্ধতা / সতর্কতা
- এই সংস্করণটি মূল পুরোনো ওয়েবসাইটের সব Gallery/Chat/পুরোনো পেজ পুনর্নির্মাণ করে না; এটি লগইন, সদস্য পরিচালনা এবং হিসাব/রিপোর্টের Supabase workflow-এর জন্য আলাদা lightweight interface।
- সদস্যের ঠিকানা `member_profiles`-এ রাখা হয়; ব্যক্তিগত তথ্য অপ্রয়োজনে যোগ করবেন না।
- নতুন সদস্যের পাসওয়ার্ড অন্তত ১০ অক্ষরের হওয়া দরকার। প্রথম লগইনের পর সদস্যকে পাসওয়ার্ড পরিবর্তন করতে বলুন।
- `ds_transactions`-এর `kind` (bill/chanda/donation/expense) ও `direction` (income/expense) আলাদা। যেমন চাঁদা/অনুদান সাধারণত income হবে; খরচ expense হবে।
- লাইভ ব্যবহারের আগে test member দিয়ে দুইটি আলাদা browser/device-এ পরীক্ষা করুন।
