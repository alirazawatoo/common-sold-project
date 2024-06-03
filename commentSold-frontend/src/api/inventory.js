import instance from 'api'
import { listQuery } from 'utils/helpers'

const fetchInventories = (query) => instance
  .get(`inventories?${listQuery(query)}`)
  .then((response) => response.data)

export default fetchInventories
