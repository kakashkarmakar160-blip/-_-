# দুর্গা সমিতি — ওয়েবসাইট ZIP

## এই ZIP-এ কী আছে
- আগের `index.html`-এর ডিজাইন ও ইন্টারফেস রাখা হয়েছে; HTML-এর CSS internal `<style>`-এ আছে।
- মূল inline JavaScript আলাদা `js/app.js` ফাইলে সরানো হয়েছে।
- `data.json`-এর বিদ্যমান ডেমো ডেটা রাখা হয়েছে; সদস্যদের plain-text demo password মুছে ফাঁকা করা হয়েছে।
- Supabase config, migration/function scaffold এবং Node.js server scaffold যোগ করা হয়েছে।

## Supabase সেটআপ
1. `js/config.js`-এ Project URL এবং Publishable Key বসান. Secret/service_role key এখানে বসাবেন না.
2. Supabase Dashboard-এ Auth, tables, RLS policies, Storage policies এবং function code যাচাই করুন. `supabase/migrations/`-এ আপনার বর্তমান schema/policies-এর migration এখনও যোগ করতে হবে।
3. Edge Function-এর বর্তমান কোড কেবল health/demo response দেয়; এটি এখনো সদস্য/চাঁদা/খরচের CRUD করে না।
4. বাস্তব ডেটা ব্যবহার করার আগে Auth ও role-based authorization, API validation এবং RLS পরীক্ষা সম্পূর্ণ করুন।

## Node.js সার্ভার
Node.js 20+ ইনস্টল করে প্রজেক্ট ফোল্ডারে চালান:
```bash
npm install
cp .env.example .env
npm run dev
```
`server/server.js` একটি প্রাথমিক static/health server scaffold। নিরাপত্তা middleware ইচ্ছাকৃতভাবে অসম্পূর্ণ রাখা হয়েছে; production-এ প্রকাশের আগে Auth/authorization implement করতে হবে।

## গুরুত্বপূর্ণ সীমাবদ্ধতা
এই ZIP হলো আগের ফাইলের ভিত্তিতে পুনর্গঠিত starter package, সম্পূর্ণ Supabase integration নয়। UI-এর সব ফিচার ডেটাবেসে সিঙ্ক হবে—এমন দাবি করা হচ্ছে না। `data.json` হলো ডেমো/স্থানান্তরের ডেটা, মূল অনলাইন ডেটাবেস নয়।
