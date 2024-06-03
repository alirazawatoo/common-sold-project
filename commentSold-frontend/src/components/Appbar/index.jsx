import { Button } from '@mui/material'
import LogoutOutlined from '@mui/icons-material/LogoutOutlined'
import { NavLink, useNavigate } from 'react-router-dom'

import { menu } from 'utils/constants/common'
import { getSignedInName, removeToken } from 'utils/helpers'

import './styles.scss'

const AppBar = () => {
  const navigate = useNavigate()
  const name = getSignedInName()

  const handleLogout = () => {
    removeToken()
    navigate('/login')
  }

  return (
    <header className='appbar' data-testid='appbar'>
      <div className='appbar-inner'>
        <NavLink to='/products' className='brand'>
          Stockroom
        </NavLink>
        <nav aria-label='Main' className='appbar-nav'>
          {menu.map((item) => (
            <NavLink key={item.path} to={item.path} className='appbar-link'>
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className='appbar-user'>
          {name && <span className='appbar-name'>{name}</span>}
          <Button
            onClick={handleLogout}
            color='inherit'
            size='small'
            startIcon={<LogoutOutlined aria-hidden />}
          >
            Log out
          </Button>
        </div>
      </div>
    </header>
  )
}

export default AppBar
