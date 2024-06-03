import { Typography } from '@mui/material'

import './styles.scss'

const PageHeader = ({ title, description, children }) => (
  <div className='page-header'>
    <div>
      <Typography variant='h1'>{title}</Typography>
      {description && <Typography color='text.secondary'>{description}</Typography>}
    </div>
    {children && <div className='page-header-actions'>{children}</div>}
  </div>
)

export default PageHeader
