# Complete API Documentation - Lazada E-Commerce Platform

This comprehensive documentation covers all API endpoints, functions, and data structures in the Lazada e-commerce platform codebase.

## Overview

The system currently operates with two API layers:
- **Backend API** (`/api/`): Limited implementation with Supabase integration
- **Frontend Mock API** (`/api-test/`): Complete mock implementation for development

## Table of Contents

1. [Database Schema](#database-schema)
2. [Backend API Endpoints](#backend-api-endpoints)
3. [Frontend Mock API Endpoints](#frontend-mock-api-endpoints)
4. [Service Functions](#service-functions)
5. [Authentication & Authorization](#authentication--authorization)
6. [Data Models](#data-models)
7. [Error Handling](#error-handling)

---

## Database Schema

The system uses Supabase as the backend database with the following tables:

### Tables Structure

#### `users` - Base user table
```typescript
Row: {
    id: string          // UUID primary key
    email: string       // Login email
    password: string    // Hashed password
    username: string    // Display name
    profile_picture: string
    role: string        // 'customer' | 'vendor' | 'shipper'
}
```

#### `customers` - Customer-specific data
```typescript
Row: {
    id: string          // Foreign key to users.id
    address: string     // Customer address
    name: string        // Customer full name
}
```

#### `vendors` - Vendor-specific data
```typescript
Row: {
    id: string              // Foreign key to users.id
    business_name: string   // Business name
    business_address: string // Business address
}
```

#### `shippers` - Shipper-specific data
```typescript
Row: {
    id: string      // Foreign key to users.id
    hub_id: string  // Foreign key to distribution_hubs.id
}
```

#### `distribution_hubs` - Distribution centers
```typescript
Row: {
    id: string      // UUID primary key
    name: string    // Hub name (e.g., "Hanoi", "Ho Chi Minh")
    address: string // Hub address
}
```

#### `products` - Product catalog
```typescript
Row: {
    id: string          // UUID primary key
    vendor_id: string   // Foreign key to vendors.id
    name: string        // Product name
    price: number       // Product price
    description: string // Product description
    image: string       // Product image URL
}
```

#### `shopping_cart` - User shopping carts
```typescript
Row: {
    id: string          // UUID primary key
    customer_id: string // Foreign key to customers.id
    product_id: string  // Foreign key to products.id
    quantity: number    // Item quantity
}
```

#### `orders` - Order records
```typescript
Row: {
    id: string          // UUID primary key
    customer_id: string // Foreign key to customers.id
    hub_id: string      // Foreign key to distribution_hubs.id
    status: string      // 'pending' | 'active' | 'delivered' | 'cancelled'
    total_price: number // Total order amount
}
```

#### `order_items` - Order line items
```typescript
Row: {
    id: string                  // UUID primary key
    order_id: string           // Foreign key to orders.id
    product_id: string         // Foreign key to products.id
    quantity: string           // Item quantity
    price_at_order_time: number // Price when order was placed
}
```

---

## Backend API Endpoints

### Base URL: `/api`

Currently implemented backend endpoints with Supabase integration:

### Authentication Routes (`/api/auth`)

#### `POST /api/auth/login`
**Function**: User login with email and password
```typescript
// Implementation: backend/src/routes/auth.router.ts:15
async (req: Request, res: Response) => {
    const { email, password } = req.body
    const session = await signInUser(email, password)
    // Sets HTTP-only cookies for access_token and refresh_token
    // Returns session data and user information
}
```

**Request:**
```json
{
    "email": "string",
    "password": "string"
}
```

**Response:**
```json
{
    "data": {
        "access_token": "string",
        "refresh_token": "string", 
        "user": {
            "id": "string",
            "email": "string",
            "role": "string"
        }
    }
}
```

#### `POST /api/auth/signup`
**Function**: User registration with email and password
```typescript
// Implementation: backend/src/routes/auth.router.ts:57
async (req: Request, res: Response) => {
    const { email, password } = req.body
    const session = await signUpUser(email, password)
    // Creates new user account in Supabase
}
```

### User Management Routes (`/api/users`)

#### `GET /api/users`
**Function**: Fetch all users from database
```typescript
// Implementation: backend/src/routes/user.router.ts:15
async (req: Request, res: Response) => {
    const users = await UserService.getAllUsers()
    // Returns array of all users
}
```

#### `GET /api/users?id={userId}`
**Function**: Fetch specific user by ID
```typescript
// Implementation: backend/src/routes/user.router.ts:25
async (req: Request, res: Response) => {
    const user = await UserService.getUserById(String(req.query.id))
    // Returns single user object
}
```

### Planned Backend Routes (Currently Empty)

The following router files exist but are not yet implemented:

- `backend/src/routes/products.router.ts` - Product management
- `backend/src/routes/orders.router.ts` - Order management  
- `backend/src/routes/shopping_cart_items.router.ts` - Cart management
- `backend/src/routes/customer.router.ts` - Customer-specific endpoints
- `backend/src/routes/vendor.router.ts` - Vendor-specific endpoints
- `backend/src/routes/shipper.router.ts` - Shipper-specific endpoints
- `backend/src/routes/distribution_hubs.router.ts` - Hub management

---

## Frontend Mock API Endpoints

### Base URL: `/api-test`

Complete mock implementation for development and testing:

### Authentication Mock APIs

#### `POST /api-test/auth/login`
**Function**: Mock user authentication
```typescript
// Implementation: frontend/app/routes/api/auth.login.ts:1
export async function action({ request }) {
    const { email } = await request.json()
    // Determines user role based on email prefix
    // Returns mock user data
}
```

#### `POST /api-test/auth/register/customer`
**Function**: Mock customer registration
```typescript
// Implementation: frontend/app/routes/api/auth.register.customer.ts:1
export async function action() {
    // Returns success response for customer registration
}
```

#### `POST /api-test/auth/register/vendor`
**Function**: Mock vendor registration
```typescript
// Implementation: frontend/app/routes/api/auth.register.vendor.ts:1
export async function action() {
    // Returns success response for vendor registration
}
```

#### `POST /api-test/auth/register/shipper`
**Function**: Mock shipper registration
```typescript
// Implementation: frontend/app/routes/api/auth.register.shipper.ts:1
export async function action() {
    // Returns success response for shipper registration
}
```

### Product Mock APIs

#### `GET /api-test/products`
**Function**: Retrieve all products
```typescript
// Implementation: frontend/app/routes/api/products.ts:3
export async function loader() {
    return Response(JSON.stringify(mockProducts))
    // Returns array of mock product data
}
```

#### `POST /api-test/products`
**Function**: Create new product (vendor)
```typescript
// Implementation: frontend/app/routes/api/products.ts:9
export async function action({ request }) {
    await request.json()
    // Simulates product creation
    // Returns success with generated ID
}
```

#### `GET /api-test/products/{productId}`
**Function**: Get specific product by ID
```typescript
// Implementation: frontend/app/routes/api/products.$productId.ts:3
export async function loader({ params }) {
    // Returns specific product data
}
```

#### `GET /api-test/products/search`
**Function**: Search and filter products
```typescript
// Implementation: frontend/app/routes/api/products.search.ts:3
export async function loader({ request }) {
    // Supports query parameters: q, min, max, category
    // Returns filtered product results
}
```

### Cart Mock APIs

#### `GET /api-test/cart?userId={userId}`
**Function**: Retrieve user's shopping cart
```typescript
// Implementation: frontend/app/routes/api/cart.ts:6
export async function loader({ request }) {
    const userId = url.searchParams.get("userId")
    const result = mockGetCart(userId)
    // Returns cart items with product details
}
```

#### `POST /api-test/cart?userId={userId}`
**Function**: Sync user's shopping cart
```typescript
// Implementation: frontend/app/routes/api/cart.ts:47
export async function action({ request }) {
    const body = await request.json()
    const result = mockSyncCart(userId, body.items)
    // Updates cart and returns success status
}
```

### Order Mock APIs

#### `GET /api-test/orders?hub={hubName}`
**Function**: Retrieve orders (optionally filtered by hub)
```typescript
// Implementation: frontend/app/routes/api/orders.ts:3
export async function loader({ request }) {
    const hub = url.searchParams.get("hub")
    const data = hub ? getOrdersByHub(hub) : mockOrders
    // Returns array of order data
}
```

#### `GET /api-test/orders/{orderId}`
**Function**: Get specific order by ID
```typescript
// Implementation: frontend/app/routes/api/orders.$orderId.ts:3
export async function loader({ params }) {
    // Returns specific order details
}
```

#### `POST /api-test/orders/{orderId}/status`
**Function**: Update order status (shipper)
```typescript
// Implementation: frontend/app/routes/api/orders.$orderId.status.ts:3
export async function action({ params, request }) {
    // Updates order status to 'delivered' or 'cancelled'
}
```

#### `POST /api-test/orders/checkout`
**Function**: Place new order (customer)
```typescript
// Implementation: frontend/app/routes/api/orders.checkout.ts:4
export async function action({ request }) {
    const body = await request.json()
    // Validates order data and creates new order
    // Returns order confirmation
}
```

### Profile Mock APIs

#### `POST /api-test/profile/upload-image`
**Function**: Upload user profile image
```typescript
// Implementation: frontend/app/routes/api/profile.upload-image.ts:1
export async function action({ request }) {
    // Handles multipart/form-data file upload
    // Validates image file and size constraints
    // Returns upload success status
}
```

---

## Service Functions

### Database Service Functions

#### User Service (`backend/src/service/user.service.ts`)

##### `UserService.getAllUsers()`
**Function**: Fetch all users from database
```typescript
async getAllUsers(): Promise<User[] | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('id', { ascending: false })
    // Returns array of User objects or null
}
```

##### `UserService.getUserById(id: string)`
**Function**: Fetch specific user by ID
```typescript
async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle()
    // Returns User object or null if not found
}
```

#### Authentication Service (`backend/src/db/db.ts`)

##### `signInUser(email: string, password: string)`
**Function**: Authenticate user with Supabase
```typescript
export async function signInUser(email: string, password: string):
    Promise<null | { user: any; access_token: string; refresh_token: string }> {
    const { data, error } = await supabase.auth.signInWithPassword({
        email, password
    })
    // Returns session data or null if failed
}
```

##### `signUpUser(email: string, password: string)`
**Function**: Create new user account
```typescript
export async function signUpUser(email: string, password: string):
    Promise<null | { user: any; access_token: string; refresh_token: string }> {
    const { data, error } = await supabase.auth.signUp({
        email, password
    })
    // Returns session data or null if failed
}
```

##### `changePassword(newPassword: string)`
**Function**: Update user password
```typescript
export async function changePassword(newPassword: string): Promise<boolean> {
    const { error } = await supabase.auth.updateUser({
        password: newPassword
    })
    // Returns true if successful, false if failed
}
```

### Frontend Service Functions

#### Cart Service (`frontend/app/lib/cart.ts`)

##### Cart State Management
```typescript
// Redux-based cart management with persistence
// Handles cart synchronization across devices
// Integrates with mock API for server-side storage
```

#### Auth Service (`frontend/app/lib/auth.ts`)

##### Authentication Management
```typescript
// Handles user login/logout state
// Manages authentication tokens
// Provides role-based access control
```

### Mock Data Services (`frontend/app/lib/api.ts`)

##### `mockGetCart(userId: string)`
**Function**: Retrieve mock cart data
```typescript
export function mockGetCart(userId: string) {
    // Returns simulated cart data for user
    // Includes product details and quantities
}
```

##### `mockSyncCart(userId: string, items: CartItem[])`
**Function**: Sync cart data to mock storage
```typescript
export function mockSyncCart(userId: string, items: CartItem[]) {
    // Simulates server-side cart storage
    // Returns sync confirmation
}
```

---

## Authentication & Authorization

### Authentication Flow

1. **User Login**: Email/password sent to `/api/auth/login`
2. **Session Creation**: Supabase creates authenticated session
3. **Cookie Storage**: Access and refresh tokens stored as HTTP-only cookies
4. **Request Authentication**: Middleware validates tokens on protected routes

### Authorization Middleware

#### `requireAuth` (`backend/src/middleware/requireAuth.ts`)
```typescript
// Validates JWT tokens from cookies
// Extracts user information from token
// Protects routes requiring authentication
```

### Role-Based Access Control

- **Customer**: Can browse products, manage cart, place orders
- **Vendor**: Can manage products, view sales analytics
- **Shipper**: Can view and update order statuses for assigned hub

---

## Data Models

### User Types
```typescript
export type User = Database['public']['Tables']['users']['Row']

export interface CustomerUser extends User {
    role: 'customer'
    customerInfo: {
        address: string
        name: string
    }
}

export interface VendorUser extends User {
    role: 'vendor'
    vendorInfo: {
        business_name: string
        business_address: string
    }
}

export interface ShipperUser extends User {
    role: 'shipper'
    shipperInfo: {
        hub_id: string
        distributionHub: string
    }
}
```

### Product Model
```typescript
export interface Product {
    id: string
    name: string
    price: number
    description: string
    imageUrl: string
    vendorId: string
    vendorName: string
    category: string
    inStock: boolean
    rating: number
    reviewCount: number
}
```

### Cart Models
```typescript
export interface CartItem {
    product: Product
    quantity: number
}

export interface Cart {
    items: CartItem[]
    lastUpdated: string
}
```

### Order Models
```typescript
export interface Order {
    id: string
    customerId: string
    customerName: string
    customerAddress: string
    items: OrderItem[]
    total: number
    status: 'pending' | 'active' | 'delivered' | 'cancelled'
    hubId: string
    hubName: string
    orderDate: string
    deliveryDate?: string
    shipperId?: string
}

export interface OrderItem {
    productId: string
    productName: string
    quantity: number
    price: number
}
```

---

## Error Handling

### Response Utilities (`backend/src/utils/json_mes.ts`)

#### `SuccessJsonResponse(res, statusCode, data)`
**Function**: Standardized success response format
```typescript
// Returns consistent success response structure
// Includes status code and data payload
```

#### `ErrorJsonResponse(res, statusCode, message)`
**Function**: Standardized error response format  
```typescript
// Returns consistent error response structure
// Includes error code and descriptive message
```

### Common HTTP Status Codes

- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `404`: Not Found (resource doesn't exist)
- `405`: Method Not Allowed
- `500`: Internal Server Error

### Validation Rules

#### Email Validation
- Must be valid email format
- Required for authentication

#### Password Requirements
- 8-20 characters
- Must include: uppercase, lowercase, digit, special character (!@#$%^&*)

#### Username Requirements
- 8-15 characters
- Alphanumeric only (A-Z, a-z, 0-9)

#### File Upload Constraints
- Profile images: Max 2MB, image formats only
- Product images: Optional, standard image formats

---

## API Integration Notes

### Development vs Production

- **Development**: Uses `/api-test/` mock endpoints
- **Production**: Intended to use `/api/` real backend endpoints

### Cross-Device Synchronization

The cart system implements intelligent synchronization:
- Automatic sync on login
- Real-time sync on cart modifications
- Conflict resolution with local-first approach

### Performance Considerations

- Optimistic UI updates for instant feedback
- Minimal API calls through smart caching
- Efficient state management with Redux Toolkit
- Automatic retry mechanisms for failed requests

### Security Features

- HTTP-only cookies for token storage
- CSRF protection through SameSite cookies
- Role-based route protection
- Input validation on all endpoints

---

## Development Setup

### Environment Variables Required

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
PRODUCTION_SITE=false
```

### Database Migration

The database schema is defined in `backend/src/db/db.ts` and should be created in Supabase with the specified table structure.

### Testing

- Frontend mock APIs allow for complete frontend testing without backend
- Backend endpoints can be tested with tools like Postman or curl
- Authentication requires valid Supabase credentials

---

*This documentation covers all implemented and planned API functionality in the Lazada e-commerce platform. For specific implementation details, refer to the individual source files referenced throughout this document.*