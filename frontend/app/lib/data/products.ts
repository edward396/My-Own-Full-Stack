// Mock product data for demonstration
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  vendorId: string;
  vendorName: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    description:
      "High-quality wireless headphones with active noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    vendorId: "vendor1",
    vendorName: "TechGear Store",
    category: "Electronics",
    inStock: true,
    rating: 4.5,
    reviewCount: 128,
  },
  {
    id: "2",
    name: "Organic Cotton T-Shirt",
    price: 24.99,
    description:
      "Comfortable and sustainable organic cotton t-shirt available in multiple colors and sizes. Perfect for everyday wear.",
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    vendorId: "vendor2",
    vendorName: "EcoFashion",
    category: "Clothing",
    inStock: true,
    rating: 4.2,
    reviewCount: 89,
  },
  {
    id: "3",
    name: "Stainless Steel Water Bottle",
    price: 32.5,
    description:
      "Durable stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours. Leak-proof and eco-friendly.",
    imageUrl:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    vendorId: "vendor3",
    vendorName: "LifeStyle Goods",
    category: "Home & Garden",
    inStock: true,
    rating: 4.8,
    reviewCount: 203,
  },
  {
    id: "4",
    name: "LED Desk Lamp",
    price: 45.0,
    description:
      "Modern LED desk lamp with adjustable brightness and color temperature. USB charging port included for convenience.",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    vendorId: "vendor1",
    vendorName: "TechGear Store",
    category: "Electronics",
    inStock: true,
    rating: 4.3,
    reviewCount: 67,
  },
  {
    id: "5",
    name: "Yoga Exercise Mat",
    price: 28.99,
    description:
      "Non-slip yoga mat made from eco-friendly materials. Perfect for yoga, pilates, and other floor exercises.",
    imageUrl:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=400&fit=crop",
    vendorId: "vendor4",
    vendorName: "FitLife Sports",
    category: "Sports & Fitness",
    inStock: true,
    rating: 4.6,
    reviewCount: 156,
  },
  {
    id: "6",
    name: "Ceramic Coffee Mug Set",
    price: 19.99,
    description:
      "Set of 4 elegant ceramic coffee mugs with comfortable handles. Microwave and dishwasher safe.",
    imageUrl:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=400&fit=crop",
    vendorId: "vendor3",
    vendorName: "LifeStyle Goods",
    category: "Home & Garden",
    inStock: false,
    rating: 4.1,
    reviewCount: 45,
  },
  {
    id: "7",
    name: "Bluetooth Speaker",
    price: 65.0,
    description:
      "Portable Bluetooth speaker with 360-degree sound and waterproof design. Perfect for outdoor activities.",
    imageUrl:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    vendorId: "vendor1",
    vendorName: "TechGear Store",
    category: "Electronics",
    inStock: true,
    rating: 4.4,
    reviewCount: 112,
  },
  {
    id: "8",
    name: "Running Shoes",
    price: 95.5,
    description:
      "Lightweight and comfortable running shoes with excellent cushioning and breathable mesh upper.",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    vendorId: "vendor4",
    vendorName: "FitLife Sports",
    category: "Sports & Fitness",
    inStock: true,
    rating: 4.7,
    reviewCount: 234,
  },
  {
    id: "9",
    name: "Smartphone Case",
    price: 15.99,
    description:
      "Protective smartphone case with shock absorption and precise cutouts. Available for multiple phone models.",
    imageUrl:
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
    vendorId: "vendor2",
    vendorName: "EcoFashion",
    category: "Electronics",
    inStock: true,
    rating: 4.0,
    reviewCount: 78,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find((product) => product.id === id);
};

export const getProductsByVendor = (vendorId: string): Product[] => {
  return mockProducts.filter((product) => product.vendorId === vendorId);
};

export const searchProducts = (
  query?: string,
  minPrice?: number,
  maxPrice?: number,
  category?: string
): Product[] => {
  return mockProducts.filter((product) => {
    const matchesQuery =
      !query ||
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase());

    const matchesMinPrice = !minPrice || product.price >= minPrice;
    const matchesMaxPrice = !maxPrice || product.price <= maxPrice;
    const matchesCategory = !category || product.category === category;

    return (
      matchesQuery && matchesMinPrice && matchesMaxPrice && matchesCategory
    );
  });
};
