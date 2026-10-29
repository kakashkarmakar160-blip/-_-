# দুর্গা সমিতি — Supabase Database Edition

এই সংস্করণে ওয়েবসাইটের সদস্য/হিসাব/চ্যাট/গ্যালারি ডেটা `localStorage`, `sessionStorage` বা `data.json`-এ সংরক্ষণ করা হয় না। অ্যাপের ডেটা Supabase Database থেকে পড়ে এবং Supabase-এ লিখে। লগইন সেশন ইচ্ছাকৃতভাবে শুধু মেমরিতে থাকে; পেজ রিফ্রেশ করলে আবার লগইন করতে হবে।

## ১) `config.js` সেট করুন
`publishableKey`-এর জায়গায় Supabase Dashboard → Project Settings → API Keys থেকে **Publishable key** বসান। `service_role` বা Secret key কখনো ব্যবহার করবেন না। URL আগে থেকেই প্রকল্পের URL হিসেবে বসানো আছে; নিজের প্রকল্প আলাদা হলে সেটি পরিবর্তন করুন।

## ২) Database/RLS
Supabase SQL Editor-এ `supabase-policies.sql` চালান। এটি বিদ্যমান রেকর্ড মুছে না, কিন্তু এই ফাইলে উল্লিখিত একই নামের policies পুনরায় তৈরি করে। `public.is_current_user_admin()` ফাংশনটি আগে তৈরি থাকা দরকার। টেবিলগুলোও আগে থেকে থাকতে হবে।

## ৩) Auth এবং member row
Supabase Authentication-এ প্রত্যেক সদস্যের Auth user তৈরি করতে হবে। `public.members.id` অবশ্যই সেই Auth user-এর UUID-এর সঙ্গে মিলতে হবে। একই row-তে `member_id`, `name`, `role` (`admin` বা `member`) এবং `status` (`active` বা `inactive`) পূরণ করুন। অ্যাডমিনের জন্য `role='admin'`, `status='active'` দিতে হবে। এই সংস্করণের লগইন ইমেল ও পাসওয়ার্ড দিয়ে হয়।

## ৪) GitHub Pages
`index.html`, `app.js`, `config.js`, `durga-samiti-logo.png` এবং সদস্য ছবিগুলো repository root-এ রাখুন। Commit/push করার পরে GitHub Pages প্রকাশিত হলে সাইট খুলুন।

## এই সংস্করণের কাজ
- Supabase Auth login/logout (session browser storage-এ persist হয় না)
- Supabase থেকে সদস্য, চাঁদা, খরচ, গ্যালারি, chat এবং dashboard totals পড়া
- অ্যাডমিন: সদস্য যোগ/নাম-অবস্থা সম্পাদনা/মুছুন, চাঁদা যোগ, খরচ যোগ, গ্যালারি URL যোগ
- লগইন করা সদস্য: ডেটা দেখা এবং গ্রুপ চ্যাটে মেসেজ পাঠানো (RLS অনুমতি সাপেক্ষে)

## গুরুত্বপূর্ণ সীমা
- এই ZIP-এ আগের ডেমো UI-এর সব ফিচার/ফর্ম পুনরায় বানানো হয়নি; এটি database-only starter সংস্করণ, পুরোনো localStorage demo flow-এর এক-এক অনুলিপি নয়।
- নতুন সদস্য যোগ করার আগে Supabase Auth-এ তাঁর account তৈরি করে UUID নিতে হবে।
- গ্যালারি যোগ করতে media-র public URL দিতে হবে; এই সংস্করণে Storage upload UI নেই।
- Supabase policy বা schema-তে পার্থক্য থাকলে নির্দিষ্ট কাজ RLS/column error দিতে পারে।
- RLS-এ authenticated সদস্যদের সদস্য/চাঁদা/খরচ/গ্যালারি/চ্যাট পড়ার অনুমতি আছে; ব্যক্তিগত আর্থিক তথ্য সদস্যদের থেকে লুকাতে চাইলে SELECT policies আলাদা করে সীমিত করুন।
