const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validateLogin = (values) => {
  const errors = {}
  if (!values.email) errors.email = 'Enter your email address'
  else if (!EMAIL.test(values.email)) errors.email = 'That does not look like an email address'
  if (!values.password) errors.password = 'Enter your password'
  return errors
}

const required = {
  product_name: 'Give the product a name',
  description: 'Add a short description',
  product_type: 'Choose a product type',
  style: 'Choose a style',
  brand: 'Choose a brand',
}

export const validateProduct = (values) => {
  const errors = {}
  Object.entries(required).forEach(([field, message]) => {
    if (!String(values[field] ?? '').trim()) errors[field] = message
  })
  if (values.shipping_price === '' || values.shipping_price === undefined) {
    errors.shipping_price = 'Enter the shipping charge in cents'
  } else if (!/^\d+$/.test(String(values.shipping_price))) {
    errors.shipping_price = 'Use a whole number of cents, such as 595'
  }
  if (values.url && !/^https?:\/\/\S+$/i.test(values.url)) {
    errors.url = 'Use a full link starting with http:// or https://'
  }
  return errors
}
