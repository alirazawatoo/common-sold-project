'use strict'

const jwt = require('../utils/jwt')

const authenticationRouteHandler = require('../modules/authentication/router')
const inventoriesRouteHandler = require('../modules/inventories/router')
const ordersRouteHandler = require('../modules/orders/router')
const productsRouteHandler = require('../modules/products/router')

const registerRoutes = app => {
  const prefix = process.env.API_VERSION || '/api/v1/'

  app.use(`${prefix}auth`, authenticationRouteHandler)
  app.use(`${prefix}orders`, jwt.protect, ordersRouteHandler)
  app.use(`${prefix}inventories`, jwt.protect, inventoriesRouteHandler)
  app.use(`${prefix}products`, jwt.protect, productsRouteHandler)

  app.get('/', (req, res) => res.send('Server Running'))
}

module.exports = registerRoutes
