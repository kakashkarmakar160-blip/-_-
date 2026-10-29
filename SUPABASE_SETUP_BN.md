# দুর্গা সমিতি — Supabase সেটআপ (বাংলা)

## এই ZIP-এ কী ঠিক করা হয়েছে
- `index.ts`-এর GET health-check খালি JSON parse করে না; CORS OPTIONS এবং পরিষ্কার JSON error response আছে।
- POST অনুরোধে Supabase Auth user যাচাই হয়। এই Function ইচ্ছাকৃতভাবে এখনও কোনো টেবিলে insert/update/delete করে না।
- `config.js`-এ আপনার Project URL ও Edge Function URL বসানো আছে। Publishable Key বসাতে হবে।
- `api.js`-এ সংযোগ পরীক্ষা এবং Auth access token-সহ REST SELECT helper আছে।
- `package.json`-এর server script ঠিক করা হয়েছে।

## গুরুত্বপূর্ণ সীমাবদ্ধতা
বর্তমান `index.html` এখনও নিজস্ব demo/localStorage login এবং data structure ব্যবহার করে। এই ZIP-এ সদস্য, চাঁদা, খরচ, চ্যাট ও গ্যালারির সম্পূর্ণ Supabase sync দাবি করা হচ্ছে না। Supabase Auth-এ প্রতিটি সদস্যের লগইন অ্যাকাউন্ট এবং `members.id`-এর Auth UUID মিলিয়ে তারপর UI-কে API-তে যুক্ত করতে হবে। শুধু Edge Function health-check সফল হওয়া database sync-এর প্রমাণ নয়।

## Publishable Key বসানো
1. Supabase Dashboard → Project Settings → API Keys খুলুন।
2. শুধু Publishable key (`sb_publishable_...`) বা পুরনো `anon` public key কপি করুন।
3. `config.js`-এর `PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE` বদলান।
4. কখনও `service_role`, `sb_secret_...` বা অন্য secret key browser code/GitHub-এ দেবেন না।
5. `config.js`-এর তথ্য public repository-তে থাকলে key-টিকে public key হিসেবেই ধরুন এবং RLS ঠিক রাখুন।

## Edge Function deploy
Supabase Dashboard → Edge Functions → `durga-samiti-api` → Code-এ `index.ts`-এর কোড বসিয়ে Deploy updates করুন। GET health-check লগইন ছাড়াই কেবল function চলার অবস্থা জানায়। POST-এ valid Supabase Auth access token লাগবে।

## GitHub Pages
`index.html`, `config.js`, `api.js`, `data.json`, ছবি ও অন্যান্য assets একই root folder-এ রাখুন। মনে রাখবেন: `index.html`-এ `api.js` helper যোগ করলেই স্বয়ংক্রিয় sync চালু হয় না; UI-র প্রতিটি data action-কে helper/secure backend-এ সংযুক্ত করতে হবে।

## নিরাপত্তা
- LocalStorage-এ রাখা demo password production login নয়।
- সব টেবিলে RLS চালু রাখুন এবং নীতিগুলো পরীক্ষা করুন।
- `members`-এ ফোন/ব্যক্তিগত তথ্য থাকলে সব authenticated user-কে সব column দেখানোর আগে privacy বিবেচনা করুন।
- production ব্যবহারের আগে Auth, member ID mapping, role changes, writes, Storage upload এবং audit logging আলাদা করে পরীক্ষা করুন।
