// Runs the API against a real MySQL database loaded with the demo seed.
// Skipped unless TEST_DATABASE=1 (see `npm run test:db`). It drops and
// recreates every table, so point it at a throwaway database.
const request = require('supertest')
const createApp = require('../../config/app')
const db = require('../../models')
const { seed, DEMO_PASSWORD } = require('../../seed/seed')

const describeDb = process.env.TEST_DATABASE === '1' ? describe : describe.skip
const app = createApp()

const login = async email => {
  const res = await request(app).post('/api/v1/auth/login').send({ email, password: DEMO_PASSWORD })
  return res.body.token
}

const productBody = overrides => ({
  product_name: 'Merino Beanie',
  description: 'Rib knit, one size.',
  style: 'Casual Chic',
  brand: 'Vila',
  product_type: 'clothing',
  shipping_price: 350,
  url: '',
  note: '',
  ...overrides
})

describeDb('API against MySQL', () => {
  let demoToken
  let rileyToken

  beforeAll(async () => {
    await seed({ reset: true })
    demoToken = await login('demo@example.com')
    rileyToken = await login('riley@example.com')
  })

  afterAll(() => db.sequelize.close())

  const get = path => request(app).get(`/api/v1/${path}`).set('access-token', demoToken)

  describe('login', () => {
    it('issues a token for the right password', () => {
      expect(demoToken).toEqual(expect.any(String))
    })

    it('refuses a wrong password and an unknown email the same way', async () => {
      const wrong = await request(app).post('/api/v1/auth/login').send({ email: 'demo@example.com', password: 'nope' })
      const unknown = await request(app).post('/api/v1/auth/login').send({ email: 'ghost@example.com', password: 'nope' })
      expect([wrong.status, unknown.status]).toEqual([401, 401])
      expect(wrong.body).toEqual(unknown.body)
    })
  })

  describe('orders', () => {
    it('reports totals and the average for the filtered set only', async () => {
      const paid = await db.orders.findAll({ where: { order_status: 'Paid' } })
      const expectedTotal = paid.reduce((sum, order) => sum + order.total_cents, 0)

      const res = await get('orders?order_status=Paid&limit=2')
      expect(res.status).toBe(200)
      expect(res.body.count).toBe(paid.length)
      expect(res.body.totalSale).toBe(expectedTotal)
      expect(res.body.average).toBe(Math.round(expectedTotal / paid.length))
      expect(res.body.rows).toHaveLength(2)
    })

    it('returns zeros when nothing matches', async () => {
      const res = await get('orders?name=no-such-customer')
      expect(res.body).toMatchObject({ count: 0, totalSale: 0, average: 0, rows: [] })
    })

    it('includes the ordered variant, not every variant of the product', async () => {
      const res = await get('orders?limit=100')
      for (const row of res.body.rows) {
        const order = await db.orders.findByPk(row.id)
        const variant = await db.inventory.findByPk(order.inventory_id)
        expect(row.inventory).toEqual({ color: variant.color, size: variant.size })
      }
    })

    it('sorts by product name through the join', async () => {
      const res = await get('orders?sort_table_name=products&sort_column=product_name&sort_order=asc&limit=100')
      const names = res.body.rows.map(row => row.product.product_name)
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
    })

    it('refuses to sort by a column that is not exposed', async () => {
      const res = await get('orders?sort_table_name=orders&sort_column=payment_ref&sort_order=asc')
      expect(res.status).toBe(400)
    })
  })

  describe('inventory', () => {
    it('filters stock below a threshold', async () => {
      const res = await get('inventories?quantity=5&operator=lt&limit=100')
      expect(res.body.count).toBe(await db.inventory.count({ where: { quantity: { [db.Sequelize.Op.lt]: 5 } } }))
      expect(res.body.rows.every(row => row.quantity < 5)).toBe(true)
    })

    it('searches by product name and pages the result', async () => {
      const res = await get('inventories?name=Jeans&limit=2&page=1')
      expect(res.body.count).toBe(3)
      expect(res.body.rows).toHaveLength(1)
      expect(res.body.rows[0].product.product_name).toBe('High-Rise Straight Jeans')
    })
  })

  describe('products', () => {
    it('creates, reads, updates and deletes a product', async () => {
      const created = await request(app).post('/api/v1/products').set('access-token', demoToken).send(productBody())
      expect(created.status).toBe(201)

      const path = `/api/v1/products/${created.body.id}`
      const fetched = await request(app).get(path).set('access-token', demoToken)
      expect(fetched.body).toMatchObject({ product_name: 'Merino Beanie', shipping_price: 350 })

      // The admin UI sends back the whole record it loaded.
      const updated = await request(app).put(path).set('access-token', demoToken)
        .send({ ...fetched.body, product_name: 'Merino Rib Beanie' })
      expect(updated.status).toBe(200)
      expect((await db.products.findByPk(created.body.id)).product_name).toBe('Merino Rib Beanie')

      expect((await request(app).delete(path).set('access-token', demoToken)).status).toBe(200)
      expect((await request(app).get(path).set('access-token', demoToken)).status).toBe(404)
    })

    it("does not let one admin change another admin's product", async () => {
      const product = await db.products.findOne({ where: { product_name: 'Linen Wrap Dress' } })
      const res = await request(app).put(`/api/v1/products/${product.id}`).set('access-token', rileyToken)
        .send(productBody({ product_name: 'Hijacked' }))
      expect(res.status).toBe(403)
      expect((await product.reload()).product_name).toBe('Linen Wrap Dress')
    })

    it('refuses to delete a product that has orders', async () => {
      const order = await db.orders.findOne({ include: [{ model: db.products, where: { admin_id: 1 } }] })
      const res = await request(app).delete(`/api/v1/products/${order.product_id}`).set('access-token', demoToken)
      expect(res.status).toBe(409)
      expect(await db.products.findByPk(order.product_id)).not.toBeNull()
    })

    it('deletes the stock rows along with an unordered product', async () => {
      const product = await db.products.create({ ...productBody(), admin_id: 1 })
      await db.inventory.create({
        product_id: product.id, sku: 'TMP-1', color: 'Grey', size: 'OS', quantity: 3, price_cents: 2500,
        sale_price_cents: 2500, cost_cents: 1000, weight: 0.1, length: 1, width: 1, height: 1, note: ''
      })
      await request(app).delete(`/api/v1/products/${product.id}`).set('access-token', demoToken)
      expect(await db.inventory.count({ where: { product_id: product.id } })).toBe(0)
    })
  })
})
