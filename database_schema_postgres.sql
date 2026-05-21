-- Peace and Love Studio PR
-- Full PostgreSQL / Supabase schema
-- Execute this whole file in a single run inside the SQL Editor.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'appointment_status') then
    create type appointment_status as enum ('pendiente', 'en proceso', 'aprobada', 'rechazada', 'realizada', 'cancelada');
  end if;

  if not exists (select 1 from pg_type where typname = 'testimonial_status') then
    create type testimonial_status as enum ('pendiente', 'aprobado', 'rechazado');
  end if;

  if not exists (select 1 from pg_type where typname = 'suggestion_status') then
    create type suggestion_status as enum ('nueva', 'revisada', 'archivada');
  end if;

  if not exists (select 1 from pg_type where typname = 'contact_preference') then
    create type contact_preference as enum ('whatsapp', 'call', 'email');
  end if;

  if not exists (select 1 from pg_type where typname = 'suggestion_type') then
    create type suggestion_type as enum ('servicio', 'pagina', 'atencion', 'ambiente', 'otro');
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_method') then
    create type payment_method as enum ('efectivo', 'tarjeta', 'transferencia', 'otro');
  end if;

  if not exists (select 1 from pg_type where typname = 'gallery_category') then
    create type gallery_category as enum ('manicura', 'gel', 'acrilico', 'pestanas', 'pedicura');
  end if;

  if not exists (select 1 from pg_type where typname = 'availability_rule_type') then
    create type availability_rule_type as enum ('day-full', 'day-time', 'date-full', 'date-time');
  end if;
end
$$;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function authenticate_admin(input_username text, input_password text)
returns table (
  admin_id uuid,
  username text,
  is_active boolean
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select
    a.id,
    a.username,
    a.is_active
  from admin_users a
  where lower(a.username) = lower(trim(input_username))
    and a.is_active = true
    and a.password_hash = crypt(input_password, a.password_hash)
  limit 1;
end;
$$;

revoke all on function authenticate_admin(text, text) from public;
grant execute on function authenticate_admin(text, text) to anon, authenticated;

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  email text,
  password_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  notes text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists customers_email_unique_idx
  on customers (lower(email))
  where email is not null and email <> '';

create unique index if not exists customers_phone_unique_idx
  on customers (phone)
  where phone is not null and phone <> '';

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  category text not null,
  name_es text not null,
  name_en text,
  description_es text not null default '',
  description_en text not null default '',
  icon text not null default 'fas fa-hand-sparkles',
  price numeric(10,2) not null default 0,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists services_active_idx on services (is_active);
create index if not exists services_category_idx on services (category);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  customer_id uuid references customers(id) on delete set null,
  customer_name text not null,
  customer_phone text,
  customer_email text,
  appointment_date date not null,
  appointment_time text not null,
  comments text not null default '',
  contact_preference contact_preference not null default 'whatsapp',
  status appointment_status not null default 'pendiente',
  calendar_event_id text not null default '',
  calendar_synced boolean not null default false,
  calendar_synced_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists appointments_date_idx on appointments (appointment_date);
create index if not exists appointments_status_idx on appointments (status);
create index if not exists appointments_customer_idx on appointments (customer_id);

create table if not exists appointment_services (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references appointments(id) on delete cascade,
  service_id uuid references services(id) on delete set null,
  service_name_snapshot text not null,
  price_snapshot numeric(10,2) not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  unique (appointment_id, service_name_snapshot)
);

create index if not exists appointment_services_appointment_idx on appointment_services (appointment_id);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  customer_name text not null,
  service_name text,
  rating integer not null default 5 check (rating between 1 and 5),
  comment text not null,
  testimonial_date date,
  status testimonial_status not null default 'pendiente',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists testimonials_status_idx on testimonials (status);

create table if not exists suggestions (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  customer_name text not null,
  customer_email text,
  suggestion_kind suggestion_type not null,
  message text not null,
  status suggestion_status not null default 'nueva',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists suggestions_status_idx on suggestions (status);
create index if not exists suggestions_kind_idx on suggestions (suggestion_kind);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  question_es text not null,
  question_en text,
  answer_es text not null,
  answer_en text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists faqs_active_idx on faqs (is_active);

create table if not exists gallery_items (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  title_es text not null,
  title_en text,
  description_es text not null default '',
  description_en text not null default '',
  category gallery_category not null,
  before_image_url text not null default '',
  after_image_url text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists gallery_items_active_idx on gallery_items (is_active);
create index if not exists gallery_items_category_idx on gallery_items (category);

create table if not exists business_hours (
  id uuid primary key default gen_random_uuid(),
  weekday smallint not null check (weekday between 0 and 6),
  day_name_es text not null,
  day_name_en text not null,
  open_time time,
  close_time time,
  is_closed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (weekday)
);

create table if not exists availability_rules (
  id uuid primary key default gen_random_uuid(),
  rule_type availability_rule_type not null,
  weekday smallint check (weekday between 0 and 6),
  day_name text,
  specific_date date,
  specific_time text,
  source text not null default '',
  appointment_id uuid references appointments(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists availability_rules_date_idx on availability_rules (specific_date);
create index if not exists availability_rules_weekday_idx on availability_rules (weekday);
create index if not exists availability_rules_type_idx on availability_rules (rule_type);

create table if not exists site_content (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists app_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists receipts (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  customer_id uuid references customers(id) on delete set null,
  appointment_id uuid references appointments(id) on delete set null,
  customer_name text not null,
  customer_phone text,
  customer_email text,
  service_name text not null,
  receipt_date date not null,
  price numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  payment_method payment_method not null default 'efectivo',
  notes text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists receipts_date_idx on receipts (receipt_date);
create index if not exists receipts_customer_idx on receipts (customer_id);

drop trigger if exists trg_admin_users_updated_at on admin_users;
create trigger trg_admin_users_updated_at before update on admin_users for each row execute function set_updated_at();

drop trigger if exists trg_customers_updated_at on customers;
create trigger trg_customers_updated_at before update on customers for each row execute function set_updated_at();

drop trigger if exists trg_services_updated_at on services;
create trigger trg_services_updated_at before update on services for each row execute function set_updated_at();

drop trigger if exists trg_appointments_updated_at on appointments;
create trigger trg_appointments_updated_at before update on appointments for each row execute function set_updated_at();

drop trigger if exists trg_testimonials_updated_at on testimonials;
create trigger trg_testimonials_updated_at before update on testimonials for each row execute function set_updated_at();

drop trigger if exists trg_suggestions_updated_at on suggestions;
create trigger trg_suggestions_updated_at before update on suggestions for each row execute function set_updated_at();

drop trigger if exists trg_faqs_updated_at on faqs;
create trigger trg_faqs_updated_at before update on faqs for each row execute function set_updated_at();

drop trigger if exists trg_gallery_items_updated_at on gallery_items;
create trigger trg_gallery_items_updated_at before update on gallery_items for each row execute function set_updated_at();

drop trigger if exists trg_business_hours_updated_at on business_hours;
create trigger trg_business_hours_updated_at before update on business_hours for each row execute function set_updated_at();

drop trigger if exists trg_availability_rules_updated_at on availability_rules;
create trigger trg_availability_rules_updated_at before update on availability_rules for each row execute function set_updated_at();

drop trigger if exists trg_site_content_updated_at on site_content;
create trigger trg_site_content_updated_at before update on site_content for each row execute function set_updated_at();

drop trigger if exists trg_app_settings_updated_at on app_settings;
create trigger trg_app_settings_updated_at before update on app_settings for each row execute function set_updated_at();

drop trigger if exists trg_receipts_updated_at on receipts;
create trigger trg_receipts_updated_at before update on receipts for each row execute function set_updated_at();

insert into business_hours (weekday, day_name_es, day_name_en, open_time, close_time, is_closed)
values
  (0, 'Domingo', 'Sunday', null, null, true),
  (1, 'Lunes', 'Monday', '09:00', '16:00', false),
  (2, 'Martes', 'Tuesday', null, null, true),
  (3, 'Miercoles', 'Wednesday', '09:00', '16:00', false),
  (4, 'Jueves', 'Thursday', null, null, true),
  (5, 'Viernes', 'Friday', '09:00', '16:00', false),
  (6, 'Sabado', 'Saturday', '07:00', '16:00', false)
on conflict (weekday) do update
set
  day_name_es = excluded.day_name_es,
  day_name_en = excluded.day_name_en,
  open_time = excluded.open_time,
  close_time = excluded.close_time,
  is_closed = excluded.is_closed,
  updated_at = timezone('utc', now());

delete from availability_rules
where source = 'default_schedule';

insert into availability_rules (rule_type, weekday, day_name, specific_date, specific_time, source)
values
  ('day-time', 1, 'lunes', null, '7:00 AM', 'default_schedule'),
  ('day-time', 1, 'lunes', null, '8:00 AM', 'default_schedule'),
  ('day-time', 3, 'miercoles', null, '7:00 AM', 'default_schedule'),
  ('day-time', 3, 'miercoles', null, '8:00 AM', 'default_schedule'),
  ('day-time', 5, 'viernes', null, '7:00 AM', 'default_schedule'),
  ('day-time', 5, 'viernes', null, '8:00 AM', 'default_schedule')
;

insert into site_content (section_key, content)
values
  ('hero', jsonb_build_object('title', 'Peace and Love Studio PR', 'subtitle', 'Belleza, cuidado y estilo en cada detalle')),
  ('about', jsonb_build_object('title', 'Mas que un estudio, una experiencia', 'text', 'En Peace and Love Studio PR creemos que cada servicio es una experiencia de cuidado, belleza y confianza.')),
  ('footer', jsonb_build_object('description', 'Estudio de unas y belleza en Barranquitas, Puerto Rico. Belleza, cuidado y amor en cada servicio.')),
  ('schedule', jsonb_build_object('display', jsonb_build_array(
    jsonb_build_object('day_es', 'Lunes', 'day_en', 'Monday', 'hours', '9:00 AM - 4:00 PM'),
    jsonb_build_object('day_es', 'Martes', 'day_en', 'Tuesday', 'hours', 'Cerrado / Closed'),
    jsonb_build_object('day_es', 'Miercoles', 'day_en', 'Wednesday', 'hours', '9:00 AM - 4:00 PM'),
    jsonb_build_object('day_es', 'Jueves', 'day_en', 'Thursday', 'hours', 'Cerrado / Closed'),
    jsonb_build_object('day_es', 'Viernes', 'day_en', 'Friday', 'hours', '9:00 AM - 4:00 PM'),
    jsonb_build_object('day_es', 'Sabado', 'day_en', 'Saturday', 'hours', '7:00 AM - 4:00 PM'),
    jsonb_build_object('day_es', 'Domingo', 'day_en', 'Sunday', 'hours', 'Cerrado / Closed')
  )))
on conflict (section_key) do nothing;

insert into app_settings (setting_key, setting_value)
values
  ('business', jsonb_build_object(
    'name', 'Peace and Love Studio PR',
    'phone', '787-228-4063',
    'location', 'Barranquitas, Puerto Rico',
    'email', '',
    'instagram', 'https://www.instagram.com/peaceandlovestudiopr',
    'facebook', 'https://www.facebook.com/share/1E9R9ckDog/',
    'calendarWebhookUrl', '',
    'calendarSecret', '',
    'calendarId', 'primary',
    'calendarTimezone', 'America/Puerto_Rico',
    'calendarEventDurationMinutes', 60,
    'lang', 'es',
    'theme', 'light'
  ))
on conflict (setting_key) do nothing;

comment on table admin_users is 'Usuarios administradores del panel.';
comment on table customers is 'Clientas y clientes que han reservado o interactuado.';
comment on table services is 'Servicios ofrecidos por el negocio.';
comment on table appointments is 'Citas solicitadas o administradas desde la web/panel.';
comment on table appointment_services is 'Relacion entre una cita y uno o varios servicios.';
comment on table testimonials is 'Testimonios enviados por clientas.';
comment on table suggestions is 'Sugerencias enviadas desde la web.';
comment on table faqs is 'Preguntas frecuentes visibles en la pagina.';
comment on table gallery_items is 'Trabajos del antes y despues.';
comment on table business_hours is 'Horario semanal oficial del negocio.';
comment on table availability_rules is 'Bloqueos y reglas especiales de disponibilidad.';
comment on table site_content is 'Contenido editable del sitio por seccion.';
comment on table app_settings is 'Configuraciones globales del negocio y del panel.';
comment on table receipts is 'Recibos emitidos desde el panel administrativo.';

-- ============================================================
-- RLS + Permissions for current frontend sync strategy
-- IMPORTANT:
-- The current frontend code syncs state through app_settings using the
-- publishable key. These policies make that work immediately, but they
-- are permissive. For production-hardening, move admin writes behind auth.
-- ============================================================

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

alter default privileges in schema public
grant select, insert, update, delete on tables to anon, authenticated;

alter default privileges in schema public
grant usage, select on sequences to anon, authenticated;

alter table admin_users enable row level security;
alter table customers enable row level security;
alter table services enable row level security;
alter table appointments enable row level security;
alter table appointment_services enable row level security;
alter table testimonials enable row level security;
alter table suggestions enable row level security;
alter table faqs enable row level security;
alter table gallery_items enable row level security;
alter table business_hours enable row level security;
alter table availability_rules enable row level security;
alter table site_content enable row level security;
alter table app_settings enable row level security;
alter table receipts enable row level security;

drop policy if exists public_read_services on services;
create policy public_read_services
on services
for select
to anon, authenticated
using (true);

drop policy if exists public_read_faqs on faqs;
create policy public_read_faqs
on faqs
for select
to anon, authenticated
using (true);

drop policy if exists public_read_gallery_items on gallery_items;
create policy public_read_gallery_items
on gallery_items
for select
to anon, authenticated
using (true);

drop policy if exists public_read_testimonials on testimonials;
create policy public_read_testimonials
on testimonials
for select
to anon, authenticated
using (true);

drop policy if exists public_insert_testimonials on testimonials;
create policy public_insert_testimonials
on testimonials
for insert
to anon, authenticated
with check (true);

drop policy if exists public_insert_suggestions on suggestions;
create policy public_insert_suggestions
on suggestions
for insert
to anon, authenticated
with check (true);

drop policy if exists public_insert_appointments on appointments;
create policy public_insert_appointments
on appointments
for insert
to anon, authenticated
with check (true);

drop policy if exists public_read_site_content on site_content;
create policy public_read_site_content
on site_content
for select
to anon, authenticated
using (true);

drop policy if exists public_read_business_hours on business_hours;
create policy public_read_business_hours
on business_hours
for select
to anon, authenticated
using (true);

drop policy if exists public_read_availability_rules on availability_rules;
create policy public_read_availability_rules
on availability_rules
for select
to anon, authenticated
using (true);

drop policy if exists public_app_settings_sync_select on app_settings;
create policy public_app_settings_sync_select
on app_settings
for select
to anon, authenticated
using (
  setting_key = 'business'
  or setting_key like 'pal_%'
);

drop policy if exists public_app_settings_sync_insert on app_settings;
create policy public_app_settings_sync_insert
on app_settings
for insert
to anon, authenticated
with check (
  setting_key = 'business'
  or setting_key like 'pal_%'
);

drop policy if exists public_app_settings_sync_update on app_settings;
create policy public_app_settings_sync_update
on app_settings
for update
to anon, authenticated
using (
  setting_key = 'business'
  or setting_key like 'pal_%'
)
with check (
  setting_key = 'business'
  or setting_key like 'pal_%'
);

drop policy if exists public_app_settings_sync_delete on app_settings;
create policy public_app_settings_sync_delete
on app_settings
for delete
to anon, authenticated
using (
  setting_key = 'business'
  or setting_key like 'pal_%'
);

drop policy if exists public_manage_customers on customers;
create policy public_manage_customers
on customers
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists public_manage_services on services;
create policy public_manage_services
on services
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists public_manage_faqs on faqs;
create policy public_manage_faqs
on faqs
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists public_manage_gallery_items on gallery_items;
create policy public_manage_gallery_items
on gallery_items
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists public_manage_testimonials on testimonials;
create policy public_manage_testimonials
on testimonials
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists public_manage_suggestions on suggestions;
create policy public_manage_suggestions
on suggestions
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists public_manage_appointments on appointments;
create policy public_manage_appointments
on appointments
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists public_manage_appointment_services on appointment_services;
create policy public_manage_appointment_services
on appointment_services
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists public_manage_business_hours on business_hours;
create policy public_manage_business_hours
on business_hours
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists public_manage_availability_rules on availability_rules;
create policy public_manage_availability_rules
on availability_rules
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists public_manage_site_content on site_content;
create policy public_manage_site_content
on site_content
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists public_manage_receipts on receipts;
create policy public_manage_receipts
on receipts
for all
to anon, authenticated
using (true)
with check (true);
