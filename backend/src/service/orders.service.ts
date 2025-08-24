/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Nguyen The Anh
# ID: s3975844*/
import { supabase, Database } from "../db/db";

export type OrderStatus = "active" | "delivered" | "canceled"; //Statuses of an order
export type Order = Database["public"]["Tables"]["orders"]["Row"]; //take the orders table from database

export type Pagination = {
  page: number;
  size: number;
};

export const OrderService = {
  //take the orders from write hub_id and return the orders in that hub
  async getOrders({ page, size }: Pagination, shipperId: string, status: OrderStatus[] = ["active"]): Promise<Order[] | null> {
    const offset = (page - 1) * size;

    const { data: distributionId, error: distributionErr } = await supabase //take the hub_id of shipper
      .from("shippers")
      .select("hub_id")
      .eq("id", shipperId)
      .maybeSingle();

    if (distributionErr) {
      console.error("Error fetching shipper hub:", distributionErr);
      throw new Error("DB_READ_FAILED");
    }

    const hubId = distributionId?.hub_id;
    if (!hubId) {
      //empty hub_id, return empty orders
      console.warn("No hub_id found for shipper:", shipperId);
    }

    // no hub_id -> return null
    if (!hubId) return [];

    let queryOrders = supabase.from("orders").select("*").eq("hub_id", hubId);

    //filter by status if provided
    if (status?.length) {
      queryOrders = queryOrders.in("status", status); // take all three statuses
    }

    const { data, error } = await queryOrders
      .order("id", { ascending: false })
      .range(offset, offset + size - 1);

    if (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
    return data ?? null;
  },

  // update the status of an order only "active" status -> "delivered" or "canceled"
  async updateStatus(
    orderId: string,
    nextStatus: Exclude<OrderStatus, "active">,
    shipperId: string
  ): Promise<Order> {
    //take the current order same as orderId
    //check hub_id of shipper through user_id
    const { data: distributionId, error: distributionErr } = await supabase //take the hub_id of shipper
      .from("shippers")
      .select("hub_id")
      .eq("id", shipperId)
      .maybeSingle();

    if (distributionErr) {
      console.error("Error fetching shipper hub:", distributionErr);
      throw new Error("DB_READ_FAILED");
    }
    if (!distributionId?.hub_id) {
      //Vendor or customer can not access
      throw new Error("Unauthorized: Only shipper can update order status");
    }
    const hubId = distributionId?.hub_id;
    if (!hubId) {
      //empty hub_id, return empty orders
      console.warn("No hub_id found for shipper:", shipperId);
    }

    const { data: currentOrder, error: getErr } = await supabase
      .from("orders")
      .select("id, status, hub_id")
      .eq("id", orderId)
      .maybeSingle();

    if (getErr) throw new Error("DB_READ_FAILED");
    if (!currentOrder) throw new Error("NOT_FOUND");
    if (currentOrder.status !== "active") throw new Error("ALREADY_FINALIZED");
    if (currentOrder.hub_id !== hubId)
      throw new Error("Unauthorized: Order not in your hub"); //check if order in this hub
    // only update status if current status is "active"
    let q = supabase
      .from("orders")
      .update({ status: nextStatus })
      .eq("id", orderId)
      .eq("status", "active");

    if (hubId) q = q.eq("hub_id", hubId);

    const { data: updated, error: updErr } = await q
      .select("id, status, hub_id, customer_id, total_price")
      .maybeSingle();

    if (updErr) {
      console.error("UPDATE_ERROR:", updErr); //Debugging purpose
      throw new Error("DB_WRITE_FAILED");
    }
    if (!updated) throw new Error("CONFLICT");

    return updated as Order;
  },
};
