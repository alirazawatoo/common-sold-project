const Joi = require('joi')
const { type, styles, brands } = require('./constants')

const loginSchema = Joi.object({
  email: Joi.string().trim().required(),
  password: Joi.string().required()
})

// The brand list has ~900 entries; Joi's default message would print all of them.
const fromList = values => Joi.string().valid(...values).required()
  .messages({ 'any.only': '{{#label}} must be one of the options the API lists' })

const productSchema = Joi.object({
  product_name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  style: fromList(styles),
  brand: fromList(brands),
  url: Joi.string().allow('').default(''),
  product_type: fromList(type),
  shipping_price: Joi.number().integer().min(0).required(),
  note: Joi.string().allow('').default('')
})

// The admin UI posts back the whole product it loaded (id, timestamps...), so
// unknown keys are dropped instead of rejected.
const validateBody = schema => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { stripUnknown: true })

  if (error) {
    const message = error.details[0].message.replace(/"/g, '')
    return res.status(400).send({ message })
  }
  req.body = value
  next()
}

exports.auth = validateBody(loginSchema)
exports.product = validateBody(productSchema)
