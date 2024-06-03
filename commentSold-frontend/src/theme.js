import { createTheme } from '@mui/material/styles'

// Linen, spruce and clay: the palette of a small clothing shop's back room.
export const colors = {
  spruce: '#1f3a34',
  spruceSoft: '#e3ebe6',
  linen: '#f4efe6',
  surface: '#fffdf9',
  clay: '#a84a28',
  ink: '#22201c',
  muted: '#5c564d',
  line: '#ddd3c4',
  danger: '#a3292b',
}

const display = '"Fraunces", Georgia, "Times New Roman", serif'
const body = '"Public Sans", "Segoe UI", system-ui, -apple-system, sans-serif'

const theme = createTheme({
  palette: {
    primary: { main: colors.spruce, contrastText: '#ffffff' },
    secondary: { main: colors.clay, contrastText: '#ffffff' },
    error: { main: colors.danger },
    background: { default: colors.linen, paper: colors.surface },
    text: { primary: colors.ink, secondary: colors.muted },
    divider: colors.line,
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: body,
    h1: { fontFamily: display, fontWeight: 600, fontSize: '2rem', letterSpacing: '-0.01em' },
    h2: { fontFamily: display, fontWeight: 600, fontSize: '1.5rem' },
    h3: { fontFamily: display, fontWeight: 600, fontSize: '1.25rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiTextField: { defaultProps: { size: 'small' } },
  },
})

export default theme
