export const productFieldsInitialValues = {
  product_name: '',
  description: '',
  style: '',
  brand: '',
  product_type: '',
  shipping_price: '',
  note: '',
  url: '',
}

export const productFields = [
  { name: 'product_name', label: 'Product name', type: 'text' },
  {
    name: 'description', label: 'Description', type: 'text', multiline: true,
  },
  { name: 'product_type', label: 'Product type', type: 'select' },
  { name: 'style', label: 'Style', type: 'select' },
  { name: 'brand', label: 'Brand', type: 'select' },
  {
    name: 'shipping_price', label: 'Shipping (cents)', type: 'number', helperText: 'For example 595 for $5.95',
  },
  { name: 'url', label: 'Image URL (optional)', type: 'url' },
  {
    name: 'note', label: 'Internal note (optional)', type: 'text', multiline: true,
  },
]
