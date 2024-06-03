import instance from 'api'
import { listQuery } from 'utils/helpers'

const fetchOrders = (query) => instance
  .get(`orders?${listQuery(query)}`)
  .then((response) => response.data)

export default fetchOrders
