import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Select from 'components/Select'

describe('Select', () => {
  it('lets the user search and pick an option', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Select id='shipper' label='Shipper' options={['USPS', 'DHL', 'FedEx']} value='' onChange={onChange} />)

    await user.type(screen.getByRole('combobox', { name: 'Shipper' }), 'fed')
    expect(screen.getAllByRole('option')).toHaveLength(1)
    await user.click(screen.getByRole('option', { name: 'FedEx' }))
    expect(onChange).toHaveBeenCalledWith('FedEx')
  })

  it('reports an empty string when cleared', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Select id='status' label='Status' options={['Paid']} value='Paid' onChange={onChange} />)
    await user.click(screen.getByTitle('Clear'))
    expect(onChange).toHaveBeenCalledWith('')
  })
})
