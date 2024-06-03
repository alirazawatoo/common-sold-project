import { TOKEN } from './constants/common'

export const saveToken = (token) => localStorage.setItem(TOKEN, token)

// Older builds stored the token JSON-encoded, with surrounding quotes.
export const getToken = () => localStorage.getItem(TOKEN)?.replace(/^"|"$/g, '') || null

export const removeToken = () => localStorage.removeItem(TOKEN)

// Reads the display name from the token payload; the API still verifies the signature.
export const getSignedInName = () => {
  const payload = getToken()?.split('.')[1]
  if (!payload) return ''
  try {
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))).name || ''
  } catch {
    return ''
  }
}

const numberFormat = new Intl.NumberFormat('en-US')
const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export const formatNumber = (number) => numberFormat.format(Number(number) || 0)

export const formatCents = (cents) => currencyFormat.format((Number(cents) || 0) / 100)

// Builds the query string the list endpoints share; empty filters are left out.
export const listQuery = ({
  page = 0, limit = 10, sort, ...filters
}) => {
  const params = new URLSearchParams({ page, limit })
  if (sort) {
    params.set('sort_table_name', sort.table)
    params.set('sort_column', sort.column)
    params.set('sort_order', sort.order)
  }
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, value)
  })
  return params.toString()
}

// "products.product_name" -> { table: 'products', column: 'product_name' }
export const sortFromField = (sortField, order) => {
  const [table, column] = sortField.split('.')
  return { table, column, order }
}
