import { z } from "zod";

// Product schemas
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  imageUrl: z.string().url(),
  vendorId: z.string(),
  vendorName: z.string(),
  category: z.string(),
  inStock: z.boolean(),
  rating: z.number(),
  reviewCount: z.number(),
});
export type ProductDto = z.infer<typeof ProductSchema>;
export const ProductsSchema = z.array(ProductSchema);

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

// Auth DTO (optional)
export const LoginSchema = z.object({
  id: z.string(),
  username: z.string(),
  role: z.enum(["customer", "vendor", "shipper"]),
  name: z.string().optional(),
  businessName: z.string().optional(),
  distributionHub: z.string().optional(),
});
export type LoginDto = z.infer<typeof LoginSchema>;
