import { LinearProgress } from '@mui/material'
import { Suspense, useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

import { SIGNED_OUT_EVENT } from 'api'
import AppBar from 'components/Appbar'
import { getToken } from 'utils/helpers'

// Wraps the signed-in pages; an expired session sends the admin back to login.
const RequireAuth = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const signOut = () => navigate('/login', { replace: true })
    window.addEventListener(SIGNED_OUT_EVENT, signOut)
    return () => window.removeEventListener(SIGNED_OUT_EVENT, signOut)
  }, [navigate])

  if (!getToken()) return <Navigate to='/login' replace />

  return (
    <>
      <a className='skip-link' href='#main'>Skip to content</a>
      <AppBar />
      <main id='main' className='page'>
        <Suspense fallback={<LinearProgress aria-label='Loading page' />}>
          <Outlet />
        </Suspense>
      </main>
    </>
  )
}

export default RequireAuth
