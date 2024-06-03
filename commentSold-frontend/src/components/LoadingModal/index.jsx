import { Backdrop, CircularProgress } from '@mui/material'

const LoadingModal = ({ show, label = 'Saving' }) => (
  <Backdrop open={show} sx={{ zIndex: (theme) => theme.zIndex.modal + 1, color: '#ffffff' }}>
    <CircularProgress color='inherit' aria-label={label} />
  </Backdrop>
)

export default LoadingModal
