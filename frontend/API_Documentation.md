# Lazada E-Commerce API Documentation

This document outlines all the API endpoints available in the Lazada e-commerce system. Currently using mock endpoints under `/api-test/` prefix. The `/api/` prefix is reserved for future real backend integration.

## Base URL

- **Mock/Development**: `/api-test`
- **Production**: `/api` (reserved for future use)

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Profile Endpoints](#profile-endpoints)
3. [Cart Endpoints](#cart-endpoints)
4. [Product Endpoints](#product-endpoints)
5. [Order Endpoints](#order-endpoints)
6. [Error Responses](#error-responses)
7. [Validation Rules](#validation-rules)
8. [Technical Implementation](#technical-implementation)

---

## Authentication Endpoints

### POST /auth/login

Authenticate user credentials and return user information with role-specific data.

**Request:**

```json
{
  "email": "string", // valid email address
  "password": "string" // 8-20 chars with upper, lower, digit, special (!@#$%^&*)
}
```

**Response:**

```json
{
  "id": "string",
  "username": "string",
  "role": "customer" | "vendor" | "shipper",
  "name": "string",           // optional, for customers
  "businessName": "string",   // optional, for vendors  
  "distributionHub": "string" // optional, for shippers
}
```

**Notes:**
- Returns user data based on stored registration information
- Shippers get their selected distribution hub from registration
- Vendors get their business name from registration
- Customers get their display name from registration

### POST /auth/register/customer

Register a new customer account.

**Request:**

```json
{
  "email": "string", // valid email address
  "username": "string", // 8-15 alphanumeric characters
  "password": "string", // 8-20 chars with upper, lower, digit, special
  "name": "string", // minimum 5 characters
  "address": "string" // minimum 5 characters
}
```

**Response:**

```json
{
  "success": true
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "string" // Error description
}
```

### POST /auth/register/vendor

Register a new vendor account.

**Request:**

```json
{
  "email": "string", // valid email address
  "username": "string", // 8-15 alphanumeric characters
  "password": "string", // 8-20 chars with upper, lower, digit, special
  "businessName": "string", // minimum 5 characters
  "businessAddress": "string" // minimum 5 characters
}
```

**Response:**

```json
{
  "success": true
}
```

### POST /auth/register/shipper

Register a new shipper account with distribution hub selection.

**Request:**

```json
{
  "email": "string", // valid email address
  "username": "string", // 8-15 alphanumeric characters
  "password": "string", // 8-20 chars with upper, lower, digit, special
  "hub": "string" // distribution hub: "Ho Chi Minh" | "Da Nang" | "Hanoi"
}
```

**Response:**

```json
{
  "success": true
}
```

**Notes:**
- Hub selection is preserved and used during login
- Available hubs: Ho Chi Minh, Da Nang, Hanoi

---

## Profile Endpoints

### POST /profile/upload-image

Upload a new profile image for the authenticated user.

**Request:**

- Content-Type: `multipart/form-data`
- Body: Form data with the following field:
  - `profileImage`: File (image file)

**File Requirements:**

- File must be an image (image/*)
- Maximum file size: 2MB
- Supported formats: PNG, JPG, JPEG, GIF, etc.

**Response:**

```json
{
  "success": true,
  "imageUrl": "string", // optional, URL to the uploaded image
  "message": "string"   // optional, success message
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": "string" // Error description
}
```

**Common Error Cases:**

- `400`: No image file provided
- `400`: File must be an image
- `400`: File size must be less than 2MB
- `500`: Upload failed

---

## Cart Endpoints

### GET /cart?userId={userId}

Retrieve the cart for a specific user. Enables cart synchronization across devices.

**Query Parameters:**
- `userId` (required): User ID to fetch cart for

**Success Response:**

```json
{
  "success": true,
  "items": [
    {
      "product": {
        "id": "string",
        "name": "string",
        "price": number,
        "image": "string",       // optional
        "vendor": "string",
        "category": "string",
        "description": "string", // optional
        "rating": number,        // optional
        "reviews": number        // optional
      },
      "quantity": number
    }
  ],
  "lastUpdated": "string"      // ISO timestamp
}
```

### POST /cart?userId={userId}

Sync the cart for a specific user. Updates the server-side cart with local changes.

**Query Parameters:**
- `userId` (required): User ID to sync cart for

**Request:**

```json
{
  "items": [
    {
      "product": {
        "id": "string",          // required
        "name": "string",        // required
        "price": number,         // required, positive
        "image": "string",       // optional
        "vendor": "string",      // required
        "category": "string",    // required
        "description": "string", // optional
        "rating": number,        // optional
        "reviews": number        // optional
      },
      "quantity": number         // required, positive
    }
  ]
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "string",         // success message
  "itemCount": number,         // number of items synced
  "lastUpdated": "string"      // ISO timestamp
}
```

### Cart Synchronization Features

**Auto-Sync Logic:**
- Empty local cart on login: Fetches cart from server
- Existing local cart on login: Syncs local cart to server
- All cart operations trigger immediate sync
- Cross-device synchronization maintained

**Error Handling:**
- Graceful offline fallback
- Toast notifications for sync status
- Automatic retry on network recovery

---

## Product Endpoints

### GET /products

Retrieve all available products.

**Response:**

```json
[
  {
    "id": "string",
    "name": "string",
    "price": number,
    "description": "string",
    "imageUrl": "string",     // valid URL
    "vendorId": "string",
    "vendorName": "string",
    "category": "string",
    "inStock": boolean,
    "rating": number,
    "reviewCount": number
  }
]
```

### GET /products/:productId

Retrieve a specific product by ID.

**Path Parameters:**
- `productId` (string): Product identifier

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "price": number,
  "description": "string",
  "imageUrl": "string",
  "vendorId": "string",
  "vendorName": "string",
  "category": "string",
  "inStock": boolean,
  "rating": number,
  "reviewCount": number
}
```

### GET /products/search

Search and filter products.

**Query Parameters:**

- `q` (string, optional): Search query
- `min` (number, optional): Minimum price
- `max` (number, optional): Maximum price
- `category` (string, optional): Product category

**Example:** `/products/search?q=laptop&min=500&max=2000&category=Electronics`

**Response:**

```json
[
  {
    "id": "string",
    "name": "string",
    "price": number,
    "description": "string",
    "imageUrl": "string",
    "vendorId": "string",
    "vendorName": "string",
    "category": "string",
    "inStock": boolean,
    "rating": number,
    "reviewCount": number
  }
]
```

---

## Vendor Product Endpoints

### GET /vendor/products?vendorId={vendorId}

Retrieve all products for a specific vendor.

**Query Parameters:**
- `vendorId` (optional): Vendor ID to filter products

**Response:**

```json
{
  "success": true,
  "products": [
    {
      "id": "string",
      "name": "string",
      "price": number,
      "description": "string",
      "image": "string",
      "vendorId": "string",
      "vendorName": "string",
      "category": "string",
      "inStock": boolean,
      "rating": number,
      "reviewCount": number,
      "createdAt": "string" // ISO timestamp
    }
  ],
  "totalCount": number,
  "vendorId": "string"
}
```

### POST /vendor/products

Create a new product (vendor only).

**Request:**

```json
{
  "name": "string",        // 10-20 characters
  "price": number,         // positive number
  "description": "string", // maximum 500 characters
  "image": "string"        // optional image URL
}
```

**Response:**

```json
{
  "success": true,
  "id": "string",         // generated product ID
  "message": "string"     // success message
}
```

### PUT /vendor/products?productId={productId}&vendorId={vendorId}

Update an existing product (vendor only).

**Query Parameters:**
- `productId` (required): ID of the product to update
- `vendorId` (required): ID of the vendor (for ownership verification)

**Request:**

```json
{
  "name": "string",        // 10-20 characters
  "price": number,         // positive number
  "description": "string", // maximum 500 characters
  "image": "string"        // optional image URL
}
```

**Response:**

```json
{
  "success": true,
  "message": "string",           // success message
  "productId": "string",         // updated product ID
  "updatedProduct": {
    "id": "string",
    "name": "string",
    "price": number,
    "description": "string",
    "image": "string",
    "vendorId": "string",
    "vendorName": "string",
    "category": "string",
    "inStock": boolean,
    "rating": number,
    "reviewCount": number,
    "updatedAt": "string"        // ISO timestamp
  }
}
```

### DELETE /vendor/products?productId={productId}&vendorId={vendorId}

Delete a product (vendor only).

**Query Parameters:**
- `productId` (required): ID of the product to delete
- `vendorId` (required): ID of the vendor (for ownership verification)

**Response:**

```json
{
  "success": true,
  "message": "string",     // success message
  "productId": "string"    // deleted product ID
}
```

---

## Order Endpoints

### GET /orders?hub={hubName}

Retrieve orders, optionally filtered by distribution hub.

**Query Parameters:**

- `hub` (string, optional): Distribution hub name for filtering

**Example:** `/orders?hub=Hanoi`

**Response:**

```json
[
  {
    "id": "string",
    "customerId": "string",
    "customerName": "string",
    "customerAddress": "string",
    "items": [
      {
        "productId": "string",
        "productName": "string",
        "quantity": number,
        "price": number
      }
    ],
    "total": number,
    "status": "pending" | "active" | "delivered" | "cancelled",
    "hubId": "string",
    "hubName": "string",
    "orderDate": "string",      // ISO date string
    "deliveryDate": "string",   // optional, ISO date string
    "shipperId": "string"       // optional
  }
]
```

### GET /orders/:orderId

Retrieve a specific order by ID.

**Path Parameters:**
- `orderId` (string): Order identifier

**Response:**

```json
{
  "id": "string",
  "customerId": "string",
  "customerName": "string",
  "customerAddress": "string",
  "items": [
    {
      "productId": "string",
      "productName": "string",
      "quantity": number,
      "price": number
    }
  ],
  "total": number,
  "status": "pending" | "active" | "delivered" | "cancelled",
  "hubId": "string",
  "hubName": "string",
  "orderDate": "string",
  "deliveryDate": "string",   // optional
  "shipperId": "string"       // optional
}
```

### POST /orders/:orderId/status

Update the status of an order (shipper only).

**Path Parameters:**
- `orderId` (string): Order identifier

**Request:**

```json
{
  "status": "delivered" | "cancelled"
}
```

**Response:**

```json
{
  "success": true
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Invalid status"
}
```

**Notes:**
- Only "delivered" and "cancelled" statuses are allowed
- When marked as "delivered", automatically sets deliveryDate
- Order disappears from active orders list after status change

### POST /orders/checkout

Place a new order (customer only).

**Request:**

```json
{
  "items": [
    {
      "productId": "string",    // required, minimum 1 character
      "quantity": number,       // required, positive integer
      "price": number          // required, positive number
    }
  ],                          // required, minimum 1 item
  "total": number             // required, positive number, must match calculated total
}
```

**Success Response:**

```json
{
  "success": true,
  "orderId": "string",         // generated order ID
  "message": "string",         // success message
  "total": number,             // confirmed total amount
  "itemCount": number          // number of items in order
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": "string",           // error message
  "details": []                // validation details (for validation errors)
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

**Error Response:**

```json
{
  "error": "string" // Error message description
}
```

**With Validation Details:**

```json
{
  "success": false,
  "error": "string",
  "details": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}
```

**Common HTTP Status Codes:**

- `200`: Success
- `201`: Created (for resource creation)
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `404`: Not Found
- `405`: Method Not Allowed
- `500`: Internal Server Error

---

## Authentication Requirements

**Role-Based Access:**

- **Customer endpoints**: `/cart/*`, `/orders/checkout`
- **Vendor endpoints**: `/vendor/products/*` (all CRUD operations)
- **Shipper endpoints**: `/orders/:orderId/status`, `/orders?hub={hub}`
- **Any authenticated user**: `/profile/*`, `/cart/*`

**Authentication Behavior:**

- Cart operations require valid `userId` parameter
- Unauthenticated users maintain local cart state only
- Cross-device synchronization requires authentication
- Registration stores user preferences (hub selection, business name, etc.)

---

## Validation Rules

### Email
- Must be valid email address format
- Required for all authentication endpoints

### Username
- 8-15 characters
- Alphanumeric only (A-Z, a-z, 0-9)
- Used for display purposes

### Password
- 8-20 characters
- Must include: uppercase letter, lowercase letter, digit, special character (!@#$%^&*)

### Product Fields
- **Name**: 10-20 characters for vendor products
- **Price**: Must be positive number
- **Description**: Maximum 500 characters
- **Image**: Optional valid URL or base64 string

### General Fields
- **Text fields**: Minimum 5 characters (names, addresses, business names)
- **Hub selection**: Must be one of: "Ho Chi Minh", "Da Nang", "Hanoi"

### File Uploads
- **Profile images**: Under 2MB, valid image formats (PNG, JPG, JPEG, GIF)
- **Supported endpoints**: `/profile/upload-image`

---

## Technical Implementation

### State Management
- **Redux Toolkit** for predictable state management
- **Redux Persist** for automatic localStorage persistence
- **React-Redux** hooks for component integration
- Centralized store with typed selectors and actions

### Data Storage
- **In-memory storage** for demo purposes
- **Registration data persistence** across login sessions
- **Role-specific data** (hub selection, business names)
- **Prepared for database integration**

### Cart Implementation
- Smart sync logic prevents data loss
- Immediate synchronization for reliability
- SSR-compatible storage with graceful fallbacks
- Type-safe schemas ensure data integrity
- Optimistic updates for responsive UX

### Error Handling
- Comprehensive error boundaries
- Toast notifications for user feedback (replacing browser alerts)
- Custom dialog components for confirmations
- Automatic retry mechanisms
- Graceful degradation for offline usage

### Performance Optimizations
- Memoized selectors prevent unnecessary re-renders
- Debounced UI updates where appropriate
- Efficient Redux store structure
- Minimal API calls through intelligent caching
- Simulated realistic API delays for testing

---

## API Summary

**Total Endpoints**: 16

**By Category**:
- **Authentication**: 4 endpoints (login + 3 registration types)
- **Profile**: 1 endpoint (image upload)
- **Cart**: 2 endpoints (GET/POST for sync)
- **Products**: 3 endpoints (list, search, detail)
- **Vendor Products**: 4 endpoints (GET, POST, PUT, DELETE)
- **Orders**: 3 endpoints (list, detail, status update, checkout)

**Implementation Status**: ✅ All endpoints fully implemented with mock data

**Frontend Integration**: ✅ Complete with Redux state management, error handling, and user notifications

**Ready for Production**: Backend replacement needed, frontend ready

---

*Last Updated: January 2024*
*Version: 1.0.0*
*Status: Complete*