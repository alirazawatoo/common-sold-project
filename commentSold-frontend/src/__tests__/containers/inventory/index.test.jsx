import { fireEvent, screen, waitFor } from '@testing-library/react'

import fetchInventories from 'api/inventory'
import Inventory from 'container/inventory'
import { renderAt } from 'utils/test'

vi.mock('api/inventory', () => ({ default: vi.fn() }))

const stock = {
  count: 3,
  rows: [
    {
      id: 1, sku: 'FH-001-SAN-S', color: 'Sand', size: 'S', quantity: 14, price_cents: 6400, cost_cents: 2880, product: { product_name: 'Linen Wrap Dress' },
    },
    {
      id: 2, sku: 'FH-001-SAN-M', color: 'Sand', size: 'M', quantity: 3, price_cents: 6400, cost_cents: 2880, product: { product_name: 'Linen Wrap Dress' },
    },
    {
      id: 3, sku: 'FH-001-OLI-L', color: 'Olive', size: 'L', quantity: 0, price_cents: 6400, cost_cents: 2880, product: { product_name: 'Linen Wrap Dress' },
    },
  ],
}

describe('Inventory page', () => {
  beforeEach(() => vi.mocked(fetchInventories).mockResolvedValue(stock))
  afterEach(() => vi.clearAllMocks())

  it('flags low and empty stock', async () => {
    renderAt(<Inventory />)
    expect(await screen.findByText('Out of stock')).toBeInTheDocument()
    expect(screen.getByText('Low: 3')).toBeInTheDocument()
    expect(screen.getByText('14')).toBeInTheDocument()
    expect(screen.getAllByText('$64.00')).toHaveLength(3)
  })

  it('asks the API for rows under a stock threshold', async () => {
    renderAt(<Inventory />)
    await screen.findByText('Out of stock')
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Units' }), { target: { value: '5' } })

    await waitFor(() => expect(fetchInventories).toHaveBeenLastCalledWith(
      expect.objectContaining({ quantity: '5', operator: 'lt', page: 0 }),
    ))
  })

  it('searches by product name after typing stops', async () => {
    const { user } = renderAt(<Inventory />)
    await user.type(screen.getByRole('searchbox', { name: 'Search by product name' }), 'tee')
    await waitFor(() => expect(fetchInventories).toHaveBeenLastCalledWith(expect.objectContaining({ name: 'tee' })))
    expect(fetchInventories).not.toHaveBeenCalledWith(expect.objectContaining({ name: 't' }))
  })
})
