import { 
  getRoleFromEmail, 
  getShipperByEmail, 
  getVendorByEmail, 
  getCustomerByEmail 
} from "~/lib/auth-storage";

export async function action({ request }: { request: Request }) {
  const body = await request.json().catch(() => ({}));
  const { email } = body || {};
  
  if (!email) {
    return new Response(JSON.stringify({ error: "Missing credentials" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  // Determine role from email
  const role = getRoleFromEmail(email);
  
  // Extract username from email for backwards compatibility
  const username = email.split('@')[0];
  
  // Create base user object
  const user: any = { 
    id: `${role}_${username}`, 
    username, 
    role 
  };
  
  // Add role-specific properties from stored registration data
  if (role === "shipper") {
    const shipperData = getShipperByEmail(email);
    
    if (shipperData) {
      // Use the hub that was selected during registration
      user.distributionHub = shipperData.hub;
      user.username = shipperData.username; // Use stored username
      console.log(`Shipper ${shipperData.username} logged in -> ${shipperData.hub} hub`);
    } else {
      // Fallback for unregistered accounts (for testing)
      user.distributionHub = "Ho Chi Minh"; // Default hub
      console.log(`Unregistered shipper ${username} defaulted to Ho Chi Minh hub`);
    }
  } else if (role === "vendor") {
    const vendorData = getVendorByEmail(email);
    
    if (vendorData) {
      user.businessName = vendorData.businessName;
      user.username = vendorData.username;
    } else {
      user.businessName = `${username} Business`; // Fallback
    }
  } else if (role === "customer") {
    const customerData = getCustomerByEmail(email);
    
    if (customerData) {
      user.name = customerData.name;
      user.username = customerData.username;
    } else {
      user.name = username; // Fallback
    }
  }
  
  return new Response(
    JSON.stringify(user),
    { headers: { "Content-Type": "application/json" } }
  );
}
