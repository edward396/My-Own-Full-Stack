/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Nguyen The Anh
# ID: s3975844 */
import { z } from "zod"
import { type Request, type Response } from "express"
import { ErrorJsonResponse, SuccessJsonResponse } from "../utils/json_mes"
import { OrderItemService } from "../service/order_items.service"

export const getOrderItemsParamsSchema = z.object({
  id: z.string().min(1),
})



export async function getOrderItemsController(req: Request, res: Response) {
  try {
    const { id: orderId } = (req as any).validatedparams as z.infer<typeof getOrderItemsParamsSchema>
    const items = await OrderItemService.getByOrderId(orderId)
    const customerInfo = await OrderItemService.getCustomerNameAndAddressByOrderId(orderId)
    const customerName = customerInfo.length > 0 ? customerInfo[0].name : "(unknown customer)";
    const customerAddress = customerInfo.length > 0 ? customerInfo[0].address : "(unknown address)";


    return SuccessJsonResponse(res, 200, { order_id: orderId, customerName, customerAddress, items })
  } catch (e) {
    console.error(e)
    return ErrorJsonResponse(res, 500, "Failed to load order items")
  }
}
