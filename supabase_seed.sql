-- ==========================================
-- 7. SEED MOCK DATA
-- ==========================================

-- Categories
INSERT INTO public.categories (id, name, description) VALUES
('c1000000-0000-0000-0000-000000000000', 'Electronics', 'Electronic devices and accessories'),
('c2000000-0000-0000-0000-000000000000', 'Clothing', 'Apparel and accessories')
ON CONFLICT DO NOTHING;

-- Suppliers
INSERT INTO public.suppliers (id, name, contact_name, phone, email, address) VALUES
('s1000000-0000-0000-0000-000000000000', 'TechSource Inc', 'John Doe', '555-0100', 'john@techsource.com', '123 Tech Blvd'),
('s2000000-0000-0000-0000-000000000000', 'FashionHub', 'Jane Smith', '555-0200', 'jane@fashionhub.com', '456 Fashion Ave')
ON CONFLICT DO NOTHING;

-- Warehouses
INSERT INTO public.warehouses (id, name, address) VALUES
('w1000000-0000-0000-0000-000000000000', 'Main Warehouse Jakarta', 'Jl. Sudirman 1, Jakarta')
ON CONFLICT DO NOTHING;

-- Zones
INSERT INTO public.zones (id, warehouse_id, name, type) VALUES
('z1000000-0000-0000-0000-000000000000', 'w1000000-0000-0000-0000-000000000000', 'Zone A', 'Electronics Storage'),
('z2000000-0000-0000-0000-000000000000', 'w1000000-0000-0000-0000-000000000000', 'Zone B', 'Clothing Storage')
ON CONFLICT DO NOTHING;

-- Products
INSERT INTO public.products (id, sku, name, category_id, unit, price, min_stock) VALUES
('p1000000-0000-0000-0000-000000000000', 'SKU-ELEC-001', 'Wireless Mouse', 'c1000000-0000-0000-0000-000000000000', 'pcs', 25.50, 50),
('p2000000-0000-0000-0000-000000000000', 'SKU-ELEC-002', 'Mechanical Keyboard', 'c1000000-0000-0000-0000-000000000000', 'pcs', 85.00, 30),
('p3000000-0000-0000-0000-000000000000', 'SKU-CLOT-001', 'Cotton T-Shirt L', 'c2000000-0000-0000-0000-000000000000', 'pcs', 12.00, 100)
ON CONFLICT DO NOTHING;
