import type { Route } from "./+types/product-detail";
import { useState } from "react";
import { useParams, Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { getProductById } from "~/lib/data/products";
import { useCart } from "~/lib/cart";
import {
  ShoppingCart,
  Star,
  ArrowLeft,
  Plus,
  Minus,
  Store,
  Truck,
  Shield,
} from "~/components/ui/icons";

export function meta({ params }: Route.MetaArgs) {
  const product = getProductById(params.productId);
  return [
    {
      title: product
        ? `${product.name} - Lazada Lite`
        : "Product Not Found - Lazada Lite",
    },
    {
      name: "description",
      content: product?.description || "Product details on Lazada Lite",
    },
  ];
}

export default function ProductDetail() {
  const { productId } = useParams();
  const product = getProductById(productId!);
  const { addItem, getTotalItems } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Product Not Found
          </h1>
          <p className='text-gray-600 mb-6'>
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to='/products'>
            <Button>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000); // Reset after 3 seconds
  };

  const updateQuantity = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Breadcrumb */}
        <div className='mb-6'>
          <Link to='/products' className='inline-flex items-center underline'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Products
          </Link>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Product Image */}
          <div className='space-y-4'>
            <div className='aspect-square overflow-hidden rounded-lg bg-gray-100'>
              <img
                src={product.imageUrl}
                alt={product.name}
                className='w-full h-full object-cover'
              />
            </div>
          </div>

          {/* Product Info */}
          <div className='space-y-6'>
            <div>
              <Badge variant='secondary' className='mb-2'>
                {product.category}
              </Badge>
              <h1 className='text-3xl font-bold text-gray-900 mb-4'>
                {product.name}
              </h1>

              <div className='flex items-center gap-4 mb-4'>
                <div className='flex items-center gap-1'>
                  <Star className='h-5 w-5' />
                  <span className='font-medium'>{product.rating}</span>
                  <span className='text-gray-600'>
                    ({product.reviewCount} reviews)
                  </span>
                </div>
                {product.inStock ? (
                  <Badge
                    variant='default'
                    className='bg-gray-100 text-gray-900'
                  >
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant='destructive'>Out of Stock</Badge>
                )}
              </div>

              <div className='text-3xl font-bold text-gray-900 mb-6'>
                ${product.price}
              </div>
            </div>

            {/* Vendor Info */}
            <Card>
              <CardHeader className='pb-3'>
                <div className='flex items-center gap-3'>
                  <Avatar>
                    <AvatarFallback>
                      <Store className='h-4 w-4' />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className='text-lg'>
                      {product.vendorName}
                    </CardTitle>
                    <CardDescription>Verified Vendor</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Quantity and Add to Cart */}
            {product.inStock && (
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <span className='font-medium'>Quantity:</span>
                  <div className='flex items-center border rounded-lg'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => updateQuantity(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className='h-4 w-4' />
                    </Button>
                    <span className='px-4 py-2 font-medium'>{quantity}</span>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => updateQuantity(1)}
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                </div>

                <div className='space-y-3'>
                  <Button
                    size='lg'
                    className='w-full'
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className='mr-2 h-5 w-5' />
                    Add to Cart - ${(product.price * quantity).toFixed(2)}
                  </Button>

                  {addedToCart && (
                    <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
                      <p className='text-gray-800 font-medium'>
                        ✅ Added to cart! You now have {getTotalItems()} items
                        in your cart.
                      </p>
                    </div>
                  )}

                  <Link to='/cart' className='w-full'>
                    <Button variant='outline' size='lg' className='w-full'>
                      View Cart ({getTotalItems()} items)
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Product Features */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='flex items-center gap-2 text-sm'>
                <Truck className='h-4 w-4' />
                <span>Fast Delivery</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <Shield className='h-4 w-4' />
                <span>Secure Payment</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <Star className='h-4 w-4' />
                <span>Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className='mt-12'>
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-700 leading-relaxed'>
                {product.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Related Products */}
        <div className='mt-12'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            You might also like
          </h2>
          <div className='text-center py-8 text-gray-600'>
            <p>Related products feature would be implemented here</p>
            <Link to='/products' className='mt-4 inline-block'>
              <Button variant='outline'>Browse More Products</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
