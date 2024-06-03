import axios from 'axios'

import { getToken, removeToken } from 'utils/helpers'

export const SIGNED_OUT_EVENT = 'stockroom:signed-out'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1/',
  timeout: 15000,
})

instance.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers['access-token'] = token
  return config
})

// An expired or revoked token anywhere signs the admin out.
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.startsWith('auth/')) {
      removeToken()
      window.dispatchEvent(new Event(SIGNED_OUT_EVENT))
    }
    return Promise.reject(error)
  },
)

export const apiErrorMessage = (error) => {
  const data = error?.response?.data
  if (data?.message || data?.error || data?.orderByError) return data.message || data.error || data.orderByError
  if (error?.request && !error?.response) return 'Cannot reach the server. Check that the API is running.'
  return 'Something went wrong. Please try again.'
}

export default instance
