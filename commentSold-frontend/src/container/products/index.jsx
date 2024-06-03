import { Button, IconButton, Tooltip } from '@mui/material'
import AddOutlined from '@mui/icons-material/AddOutlined'
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { apiErrorMessage } from 'api'
import { deleteProduct, fetchProducts } from 'api/products'
import { DeleteModal, PageHeader, Table } from 'components'
import { formatCents, formatNumber, sortFromField } from 'utils/helpers'
import { useRemoteData, useTablePaging } from 'utils/hooks'

import './styles.scss'

const Products = () => {
  const navigate = useNavigate()
  const {
    paging, onPageChange, onRowsPerPageChange, onSort,
  } = useTablePaging(sortFromField('products.product_name', 'asc'))
  const { page, limit, sort } = paging
  const {
    data, loading, error, reload,
  } = useRemoteData(fetchProducts, { page, limit, sort })
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteProduct(pendingDelete.id)
      toast.success(`${pendingDelete.product_name} deleted`)
      reload()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    }
    setDeleting(false)
    setPendingDelete(null)
  }

  const columns = [
    {
      name: 'Name', selector: (row) => row.product_name, sortable: true, sortField: 'products.product_name', grow: 2, wrap: true,
    },
    {
      name: 'Style', selector: (row) => row.style, sortable: true, sortField: 'products.style', wrap: true,
    },
    {
      name: 'Brand', selector: (row) => row.brand, sortable: true, sortField: 'products.brand', wrap: true,
    },
    { name: 'Shipping', selector: (row) => formatCents(row.shipping_price), right: true },
    {
      name: 'Actions',
      button: true,
      width: '112px',
      cell: (row) => (
        <div className='row-actions'>
          <Tooltip title='Edit'>
            <IconButton aria-label={`Edit ${row.product_name}`} onClick={() => navigate(`/products/${row.id}/edit`)}>
              <EditOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton aria-label={`Delete ${row.product_name}`} onClick={() => setPendingDelete(row)}>
              <DeleteOutlineOutlined />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title='Products'
        description={data ? `${formatNumber(data.count)} products in the catalogue` : 'Your catalogue'}
      >
        <Button component={Link} to='/products/new' variant='contained' color='secondary' startIcon={<AddOutlined />}>
          Add product
        </Button>
      </PageHeader>
      <div className='panel'>
        <Table
          label='Products'
          columns={columns}
          rows={data?.rows}
          count={data?.count}
          loading={loading}
          error={error}
          onRetry={reload}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          onSort={(field, order) => onSort(sortFromField(field, order))}
          emptyMessage='No products yet. Add your first one to start tracking stock.'
        />
      </div>
      <DeleteModal
        show={Boolean(pendingDelete)}
        itemName={pendingDelete?.product_name}
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}

export default Products
