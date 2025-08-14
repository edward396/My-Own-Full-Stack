// Simple in-memory storage for demo purposes
// In a real app, this would be a database

export interface RegisteredShipper {
  username: string;
  email: string;
  hub: string;
}

export interface RegisteredVendor {
  username: string;
  email: string;
  businessName: string;
}

export interface RegisteredCustomer {
  username: string;
  email: string;
  name: string;
}

// Storage maps
const registeredShippers = new Map<string, RegisteredShipper>();
const registeredVendors = new Map<string, RegisteredVendor>();
const registeredCustomers = new Map<string, RegisteredCustomer>();

// Pre-populate with test accounts
registeredShippers.set("shippertest@test.com", { 
  username: "shippertest", 
  email: "shippertest@test.com", 
  hub: "Ho Chi Minh" 
});
registeredShippers.set("shipper@hanoi.com", { 
  username: "shipperhanoi", 
  email: "shipper@hanoi.com", 
  hub: "Hanoi" 
});
registeredShippers.set("shipper@danang.com", { 
  username: "shipperdanang", 
  email: "shipper@danang.com", 
  hub: "Da Nang" 
});

// Test vendor accounts
registeredVendors.set("vendor@test.com", {
  username: "vendortest",
  email: "vendor@test.com", 
  businessName: "Test Electronics Store"
});

// Test customer accounts
registeredCustomers.set("customer@test.com", {
  username: "customertest",
  email: "customer@test.com",
  name: "Test Customer"
});

// Shipper functions
export function registerShipper(shipper: RegisteredShipper): void {
  registeredShippers.set(shipper.email, shipper);
  console.log(`Registered shipper: ${shipper.username} (${shipper.email}) -> ${shipper.hub} hub`);
}

export function getShipperByEmail(email: string): RegisteredShipper | undefined {
  return registeredShippers.get(email);
}

export function getAllShippers(): RegisteredShipper[] {
  return Array.from(registeredShippers.values());
}

// Vendor functions
export function registerVendor(vendor: RegisteredVendor): void {
  registeredVendors.set(vendor.email, vendor);
  console.log(`Registered vendor: ${vendor.username} (${vendor.email}) -> ${vendor.businessName}`);
}

export function getVendorByEmail(email: string): RegisteredVendor | undefined {
  return registeredVendors.get(email);
}

// Customer functions
export function registerCustomer(customer: RegisteredCustomer): void {
  registeredCustomers.set(customer.email, customer);
  console.log(`Registered customer: ${customer.username} (${customer.email}) -> ${customer.name}`);
}

export function getCustomerByEmail(email: string): RegisteredCustomer | undefined {
  return registeredCustomers.get(email);
}

// Helper to determine role from email
export function getRoleFromEmail(email: string): "customer" | "vendor" | "shipper" {
  if (email.startsWith("vendor@") || email.includes("vendor") || registeredVendors.has(email)) {
    return "vendor";
  }
  if (email.startsWith("shipper@") || email.includes("shipper") || registeredShippers.has(email)) {
    return "shipper";
  }
  return "customer";
}