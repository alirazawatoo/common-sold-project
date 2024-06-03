import { ThemeProvider } from '@mui/material'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  MemoryRouter, Route, Routes, useLocation,
} from 'react-router-dom'

import theme from '../theme'

const CurrentPath = () => <p data-testid='location'>{useLocation().pathname}</p>

// Renders `ui` at `route`; any navigation away lands on a probe showing the new path.
export const renderAt = (ui, { route = '/', path = '/' } = {}) => ({
  user: userEvent.setup(),
  ...render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={path} element={ui} />
          <Route path='*' element={<CurrentPath />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  ),
})

// A JWT-shaped token whose payload carries a display name (signature not checked client-side).
export const fakeToken = (name = 'Morgan Avery') => `x.${btoa(JSON.stringify({ name }))}.y`
