import { Alert, Button, Skeleton } from '@mui/material'
import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { apiErrorMessage } from 'api'
import {
  createProduct, fetchProduct, fetchProductOptions, updateProduct,
} from 'api/products'
import { Form, PageHeader } from 'components'
import { productFields, productFieldsInitialValues } from 'utils/constants/product'
import { useRemoteData } from 'utils/hooks'
import { validateProduct } from 'utils/validations'

import './styles.scss'

const noProduct = () => Promise.resolve(null)

// Create and edit share this page; /products/:id/edit loads the product first.
const ProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [saveError, setSaveError] = useState('')

  const options = useRemoteData(fetchProductOptions, null)
  const loadProduct = useCallback((productId) => (productId ? fetchProduct(productId) : noProduct()), [])
  const product = useRemoteData(loadProduct, id || null)

  const handleSubmit = async (values) => {
    setSaveError('')
    const body = { ...values, shipping_price: Number(values.shipping_price) }
    try {
      if (isEdit) await updateProduct(id, body)
      else await createProduct(body)
      toast.success(isEdit ? 'Product updated' : 'Product added')
      navigate('/products')
    } catch (err) {
      setSaveError(apiErrorMessage(err))
    }
  }

  const initialValues = product.data
    ? Object.fromEntries(Object.keys(productFieldsInitialValues).map((key) => [key, product.data[key] ?? '']))
    : productFieldsInitialValues

  const loadError = product.error || options.error

  return (
    <>
      <PageHeader
        title={isEdit ? 'Edit product' : 'Add a product'}
        description={isEdit ? product.data?.product_name : 'It will appear in the catalogue straight away.'}
      />
      <div className='panel product-form'>
        {loadError && <Alert severity='error' sx={{ mb: 2 }}>{loadError}</Alert>}
        {saveError && <Alert severity='error' sx={{ mb: 2 }}>{saveError}</Alert>}
        {(product.loading || options.loading) && (
          <div role='status' aria-label='Loading product'>
            {[0, 1, 2, 3, 4].map((row) => <Skeleton key={row} height={56} />)}
          </div>
        )}
        {!product.loading && !options.loading && !(isEdit && product.error) && (
          <Form
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validate={validateProduct}
            fields={productFields}
            selectOptions={options.data || {}}
            submitLabel={isEdit ? 'Save changes' : 'Add product'}
          >
            <Button component={Link} to='/products' size='large'>Cancel</Button>
          </Form>
        )}
        {isEdit && product.error && <Button component={Link} to='/products'>Back to products</Button>}
      </div>
    </>
  )
}

export default ProductForm
