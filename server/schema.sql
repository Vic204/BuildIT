-- BuildIT schema. Run with: psql $PGDATABASE -f schema.sql
-- Then seed the catalog: npm run seed
CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL -- bcrypt hash
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  imageurl TEXT,
  price NUMERIC NOT NULL,
  brand TEXT,
  category TEXT
);
-- Catalog metadata used by the detail page + PC builder compatibility checks
ALTER TABLE products ADD COLUMN IF NOT EXISTS details TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS watts INTEGER;

CREATE TABLE IF NOT EXISTS cart (
  cartid SERIAL PRIMARY KEY,
  productid INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  qty INTEGER NOT NULL CHECK (qty > 0),
  userid INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  UNIQUE (productid, userid)
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  userid INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
