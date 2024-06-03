import { useEffect, useState } from 'react'

import { apiErrorMessage } from 'api'
import { defaultPageCount } from './constants/common'

// Loads data whenever the query changes and keeps loading/error state for the page.
export const useRemoteData = (fetcher, query) => {
  const key = JSON.stringify(query ?? null)
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState({ data: null, loading: true, error: '' })

  useEffect(() => {
    let current = true
    setState((previous) => ({ ...previous, loading: true, error: '' }))
    fetcher(JSON.parse(key))
      .then((data) => current && setState({ data, loading: false, error: '' }))
      .catch((error) => current && setState((previous) => ({
        ...previous, loading: false, error: apiErrorMessage(error),
      })))
    return () => { current = false }
  }, [fetcher, key, attempt])

  return { ...state, reload: () => setAttempt((count) => count + 1) }
}

export const useDebouncedValue = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

// Page, page size and sort for a server-paginated table.
export const useTablePaging = (defaultSort) => {
  const [paging, setPaging] = useState({
    page: 0, limit: defaultPageCount, sort: defaultSort, reset: false,
  })

  return {
    paging,
    onPageChange: (page) => setPaging((previous) => ({ ...previous, page })),
    onRowsPerPageChange: (limit) => setPaging((previous) => ({ ...previous, limit, page: 0 })),
    onSort: (sort) => setPaging((previous) => ({ ...previous, sort, page: 0 })),
    // Filters changed: go back to page one and tell the table to do the same.
    backToFirstPage: () => setPaging((previous) => ({ ...previous, page: 0, reset: !previous.reset })),
  }
}
