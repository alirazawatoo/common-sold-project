import {
  formatCents, formatNumber, getSignedInName, getToken, listQuery, sortFromField,
} from 'utils/helpers'
import { fakeToken } from 'utils/test'

describe('helpers', () => {
  afterEach(() => localStorage.clear())

  it('formats cents as dollars and counts with separators', () => {
    expect(formatCents(123456)).toBe('$1,234.56')
    expect(formatCents(undefined)).toBe('$0.00')
    expect(formatNumber(12500)).toBe('12,500')
  })

  it('builds an encoded query string and skips empty filters', () => {
    const query = listQuery({
      page: 2, limit: 25, sort: sortFromField('products.product_name', 'desc'), name: 'tee & co', shipper: '',
    })
    expect(query).toBe('page=2&limit=25&sort_table_name=products&sort_column=product_name&sort_order=desc&name=tee+%26+co')
  })

  it('reads tokens saved by older builds with JSON quotes', () => {
    localStorage.setItem('token', '"abc.def.ghi"')
    expect(getToken()).toBe('abc.def.ghi')
  })

  it('reads the signed-in name from the token and survives garbage', () => {
    localStorage.setItem('token', fakeToken('Riley Chen'))
    expect(getSignedInName()).toBe('Riley Chen')
    localStorage.setItem('token', 'not-a-jwt')
    expect(getSignedInName()).toBe('')
  })
})
