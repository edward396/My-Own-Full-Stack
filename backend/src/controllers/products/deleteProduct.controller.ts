import * as z from "zod";

export const deleteProductParamsSchema = z.object({
    productId: z.string(),
}).strict();

export type DeleteProductParams = z.infer<typeof deleteProductParamsSchema>;