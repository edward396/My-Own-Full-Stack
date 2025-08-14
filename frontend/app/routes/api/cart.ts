import { z } from "zod";
import { mockGetCart, mockSyncCart } from "~/lib/api";
import { cartSyncSchema } from "~/lib/validators";

// GET /api-test/cart - Get user's cart
export async function loader({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "User ID is required" 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Get cart using centralized mock function
    const result = mockGetCart(userId);

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Cart fetch error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to fetch cart" 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// POST /api-test/cart - Sync user's cart
export async function action({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "User ID is required" 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Sync cart using centralized mock function
    const result = mockSyncCart(userId, body);

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid cart data",
          details: error.issues,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.error("Cart sync error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to sync cart" 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}