import instance from 'api'
import { saveToken } from 'utils/helpers'

const login = ({ email, password }) => instance
  .post('auth/login', { email, password })
  .then(({ data }) => {
    saveToken(data.token)
    return data
  })

export default login
