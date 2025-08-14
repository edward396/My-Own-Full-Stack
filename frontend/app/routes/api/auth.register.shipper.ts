import { registerShipper } from "~/lib/auth-storage";

export async function action({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { email, username, hub } = body;
    
    if (!email || !username || !hub) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required fields: email, username, or hub" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    // Store the shipper with their selected hub
    registerShipper({ username, email, hub });
    
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
