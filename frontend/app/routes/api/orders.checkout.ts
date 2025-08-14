import { checkoutSchema } from "~/lib/validators";
import { z } from "zod";

export async function action({ request }: { request: Request }) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validatedData = checkoutSchema.parse(body);
    
    // Simulate order processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Validate that total matches calculated total from items
    const calculatedTotal = validatedData.items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );
    
    // Allow for small floating point differences
    const totalDifference = Math.abs(calculatedTotal - validatedData.total);
    if (totalDifference > 0.01) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Total amount does not match calculated total from items" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    // Generate a mock order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Return success with order details
    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId,
        message: "Order placed successfully",
        total: validatedData.total,
        itemCount: validatedData.items.length
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid checkout data", 
          details: error.issues 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to process checkout" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}