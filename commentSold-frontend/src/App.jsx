import { CssBaseline, ThemeProvider } from '@mui/material'
import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import Login from 'container/auth/login'
import RequireAuth from 'container/auth/RequireAuth'
import theme from './theme'

// Signed-in pages load on demand so the login screen stays small.
const Inventory = lazy(() => import('container/inventory'))
const Orders = lazy(() => import('container/orders'))
const Products = lazy(() => import('container/products'))
const ProductForm = lazy(() => import('container/products/addProduct'))

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ToastContainer position='bottom-right' />
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route path='/products' element={<Products />} />
        <Route path='/products/new' element={<ProductForm />} />
        <Route path='/products/:id/edit' element={<ProductForm />} />
        <Route path='/inventory' element={<Inventory />} />
        <Route path='/orders' element={<Orders />} />
      </Route>
      <Route path='*' element={<Navigate replace to='/products' />} />
    </Routes>
  </ThemeProvider>
)

export default App
