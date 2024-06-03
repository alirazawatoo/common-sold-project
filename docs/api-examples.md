# API examples

Captured from the Docker Compose stack with the demo seed loaded. Every route
except `auth/login` needs the token from login in an `access-token` header.
The token below is shortened.

### POST /api/v1/auth/login

```json
{
  "email": "demo@example.com",
  "password": "Stockroom1"
}
```

Response `200`:

```json
{
  "token": "eyJhbG...cbSU"
}
```

### POST /api/v1/auth/login

```json
{
  "email": "demo@example.com",
  "password": "wrong"
}
```

Response `401`:

```json
{
  "message": "Incorrect email or password."
}
```

### GET /api/v1/inventories?quantity=5&operator=lt&sort_table_name=inventories&sort_column=quantity&sort_order=asc&limit=2

Response `200`:

```json
{
  "count": 6,
  "rows": [
    {
      "id": 3,
      "sku": "FH-001-OLI-L",
      "quantity": 0,
      "color": "Olive",
      "size": "L",
      "cost_cents": 2880,
      "price_cents": 6400,
      "product": {
        "id": 1,
        "product_name": "Linen Wrap Dress"
      }
    },
    {
      "id": 27,
      "sku": "FH-012-BLA-L",
      "quantity": 0,
      "color": "Black",
      "size": "L",
      "cost_cents": 3105,
      "price_cents": 6900,
      "product": {
        "id": 12,
        "product_name": "Canvas Utility Vest"
      }
    }
  ]
}
```

### GET /api/v1/orders?order_status=Shipped&limit=1

Response `200`:

```json
{
  "totalSale": 110857,
  "average": 12317,
  "count": 9,
  "rows": [
    {
      "id": 2,
      "name": "Luca Brandt",
      "email": "luca.2@example.com",
      "order_status": "Shipped",
      "total_cents": 4768,
      "transaction_id": "TXN-DEMO-1002",
      "shipper_name": "DHL",
      "tracking_number": "TRK700074",
      "product": {
        "id": 8,
        "product_name": "Satin Slip Camisole"
      },
      "inventory": {
        "color": "Champagne",
        "size": "XS"
      }
    }
  ]
}
```

### GET /api/v1/orders?sort_table_name=orders&sort_column=payment_ref&sort_order=asc

Response `400`:

```json
{
  "orderByError": "Invalid sorting parameters."
}
```

### PUT /api/v1/products/1

```json
{
  "product_name": "Linen Wrap Dress",
  "description": "Linen Wrap Dress from the vacation edit.",
  "style": "Vacation",
  "brand": "Not A Brand",
  "product_type": "clothing",
  "shipping_price": 595
}
```

Response `400`:

```json
{
  "message": "brand must be one of the options the API lists"
}
```

### GET /api/v1/products

Response `401`:

```json
{
  "message": "No Access Token"
}
```
