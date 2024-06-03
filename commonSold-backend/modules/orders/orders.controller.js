const db = require('../../models')
const helper = require('../../utils/helper')
const { attributes } = require('../../utils/constants')

const Inventory = db.inventory
const Orders = db.orders
const Products = db.products

// Find All Orders, with the sale totals for the same filter
exports.findAll = async (req, res) => {
  const { offset, limit } = helper.getOffsetLimit(req.query)
  const { orderOptions } = helper.ordersFilterOptions(req.query)
  const { order, orderByError } = helper.getOrderBy('orders', req.query, { products: Products })

  if (orderByError) return res.status(400).send({ orderByError })

  const [rows, count, totalSale] = await Promise.all([
    Orders.findAll({
      where: orderOptions,
      include: [
        { model: Products, attributes: attributes.order_products },
        { model: Inventory, attributes: attributes.order_inventory }
      ],
      offset, limit, order,
      attributes: attributes.orders
    }),
    Orders.count({ where: orderOptions }),
    Orders.sum('total_cents', { where: orderOptions })
  ])

  const total = totalSale || 0
  const average = count ? Math.round(total / count) : 0

  res.send({ totalSale: total, average, count, rows })
}
