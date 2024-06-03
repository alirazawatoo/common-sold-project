import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import SelectFilter from 'components/SelectFilter'

describe('SelectFilter', () => {
  it('groups the comparison and units under one label', () => {
    render(<SelectFilter operator='lt' quantity='' onOperatorChange={vi.fn()} onQuantityChange={vi.fn()} />)
    expect(screen.getByRole('group', { name: 'Stock level' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Comparison' })).toHaveTextContent('Fewer than')
  })

  it('reports operator and quantity changes', async () => {
    const onOperatorChange = vi.fn()
    const onQuantityChange = vi.fn()
    const user = userEvent.setup()
    render(<SelectFilter operator='lt' quantity='' onOperatorChange={onOperatorChange} onQuantityChange={onQuantityChange} />)

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Units' }), { target: { value: '5' } })
    expect(onQuantityChange).toHaveBeenCalledWith('5')

    await user.click(screen.getByRole('combobox', { name: 'Comparison' }))
    await user.click(screen.getByRole('option', { name: 'More than' }))
    expect(onOperatorChange).toHaveBeenCalledWith('gt')
  })
})
