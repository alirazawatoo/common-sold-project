import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import DeleteModal from 'components/DeleteModal'

describe('DeleteModal', () => {
  const setup = (props = {}) => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(<DeleteModal show itemName='Linen Wrap Dress' onConfirm={onConfirm} onCancel={onCancel} {...props} />)
    return { onConfirm, onCancel, user: userEvent.setup() }
  }

  it('names the product in an accessible dialog', () => {
    setup()
    expect(screen.getByRole('dialog', { name: 'Delete Linen Wrap Dress?' })).toBeInTheDocument()
  })

  it('confirms or cancels', async () => {
    const { onConfirm, onCancel, user } = setup()
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    await user.click(screen.getByRole('button', { name: 'Keep it' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('locks both buttons while deleting', () => {
    setup({ busy: true })
    expect(screen.getByRole('button', { name: 'Deleting...' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Keep it' })).toBeDisabled()
  })

  it('renders nothing when closed', () => {
    setup({ show: false })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
