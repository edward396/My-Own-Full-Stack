/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Nguyen The Anh
# ID: s3975844 */

import { supabase, type Database } from "../db/db"

type ProductRow = Database["public"]["Tables"]["products"]["Row"]
type customerRow = Database["public"]["Tables"]["customers"]["Row"]
type OrderItemsRow = Database["public"]["Tables"]["order_items"]["Row"]

export type OrderItemWithProduct = {
//  order_id: string
  product_name: string
  quantity: number
  price_at_order_time: number
  total: number
}

export type orderInformation = {
  name: string
  address: string
}

export const OrderItemService = {
  async getByOrderId(orderId: string): Promise<OrderItemWithProduct[]> {

    // take the item by id
    const { data: items, error: errItems } = await supabase
      .from("order_items")
      .select("id, order_id, product_id, quantity, price_at_order_time")
      .eq("order_id", orderId)
      .order("id", { ascending: false })

    if (errItems) throw errItems
    if (!items || items.length === 0) return []

    // take the product names
    const productIds = Array.from(new Set(items.map(i => i.product_id)))
    const { data: prods, error: errProds } = await supabase
      .from("products")
      .select("id, name")
      .in("id", productIds)

    if (errProds) throw errProds
    const nameById = new Map<string, string>(
      (prods ?? []).map((p: Pick<ProductRow, "id" | "name">) => [p.id, p.name ?? ""])
    )


    // merge data and calculate total
    return items.map((i: Pick<OrderItemsRow,"order_id"|"product_id"|"quantity"|"price_at_order_time">) => ({
//      order_id: i.order_id,
      product_name: nameById.get(i.product_id) ?? "(unknown product)",
      quantity: Number(i.quantity ?? 0),
      price_at_order_time: Number(i.price_at_order_time ?? 0),
      total: Number(i.quantity ?? 0) * Number(i.price_at_order_time ?? 0),
    }))
  },
  async getCustomerNameAndAddressByOrderId(orderId: string): Promise<orderInformation[]> {
    const {data: customerOrder, error: customerOrderErr} = await supabase
    .from("orders")
    .select()
    .eq("id", orderId)
    .maybeSingle()

    if (customerOrderErr) throw customerOrderErr
    if (!customerOrder) return []

    const customerId = customerOrder.customer_id
    const {data: customer, error: customerErr} = await supabase
    .from("customers")
    .select("name, address")
    .eq("id", customerId)
    .maybeSingle()
    if (customerErr) throw customerErr
    if (!customer) return []
    return [{name: customer.name, address: customer.address}]
  }
}