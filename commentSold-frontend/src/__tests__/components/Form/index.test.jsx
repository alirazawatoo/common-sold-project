import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Form from 'components/Form'

const fields = [
  { name: 'product_name', label: 'Product name', type: 'text' },
  { name: 'style', label: 'Style', type: 'select' },
]
const validate = (values) => (values.product_name ? {} : { product_name: 'Give the product a name' })

describe('Form', () => {
  const setup = () => {
    const onSubmit = vi.fn()
    render(
      <Form
        initialValues={{ product_name: '', style: '' }}
        onSubmit={onSubmit}
        validate={validate}
        fields={fields}
        selectOptions={{ style: ['Retro', 'Preppy'] }}
        submitLabel='Save'
      />,
    )
    return { onSubmit, user: userEvent.setup() }
  }

  it('labels every field', () => {
    setup()
    expect(screen.getByLabelText('Product name')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Style' })).toBeInTheDocument()
  })

  it('shows the validation message next to the field', async () => {
    const { onSubmit, user } = setup()
    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(await screen.findByText('Give the product a name')).toBeInTheDocument()
    expect(screen.getByLabelText('Product name')).toHaveAttribute('aria-invalid', 'true')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits typed and selected values', async () => {
    const { onSubmit, user } = setup()
    await user.type(screen.getByLabelText('Product name'), 'Rib Beanie')
    await user.click(screen.getByRole('combobox', { name: 'Style' }))
    await user.click(await screen.findByRole('option', { name: 'Retro' }))
    await user.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0]).toEqual({ product_name: 'Rib Beanie', style: 'Retro' })
  })
})
