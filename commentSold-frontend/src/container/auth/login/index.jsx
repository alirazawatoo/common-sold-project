import { Alert, Typography } from '@mui/material'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { apiErrorMessage } from 'api'
import login from 'api/user'
import Form from 'components/Form'
import { getToken } from 'utils/helpers'
import { loginFields, loginFieldsInitialValues } from 'utils/constants/login'
import { validateLogin } from 'utils/validations'

import './styles.scss'

const Login = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  if (getToken()) return <Navigate to='/products' replace />

  const handleLogin = async (values) => {
    setError('')
    try {
      await login(values)
      navigate('/products')
    } catch (err) {
      setError(apiErrorMessage(err))
    }
  }

  return (
    <main className='login'>
      <section className='login-intro' aria-hidden='true'>
        <p className='login-brand'>Stockroom</p>
        <p className='login-tagline'>Products, stock and orders for your shop, in one back room.</p>
      </section>
      <section className='login-card' aria-labelledby='login-title'>
        <Typography id='login-title' variant='h1'>Sign in</Typography>
        <Typography color='text.secondary' sx={{ mb: 3 }}>
          Use the admin account for your shop.
        </Typography>
        {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}
        <Form
          initialValues={loginFieldsInitialValues}
          onSubmit={handleLogin}
          validate={validateLogin}
          fields={loginFields}
          submitLabel='Sign in'
        />
      </section>
    </main>
  )
}

export default Login
