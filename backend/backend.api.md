````
#### `GET /api/orders`
**Function**: Fetch all orders by hubID
```typescript
async (req: Request, res: Response) => {
    const orders = await OrderService.getOrders({ page, size }, hubId);
    //Returns all Orders relevant to hubID
    return: id, customer_id, hub_id, status, total_price
````

#### `Put /api/orders/:id/status`

**Function**: Change the order status active -> delivered or canceled

```typescript
async (req: Request, res: Response) => {
   const updated = await OrderService.updateStatus(id, status, {
      restrictHubId: shipper.hub_id
    })
    //Returns updateed status of order
    return: return: id, customer_id, hub_id, updated status, total_price
```

#### `GET /api/cart`

**Function**: Fetch all orders by hubID

```typescript
async (req: Request, res: Response) => {
    const items = await ShoppingCartService.getCart({ page, size }, req.user_id)
    //Returns all the product in shopping cart
    return: id, customer_id, product_id, quantity
```

#### `Delete /deleteItem/:id`

**Function**: delete product by id

```typescript
async function deleteCartItemByIdController(req: Request, res: Response) {
    const deleted = await ShoppingCartService.deleteItemById(id, userId);
    //Returns all the product in shopping cart
    return: id, customer_id, product_id, quantity
```

#### `GET /api/products`

**Function**: Fetch all products

```typescript
async (req: Request, res: Response) => {
    const items = await ShoppingCartService.getCart({ page, size }, req.user_id)
    //Returns all the products
```

#### `GET /api/products/:productId`

**Function**: Fetch all products

```typescript
async (req: Request, res: Response) => {
    const product = await ProductService.getProductById(productId);
    //Returns single product object
```

#### `POST /api/products/:productId`

**Function**: Create a new product

```typescript
async (req: Request, res: Response) => {
    const created = await ProductService.createProduct(payload);
```
