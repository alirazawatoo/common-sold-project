import { screen } from '@testing-library/react'

import login from 'api/user'
import Login from 'container/auth/login'
import { renderAt } from 'utils/test'

vi.mock('api/user', () => ({ default: vi.fn() }))

describe('Login', () => {
  afterEach(() => {
    localStorage.clear()
    vi.mocked(login).mockReset()
  })

  it('signs in and opens the products page', async () => {
    vi.mocked(login).mockResolvedValue({ token: 'abc' })
    const { user } = renderAt(<Login />, { route: '/login', path: '/login' })

    await user.type(screen.getByLabelText('Email address'), 'demo@example.com')
    await user.type(screen.getByLabelText('Password'), 'Stockroom1')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(login).toHaveBeenCalledWith({ email: 'demo@example.com', password: 'Stockroom1' })
    expect(await screen.findByTestId('location')).toHaveTextContent('/products')
  })

  it('shows the API message when the password is wrong', async () => {
    vi.mocked(login).mockRejectedValue({ request: {}, response: { status: 401, data: { message: 'Incorrect email or password.' } } })
    const { user } = renderAt(<Login />, { route: '/login', path: '/login' })

    await user.type(screen.getByLabelText('Email address'), 'demo@example.com')
    await user.type(screen.getByLabelText('Password'), 'nope')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Incorrect email or password.')
  })

  it('checks the email before calling the API', async () => {
    const { user } = renderAt(<Login />, { route: '/login', path: '/login' })
    await user.type(screen.getByLabelText('Email address'), 'not-an-email')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByText('That does not look like an email address')).toBeInTheDocument()
    expect(login).not.toHaveBeenCalled()
  })

  it('skips the form when already signed in', () => {
    localStorage.setItem('token', 'abc')
    renderAt(<Login />, { route: '/login', path: '/login' })
    expect(screen.getByTestId('location')).toHaveTextContent('/products')
  })
})
