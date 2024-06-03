import { screen, waitFor } from '@testing-library/react'

import fetchOrders from 'api/order'
import Orders from 'container/orders'
import { renderAt } from 'utils/test'

vi.mock('api/order', () => ({ default: vi.fn() }))

const result = {
  count: 2,
  totalSale: 15990,
  average: 7995,
  rows: [
    {
      id: 1, name: 'Ada Whitlock', email: 'ada.1@example.com', order_status: 'Paid', total_cents: 7995, transaction_id: 'TXN-DEMO-1001', shipper_name: 'UPS', tracking_number: '', product: { product_name: 'Linen Wrap Dress' }, inventory: { color: 'Sand', size: 'M' },
    },
    {
      id: 2, name: 'Bruno Okafor', email: 'bruno.2@example.com', order_status: 'Shipped', total_cents: 7995, transaction_id: 'TXN-DEMO-1002', shipper_name: 'DHL', tracking_number: 'TRK700074', product: { product_name: 'Linen Wrap Dress' }, inventory: { color: 'Olive', size: 'L' },
    },
  ],
}

describe('Orders page', () => {
  beforeEach(() => vi.mocked(fetchOrders).mockResolvedValue(result))
  afterEach(() => vi.clearAllMocks())

  it('shows sales totals as money', async () => {
    renderAt(<Orders />)
    const stats = screen.getByLabelText('Sales for the current filters')
    await waitFor(() => expect(stats).toHaveTextContent('$159.90'))
    expect(stats).toHaveTextContent('$79.95')
  })

  it('shows the ordered variant and unshipped orders', async () => {
    renderAt(<Orders />)
    expect(await screen.findByText('Sand / M')).toBeInTheDocument()
    expect(screen.getByText('ada.1@example.com')).toBeInTheDocument()
    expect(screen.getByText('Not shipped')).toBeInTheDocument()
    expect(screen.getByText('TRK700074')).toBeInTheDocument()
  })

  it('filters by order status', async () => {
    const { user } = renderAt(<Orders />)
    await screen.findByText('Sand / M')
    await user.click(screen.getByRole('combobox', { name: 'Order status' }))
    await user.click(await screen.findByRole('option', { name: 'Shipped' }))
    await waitFor(() => expect(fetchOrders).toHaveBeenLastCalledWith(expect.objectContaining({ order_status: 'Shipped', page: 0 })))
  })
})
