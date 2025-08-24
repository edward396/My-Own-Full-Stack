/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Nguyen The Anh
# ID: s3975844*/
import { z } from "zod"
import { type Request, type Response } from "express"
import { ShoppingCartService } from "../service/shopping_carts.service"
import { ErrorJsonResponse, SuccessJsonResponse } from "../utils/json_mes"

export const getCartQuerrySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  size: z.coerce.number().min(1).max(30).default(10),
}).strict()

type GetCartQuerryType = z.output<typeof getCartQuerrySchema>

export const getCartController = async (req: Request, res: Response) => {
  try {

    const { page, size } =
      (req as unknown as { validatedquery: GetCartQuerryType }).validatedquery

    const items = await ShoppingCartService.getCart({ page, size }, req.user_id)

    if (items === null) {
      return ErrorJsonResponse(res, 500, "Failed to fetch shopping cart")
    }

    return SuccessJsonResponse(res, 200, {
      data: { items, count: items.length, page, size },
    })
  } catch (err: any) {
    if (err?.issues) {
      return ErrorJsonResponse(res, 400, err.issues[0]?.message ?? "Validation failed")
    }
    console.log("ERR getCart:", err)

    // throw error 500 of database
    return ErrorJsonResponse(res, 500, "Unexpected error while fetching cart")
  }
}


// Delete cart item by id
export const deleteByIdParamsSchema = z.object({
  id: z.string().min(1),
}).strict();

export async function deleteCartItemByIdController(req: Request, res: Response) {
  try {
    const { id } = deleteByIdParamsSchema.parse(req.params);
    const userId = req.user_id; //user_id of customer

    
    const deleted = await ShoppingCartService.deleteItemById(id, userId);
    if (!deleted) return ErrorJsonResponse(res, 404, "Cart item not found");

    return SuccessJsonResponse(res, 200, { data: { deleted: true, id } });
  } catch (err: any) {
    const msg = err?.message?.startsWith("Unauthorized") ? err.message : "Failed to delete cart item";
    return ErrorJsonResponse(res, msg.startsWith("Unauthorized") ? 401 : 500, msg);
  }
}

export const addToCartBodySchema = z.object({
  product_id: z.string(), 
  quantity: z.coerce.number().int().min(1).default(1),
})

export async function addToCartController(req: Request, res: Response) {
  try {
    const customerId = req.user_id; // user_id of customer
    

    const { product_id, quantity } = (req as any).validatedbody

    const item = await ShoppingCartService.addToCart(customerId, { product_id, quantity })
    return SuccessJsonResponse(res, 200, { item })
  } catch (e: any) {
    console.error("ADD_CART_ERROR:", e)
    return ErrorJsonResponse(res, e.status ?? 500, e.message ?? "ADD_CART_FAILED")
  }
}


export async function checkoutController(req: Request, res: Response) {
  try {
    const customerId = req.user_id; // user_id of customer

    const result = await ShoppingCartService.checkout(customerId as string)

    return SuccessJsonResponse(res, 201, {
      message: "Checkout success",
      order: {
        id: result.orderId,
        hub_id: result.hubId,
        status: "active",
        total_price: result.total,
      },
    })
  } catch (err) {
    console.error(err)
    return ErrorJsonResponse(res, 500, (err as Error).message)
  }
}