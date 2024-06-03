const toNumber = (value, fallback) => (value === undefined || value === '' ? fallback : Number(value))

module.exports = {
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT || 'mysql',
  port: toNumber(process.env.DB_PORT, 3306),
  pool: {
    max: toNumber(process.env.DB_POOL_MAX, 10),
    min: toNumber(process.env.DB_POOL_MIN, 0),
    acquire: toNumber(process.env.DB_POOL_ACQUIRE, 30000),
    idle: toNumber(process.env.DB_POOL_IDLE, 10000)
  },
  timezone: process.env.DB_TIMEZONE || '+00:00',
  logging: process.env.DB_LOGGING === 'true' ? console.log : false
}
