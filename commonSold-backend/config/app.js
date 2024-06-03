const cors = require('cors')
const express = require('express')

const registerRoutes = require('../routes/routes')

const createApp = () => {
  const app = express()

  app.disable('x-powered-by')
  app.use(cors())
  app.use(express.json())

  registerRoutes(app)

  app.use((req, res) => res.status(404).send({ message: 'Not found.' }))

  // Express 5 forwards rejected async handlers here.
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') return res.status(400).send({ message: 'Malformed JSON body.' })

    console.error(err)
    res.status(500).send({ message: 'Something went wrong on our side.' })
  })

  return app
}

module.exports = createApp
