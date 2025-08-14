import { registerCustomer } from "~/lib/auth-storage";

export async function action({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { email, username, name } = body;
    
    if (!email || !username || !name) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required fields: email, username, or name" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    // Store the customer with their name
    registerCustomer({ username, email, name });
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Invalid request body" 
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
