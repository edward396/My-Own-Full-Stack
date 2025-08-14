import { z } from "zod";

const usernameRegex = /^[A-Za-z0-9]{8,15}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

export const usernameSchema = z
  .string()
  .regex(usernameRegex, "Username must be 8-15 letters/digits");

export const passwordSchema = z
  .string()
  .regex(
    passwordRegex,
    "Password 8-20, includes upper, lower, digit, special !@#$%^&*"
  );

export const minLen5 = z.string().min(5, "Minimum length is 5");

export const productSchema = z.object({
  name: z.string().min(10).max(20),
  price: z.coerce.number().positive(),
  image: z.any().optional(),
  description: z.string().max(500),
});

export const priceFilterSchema = z
  .object({
    q: z.string().optional(),
    min: z.string().optional(),
    max: z.string().optional(),
  })
  .refine(
    (v) => {
      const min = Number(v.min);
      const max = Number(v.max);
      if (isNaN(min) && isNaN(max)) return true;
      if (!isNaN(min) && !isNaN(max)) return min <= max;
      return true;
    },
    { message: "Min must be <= Max" }
  );

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: passwordSchema,
});

export const customerRegistrationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: usernameSchema,
  password: passwordSchema,
  name: minLen5,
  address: minLen5,
});

export const vendorRegistrationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: usernameSchema,
  password: passwordSchema,
  businessName: minLen5,
  businessAddress: minLen5,
});

export const shipperRegistrationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: usernameSchema,
  password: passwordSchema,
  hub: z.string().min(1, "Select a hub"),
});

export const profileImageUploadSchema = z.object({
  profileImage: z
    .any()
    .refine((files) => files instanceof FileList && files.length > 0, "Please select an image file")
    .refine(
      (files) => files instanceof FileList && files[0]?.type?.startsWith('image/'),
      "File must be an image"
    )
    .refine(
      (files) => files instanceof FileList && files[0]?.size <= 2 * 1024 * 1024,
      "File size must be less than 2MB"
    ),
});

export const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1, "Product ID is required"),
      quantity: z.number().int().positive("Quantity must be a positive integer"),
      price: z.number().positive("Price must be positive"),
    })
  ).min(1, "At least one item is required"),
  total: z.number().positive("Total must be positive"),
});

// Cart schemas
export const cartItemSchema = z.object({
  product: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    description: z.string(),
    imageUrl: z.string(),
    vendorId: z.string(),
    vendorName: z.string(),
    category: z.string(),
    inStock: z.boolean(),
    rating: z.number(),
    reviewCount: z.number(),
  }),
  quantity: z.number().positive("Quantity must be positive"),
});

export const cartSyncSchema = z.object({
  items: z.array(cartItemSchema),
});

export const cartResponseSchema = z.object({
  success: z.boolean(),
  items: z.array(cartItemSchema),
  lastUpdated: z.string().optional(),
  error: z.string().optional(),
});

export const cartSyncResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  itemCount: z.number().optional(),
  lastUpdated: z.string().optional(),
  error: z.string().optional(),
});
