import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  // Static pages
  route("about", "routes/about.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("help", "routes/help.tsx"),

  // Authentication
  route("login", "routes/auth/login.tsx"),
  // Single route handles base and role-specific tabs
  route("register/:role?", "routes/auth/register.tsx"),

  // Account
  route("account", "routes/account/profile.tsx"),

  // Customer routes
  route("products", "routes/customer/products.tsx"),
  route("products/:productId", "routes/customer/product-detail.tsx"),
  route("cart", "routes/customer/cart.tsx"),

  // Vendor routes
  route("vendor/products", "routes/vendor/products.tsx"),
  route("vendor/products/new", "routes/vendor/add-product.tsx"),

  // Shipper routes
  route("shipper/orders", "routes/shipper/orders.tsx"),
  route("shipper/orders/:orderId", "routes/shipper/order-detail.tsx"),

  // API routes (mock backend under /api-test)
  route("api-test/products", "routes/api/products.ts"),
  route("api-test/products/search", "routes/api/products.search.ts"),
  route("api-test/products/:productId", "routes/api/products.$productId.ts"),
  route("api-test/vendor/products", "routes/api/vendor.products.ts"),
  route("api-test/orders", "routes/api/orders.ts"),
  route("api-test/orders/checkout", "routes/api/orders.checkout.ts"),
  route("api-test/orders/:orderId", "routes/api/orders.$orderId.ts"),
  route(
    "api-test/orders/:orderId/status",
    "routes/api/orders.$orderId.status.ts"
  ),
  route("api-test/profile/upload-image", "routes/api/profile.upload-image.ts"),
  route("api-test/cart", "routes/api/cart.ts"),
] satisfies RouteConfig;
