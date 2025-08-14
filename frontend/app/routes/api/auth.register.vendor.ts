import { registerVendor } from "~/lib/auth-storage";

export async function action({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { email, username, businessName } = body;
    
    if (!email || !username || !businessName) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required fields: email, username, or businessName" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    // Store the vendor with their business name
    registerVendor({ username, email, businessName });
    
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
