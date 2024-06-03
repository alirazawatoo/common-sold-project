import { validateLogin, validateProduct } from 'utils/validations'

const product = {
  product_name: 'Scarf', description: 'Wool', style: 'Retro', brand: 'Vila', product_type: 'clothing', shipping_price: '300', url: '', note: '',
}

describe('validations', () => {
  it('requires a well-formed email and a password to log in', () => {
    expect(validateLogin({ email: '', password: '' })).toEqual({
      email: 'Enter your email address', password: 'Enter your password',
    })
    expect(validateLogin({ email: 'demo@example', password: 'x' }).email).toBeDefined()
    expect(validateLogin({ email: 'demo@example.com', password: 'x' })).toEqual({})
  })

  it('accepts a complete product', () => {
    expect(validateProduct(product)).toEqual({})
  })

  it('rejects blank names, fractional shipping and odd links', () => {
    expect(validateProduct({
      ...product, product_name: '  ', shipping_price: '5.95', url: 'ftp://x',
    })).toEqual({
      product_name: 'Give the product a name',
      shipping_price: 'Use a whole number of cents, such as 595',
      url: 'Use a full link starting with http:// or https://',
    })
  })

  it('treats a shipping charge of 0 as valid', () => {
    expect(validateProduct({ ...product, shipping_price: 0 })).toEqual({})
  })
})
