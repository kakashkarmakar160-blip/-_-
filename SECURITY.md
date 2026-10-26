# নিরাপত্তা নির্দেশিকা
- Supabase service/secret key কখনো `public/`, HTML, browser JavaScript, data.json বা Git-এ রাখবেন না।
- `.env` Git-এ commit করবেন না; hosting environment variables ব্যবহার করুন।
- বর্তমান server middleware এবং API scaffold production-ready নয়; বাস্তব সদস্য/হিসাবের ডেটা ব্যবহারের আগে Auth, role authorization, validation, RLS ও tests সম্পূর্ণ করতে হবে।
- ডেমো `data.json`-এর পাসওয়ার্ড ফিল্ড ফাঁকা করা হয়েছে; Supabase Auth ব্যবহার করুন।
