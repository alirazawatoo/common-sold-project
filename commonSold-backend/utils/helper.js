const db = require('../models')

const Op = db.Sequelize.Op
const MAX_PAGE_SIZE = 100

// Sorting is driven by query params, so only these columns may reach ORDER BY.
const sortableColumns = {
  inventories: {
    inventories: ['sku', 'quantity', 'color', 'size', 'price_cents', 'cost_cents'],
    products: ['product_name']
  },
  orders: {
    orders: ['name', 'email', 'order_status', 'total_cents', 'transaction_id', 'shipper_name', 'tracking_number'],
    products: ['product_name']
  },
  products: {
    products: ['product_name', 'style', 'brand']
  }
}

const quantityOperators = { lt: Op.lt, gt: Op.gt, eq: Op.eq }

const toWholeNumber = (value, fallback) => {
  const number = Number.parseInt(value, 10)
  return Number.isNaN(number) || number < 0 ? fallback : number
}

exports.getOffsetLimit = ({ page, limit }) => {
  const pageSize = Math.min(Math.max(toWholeNumber(limit, 20), 1), MAX_PAGE_SIZE)
  return { limit: pageSize, offset: toWholeNumber(page, 0) * pageSize }
}

exports.inventoryFilterOptions = ({ name, quantity, operator }) => {
  const productOptions = {}
  const inventoryOptions = {}
  let error = ''

  if (name) productOptions.product_name = { [Op.like]: `%${name}%` }

  if (quantity !== undefined && quantity !== '') {
    const threshold = Number(quantity)
    if (!Number.isInteger(threshold)) error = 'Quantity must be a whole number.'
    else if (!quantityOperators[operator]) error = 'Invalid Operator.'
    else inventoryOptions.quantity = { [quantityOperators[operator]]: threshold }
  }

  return { productOptions, inventoryOptions, error }
}

exports.ordersFilterOptions = ({ name, order_status, shipper }) => {
  const orderOptions = {}

  if (name) {
    orderOptions[Op.or] = ['name', 'email', 'transaction_id', 'tracking_number']
      .map(column => ({ [column]: { [Op.like]: `%${name}%` } }))
  }
  if (order_status) orderOptions.order_status = order_status
  if (shipper) orderOptions.shipper_name = shipper

  return { orderOptions }
}

// Returns a Sequelize `order` for one list endpoint, or an error for a column or
// direction that is not allowed there. `models` maps a table name to the model
// to sort through when it is not the endpoint's own table.
exports.getOrderBy = (resource, { sort_table_name, sort_column, sort_order }, models = {}) => {
  if (!sort_column || !sort_order) return { order: [], orderByError: '' }

  const direction = String(sort_order).toUpperCase()
  const allowed = sortableColumns[resource][sort_table_name] || []

  if (!['ASC', 'DESC'].includes(direction) || !allowed.includes(sort_column))
    return { order: [], orderByError: 'Invalid sorting parameters.' }

  const order = sort_table_name === resource
    ? [[sort_column, direction]]
    : [[models[sort_table_name], sort_column, direction]]

  return { order, orderByError: '' }
}
