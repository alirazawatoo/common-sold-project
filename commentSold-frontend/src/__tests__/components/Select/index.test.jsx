import { render, screen } from '@testing-library/react'

import Select from 'components/Select'
import { TestApp } from 'utils/test'

describe('Select Component', () => {
  beforeEach(() => render(<Select placeHolder='Pick a shipper' selectOptions={[]} />, { wrapper: TestApp }))

  it('shows its placeholder', () => {
    expect(screen.getByText('Pick a shipper')).toBeInTheDocument()
  })
})
