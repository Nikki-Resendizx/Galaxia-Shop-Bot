-- Galaxia Shop / Neon PostgreSQL
-- Apply manually to the Galaxia-Shop project's main branch after reviewing.
create extension if not exists pgcrypto;

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2) check (compare_at_price is null or compare_at_price >= price),
  image_url text,
  stock integer check (stock is null or stock >= 0),
  active boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table products add column if not exists category text;

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  telegram_user_id bigint unique,
  telegram_username text,
  full_name text,
  phone text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigserial unique,
  customer_id uuid references customers(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','awaiting_payment','paid','processing','shipped','completed','cancelled','refunded')),
  subtotal numeric(12,2) not null default 0 check (subtotal >= 0),
  shipping_total numeric(12,2) not null default 0 check (shipping_total >= 0),
  total numeric(12,2) not null default 0 check (total >= 0),
  currency char(3) not null default 'MXN',
  payment_provider text,
  payment_reference text,
  shipping_address jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(12,2) not null check (line_total >= 0)
);

create index if not exists products_active_featured_idx on products(active, featured desc, created_at desc);
create index if not exists orders_customer_created_idx on orders(customer_id, created_at desc);
create index if not exists orders_status_created_idx on orders(status, created_at desc);

insert into categories(name, slug) values
  ('Digital','digital'), ('Accesorios','accesorios'), ('Novedades','novedades')
on conflict (slug) do nothing;