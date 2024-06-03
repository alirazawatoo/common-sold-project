import instance from 'api'
import { listQuery } from 'utils/helpers'

const data = (request) => request.then((response) => response.data)

export const fetchProducts = (query) => data(instance.get(`products?${listQuery(query)}`))

export const fetchProduct = (id) => data(instance.get(`products/${id}`))

export const fetchProductOptions = () => Promise
  .all(['styles', 'brands', 'types'].map((list) => data(instance.get(`products/${list}`))))
  .then(([styles, brands, types]) => ({ style: styles, brand: brands, product_type: types }))

export const createProduct = (body) => data(instance.post('products', body))

export const updateProduct = (id, body) => data(instance.put(`products/${id}`, body))

export const deleteProduct = (id) => data(instance.delete(`products/${id}`))
