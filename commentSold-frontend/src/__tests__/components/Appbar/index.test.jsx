import { screen } from '@testing-library/react'

import AppBar from 'components/Appbar'
import { fakeToken, renderAt } from 'utils/test'

describe('AppBar', () => {
  beforeEach(() => localStorage.setItem('token', fakeToken()))
  afterEach(() => localStorage.clear())

  it('marks the current page in the main navigation', () => {
    renderAt(<AppBar />, { route: '/inventory', path: '/inventory' })
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(nav).toContainElement(screen.getByRole('link', { name: 'Products' }))
    expect(screen.getByRole('link', { name: 'Inventory' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Orders' })).not.toHaveAttribute('aria-current')
  })

  it('shows who is signed in', () => {
    renderAt(<AppBar />)
    expect(screen.getByText('Morgan Avery')).toBeInTheDocument()
  })

  it('logs out by clearing the token and returning to login', async () => {
    const { user } = renderAt(<AppBar />)
    await user.click(screen.getByRole('button', { name: 'Log out' }))
    expect(localStorage.getItem('token')).toBeNull()
    expect(screen.getByTestId('location')).toHaveTextContent('/login')
  })
})
