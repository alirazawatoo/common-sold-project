const helper = require('../../utils/helper')
const db = require('../../models')
const { type, styles, brands } = require('../../utils/constants')

const Inventory = db.inventory
const Orders = db.orders
const Products = db.products

const productFields = ({ product_name, description, style, brand, url, product_type, shipping_price, note }) => ({
  product_name: product_name.trim(),
  description: description.trim(),
  style,
  brand,
  url: url.trim(),
  product_type,
  shipping_price,
  note: note.trim()
})

// Only the admin who created a product, or a superadmin, may change it.
const findEditableProduct = async (req, res) => {
  const product = await Products.findByPk(req.params.productId)

  if (!product) {
    res.status(404).send({ message: 'Product not found.' })
    return null
  }
  if (product.admin_id !== req.userId && !req.superadmin) {
    res.status(403).send({ message: 'You can only change your own products.' })
    return null
  }
  return product
}

// Create and Save a new Product
exports.create = async (req, res) => {
  try {
    const product = await Products.create({ ...productFields(req.body), admin_id: req.userId })
    res.status(201).send({ message: 'Product successfully created.', id: product.id })
  } catch (err) {
    res.status(500).send({ message: 'Some error occurred while creating the product.' })
  }
}

// Find All Products
exports.findAll = async (req, res) => {
  try {
    const { offset, limit } = helper.getOffsetLimit(req.query)
    const { order, orderByError } = helper.getOrderBy('products', req.query)

    if (orderByError) return res.status(400).send({ orderByError })

    res.send(await Products.findAndCountAll({ offset, limit, order }))
  } catch (err) {
    res.status(500).send({ message: 'Some error occurred while retrieving products.' })
  }
}

exports.findAllTypes = (req, res) => res.send(type)

exports.findAllBrands = (req, res) => res.send(brands)

exports.findAllStyles = (req, res) => res.send(styles)

// Find Product by ID
exports.findById = async (req, res) => {
  try {
    const product = await Products.findByPk(req.params.productId)
    if (!product) return res.status(404).send({ message: 'Product not found.' })
    res.send(product)
  } catch (err) {
    res.status(500).send({ message: 'Some error occurred while retrieving products.' })
  }
}

// Update a product by the id in the request
exports.update = async (req, res) => {
  try {
    const product = await findEditableProduct(req, res)
    if (!product) return

    await product.update(productFields(req.body))
    res.send({ message: 'Product was updated successfully.' })
  } catch (err) {
    res.status(500).send({ message: 'Error updating product.' })
  }
}

// Delete a product and its stock rows; products that have been ordered stay.
exports.deleteById = async (req, res) => {
  try {
    const product = await findEditableProduct(req, res)
    if (!product) return

    const orderCount = await Orders.count({ where: { product_id: product.id } })
    if (orderCount)
      return res.status(409).send({ message: 'This product has orders, so it cannot be deleted.' })

    await db.sequelize.transaction(async transaction => {
      await Inventory.destroy({ where: { product_id: product.id }, transaction })
      await product.destroy({ transaction })
    })
    res.send({ message: 'Product is successfully deleted.' })
  } catch (err) {
    res.status(500).send({ message: 'Error deleting product.' })
  }
}
