import * as z from "zod";

export const createProductBodySchema = z.object({
    name: z
        .string()
        .trim()
        .min(10, "Name must be 10–20 characters")
        .max(20, "Name must be 10–20 characters"),
    price: z.number().positive("Price must be a positive number"),
    image: z.string().min(1, "Image is required"),
    description: z.string().trim().max(500, "Description must be at most 500 characters").optional(),
    category: z.string().trim().max(120).optional(),
}).strict();

export type CreateProductBody = z.infer<typeof createProductBodySchema>;