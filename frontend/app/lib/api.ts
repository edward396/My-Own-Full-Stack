import { z } from "zod";
import {
  ProductSchema,
  ProductsSchema,
  ProductsApiResponseSchema,
  ProductApiResponseSchema,
  OrderSchema,
  OrdersSchema,
  LoginSchema,
  type ProductDto,
  type OrderDto,
  type LoginDto,
} from "~/lib/schemas";
import {
  customerRegistrationSchema,
  vendorRegistrationSchema,
  shipperRegistrationSchema,
  loginSchema,
  cartSyncSchema,
  cartResponseSchema,
  cartSyncResponseSchema,
} from "~/lib/validators";

// Mock cart storage (in a real app, this would be in a database)
const mockCartStorage = new Map<string, any[]>();

// Mock cart handlers
export function mockGetCart(userId: string) {
  const userCart = mockCartStorage.get(userId) || [];
  return {
    success: true,
    items: userCart,
    lastUpdated: new Date().toISOString(),
  };
}

export function mockSyncCart(userId: string, cartData: any) {
  // Validate cart data
  const validatedData = cartSyncSchema.parse(cartData);

  // Save cart to mock storage
  mockCartStorage.set(userId, validatedData.items);

  return {
    success: true,
    message: "Cart synced successfully",
    itemCount: validatedData.items.length,
    lastUpdated: new Date().toISOString(),
  };
}

// Shared fetch helper with zod parsing
async function request<T>(
  input: RequestInfo | URL,
  schema: z.ZodType<T>,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    credentials: "include", // Include cookies for authentication
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  const data = await res.json();
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }
  return parsed.data;
}

// API endpoints (local mock uses /api-test; /api reserved for real backend)
const API_BASE = "http://localhost:5000/api"; // you can swap to an env-based URL later

// Products
export async function fetchProducts(): Promise<ProductDto[]> {
  const response = await request(
    `${API_BASE}/products`,
    ProductsApiResponseSchema
  );
  return response.message.data.products;
}

export async function fetchProduct(productId: string): Promise<ProductDto> {
  const response = await request(
    `${API_BASE}/products/${productId}`,
    ProductApiResponseSchema
  );
  return response.message.data.product;
}

export async function searchProductsApi(params: {
  q?: string;
  min?: number;
  max?: number;
  category?: string;
}): Promise<ProductDto[]> {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.min !== undefined) qs.set("min", String(params.min));
  if (params.max !== undefined) qs.set("max", String(params.max));
  if (params.category) qs.set("category", params.category);
  const response = await request(
    `${API_BASE}/products/search?${qs.toString()}`,
    ProductsApiResponseSchema
  );
  return response.message.data.products;
}

// Orders (Shipper)
export async function fetchOrdersByHub(hubName: string): Promise<OrderDto[]> {
  return request(
    `${API_BASE}/orders?hub=${encodeURIComponent(hubName)}`,
    OrdersSchema
  );
}

export async function fetchOrder(orderId: string): Promise<OrderDto> {
  return request(`${API_BASE}/orders/${orderId}`, OrderSchema);
}

export async function updateOrderStatusApi(
  orderId: string,
  status: "delivered" | "cancelled"
): Promise<{ success: boolean }> {
  return request(
    `${API_BASE}/orders/${orderId}/status`,
    z.object({ success: z.boolean() }),
    { method: "POST", body: JSON.stringify({ status }) }
  );
}

// Auth
export async function loginApi(
  credentials: z.infer<typeof loginSchema>
): Promise<LoginDto> {
  return request(`${API_BASE}/auth/login`, LoginSchema, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
// Fix customer registration
export async function registerCustomerApi(
  data: z.infer<typeof customerRegistrationSchema>
): Promise<{ success: boolean }> {
  // Add missing profile_picture field that backend expects
  const transformedData = {
    email: data.email,
    username: data.username,
    password: data.password,
    name: data.name,
    address: data.address,
    profile_picture: null, // Backend expects this field
  };

  return request(
    `${API_BASE}/auth/register/customer`,
    z.object({ success: z.boolean() }),
    { method: "POST", body: JSON.stringify(transformedData) }
  );
}

// Fix vendor registration
export async function registerVendorApi(
  data: z.infer<typeof vendorRegistrationSchema>
): Promise<{ success: boolean }> {
  // Transform field names to match backend expectations
  const transformedData = {
    email: data.email,
    username: data.username,
    password: data.password,
    business_name: data.businessName, // camelCase → snake_case
    business_address: data.businessAddress, // camelCase → snake_case
    profile_picture: null, // Backend expects this field
  };

  return request(
    `${API_BASE}/auth/register/vendor`,
    z.object({ success: z.boolean() }),
    { method: "POST", body: JSON.stringify(transformedData) }
  );
}

// Fix shipper registration
export async function registerShipperApi(
  data: z.infer<typeof shipperRegistrationSchema>
): Promise<{ success: boolean }> {
  // Transform field names to match backend expectations
  const transformedData = {
    email: data.email,
    username: data.username,
    password: data.password,
    hub_id: data.hub, // hub → hub_id
    profile_picture: null, // Backend expects this field
  };

  return request(
    `${API_BASE}/auth/register/shipper`,
    z.object({ success: z.boolean() }),
    { method: "POST", body: JSON.stringify(transformedData) }
  );
}

// Vendor - create product (demo)
export async function createProductApi(data: {
  name: string;
  price: number;
  description: string;
  image?: File | null;
}): Promise<{ success: boolean; id?: string }> {
  return request(
    `${API_BASE}/vendor/products`,
    z.object({ success: z.boolean(), id: z.string().optional() }),
    { method: "POST", body: JSON.stringify({ ...data, image: undefined }) }
  );
}

// Delete vendor product
export async function deleteVendorProductApi(
  productId: string,
  vendorId: string
): Promise<{ success: boolean; message?: string; productId?: string }> {
  const url = `${API_BASE}/vendor/products?productId=${encodeURIComponent(productId)}&vendorId=${encodeURIComponent(vendorId)}`;

  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`API ${response.status}: ${text || response.statusText}`);
  }

  const data = await response.json();
  const schema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
    productId: z.string().optional(),
  });

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}

// Edit vendor product
export async function editVendorProductApi(
  productId: string,
  vendorId: string,
  productData: {
    name: string;
    price: number;
    description: string;
    image?: string;
  }
): Promise<{
  success: boolean;
  message?: string;
  productId?: string;
  updatedProduct?: any;
}> {
  const url = `${API_BASE}/vendor/products?productId=${encodeURIComponent(productId)}&vendorId=${encodeURIComponent(vendorId)}`;

  const response = await fetch(url, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`API ${response.status}: ${text || response.statusText}`);
  }

  const data = await response.json();
  const schema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
    productId: z.string().optional(),
    updatedProduct: z.any().optional(),
  });

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}

// Checkout (enhanced)
export async function placeOrderApi(payload: {
  items: Array<{ productId: string; quantity: number; price: number }>;
  total: number;
}): Promise<{
  success: boolean;
  orderId?: string;
  message?: string;
  total?: number;
  itemCount?: number;
  error?: string;
  details?: any;
}> {
  return request(
    `${API_BASE}/orders/checkout`,
    z.object({
      success: z.boolean(),
      orderId: z.string().optional(),
      message: z.string().optional(),
      total: z.number().optional(),
      itemCount: z.number().optional(),
      error: z.string().optional(),
      details: z.any().optional(),
    }),
    { method: "POST", body: JSON.stringify(payload) }
  );
}

// Profile image upload
export async function uploadProfileImageApi(file: File): Promise<{
  success: boolean;
  imageUrl?: string;
}> {
  const formData = new FormData();
  formData.append("profileImage", file);

  const res = await fetch(`${API_BASE}/profile/upload-image`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }

  const data = await res.json();
  const parsed = z
    .object({
      success: z.boolean(),
      imageUrl: z.string().optional(),
    })
    .safeParse(data);

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}

// Cart API functions
export async function fetchCartApi(userId: string): Promise<{
  success: boolean;
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
      description: string;
      imageUrl: string;
      vendorId: string;
      vendorName: string;
      category: string;
      inStock: boolean;
      rating: number;
      reviewCount: number;
    };
    quantity: number;
  }>;
  lastUpdated?: string;
  error?: string;
}> {
  const res = await fetch(
    `${API_BASE}/cart?userId=${encodeURIComponent(userId)}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }

  const data = await res.json();
  const parsed = cartResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}

export async function syncCartApi(
  userId: string,
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
      description: string;
      imageUrl: string;
      vendorId: string;
      vendorName: string;
      category: string;
      inStock: boolean;
      rating: number;
      reviewCount: number;
    };
    quantity: number;
  }>
): Promise<{
  success: boolean;
  message?: string;
  itemCount?: number;
  lastUpdated?: string;
  error?: string;
}> {
  const res = await fetch(
    `${API_BASE}/cart?userId=${encodeURIComponent(userId)}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }

  const data = await res.json();
  const parsed = cartSyncResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}
