# দুর্গা সমিতি ওয়েবসাইট

বাংলা responsive website. মূল UI `index.html`-এ; demo records `data.json`-এ। `config.js`-এ public Supabase configuration এবং `api.js`-এ helper functions রয়েছে।

## চালানো
GitHub Pages-এর root-এ `index.html`, `config.js`, `api.js`, `data.json` ও ছবি রাখুন। Supabase Publishable Key বসানোর নিয়ম `SUPABASE_SETUP_BN.md`-এ আছে।

## বর্তমান অবস্থা
এই প্রকল্পে UI এখনও LocalStorage demo flow ব্যবহার করে। Edge Function health-check কাজ করা মানে members/contributions/expenses/gallery/chat স্বয়ংক্রিয়ভাবে sync হচ্ছে না। Supabase Auth token ও RLS-backed CRUD wiring সম্পূর্ণ করতে হবে। Production login হিসেবে demo password ব্যবহার করবেন না।

## নিরাপত্তা
কোনো `service_role` বা secret key browser-এ দেবেন না। `SUPABASE_SETUP_BN.md` এবং `SECURITY.md` পড়ুন।
