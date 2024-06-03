import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Table from 'components/Table'

const columns = [
  { name: 'Name', selector: (row) => row.name, sortable: true, sortField: 'products.product_name' },
  { name: 'Brand', selector: (row) => row.brand },
]
const rows = [{ id: 1, name: 'Linen Wrap Dress', brand: 'Vila' }, { id: 2, name: 'Cotton Crew Tee', brand: 'Hanes' }]

describe('Table', () => {
  it('renders a header row and one row per record', () => {
    render(<Table label='Products' columns={columns} rows={rows} count={2} />)
    expect(screen.getByRole('region', { name: 'Products' })).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(3)
    expect(screen.getByText('Cotton Crew Tee')).toBeInTheDocument()
  })

  it('shows the empty message when there are no rows', () => {
    render(<Table label='Products' columns={columns} rows={[]} count={0} emptyMessage='No products yet.' />)
    expect(screen.getByText('No products yet.')).toBeInTheDocument()
  })

  it('marks the table busy and shows skeleton rows while loading', async () => {
    render(<Table label='Products' columns={columns} rows={[]} loading />)
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true')
    expect(await screen.findByTestId('table-skeleton')).toBeInTheDocument()
  })

  it('offers a retry when loading failed', async () => {
    const onRetry = vi.fn()
    render(<Table label='Products' columns={columns} error='Cannot reach the server.' onRetry={onRetry} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Cannot reach the server.')
    await userEvent.setup().click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalled()
  })

  it('reports the sort field and direction', async () => {
    const onSort = vi.fn()
    render(<Table label='Products' columns={columns} rows={rows} count={2} onSort={onSort} />)
    await userEvent.setup().click(screen.getByText('Name'))
    expect(onSort).toHaveBeenCalledWith('products.product_name', expect.stringMatching(/asc|desc/))
  })
})
