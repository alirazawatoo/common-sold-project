import { Skeleton } from '@mui/material'

import './styles.scss'

const StatTile = ({ label, value, loading }) => (
  <div className='stat-tile'>
    <dt>{label}</dt>
    <dd>{loading ? <Skeleton width='6ch' /> : value}</dd>
  </div>
)

export default StatTile
