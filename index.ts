import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json; charset=utf-8"};
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:cors});
const norm=(v:string)=>v.trim().toLowerCase();
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors}); if(req.method!=='POST')return reply({success:false,error:'POST only'},405);
 const url=Deno.env.get('SUPABASE_URL')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,anon=Deno.env.get('SUPABASE_ANON_KEY')??Deno.env.get('SUPABASE_PUBLISHABLE_KEY');
 if(!url||!service||!anon)return reply({success:false,error:'Supabase Function Secrets অসম্পূর্ণ'},500);
 let body:any;try{body=await req.json()}catch{return reply({success:false,error:'Invalid JSON'},400)}
 const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
 if(body.action==='login'){
  const id=String(body.member_id??'').trim(),password=String(body.password??'');if(!id||!password)return reply({success:false,error:'সদস্য ID ও পাসওয়ার্ড দিন'},400);
  const {data:m,error}=await admin.from('members').select('auth_email,status').ilike('member_id',id).maybeSingle();if(error||!m||m.status!=='active'||!m.auth_email)return reply({success:false,error:'সদস্য খুঁজে পাওয়া যায়নি বা লগইন সক্রিয় নয়'},401);
  const client=createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false}});const {data,error:loginError}=await client.auth.signInWithPassword({email:m.auth_email,password});if(loginError||!data.session)return reply({success:false,error:'সদস্য ID বা পাসওয়ার্ড সঠিক নয়'},401);
  return reply({success:true,session:data.session});
 }
 const auth=req.headers.get('Authorization')??'';if(!auth.startsWith('Bearer '))return reply({success:false,error:'Login required'},401);
 const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}},auth:{persistSession:false,autoRefreshToken:false}});const {data:{user},error:userErr}=await userClient.auth.getUser();if(userErr||!user)return reply({success:false,error:'Invalid login'},401);
 const {data:actor}=await admin.from('members').select('role,status').eq('auth_user_id',user.id).maybeSingle();if(!actor||actor.role!=='admin'||actor.status!=='active')return reply({success:false,error:'শুধু অ্যাডমিন এই কাজ করতে পারবেন'},403);
 if(body.action==='provision_existing'){
  const memberId=String(body.member_id??'').trim(),password=String(body.password??'');if(!memberId||password.length<10)return reply({success:false,error:'সদস্য ID এবং অন্তত ১০ অক্ষরের নতুন পাসওয়ার্ড দিন'},400);
  const {data:m,error:findErr}=await admin.from('members').select('id,member_id,name,auth_user_id').ilike('member_id',memberId).maybeSingle();if(findErr||!m)return reply({success:false,error:'সদস্য খুঁজে পাওয়া যায়নি'},404);if(m.auth_user_id)return reply({success:false,error:'এই সদস্যের লগইন ইতিমধ্যে তৈরি আছে'},409);
  const syntheticEmail=`${encodeURIComponent(norm(m.member_id))}@members.durgasamiti.invalid`;const {data:created,error:createErr}=await admin.auth.admin.createUser({email:syntheticEmail,password,email_confirm:true,user_metadata:{member_id:m.member_id,name:m.name}});if(createErr)return reply({success:false,error:createErr.message},400);
  const {error:updateErr}=await admin.from('members').update({auth_user_id:created.user.id,auth_email:syntheticEmail}).eq('id',m.id);if(updateErr){await admin.auth.admin.deleteUser(created.user.id);return reply({success:false,error:updateErr.message},400)}return reply({success:true,message:'সদস্যের লগইন তৈরি হয়েছে'});
 }
 if(body.action==='create_member'){
  const m=body.member??{},name=String(m.name??'').trim(),member_id=String(m.member_id??'').trim(),password=String(m.password??''),role=m.role==='admin'?'admin':'member',birth_date=m.birth_date?String(m.birth_date):null,address=String(m.address??'').trim();
  if(!name||!member_id||password.length<10)return reply({success:false,error:'নাম, সদস্য ID এবং অন্তত ১০ অক্ষরের প্রাথমিক পাসওয়ার্ড দিন'},400);
  const syntheticEmail=`${encodeURIComponent(norm(member_id))}@members.durgasamiti.invalid`;
  const {data:created,error:createErr}=await admin.auth.admin.createUser({email:syntheticEmail,password,email_confirm:true,user_metadata:{member_id,name}});if(createErr)return reply({success:false,error:createErr.message},400);
  const {data:inserted,error:insertErr}=await admin.from('members').insert({member_id,name,role,status:'active',birth_date,auth_user_id:created.user.id,auth_email:syntheticEmail}).select('id').single();
  if(insertErr){await admin.auth.admin.deleteUser(created.user.id);return reply({success:false,error:insertErr.message},400)}
  if(address){const {error:profileErr}=await admin.from('member_profiles').upsert({member_id:inserted.id,address});if(profileErr)return reply({success:false,error:'সদস্য তৈরি হয়েছে, কিন্তু ঠিকানা সেভ হয়নি: '+profileErr.message},500)}
  return reply({success:true,message:'সদস্য তৈরি হয়েছে'});
 }
 return reply({success:false,error:'Unknown action'},400);
});
