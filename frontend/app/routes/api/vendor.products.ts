import { z } from "zod";

// Schema for vendor product creation
const vendorProductSchema = z.object({
  name: z.string().min(10, "Product name must be at least 10 characters").max(20, "Product name must be at most 20 characters"),
  price: z.number().positive("Price must be positive"),
  description: z.string().max(500, "Description must be at most 500 characters"),
  image: z.string().optional(), // Image URL or base64 string
});

// Handle POST and DELETE requests for vendor products
export async function action({ request }: { request: Request }) {
  const method = request.method;

  // Handle DELETE request
  if (method === "DELETE") {
    try {
      const url = new URL(request.url);
      const productId = url.searchParams.get("productId");
      const vendorId = url.searchParams.get("vendorId");
      
      if (!productId) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Product ID is required" 
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      if (!vendorId) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Vendor ID is required" 
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real application, this would:
      // 1. Verify the vendor owns this product
      // 2. Delete the product from the database
      // 3. Handle any related data cleanup (orders, reviews, etc.)
      // 4. Remove product images from storage
      
      console.log(`Mock: Deleting product ${productId} for vendor ${vendorId}`);

      // Simulate successful deletion
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Product deleted successfully",
          productId: productId
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json" } 
        }
      );

    } catch (error) {
      console.error("Product deletion error:", error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to delete product" 
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }
  }

  // Handle PUT request (update product)
  if (method === "PUT") {
    try {
      const url = new URL(request.url);
      const productId = url.searchParams.get("productId");
      const vendorId = url.searchParams.get("vendorId");
      
      if (!productId) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Product ID is required" 
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      if (!vendorId) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Vendor ID is required" 
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const body = await request.json().catch(() => ({}));
      
      // Validate the request body
      const validationResult = vendorProductSchema.safeParse(body);
      
      if (!validationResult.success) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Validation failed",
            details: validationResult.error.issues.map(issue => ({
              field: issue.path.join('.'),
              message: issue.message
            }))
          }),
          { 
            status: 400, 
            headers: { "Content-Type": "application/json" } 
          }
        );
      }

      const { name, price, description, image } = validationResult.data;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 400));

      // In a real application, this would:
      // 1. Verify the vendor owns this product
      // 2. Update the product in the database
      // 3. Return the updated product data
      
      console.log(`Mock: Updating product ${productId} for vendor ${vendorId}`, {
        name, price, description, image
      });

      // Create updated product object for response
      const updatedProduct = {
        id: productId,
        name,
        price,
        description,
        image: image || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop",
        vendorId: vendorId,
        vendorName: "TechGear Solutions",
        category: "Electronics", // In real app, this might be updateable too
        inStock: true,
        rating: 4.0,
        reviewCount: 0,
        updatedAt: new Date().toISOString()
      };

      // Simulate successful update
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Product updated successfully",
          productId: productId,
          updatedProduct: updatedProduct
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json" } 
        }
      );

    } catch (error) {
      console.error("Product update error:", error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to update product" 
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }
  }

  // Handle POST request (create product)
  if (method === "POST") {
    try {
      const body = await request.json().catch(() => ({}));
      
      // Validate the request body
      const validationResult = vendorProductSchema.safeParse(body);
      
      if (!validationResult.success) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Validation failed",
            details: validationResult.error.issues.map(issue => ({
              field: issue.path.join('.'),
              message: issue.message
            }))
          }),
          { 
            status: 400, 
            headers: { "Content-Type": "application/json" } 
          }
        );
      }

      const { name, price, description, image } = validationResult.data;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Generate a mock product ID
      const productId = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // In a real application, this would save to the database
      // For now, we'll just return a success response
      console.log("Mock vendor product created:", {
        id: productId,
        name,
        price,
        description,
        image,
        createdAt: new Date().toISOString()
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          id: productId,
          message: "Product created successfully"
        }),
        { 
          status: 201, 
          headers: { "Content-Type": "application/json" } 
        }
      );

    } catch (error) {
      console.error("Vendor product creation error:", error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to create product" 
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }
  }

  // Method not allowed
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: "Method not allowed" 
    }),
    { 
      status: 405, 
      headers: { "Content-Type": "application/json" } 
    }
  );
}

// GET /api-test/vendor/products - Get vendor's products with dummy data
export async function loader({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const vendorId = url.searchParams.get("vendorId");
    
    // If no vendorId provided, we'll still return dummy products for demo purposes
    const effectiveVendorId = vendorId || "vendor_demo";

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Generate realistic dummy products for vendor
    const dummyProducts = [
      {
        id: "prod_electronics_001",
        name: "Wireless Bluetooth Headphones",
        price: 89.99,
        description: "High-quality wireless headphones with noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
        vendorId: effectiveVendorId,
        vendorName: "TechGear Solutions",
        category: "Electronics",
        inStock: true,
        rating: 4.5,
        reviewCount: 127,
        createdAt: "2024-01-15T10:30:00Z"
      },
      {
        id: "prod_electronics_002", 
        name: "Smart Phone Case Set",
        price: 24.99,
        description: "Durable protective case with screen protector and wireless charging compatibility. Available in multiple colors with premium materials.",
        image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=300&fit=crop",
        vendorId: effectiveVendorId,
        vendorName: "TechGear Solutions",
        category: "Electronics",
        inStock: true,
        rating: 4.2,
        reviewCount: 89,
        createdAt: "2024-01-20T14:15:00Z"
      },
      {
        id: "prod_home_001",
        name: "Premium Coffee Maker",
        price: 159.99,
        description: "Professional-grade coffee maker with programmable timer, auto-shutoff, and thermal carafe. Brews perfect coffee every time with multiple strength settings.",
        image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=300&h=300&fit=crop",
        vendorId: effectiveVendorId,
        vendorName: "TechGear Solutions",
        category: "Home & Kitchen",
        inStock: true,
        rating: 4.7,
        reviewCount: 203,
        createdAt: "2024-02-01T09:45:00Z"
      },
      {
        id: "prod_fashion_001",
        name: "Classic Leather Wallet",
        price: 45.00,
        description: "Handcrafted genuine leather wallet with RFID blocking technology. Multiple card slots, cash compartment, and elegant design for everyday use.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
        vendorId: effectiveVendorId,
        vendorName: "TechGear Solutions",
        category: "Fashion",
        inStock: false,
        rating: 4.3,
        reviewCount: 156,
        createdAt: "2024-02-10T16:20:00Z"
      },
      {
        id: "prod_sports_001",
        name: "Yoga Mat Pro Series",
        price: 79.99,
        description: "Professional-grade yoga mat with superior grip and cushioning. Extra thick, non-slip surface perfect for all types of yoga and exercise routines.",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
        vendorId: effectiveVendorId,
        vendorName: "TechGear Solutions",
        category: "Sports & Fitness",
        inStock: true,
        rating: 4.6,
        reviewCount: 92,
        createdAt: "2024-02-15T11:30:00Z"
      },
      {
        id: "prod_books_001",
        name: "Complete Programming Guide",
        price: 34.99,
        description: "Comprehensive programming guide covering modern web development, algorithms, and best practices. Perfect for beginners and intermediate developers.",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop",
        vendorId: effectiveVendorId,
        vendorName: "TechGear Solutions",
        category: "Books",
        inStock: true,
        rating: 4.8,
        reviewCount: 78,
        createdAt: "2024-02-20T13:45:00Z"
      },
      {
        id: "prod_electronics_003",
        name: "USB-C Hub Station",
        price: 69.99,
        description: "Multi-port USB-C hub with 4K HDMI output, USB 3.0 ports, SD card reader, and power delivery. Essential for modern laptops and tablets.",
        image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=300&h=300&fit=crop",
        vendorId: effectiveVendorId,
        vendorName: "TechGear Solutions",
        category: "Electronics",
        inStock: true,
        rating: 4.4,
        reviewCount: 145,
        createdAt: "2024-02-25T08:15:00Z"
      },
      {
        id: "prod_home_002",
        name: "Smart LED Light Strips",
        price: 29.99,
        description: "WiFi-enabled LED light strips with millions of colors, music sync, and app control. Perfect for room ambiance and smart home integration.",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop",
        vendorId: effectiveVendorId,
        vendorName: "TechGear Solutions", 
        category: "Home & Kitchen",
        inStock: true,
        rating: 4.1,
        reviewCount: 67,
        createdAt: "2024-03-01T15:30:00Z"
      }
    ];

    return new Response(
      JSON.stringify({ 
        success: true, 
        products: dummyProducts,
        totalCount: dummyProducts.length,
        vendorId: effectiveVendorId
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Vendor products fetch error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to fetch vendor products" 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}