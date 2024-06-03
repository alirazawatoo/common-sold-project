'use strict'

const ordersController = require('./orders.controller')
const express = require('express')
const router = express.Router()

router.get('/', ordersController.findAll)

module.exports = router
