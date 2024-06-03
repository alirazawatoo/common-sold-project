const db = require('../../models')
const helper = require('../../utils/helper')
const { attributes } = require('../../utils/constants')

const Inventory = db.inventory
const Products = db.products

// Find All inventories
exports.findAll = async (req, res) => {
  const { offset, limit } = helper.getOffsetLimit(req.query)
  const { productOptions, inventoryOptions, error } = helper.inventoryFilterOptions(req.query)
  const { order, orderByError } = helper.getOrderBy('inventories', req.query, { products: Products })

  if (error) return res.status(400).send({ error })
  if (orderByError) return res.status(400).send({ orderByError })

  const inventory = await Inventory.findAndCountAll({
    where: inventoryOptions,
    include: [{
      model: Products,
      where: productOptions,
      attributes: attributes.inventory_products,
    }],
    offset, limit, order,
    attributes: attributes.inventory
  })
  res.send(inventory)
}
