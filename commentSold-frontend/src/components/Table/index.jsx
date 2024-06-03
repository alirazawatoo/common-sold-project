import {
  Alert, Box, Button, Skeleton,
} from '@mui/material'
import DataTable from 'react-data-table-component'

import { defaultPageCount, rowsPerPageOptions } from 'utils/constants/common'
import { colors } from '../../theme'

const tableStyles = {
  headRow: { style: { backgroundColor: colors.spruceSoft, borderBottomColor: colors.line, minHeight: '48px' } },
  headCells: { style: { color: colors.ink, fontSize: '0.85rem', fontWeight: 700 } },
  rows: {
    style: { fontSize: '0.95rem', minHeight: '52px', color: colors.ink },
    highlightOnHoverStyle: { backgroundColor: '#f8f3ea', outline: 'none' },
  },
  pagination: { style: { borderTopColor: colors.line, color: colors.muted } },
}

const LoadingRows = () => (
  <Box sx={{ width: '100%', px: 2, py: 1 }} data-testid='table-skeleton' aria-label='Loading' role='status'>
    {[0, 1, 2, 3, 4].map((row) => <Skeleton key={row} height={44} />)}
  </Box>
)

const Table = ({
  label, columns, rows, count, loading, error, onRetry, onPageChange, onRowsPerPageChange, onSort,
  resetPage, defaultSortFieldId = 1, emptyMessage = 'Nothing to show yet.',
}) => {
  if (error) {
    return (
      <Alert
        severity='error'
        sx={{ m: 2 }}
        action={onRetry && <Button color='inherit' size='small' onClick={onRetry}>Try again</Button>}
      >
        {error}
      </Alert>
    )
  }

  return (
    <section aria-label={label} data-testid='table'>
      <DataTable
        columns={columns}
        data={rows || []}
        customStyles={tableStyles}
        progressPending={loading}
        progressSkeleton={false}
        progressComponent={<LoadingRows />}
        noDataComponent={<Box sx={{ p: 4, color: 'text.secondary' }}>{emptyMessage}</Box>}
        highlightOnHover
        persistTableHead
        responsive
        pagination
        paginationServer
        paginationTotalRows={count || 0}
        paginationPerPage={defaultPageCount}
        paginationRowsPerPageOptions={rowsPerPageOptions}
        paginationResetDefaultPage={resetPage}
        onChangePage={(page) => onPageChange?.(page - 1)}
        onChangeRowsPerPage={(limit) => onRowsPerPageChange?.(limit)}
        sortServer
        defaultSortFieldId={defaultSortFieldId}
        onSort={(column, direction) => column.sortField && onSort?.(column.sortField, direction)}
      />
    </section>
  )
}

export default Table
