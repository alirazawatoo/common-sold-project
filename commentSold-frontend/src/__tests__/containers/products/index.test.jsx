import { screen, waitFor, within } from '@testing-library/react'

import { deleteProduct, fetchProducts } from 'api/products'
import Products from 'container/products'
import { renderAt } from 'utils/test'

vi.mock('api/products', () => ({ fetchProducts: vi.fn(), deleteProduct: vi.fn() }))

const page = {
  count: 2,
  rows: [
    {
      id: 7, product_name: 'Linen Wrap Dress', style: 'Vacation', brand: 'Vila', shipping_price: 595,
    },
    {
      id: 9, product_name: 'Cotton Crew Tee', style: 'Casual Chic', brand: 'Hanes', shipping_price: 395,
    },
  ],
}

describe('Products page', () => {
  beforeEach(() => vi.mocked(fetchProducts).mockResolvedValue(page))
  afterEach(() => vi.clearAllMocks())

  it('lists products with their shipping charge', async () => {
    renderAt(<Products />)
    expect(await screen.findByText('Linen Wrap Dress')).toBeInTheDocument()
    expect(screen.getByText('$5.95')).toBeInTheDocument()
    expect(screen.getByText('2 products in the catalogue')).toBeInTheDocument()
    expect(fetchProducts).toHaveBeenCalledWith({
      page: 0, limit: 10, sort: { table: 'products', column: 'product_name', order: 'asc' },
    })
  })

  it('opens the edit page from a labelled icon button', async () => {
    const { user } = renderAt(<Products />)
    await user.click(await screen.findByRole('button', { name: 'Edit Cotton Crew Tee' }))
    expect(screen.getByTestId('location')).toHaveTextContent('/products/9/edit')
  })

  it('deletes after confirmation and reloads the list', async () => {
    vi.mocked(deleteProduct).mockResolvedValue({})
    const { user } = renderAt(<Products />)
    await user.click(await screen.findByRole('button', { name: 'Delete Linen Wrap Dress' }))
    const dialog = screen.getByRole('dialog', { name: 'Delete Linen Wrap Dress?' })
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

    expect(deleteProduct).toHaveBeenCalledWith(7)
    await waitFor(() => expect(fetchProducts).toHaveBeenCalledTimes(2))
  })

  it('shows an error with a retry when the API is down', async () => {
    vi.mocked(fetchProducts).mockRejectedValueOnce({ request: {} })
    const { user } = renderAt(<Products />)
    expect(await screen.findByRole('alert')).toHaveTextContent('Cannot reach the server')
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByText('Linen Wrap Dress')).toBeInTheDocument()
  })

  it('invites the admin to add a first product when the catalogue is empty', async () => {
    vi.mocked(fetchProducts).mockResolvedValue({ count: 0, rows: [] })
    renderAt(<Products />)
    expect(await screen.findByText(/No products yet/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Add product' })).toHaveAttribute('href', '/products/new')
  })
})
