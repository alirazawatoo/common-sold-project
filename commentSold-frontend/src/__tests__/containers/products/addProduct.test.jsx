import { screen, waitFor } from '@testing-library/react'

import {
  createProduct, fetchProduct, fetchProductOptions, updateProduct,
} from 'api/products'
import ProductForm from 'container/products/addProduct'
import { renderAt } from 'utils/test'

vi.mock('api/products', () => ({
  createProduct: vi.fn(),
  fetchProduct: vi.fn(),
  fetchProductOptions: vi.fn(),
  updateProduct: vi.fn(),
}))

const options = { style: ['Retro', 'Vacation'], brand: ['Vila', 'Hanes'], product_type: ['clothing'] }

const choose = async (user, label, option) => {
  await user.click(screen.getByRole('combobox', { name: label }))
  await user.click(await screen.findByRole('option', { name: option }))
}

describe('Product form', () => {
  beforeEach(() => vi.mocked(fetchProductOptions).mockResolvedValue(options))
  afterEach(() => vi.clearAllMocks())

  it('adds a product with the shipping charge as a number', async () => {
    vi.mocked(createProduct).mockResolvedValue({ id: 13 })
    const { user } = renderAt(<ProductForm />, { route: '/products/new', path: '/products/new' })

    await user.type(await screen.findByLabelText('Product name'), 'Merino Beanie')
    await user.type(screen.getByLabelText('Description'), 'Rib knit.')
    await choose(user, 'Product type', 'clothing')
    await choose(user, 'Style', 'Retro')
    await choose(user, 'Brand', 'Vila')
    await user.type(screen.getByLabelText('Shipping (cents)'), '350')
    await user.click(screen.getByRole('button', { name: 'Add product' }))

    await waitFor(() => expect(createProduct).toHaveBeenCalled())
    expect(createProduct.mock.calls[0][0]).toMatchObject({
      product_name: 'Merino Beanie', style: 'Retro', brand: 'Vila', product_type: 'clothing', shipping_price: 350,
    })
    expect(await screen.findByTestId('location')).toHaveTextContent('/products')
  })

  it('loads an existing product into the form and saves changes', async () => {
    vi.mocked(fetchProduct).mockResolvedValue({
      id: 7,
      product_name: 'Linen Wrap Dress',
      description: 'Breezy.',
      style: 'Vacation',
      brand: 'Vila',
      product_type: 'clothing',
      shipping_price: 595,
      note: '',
      url: '',
      admin_id: 1,
    })
    vi.mocked(updateProduct).mockResolvedValue({})
    const { user } = renderAt(<ProductForm />, { route: '/products/7/edit', path: '/products/:id/edit' })

    const name = await screen.findByLabelText('Product name')
    expect(name).toHaveValue('Linen Wrap Dress')
    await user.clear(name)
    await user.type(name, 'Linen Wrap Midi')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    await waitFor(() => expect(updateProduct).toHaveBeenCalled())
    expect(updateProduct.mock.calls[0][0]).toBe('7')
    expect(updateProduct.mock.calls[0][1]).toMatchObject({ product_name: 'Linen Wrap Midi', shipping_price: 595 })
    expect(updateProduct.mock.calls[0][1]).not.toHaveProperty('admin_id')
  })

  it('explains a missing product instead of showing an empty form', async () => {
    vi.mocked(fetchProduct).mockRejectedValue({ request: {}, response: { status: 404, data: { message: 'Product not found.' } } })
    renderAt(<ProductForm />, { route: '/products/99/edit', path: '/products/:id/edit' })
    expect(await screen.findByRole('alert')).toHaveTextContent('Product not found.')
    expect(screen.queryByLabelText('Product name')).not.toBeInTheDocument()
  })

  it('keeps the admin on the form when saving fails', async () => {
    vi.mocked(createProduct).mockRejectedValue({ request: {}, response: { status: 400, data: { message: 'brand must be one of [...]' } } })
    const { user } = renderAt(<ProductForm />, { route: '/products/new', path: '/products/new' })
    await user.type(await screen.findByLabelText('Product name'), 'Scarf')
    await user.type(screen.getByLabelText('Description'), 'Wool')
    await choose(user, 'Product type', 'clothing')
    await choose(user, 'Style', 'Retro')
    await choose(user, 'Brand', 'Hanes')
    await user.type(screen.getByLabelText('Shipping (cents)'), '300')
    await user.click(screen.getByRole('button', { name: 'Add product' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('brand must be one of')
  })
})
