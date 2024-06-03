import { render, screen } from '@testing-library/react'

import LoadingModal from 'components/LoadingModal'

describe('LoadingModal', () => {
  it('shows a labelled progress indicator', () => {
    render(<LoadingModal show label='Saving product' />)
    expect(screen.getByRole('progressbar', { name: 'Saving product' })).toBeInTheDocument()
  })

  it('is hidden when not loading', () => {
    render(<LoadingModal show={false} />)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})
