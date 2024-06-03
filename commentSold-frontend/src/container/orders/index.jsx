import { Chip, TextField } from '@mui/material'
import { useState } from 'react'

import fetchOrders from 'api/order'
import {
  PageHeader, Select, StatTile, Table,
} from 'components'
import { orderStatusOptions, shipperNameOptions } from 'utils/constants/order'
import {
  formatCents, formatNumber, sortFromField,
} from 'utils/helpers'
import { useDebouncedValue, useRemoteData, useTablePaging } from 'utils/hooks'

import './styles.scss'

const variantOf = (row) => [row.inventory?.color, row.inventory?.size].filter(Boolean).join(' / ')

const columns = [
  {
    name: 'Customer',
    selector: (row) => row.name,
    sortable: true,
    sortField: 'orders.name',
    grow: 2,
    minWidth: '200px',
    cell: (row) => (
      <div className='stacked'>
        <span>{row.name}</span>
        <span className='secondary'>{row.email}</span>
      </div>
    ),
  },
  {
    name: 'Product',
    selector: (row) => row.product?.product_name,
    sortable: true,
    sortField: 'products.product_name',
    grow: 2,
    minWidth: '180px',
    cell: (row) => (
      <div className='stacked'>
        <span>{row.product?.product_name}</span>
        <span className='secondary'>{variantOf(row)}</span>
      </div>
    ),
  },
  {
    name: 'Status',
    selector: (row) => row.order_status,
    sortable: true,
    sortField: 'orders.order_status',
    minWidth: '120px',
    cell: (row) => <Chip size='small' variant='outlined' className={`status status-${row.order_status.toLowerCase()}`} label={row.order_status} />,
  },
  {
    name: 'Total', selector: (row) => formatCents(row.total_cents), sortable: true, sortField: 'orders.total_cents', right: true, minWidth: '110px',
  },
  {
    name: 'Shipper', selector: (row) => row.shipper_name, sortable: true, sortField: 'orders.shipper_name', minWidth: '100px',
  },
  {
    name: 'Tracking',
    selector: (row) => row.tracking_number,
    sortable: true,
    sortField: 'orders.tracking_number',
    minWidth: '130px',
    cell: (row) => (row.tracking_number ? <code className='mono'>{row.tracking_number}</code> : <span className='secondary'>Not shipped</span>),
  },
  {
    name: 'Transaction',
    selector: (row) => row.transaction_id,
    sortable: true,
    sortField: 'orders.transaction_id',
    minWidth: '150px',
    cell: (row) => <code className='mono'>{row.transaction_id}</code>,
  },
]

const Orders = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [shipper, setShipper] = useState('')
  const {
    paging, onPageChange, onRowsPerPageChange, onSort, backToFirstPage,
  } = useTablePaging(sortFromField('orders.name', 'asc'))
  const name = useDebouncedValue(search)
  const { page, limit, sort } = paging

  const {
    data, loading, error, reload,
  } = useRemoteData(fetchOrders, {
    page, limit, sort, name, order_status: status, shipper,
  })

  const changeFilter = (setter) => (value) => {
    setter(value)
    backToFirstPage()
  }

  return (
    <>
      <PageHeader title='Orders' description='Sales totals follow the filters you choose.' />
      <dl className='order-stats' aria-label='Sales for the current filters'>
        <StatTile label='Total sales' value={formatCents(data?.totalSale)} loading={loading && !data} />
        <StatTile label='Orders' value={formatNumber(data?.count)} loading={loading && !data} />
        <StatTile label='Average order' value={formatCents(data?.average)} loading={loading && !data} />
      </dl>
      <div className='panel'>
        <div className='filters'>
          <TextField
            label='Search name, email, transaction or tracking'
            type='search'
            value={search}
            onChange={(event) => changeFilter(setSearch)(event.target.value)}
          />
          <Select
            id='order-status'
            label='Order status'
            options={orderStatusOptions}
            value={status}
            onChange={changeFilter(setStatus)}
          />
          <Select
            id='order-shipper'
            label='Shipper'
            options={shipperNameOptions}
            value={shipper}
            onChange={changeFilter(setShipper)}
          />
        </div>
        <Table
          label='Orders'
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
          emptyMessage='No orders match these filters.'
        />
      </div>
    </>
  )
}

export default Orders
