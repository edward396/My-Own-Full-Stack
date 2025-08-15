/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Nguyen The Anh
# ID: s3975844 */

import { supabase, Database } from "../db/db";

export type Product = Database["public"]["Tables"]["products"]["Row"];

export const ProductService = {
  /** Fetch all Customers*/
  async getAllProducts(): Promise<Product[] | null> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    //DEBUG, will be remove
    console.log("📊 Raw Supabase response:");
    console.log("  - Data:", data);
    console.log("  - Error:", error);
    console.log("  - Data length:", data?.length);
    //

    if (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
    console.log(data);

    if (!data) {
      return null; // explicitly return null to trigger 404 in route
    }
    return data;
  },

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    console.log("data", data);

    if (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }

    return data || null;
  },

  //   async createProduct(productInfo: {
  //     name: string;
  //     quantity: number
  //   }) {
  //     supabase.insert("products")
  //   }
};