const request = require('supertest')
const createApp = require('../../config/app')
const jwt = require('../../utils/jwt')

const app = createApp()
const token = jwt.signToken({ userId: 1, name: 'Test Admin', email: 'admin@example.com' })

describe('authentication guard', () => {
  it.each(['orders', 'inventories', 'products'])('rejects /%s without a token', async resource => {
    const res = await request(app).get(`/api/v1/${resource}`)
    expect(res.status).toBe(401)
  })

  it('rejects a token signed with another secret', async () => {
    const forged = require('jsonwebtoken').sign({ userId: 1 }, 'not-the-secret')
    const res = await request(app).get('/api/v1/products').set('access-token', forged)
    expect(res.status).toBe(401)
  })

  it('serves the option lists to a signed-in admin', async () => {
    const res = await request(app).get('/api/v1/products/types').set('access-token', token)
    expect(res.status).toBe(200)
    expect(res.body).toEqual(['clothing'])
  })
})

describe('request validation', () => {
  it('requires an email and password to log in', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@example.com' })
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('password is required')
  })

  it('rejects a product whose brand is not in the list', async () => {
    const res = await request(app).post('/api/v1/products').set('access-token', token).send({
      product_name: 'Scarf', description: 'Wool', style: 'Retro', brand: 'Not A Brand',
      product_type: 'clothing', shipping_price: 300
    })
    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/^brand must be one of/)
  })

  it('rejects a negative shipping price on update', async () => {
    const res = await request(app).put('/api/v1/products/1').set('access-token', token).send({
      product_name: 'Scarf', description: 'Wool', style: 'Retro', brand: 'Vila',
      product_type: 'clothing', shipping_price: -1
    })
    expect(res.status).toBe(400)
  })

  it('answers malformed JSON with 400', async () => {
    const res = await request(app).post('/api/v1/auth/login')
      .set('content-type', 'application/json').send('{"email":')
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Malformed JSON body.')
  })

  it('answers unknown routes with a JSON 404', async () => {
    const res = await request(app).get('/api/v1/nothing-here')
    expect(res.status).toBe(404)
  })
})
