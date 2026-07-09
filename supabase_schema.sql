-- SimpanAja Inventory Management System - Supabase Schema
-- Run this in Supabase SQL Editor

-- ==========================================
-- 1. EXTENSIONS & CUSTOM TYPES
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('Admin', 'Kepala Gudang', 'Staff Gudang');
CREATE TYPE transaction_type AS ENUM ('inbound', 'outbound', 'adjustment');
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'cancelled');
CREATE TYPE movement_type AS ENUM ('IN', 'OUT');

-- ==========================================
-- 2. MASTER DATA
-- ==========================================

-- User Profiles (linked to auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'Staff Gudang',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers
CREATE TABLE public.suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    contact_name TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.categories(id),
    unit TEXT NOT NULL, -- e.g., pcs, box, kg
    price NUMERIC(10, 2) DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. WAREHOUSE LAYOUT
-- ==========================================

-- Warehouses
CREATE TABLE public.warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Zones
CREATE TABLE public.zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID REFERENCES public.warehouses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Racks
CREATE TABLE public.racks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES public.zones(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bins (Lowest location level)
CREATE TABLE public.bins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rack_id UUID REFERENCES public.racks(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    barcode TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. INVENTORY CORE
-- ==========================================

-- Inventory (Real-time stock per bin/batch)
CREATE TABLE public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    bin_id UUID REFERENCES public.bins(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 0,
    batch_number TEXT,
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (product_id, bin_id, batch_number) -- Ensure unique tracking per batch in a bin
);

-- ==========================================
-- 5. TRANSACTIONS & LOGISTICS (INBOUND/OUTBOUND)
-- ==========================================

-- Transactions (Headers)
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trx_code TEXT UNIQUE NOT NULL, -- e.g., INB-20231001-001
    type transaction_type NOT NULL,
    status transaction_status NOT NULL DEFAULT 'pending',
    supplier_id UUID REFERENCES public.suppliers(id), -- Only for Inbound
    user_id UUID REFERENCES public.profiles(id), -- Who handled this
    reference_no TEXT, -- PO Number / SO Number
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction Items (Line items)
CREATE TABLE public.transaction_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    expected_qty INTEGER NOT NULL,
    actual_qty INTEGER DEFAULT 0,
    bin_id UUID REFERENCES public.bins(id), -- Where it was placed / taken from
    batch_number TEXT,
    expiry_date DATE
);

-- Stock Movement Logs (Audit Trail)
CREATE TABLE public.stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_id UUID REFERENCES public.inventory(id),
    transaction_id UUID REFERENCES public.transactions(id),
    type movement_type NOT NULL,
    quantity INTEGER NOT NULL,
    previous_qty INTEGER NOT NULL,
    new_qty INTEGER NOT NULL,
    user_id UUID REFERENCES public.profiles(id),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 6. REALTIME TRIGGERS & RLS
-- ==========================================

-- Enable Realtime for key tables
alter publication supabase_realtime add table public.inventory;
alter publication supabase_realtime add table public.transactions;
alter publication supabase_realtime add table public.stock_movements;
alter publication supabase_realtime add table public.products;

-- Example RLS (Row Level Security) - to be customized
-- ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all authenticated users" ON public.products FOR ALL TO authenticated USING (true);
