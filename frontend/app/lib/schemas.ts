import { z } from "zod";

// Product schemas - Updated to match backend response
export const ProductSchema = z
  .object({
    id: z.string(),
    vendor_id: z.string(),
    name: z.string(),
    price: z.number(),
    description: z.string(),
    image: z.string(),
    category: z.string(),
    instock: z.boolean(),
    // Optional fields for frontend compatibility
    vendorId: z.string().optional(),
    vendorName: z.string().optional(),
    imageUrl: z.string().optional(),
    inStock: z.boolean().optional(),
    rating: z.number().optional(),
    reviewCount: z.number().optional(),
  })
  .transform((data) => ({
    // Backend fields
    id: data.id,
    vendor_id: data.vendor_id,
    name: data.name,
    price: data.price,
    description: data.description,
    image: data.image,
    category: data.category,
    instock: data.instock,
    // Frontend compatibility fields with defaults
    vendorId: data.vendor_id,
    vendorName: data.vendorName || "Unknown Vendor",
    imageUrl: data.image,
    inStock: data.instock,
    rating: data.rating || 4.0,
    reviewCount: data.reviewCount || 0,
  }));
export type ProductDto = z.infer<typeof ProductSchema>;
export const ProductsSchema = z.array(ProductSchema);

// API Response schema for products endpoint
export const ProductsApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.object({
    data: z.object({
      products: z.array(ProductSchema),
      count: z.number(),
    }),
  }),
});

// API Response schema for single product endpoint
export const ProductApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.object({
    data: z.object({
      product: ProductSchema,
    }),
  }),
});

// Order schemas
const OrderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number(),
  price: z.number(),
});
export const OrderSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  customerAddress: z.string(),
  items: z.array(OrderItemSchema),
  total: z.number(),
  status: z.enum(["pending", "active", "delivered", "cancelled"]),
  hubId: z.string(),
  hubName: z.string(),
  orderDate: z.string(),
  deliveryDate: z.string().optional(),
  shipperId: z.string().optional(),
});
export type OrderDto = z.infer<typeof OrderSchema>;
export const OrdersSchema = z.array(OrderSchema);

// Auth DTO (updated to match backend response structure)
export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  password: z.string(),
  profile_picture: z.string().nullable(),
  role: z.enum(["customer", "vendor", "shipper"]),
  // Customer-specific fields
  name: z.string().optional(),
  address: z.string().optional(),
  // Vendor-specific fields
  business_name: z.string().optional(),
  business_address: z.string().optional(),
  // Shipper-specific fields
  hub_id: z.string().optional(),
});

export const LoginSchema = z.object({
  success: z.boolean(),
  message: z.object({
    data: z.object({
      user: UserSchema,
    }),
  }),
});

export type LoginDto = z.infer<typeof LoginSchema>;
export type UserDto = z.infer<typeof UserSchema>;
