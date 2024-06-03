const { Op } = require('sequelize')
const helper = require('../../utils/helper')
const db = require('../../models')

describe('getOffsetLimit', () => {
  it('defaults to the first page of 20', () => {
    expect(helper.getOffsetLimit({})).toEqual({ limit: 20, offset: 0 })
  })

  it('turns a page number into an offset', () => {
    expect(helper.getOffsetLimit({ page: '3', limit: '10' })).toEqual({ limit: 10, offset: 30 })
  })

  it('caps the page size and ignores nonsense', () => {
    expect(helper.getOffsetLimit({ page: '-2', limit: '5000' })).toEqual({ limit: 100, offset: 0 })
    expect(helper.getOffsetLimit({ page: 'abc', limit: '0' })).toEqual({ limit: 1, offset: 0 })
  })
})

describe('inventoryFilterOptions', () => {
  it('filters product names with LIKE', () => {
    const { productOptions } = helper.inventoryFilterOptions({ name: 'dress' })
    expect(productOptions.product_name[Op.like]).toBe('%dress%')
  })

  it.each([['lt', Op.lt], ['gt', Op.gt], ['eq', Op.eq]])('maps %s to a quantity comparison', (operator, op) => {
    const { inventoryOptions, error } = helper.inventoryFilterOptions({ quantity: '5', operator })
    expect(error).toBe('')
    expect(inventoryOptions.quantity[op]).toBe(5)
  })

  it('rejects an unknown operator or a fractional quantity', () => {
    expect(helper.inventoryFilterOptions({ quantity: '5', operator: 'gte' }).error).toBe('Invalid Operator.')
    expect(helper.inventoryFilterOptions({ quantity: '2.5', operator: 'lt' }).error).toMatch(/whole number/)
  })

  it('treats quantity 0 as a real threshold', () => {
    const { inventoryOptions } = helper.inventoryFilterOptions({ quantity: '0', operator: 'eq' })
    expect(inventoryOptions.quantity[Op.eq]).toBe(0)
  })
})

describe('ordersFilterOptions', () => {
  it('searches name, email, transaction and tracking number', () => {
    const { orderOptions } = helper.ordersFilterOptions({ name: 'ada' })
    expect(orderOptions[Op.or].map(clause => Object.keys(clause)[0]))
      .toEqual(['name', 'email', 'transaction_id', 'tracking_number'])
  })

  it('matches status and shipper exactly', () => {
    expect(helper.ordersFilterOptions({ order_status: 'Paid', shipper: 'UPS' }).orderOptions)
      .toEqual({ order_status: 'Paid', shipper_name: 'UPS' })
  })
})

describe('getOrderBy', () => {
  it('returns no order when sorting is not requested', () => {
    expect(helper.getOrderBy('products', {})).toEqual({ order: [], orderByError: '' })
  })

  it('sorts by an allowed column of the endpoint table', () => {
    const query = { sort_table_name: 'orders', sort_column: 'total_cents', sort_order: 'desc' }
    expect(helper.getOrderBy('orders', query).order).toEqual([['total_cents', 'DESC']])
  })

  it('sorts through an associated model', () => {
    const query = { sort_table_name: 'products', sort_column: 'product_name', sort_order: 'asc' }
    const { order } = helper.getOrderBy('inventories', query, { products: db.products })
    expect(order).toEqual([[db.products, 'product_name', 'ASC']])
  })

  it.each([
    ['a column that is not whitelisted', { sort_table_name: 'orders', sort_column: 'payment_ref', sort_order: 'asc' }],
    ['a table the endpoint does not join', { sort_table_name: 'users', sort_column: 'email', sort_order: 'asc' }],
    ['an injected direction', { sort_table_name: 'orders', sort_column: 'name', sort_order: 'asc; DROP TABLE orders' }]
  ])('rejects %s', (label, query) => {
    expect(helper.getOrderBy('orders', query).orderByError).toBe('Invalid sorting parameters.')
  })
})
