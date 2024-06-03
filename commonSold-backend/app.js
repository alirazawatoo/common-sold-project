require('dotenv').config({ quiet: true })

const createApp = require('./config/app')
const db = require('./models')

const port = Number(process.env.PORT) || 5000

const start = async () => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set; copy .env.example to .env first.')

  await db.sequelize.authenticate()
  // Creates missing tables only; it never alters or drops existing ones.
  await db.sequelize.sync()

  createApp().listen(port, () => console.log(`API listening on port ${port}`))
}

start().catch(err => {
  console.error(`Could not start the API: ${err.message}`)
  process.exit(1)
})
