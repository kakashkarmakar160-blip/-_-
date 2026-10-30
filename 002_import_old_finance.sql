-- OPTIONAL: Run ONCE only, after 001_supabase_sync.sql.
-- Copies the old contributions and expenses tables into ds_transactions.
-- Review the SELECT previews first; take a backup before running.

-- Preview old income rows:
-- select c.*, m.name from public.contributions c left join public.members m on m.id=c.member_id order by c.payment_date;
-- Preview old expense rows:
-- select e.*, m.name from public.expenses e left join public.members m on m.id=e.responsible_member_id order by e.expense_date;

insert into public.ds_transactions(kind,direction,amount,transaction_date,person,description,notes,created_by)
select case when coalesce(c.contribution_type,'') ilike '%অনুদান%' then 'donation' else 'chanda' end,
       'income',c.amount,c.payment_date,m.name,
       coalesce(nullif(c.contribution_type,''),'সদস্য চাঁদা'),coalesce(c.notes,''),null
from public.contributions c left join public.members m on m.id=c.member_id
where not exists(select 1 from public.ds_transactions d where d.direction='income' and d.amount=c.amount and d.transaction_date=c.payment_date and d.person is not distinct from m.name and d.description=coalesce(nullif(c.contribution_type,''),'সদস্য চাঁদা'));

insert into public.ds_transactions(kind,direction,amount,transaction_date,person,description,notes,created_by)
select 'expense','expense',e.amount,e.expense_date,m.name,
       concat_ws(' — ',nullif(e.category,''),nullif(e.description,'')),coalesce(e.receipt_url,''),null
from public.expenses e left join public.members m on m.id=e.responsible_member_id
where not exists(select 1 from public.ds_transactions d where d.direction='expense' and d.amount=e.amount and d.transaction_date=e.expense_date and d.person is not distinct from m.name and d.description=concat_ws(' — ',nullif(e.category,''),nullif(e.description,'')));
