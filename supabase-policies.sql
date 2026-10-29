-- দুর্গা সমিতি: RLS policies for the existing tables.
-- Run in Supabase SQL Editor as project owner. Does not delete any rows.
-- Requires public.is_current_user_admin() to exist as created in earlier setup.

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Recreate only these named policies so this script can be run again safely.
DROP POLICY IF EXISTS "Authenticated users can view members" ON public.members;
DROP POLICY IF EXISTS "Admins can insert members" ON public.members;
DROP POLICY IF EXISTS "Admins can update members" ON public.members;
DROP POLICY IF EXISTS "Admins can delete members" ON public.members;
CREATE POLICY "Authenticated users can view members" ON public.members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert members" ON public.members FOR INSERT TO authenticated WITH CHECK (public.is_current_user_admin());
CREATE POLICY "Admins can update members" ON public.members FOR UPDATE TO authenticated USING (public.is_current_user_admin()) WITH CHECK (public.is_current_user_admin());
CREATE POLICY "Admins can delete members" ON public.members FOR DELETE TO authenticated USING (public.is_current_user_admin());

DROP POLICY IF EXISTS "Members can view own profile or admin can view all" ON public.member_profiles;
DROP POLICY IF EXISTS "Members can insert own profile or admin can insert any" ON public.member_profiles;
DROP POLICY IF EXISTS "Members can update own profile or admin can update any" ON public.member_profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.member_profiles;
CREATE POLICY "Members can view own profile or admin can view all" ON public.member_profiles FOR SELECT TO authenticated USING (member_id = (SELECT auth.uid()) OR public.is_current_user_admin());
CREATE POLICY "Members can insert own profile or admin can insert any" ON public.member_profiles FOR INSERT TO authenticated WITH CHECK (member_id = (SELECT auth.uid()) OR public.is_current_user_admin());
CREATE POLICY "Members can update own profile or admin can update any" ON public.member_profiles FOR UPDATE TO authenticated USING (member_id = (SELECT auth.uid()) OR public.is_current_user_admin()) WITH CHECK (member_id = (SELECT auth.uid()) OR public.is_current_user_admin());
CREATE POLICY "Admins can delete profiles" ON public.member_profiles FOR DELETE TO authenticated USING (public.is_current_user_admin());

DROP POLICY IF EXISTS "Authenticated users can view contributions" ON public.contributions;
DROP POLICY IF EXISTS "Admins can insert contributions" ON public.contributions;
DROP POLICY IF EXISTS "Admins can update contributions" ON public.contributions;
DROP POLICY IF EXISTS "Admins can delete contributions" ON public.contributions;
CREATE POLICY "Authenticated users can view contributions" ON public.contributions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert contributions" ON public.contributions FOR INSERT TO authenticated WITH CHECK (public.is_current_user_admin());
CREATE POLICY "Admins can update contributions" ON public.contributions FOR UPDATE TO authenticated USING (public.is_current_user_admin()) WITH CHECK (public.is_current_user_admin());
CREATE POLICY "Admins can delete contributions" ON public.contributions FOR DELETE TO authenticated USING (public.is_current_user_admin());

DROP POLICY IF EXISTS "Authenticated users can view expenses" ON public.expenses;
DROP POLICY IF EXISTS "Admins can insert expenses" ON public.expenses;
DROP POLICY IF EXISTS "Admins can update expenses" ON public.expenses;
DROP POLICY IF EXISTS "Admins can delete expenses" ON public.expenses;
CREATE POLICY "Authenticated users can view expenses" ON public.expenses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert expenses" ON public.expenses FOR INSERT TO authenticated WITH CHECK (public.is_current_user_admin());
CREATE POLICY "Admins can update expenses" ON public.expenses FOR UPDATE TO authenticated USING (public.is_current_user_admin()) WITH CHECK (public.is_current_user_admin());
CREATE POLICY "Admins can delete expenses" ON public.expenses FOR DELETE TO authenticated USING (public.is_current_user_admin());

DROP POLICY IF EXISTS "Authenticated users can view gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admins can insert gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admins can update gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admins can delete gallery" ON public.gallery;
CREATE POLICY "Authenticated users can view gallery" ON public.gallery FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert gallery" ON public.gallery FOR INSERT TO authenticated WITH CHECK (public.is_current_user_admin());
CREATE POLICY "Admins can update gallery" ON public.gallery FOR UPDATE TO authenticated USING (public.is_current_user_admin()) WITH CHECK (public.is_current_user_admin());
CREATE POLICY "Admins can delete gallery" ON public.gallery FOR DELETE TO authenticated USING (public.is_current_user_admin());

DROP POLICY IF EXISTS "Authenticated users can view chat" ON public.chat_messages;
DROP POLICY IF EXISTS "Members can send own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admins can update chat" ON public.chat_messages;
DROP POLICY IF EXISTS "Admins can delete chat" ON public.chat_messages;
CREATE POLICY "Authenticated users can view chat" ON public.chat_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Members can send own messages" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (member_id = (SELECT auth.uid()));
CREATE POLICY "Admins can update chat" ON public.chat_messages FOR UPDATE TO authenticated USING (public.is_current_user_admin()) WITH CHECK (public.is_current_user_admin());
CREATE POLICY "Admins can delete chat" ON public.chat_messages FOR DELETE TO authenticated USING (public.is_current_user_admin());

DROP POLICY IF EXISTS "Authenticated users can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can delete site settings" ON public.site_settings;
CREATE POLICY "Authenticated users can view site settings" ON public.site_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert site settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.is_current_user_admin());
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.is_current_user_admin()) WITH CHECK (public.is_current_user_admin());
CREATE POLICY "Admins can delete site settings" ON public.site_settings FOR DELETE TO authenticated USING (public.is_current_user_admin());
