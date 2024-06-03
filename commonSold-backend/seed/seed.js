// Creates the schema and loads a small, fictional boutique: two admins, a dozen
// products with their stock rows, and a few dozen orders. Every name, email
// address and tracking number here is made up.
//
//   npm run seed            create tables, load data only if there are no users
//   npm run seed -- --reset drop and recreate every table first
require('dotenv').config({ quiet: true })

const bcrypt = require('bcrypt')
const db = require('../models')

const DEMO_PASSWORD = 'Stockroom1'

const admins = [
  { name: 'Morgan Avery', email: 'demo@example.com', shop_name: 'Fernhill Threads', shop_domain: 'fernhill.example.com' },
  { name: 'Riley Chen', email: 'riley@example.com', shop_name: 'Harbour Lane Studio', shop_domain: 'harbourlane.example.com' }
]

// [name, style, brand, shipping cents, [color, size, quantity, price cents]...]
const catalogue = [
  ['Linen Wrap Dress', 'Vacation', 'Vila', 595, [['Sand', 'S', 14, 6400], ['Sand', 'M', 3, 6400], ['Olive', 'L', 0, 6400]]],
  ['Ribbed Knit Cardigan', 'Casual Chic', 'Only', 495, [['Oat', 'M', 22, 5200], ['Charcoal', 'L', 9, 5200]]],
  ['High-Rise Straight Jeans', 'Streetwear', 'Lee', 695, [['Indigo', '28', 31, 7800], ['Indigo', '30', 18, 7800], ['Black', '30', 6, 7800]]],
  ['Quilted Barn Jacket', 'Formal Office Wear', 'Woolrich', 895, [['Moss', 'M', 4, 14900], ['Navy', 'L', 11, 14900]]],
  ['Pleated Midi Skirt', 'Girly', 'Next', 495, [['Rose', 'S', 27, 4600], ['Ink', 'M', 15, 4600]]],
  ['Cotton Crew Tee', 'Casual Chic', 'Hanes', 395, [['White', 'S', 58, 1800], ['White', 'M', 72, 1800], ['Black', 'M', 41, 1800]]],
  ['Wool Blend Overcoat', 'Business Casual', 'Theory', 995, [['Camel', 'M', 2, 21900], ['Camel', 'L', 5, 21900]]],
  ['Satin Slip Camisole', 'Evening Black Tie', 'Vince', 395, [['Champagne', 'XS', 12, 3900], ['Black', 'S', 19, 3900]]],
  ['Fleece Track Pants', 'Sports Wear', 'Champion', 495, [['Heather', 'M', 33, 3400], ['Navy', 'XL', 8, 3400]]],
  ['Corduroy Overshirt', 'Retro', 'Levi\'s', 595, [['Rust', 'M', 16, 5900], ['Forest', 'L', 1, 5900]]],
  ['Smocked Maxi Dress', 'Boho/Bohemian chic', 'Free People', 595, [['Terracotta', 'S', 7, 8800], ['Ivory', 'M', 13, 8800]]],
  ['Canvas Utility Vest', 'Military', 'Carhartt Work in Progress', 595, [['Khaki', 'M', 10, 6900], ['Black', 'L', 0, 6900]]]
]

const customers = [
  'Ada Whitlock', 'Bruno Okafor', 'Celia Marchetti', 'Dev Raman', 'Elif Sorensen', 'Felix Navarro',
  'Greta Lindqvist', 'Hugo Achterberg', 'Ines Carvalho', 'Jonah Pike', 'Keiko Mori', 'Luca Brandt',
  'Mira Haddad', 'Noel Ferreira', 'Orla Keane', 'Pavel Novak', 'Quinn Delacroix', 'Rosa Ibarra'
]
const statuses = ['Pending', 'Paid', 'Fulfilled', 'Shipped', 'Open']
const shippers = ['USPS', 'DHL', 'FedEx', 'UPS']
const ORDER_COUNT = 36

// Small deterministic generator so every seed run produces identical data.
const random = (() => {
  let state = 20221
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state / 2147483648
  }
})()
const pick = list => list[Math.floor(random() * list.length)]

const userRow = (admin, passwordHash, index) => ({
  ...admin,
  password_hash: passwordHash,
  superadmin: false,
  remember_token: '',
  card_brand: 'Visa',
  card_last_four: String(4242 + index).slice(-4),
  billing_plan: 'starter',
  is_enabled: true,
  trial_starts_at: new Date('2026-01-05T00:00:00Z'),
  trial_ends_at: new Date('2026-02-04T00:00:00Z')
})

const seedData = async () => {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)
  const users = await db.users.bulkCreate(admins.map((admin, index) => userRow(admin, passwordHash, index)))

  const variants = []
  for (const [index, [product_name, style, brand, shipping_price, stock]] of catalogue.entries()) {
    const product = await db.products.create({
      product_name,
      description: `${product_name} from the ${style.toLowerCase()} edit.`,
      style,
      brand,
      url: '',
      product_type: 'clothing',
      shipping_price,
      note: '',
      admin_id: users[index % 3 === 2 ? 1 : 0].id
    })
    for (const [color, size, quantity, price_cents] of stock) {
      const sku = `FH-${String(product.id).padStart(3, '0')}-${color.slice(0, 3).toUpperCase()}-${size}`
      variants.push(await db.inventory.create({
        product_id: product.id, sku, color, size, quantity, price_cents,
        sale_price_cents: price_cents,
        cost_cents: Math.round(price_cents * 0.45),
        weight: 0.6, length: 30, width: 25, height: 4, note: ''
      }))
    }
  }

  const orders = []
  for (let n = 1; n <= ORDER_COUNT; n += 1) {
    const variant = pick(variants)
    const name = pick(customers)
    const status = pick(statuses)
    const shipped = status === 'Shipped' || status === 'Fulfilled'
    const subtotal = variant.price_cents * (1 + Math.floor(random() * 2))
    const shipping = 595
    const tax = Math.round(subtotal * 0.07)
    const paidAt = new Date(Date.UTC(2026, 9, 1 + (n % 28), 9 + (n % 9)))
    orders.push({
      product_id: variant.product_id,
      inventory_id: variant.id,
      name,
      email: `${name.split(' ')[0].toLowerCase()}.${n}@example.com`,
      street_address: `${100 + n * 7} Example Street`,
      apartment: n % 3 ? '' : `Unit ${n}`,
      city: pick(['Springfield', 'Riverton', 'Lakeside', 'Fairview']),
      state: pick(['CA', 'OR', 'TX', 'NY']),
      country_code: 'US',
      zip: String(90000 + n * 13),
      phone_number: `555-01${String(n).padStart(2, '0')}`,
      order_status: status,
      payment_ref: `pay_demo_${String(n).padStart(4, '0')}`,
      transaction_id: `TXN-DEMO-${String(1000 + n)}`,
      payment_amt_cents: subtotal + shipping + tax,
      ship_charged_cents: shipping,
      ship_cost_cents: 410,
      subtotal_cents: subtotal,
      tax_total_cents: tax,
      total_cents: subtotal + shipping + tax,
      shipper_name: pick(shippers),
      payment_date: paidAt,
      shipped_date: paidAt,
      tracking_number: shipped ? `TRK${String(700000 + n * 37)}` : ''
    })
  }
  await db.orders.bulkCreate(orders)

  return { users: users.length, products: catalogue.length, inventory: variants.length, orders: orders.length }
}

const seed = async ({ reset = false } = {}) => {
  await db.sequelize.sync({ force: reset })
  if (!reset && await db.users.count()) return null
  return seedData()
}

module.exports = { seed, DEMO_PASSWORD }

if (require.main === module) {
  seed({ reset: process.argv.includes('--reset') })
    .then(result => {
      console.log(result ? `Seeded ${JSON.stringify(result)}` : 'Database already has data; nothing seeded.')
      return db.sequelize.close()
    })
    .catch(err => {
      console.error(`Seeding failed: ${err.message}`)
      process.exit(1)
    })
}
