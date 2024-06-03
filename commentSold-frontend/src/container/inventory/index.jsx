import { Chip, TextField } from '@mui/material'
import { useState } from 'react'

import fetchInventories from 'api/inventory'
import { PageHeader, SelectFilter, Table } from 'components'
import { LOW_STOCK } from 'utils/constants/inventory'
import {
  formatCents, formatNumber, sortFromField,
} from 'utils/helpers'
import { useDebouncedValue, useRemoteData, useTablePaging } from 'utils/hooks'

import './styles.scss'

const StockLevel = ({ quantity }) => {
  if (quantity === 0) return <Chip size='small' color='error' label='Out of stock' />
  if (quantity < LOW_STOCK) return <Chip size='small' color='secondary' label={`Low: ${quantity}`} />
  return <span>{formatNumber(quantity)}</span>
}

const columns = [
  {
    name: 'Product', selector: (row) => row.product?.product_name, sortable: true, sortField: 'products.product_name', grow: 2, wrap: true,
  },
  {
    name: 'SKU', selector: (row) => row.sku, sortable: true, sortField: 'inventories.sku', grow: 1.5, minWidth: '150px', cell: (row) => <code className='sku'>{row.sku}</code>,
  },
  {
    name: 'Colour', selector: (row) => row.color, sortable: true, sortField: 'inventories.color',
  },
  {
    name: 'Size', selector: (row) => row.size, sortable: true, sortField: 'inventories.size', width: '90px',
  },
  {
    name: 'In stock', selector: (row) => row.quantity, sortable: true, sortField: 'inventories.quantity', cell: (row) => <StockLevel quantity={row.quantity} />,
  },
  {
    name: 'Price', selector: (row) => formatCents(row.price_cents), sortable: true, sortField: 'inventories.price_cents', right: true,
  },
  {
    name: 'Cost', selector: (row) => formatCents(row.cost_cents), sortable: true, sortField: 'inventories.cost_cents', right: true,
  },
]

const Inventory = () => {
  const [search, setSearch] = useState('')
  const [operator, setOperator] = useState('lt')
  const [quantity, setQuantity] = useState('')
  const {
    paging, onPageChange, onRowsPerPageChange, onSort, backToFirstPage,
  } = useTablePaging(sortFromField('products.product_name', 'asc'))
  const name = useDebouncedValue(search)
  const threshold = useDebouncedValue(quantity)
  const { page, limit, sort } = paging

  const {
    data, loading, error, reload,
  } = useRemoteData(fetchInventories, {
    page, limit, sort, name, ...(threshold !== '' && { quantity: threshold, operator }),
  })

  const changeFilter = (setter) => (value) => {
    setter(value)
    backToFirstPage()
  }

  return (
    <>
      <PageHeader
        title='Inventory'
        description={data ? `${formatNumber(data.count)} stock rows match` : 'Every size and colour you stock'}
      />
      <div className='panel'>
        <div className='filters'>
          <TextField
            label='Search by product name'
            type='search'
            value={search}
            onChange={(event) => changeFilter(setSearch)(event.target.value)}
          />
          <SelectFilter
            operator={operator}
            quantity={quantity}
            onOperatorChange={changeFilter(setOperator)}
            onQuantityChange={changeFilter(setQuantity)}
          />
        </div>
        <Table
          label='Inventory'
          columns={columns}
          rows={data?.rows}
          count={data?.count}
          loading={loading}
          error={error}
          onRetry={reload}
          resetPage={paging.reset}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          onSort={(field, order) => onSort(sortFromField(field, order))}
          emptyMessage='No stock rows match these filters.'
        />
      </div>
    </>
  )
}

export default Inventory
