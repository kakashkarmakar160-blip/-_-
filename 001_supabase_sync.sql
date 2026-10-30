-- দুর্গা সমিতি: additive migration. Existing member rows are preserved.
-- Run in Supabase SQL Editor after taking a database backup.

alter table public.members add column if not exists auth_user_id uuid references auth.users(id) on delete set null;
alter table public.members add column if not exists auth_email text;
create unique index if not exists members_auth_user_id_uidx on public.members(auth_user_id) where auth_user_id is not null;
create unique index if not exists members_member_id_lower_uidx on public.members(lower(member_id));

-- Link existing member rows whose primary key already equals an Auth UID (e.g. the existing admin row).
update public.members m set auth_user_id=m.id
where m.auth_user_id is null and exists(select 1 from auth.users u where u.id=m.id);
update public.members m set auth_email=u.email
from auth.users u where u.id=m.auth_user_id and (m.auth_email is null or m.auth_email='');

create or replace function public.ds_is_active_member()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.members m where m.auth_user_id=auth.uid() and m.status='active'); $$;
revoke all on function public.ds_is_active_member() from public;
grant execute on function public.ds_is_active_member() to authenticated;

create or replace function public.ds_is_admin()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.members m where m.auth_user_id=auth.uid() and m.role='admin' and m.status='active'); $$;
revoke all on function public.ds_is_admin() from public;
grant execute on function public.ds_is_admin() to authenticated;

create table if not exists public.ds_transactions (
 id uuid primary key default gen_random_uuid(),
 kind text not null check(kind in ('bill','chanda','donation','expense')),
 direction text not null check(direction in ('income','expense')),
 amount numeric(12,2) not null check(amount>0),
 transaction_date date not null default current_date,
 person text,
 description text not null,
 notes text,
 created_by uuid references auth.users(id) on delete set null default auth.uid(),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists ds_transactions_date_idx on public.ds_transactions(transaction_date desc);
alter table public.ds_transactions enable row level security;

-- Recreate only policies belonging to this new table.
drop policy if exists "ds members read transactions" on public.ds_transactions;
drop policy if exists "ds admins insert transactions" on public.ds_transactions;
drop policy if exists "ds admins update transactions" on public.ds_transactions;
drop policy if exists "ds admins delete transactions" on public.ds_transactions;
create policy "ds members read transactions" on public.ds_transactions for select to authenticated using (public.ds_is_active_member());
create policy "ds admins insert transactions" on public.ds_transactions for insert to authenticated with check(public.ds_is_admin() and created_by=auth.uid());
create policy "ds admins update transactions" on public.ds_transactions for update to authenticated using(public.ds_is_admin()) with check(public.ds_is_admin());
create policy "ds admins delete transactions" on public.ds_transactions for delete to authenticated using(public.ds_is_admin());

-- Members can read the member directory; only admins can modify it.
alter table public.members enable row level security;
do $$ declare p record; begin for p in select policyname from pg_policies where schemaname='public' and tablename='members' loop execute format('drop policy %I on public.members',p.policyname); end loop; end $$;
drop policy if exists "ds members read directory" on public.members;
drop policy if exists "ds admins insert directory" on public.members;
drop policy if exists "ds admins update directory" on public.members;
drop policy if exists "ds admins delete directory" on public.members;
create policy "ds members read directory" on public.members for select to authenticated using (public.ds_is_active_member());
create policy "ds admins insert directory" on public.members for insert to authenticated with check(public.ds_is_admin());
create policy "ds admins update directory" on public.members for update to authenticated using(public.ds_is_admin()) with check(public.ds_is_admin());
create policy "ds admins delete directory" on public.members for delete to authenticated using(public.ds_is_admin());

grant select, insert, update, delete on public.ds_transactions to authenticated;
grant select, insert, update, delete on public.members to authenticated;

-- Enable realtime notifications for shared reports (safe if already enabled).
do $$ begin
 if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='ds_transactions') then
  alter publication supabase_realtime add table public.ds_transactions;
 end if;
end $$;

-- Ensure admins can write member profile details such as address.
alter table public.member_profiles enable row level security;
drop policy if exists "ds admins insert member profiles" on public.member_profiles;
drop policy if exists "ds admins update member profiles" on public.member_profiles;
create policy "ds admins insert member profiles" on public.member_profiles for insert to authenticated with check(public.ds_is_admin());
create policy "ds admins update member profiles" on public.member_profiles for update to authenticated using(public.ds_is_admin()) with check(public.ds_is_admin());
grant select, insert, update on public.member_profiles to authenticated;
