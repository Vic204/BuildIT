require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./db');

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-only-change-me';

// middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);

function generateAccessToken(user) {
  return jwt.sign({ user }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

app.get('/health', (req, res) => res.status(200).json({ ok: true }));

// --- login (keep both casings used by the frontend) ---
async function handleLogin(req, res) {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  const user = await pool.query('SELECT * FROM accounts WHERE username = $1', [username]);
  if (user.rows.length === 0) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const row = user.rows[0];
  const ok = await bcrypt.compare(password, row.password);
  if (!ok) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const sessionUser = { username: row.username, userId: row.id };
  req.session.user = sessionUser;
  const accessToken = generateAccessToken(sessionUser);
  return res.status(200).json({ accessToken, user: sessionUser, message: 'Login Successful' });
}
app.post('/login-page', asyncHandler(handleLogin));
app.post('/Login-page', asyncHandler(handleLogin));

// --- register ---
async function handleRegister(req, res) {
  const { username, password, email } = req.body || {};
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, email and password are required' });
  }
  const userExists = await pool.query(
    'SELECT 1 FROM accounts WHERE username = $1 OR email = $2',
    [username, email]
  );
  if (userExists.rows.length > 0) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const hash = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO accounts(password, email, username) VALUES ($1,$2,$3)', [
    hash,
    email,
    username,
  ]);
  return res.status(201).json({ message: 'User registered successfully' });
}
app.post('/register-page', asyncHandler(handleRegister));
app.post('/Register-page', asyncHandler(handleRegister));

// --- add to cart ---
// NOTE: generic route kept for backwards compat with old frontend.
// It must be defined AFTER specific routes (/cart-page/checkout etc.) — see below.
async function handleAddToCart(req, res) {
  const { id } = req.params;
  const { userid, userId, qty } = req.body || {};
  const ownerId = userid ?? userId;
  const quantity = parseInt(qty, 10);
  if (!ownerId || !Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: 'userid and positive qty are required' });
  }
  const product = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  if (product.rows.length === 0) {
    return res.status(404).json({ message: 'Product not found' });
  }
  const checkcart = await pool.query(
    'SELECT 1 FROM cart WHERE productid = $1 AND userid = $2',
    [id, ownerId]
  );
  if (checkcart.rows.length > 0) {
    return res.status(400).json({ message: 'Product already exists in cart' });
  }
  await pool.query('INSERT INTO cart(productid, qty, userid) VALUES ($1,$2,$3)', [
    id,
    quantity,
    ownerId,
  ]);
  return res.status(200).json({ message: 'Product added to cart successfully' });
}

// --- load cart ---
app.get(
  '/cart-page/:id',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid user id' });
    const cartitems = await pool.query(
      'SELECT cart.qty, cart.cartid, products.* FROM cart INNER JOIN products ON cart.productid = products.id WHERE cart.userid = $1',
      [id]
    );
    // Return [] instead of 404 so the frontend doesn't show an error for empty carts
    return res.status(200).json(cartitems.rows);
  })
);

// --- delete cart item (scoped to user when provided) ---
app.delete(
  '/cart-page',
  asyncHandler(async (req, res) => {
    const { Id, id, productId, userid, userId } = req.body || {};
    const productid = Id ?? id ?? productId;
    const ownerId = userid ?? userId;
    if (!productid) return res.status(400).json({ message: 'Product id is required' });
    if (ownerId) {
      const deleted = await pool.query(
        'DELETE FROM cart WHERE productid = $1 AND userid = $2 RETURNING *',
        [productid, ownerId]
      );
      if (deleted.rows.length === 0) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }
    } else {
      const existing = await pool.query('SELECT 1 FROM cart WHERE productid = $1', [productid]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }
      await pool.query('DELETE FROM cart WHERE productid = $1', [productid]);
    }
    return res.status(200).json({ message: 'Product deleted from cart successfully' });
  })
);

// --- products by category or brand (parameterized, fixes SQL injection + missing space) ---
app.get(
  '/:categoryOrBrand/:name',
  asyncHandler(async (req, res) => {
    const { categoryOrBrand, name } = req.params;
    if (!['products', 'brands'].includes(categoryOrBrand)) {
      return res.status(404).json({ message: 'Not found' });
    }
    const { filter } = req.query;
    const params = [name];
    let query =
      categoryOrBrand === 'products'
        ? 'SELECT * FROM products WHERE category = $1'
        : 'SELECT * FROM products WHERE brand = $1';
    if (filter === 'lowtohigh') query += ' ORDER BY price ASC';
    else if (filter === 'hightolow') query += ' ORDER BY price DESC';
    const products = await pool.query(query, params);
    return res.status(200).json(products.rows);
  })
);

// --- search ---
app.get(
  '/',
  asyncHandler(async (req, res) => {
    const { search } = req.query;
    // No ?search=... -> don't clash with the routes above; treat as bad request
    if (typeof search === 'undefined') {
      return res.status(400).json({ message: 'Missing ?search= query' });
    }
    const products = await pool.query('SELECT * FROM products WHERE name ILIKE $1', [
      `%${search}%`,
    ]);
    if (products.rows.length === 0) {
      return res.status(404).json({ message: 'Products not found' });
    }
    return res.status(200).json(products.rows);
  })
);

// --- single product ---
app.get(
  '/:categoryOrBrand/:name/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json(product.rows[0]);
  })
);

// Generic add-to-cart AFTER the GETs so it doesn't swallow them for POST only
app.post('/:categoryOrBrand/:category/:id', asyncHandler(handleAddToCart));

// --- checkout (was an unfinished stub) ---
app.post(
  '/cart-page/checkout',
  asyncHandler(async (req, res) => {
    const { userid, userId, formData } = req.body || {};
    const ownerId = userid ?? userId;
    if (!ownerId) return res.status(400).json({ message: 'userid is required' });
    const items = await pool.query('SELECT productid, qty FROM cart WHERE userid = $1', [ownerId]);
    if (items.rows.length === 0) return res.status(400).json({ message: 'Cart is empty' });
    await pool.query(
      `CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        userid INTEGER NOT NULL,
        items JSONB NOT NULL,
        details JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`
    );
    await pool.query('INSERT INTO orders(userid, items, details) VALUES ($1, $2, $3)', [
      ownerId,
      JSON.stringify(items.rows),
      formData ? JSON.stringify(formData) : null,
    ]);
    await pool.query('DELETE FROM cart WHERE userid = $1', [ownerId]);
    return res.status(200).json({ message: 'Checkout successful', count: items.rows.length });
  })
);

// central error handler (must be last)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
