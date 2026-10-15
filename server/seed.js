/* Seed the products catalog from seed_products.csv (pipe-delimited).
   Usage: npm run seed [-- --force to wipe + reseed] */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./db');

const FORCE = process.argv.includes('--force');

async function main() {
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS details TEXT`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS watts INTEGER`);

  const existing = await pool.query('SELECT COUNT(*)::int AS n FROM products');
  if (existing.rows[0].n > 40 && !FORCE) {
    console.log(`products already seeded (${existing.rows[0].n} rows). Use --force to reseed.`);
    await pool.end();
    return;
  }
  if (FORCE) await pool.query('DELETE FROM products');

  const raw = fs.readFileSync(path.join(__dirname, 'seed_products.csv'), 'utf8').trim().split('\n');
  const [, ...rows] = raw; // skip header
  let inserted = 0;
  for (const line of rows) {
    if (!line.trim()) continue;
    const [name, imageurl, price, brand, category, details, watts] = line.split('|').map((s) => s.trim());
    const dupe = await pool.query('SELECT 1 FROM products WHERE name = $1 LIMIT 1', [name]);
    if (dupe.rows.length > 0 && !FORCE) continue;
    await pool.query(
      'INSERT INTO products(name, imageurl, price, brand, category, details, watts) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [name, imageurl || null, price, brand.toLowerCase(), category.toLowerCase(), details || null, watts ? parseInt(watts, 10) : null]
    );
    inserted++;
  }
  const total = await pool.query('SELECT COUNT(*)::int AS n FROM products');
  console.log(`Seeded ${inserted} products. Catalog now holds ${total.rows[0].n} rows.`);
  await pool.end();
}

main().catch(async (e) => {
  console.error(e.message);
  try { await pool.end(); } catch {}
  process.exit(1);
});
