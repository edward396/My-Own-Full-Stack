import type { Route } from "./+types/products";
import { useState } from "react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { priceFilterSchema } from "~/lib/validators";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Link } from "react-router";
import { type Product } from "~/lib/data/products";
import { fetchProducts, searchProductsApi } from "~/lib/api";
import { useCart } from "~/lib/cart";
import { ShoppingCart, Search, Star } from "~/components/ui/icons";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { z } from "zod";

type FormValues = z.infer<typeof priceFilterSchema>;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Browse Products - Lazada Lite" },
    {
      name: "description",
      content: "Discover amazing products on Lazada Lite",
    },
  ];
}

export default function Products() {
  const { register, handleSubmit, watch, formState } = useForm<FormValues>({
    resolver: zodResolver(priceFilterSchema),
  });
  const { addItem, getTotalItems } = useCart();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "relevance" | "price-asc" | "price-desc" | "rating-desc" | "name-asc"
  >("relevance");
  const [compact, setCompact] = useState(true);

  const q = watch("q");
  const min = watch("min");
  const max = watch("max");

  const categories = React.useMemo(
    () => [...new Set(filteredProducts.map((p) => p.category))],
    [filteredProducts]
  );

  const onSubmit = async (data: FormValues) => {
    const results = await searchProductsApi({
      q: data.q,
      min: data.min ? Number(data.min) : undefined,
      max: data.max ? Number(data.max) : undefined,
      category: selectedCategory || undefined,
    });
    setFilteredProducts(results);
  };

  // Real-time filtering as user types
  React.useEffect(() => {
    let ignore = false;
    (async () => {
      const results = await searchProductsApi({
        q,
        min: min ? Number(min) : undefined,
        max: max ? Number(max) : undefined,
        category: selectedCategory || undefined,
      });
      if (!ignore) setFilteredProducts(results);
    })();
    return () => {
      ignore = true;
    };
  }, [q, min, max, selectedCategory]);

  // initial fetch
  React.useEffect(() => {
    (async () => {
      const data = await fetchProducts();
      setFilteredProducts(data);
    })();
  }, []);

  const visibleProducts = React.useMemo(() => {
    const arr = [...filteredProducts];
    switch (sortBy) {
      case "price-asc":
        return arr.sort((a, b) => a.price - b.price);
      case "price-desc":
        return arr.sort((a, b) => b.price - a.price);
      case "rating-desc":
        return arr.sort((a, b) => b.rating - a.rating);
      case "name-asc":
        return arr.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return arr; // relevance = data order from search
    }
  }, [filteredProducts, sortBy]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            Browse Products
          </h1>
          <p className='text-gray-600'>
            Discover amazing products from our verified vendors
          </p>
        </div>

        {/* Search and Filters */}
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Search className='h-5 w-5' />
              Search & Filter
            </CardTitle>
            <CardDescription>
              Find exactly what you're looking for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <Input
                  placeholder='Search products...'
                  {...register("q")}
                  className='md:col-span-2'
                />
                <Input
                  placeholder='Min price'
                  type='number'
                  step='0.01'
                  {...register("min")}
                />
                <Input
                  placeholder='Max price'
                  type='number'
                  step='0.01'
                  {...register("max")}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
                <div className='md:col-span-2'>
                  <Select
                    value={selectedCategory || "all"}
                    onValueChange={(v) =>
                      setSelectedCategory(v === "all" ? "" : v)
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Category' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Categories</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={async () => {
                      (document.activeElement as HTMLElement)?.blur();
                      setSelectedCategory("");
                      const data = await fetchProducts();
                      setFilteredProducts(data);
                    }}
                  >
                    Clear
                  </Button>
                  <Button type='submit'>Apply</Button>
                </div>
              </div>

              {formState.errors.root && (
                <p className='text-gray-900 text-sm'>
                  {formState.errors.root.message}
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6'>
          <p className='text-gray-600'>
            Showing {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
            {(q || min || max || selectedCategory) && " matching your criteria"}
          </p>
          <div className='flex flex-wrap items-center gap-3'>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600'>Sort by</span>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger size='sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='relevance'>Relevance</SelectItem>
                  <SelectItem value='price-asc'>Price: Low to High</SelectItem>
                  <SelectItem value='price-desc'>Price: High to Low</SelectItem>
                  <SelectItem value='rating-desc'>Rating</SelectItem>
                  <SelectItem value='name-asc'>Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCompact((v) => !v)}
            >
              {compact ? "Comfortable" : "Compact"}
            </Button>
            <div className='flex items-center gap-2'>
              <ShoppingCart className='h-5 w-5' />
              <span className='font-medium'>
                {getTotalItems()} items in cart
              </span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className='group flex flex-col overflow-hidden rounded-xl border bg-white transition-transform hover:-translate-y-0.5 hover:shadow-md'
            >
              <div className='relative aspect-square overflow-hidden bg-gray-100'>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                />
                <div className='absolute left-2 top-2'>
                  <Badge
                    variant='secondary'
                    className='bg-white/80 px-2 py-0.5 text-[10px]'
                  >
                    {product.category}
                  </Badge>
                </div>
                {!product.inStock && (
                  <div className='absolute right-2 top-2 rounded border bg-white/90 px-2 py-0.5 text-[10px] text-gray-900'>
                    Sold out
                  </div>
                )}
              </div>

              <div
                className={
                  compact
                    ? "p-3 flex flex-col gap-2 flex-1"
                    : "p-4 flex flex-col gap-3 flex-1"
                }
              >
                <h3
                  className={
                    compact
                      ? "text-base font-semibold line-clamp-1 leading-snug min-h-[1.5rem]"
                      : "text-lg font-semibold line-clamp-2 leading-snug min-h-[3.5rem]"
                  }
                >
                  <Link
                    to={`/products/${product.id}`}
                    className='hover:underline'
                  >
                    {product.name}
                  </Link>
                </h3>
                {!compact && (
                  <p className='text-sm text-gray-600 line-clamp-2 leading-snug min-h-[2.5rem]'>
                    {product.description}
                  </p>
                )}

                <div className='text-sm text-gray-600 flex items-center gap-2'>
                  <span>by {product.vendorName}</span>
                  <span>•</span>
                  <span className='inline-flex items-center gap-1'>
                    <Star className='h-4 w-4' />
                    <span>{product.rating}</span>
                    <span>({product.reviewCount})</span>
                  </span>
                </div>

                <div className='mt-1 text-2xl font-semibold text-gray-900'>
                  ${product.price}
                </div>

                <div className='mt-auto pt-2 grid grid-cols-2 gap-2'>
                  <Link to={`/products/${product.id}`}>
                    <Button variant='ghost' size='sm' className='w-full'>
                      Details
                    </Button>
                  </Link>
                  <Button
                    size='sm'
                    className='w-full'
                    disabled={!product.inStock}
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className='mr-2 h-4 w-4' />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-gray-400 mb-4'>
              <Search className='h-16 w-16 mx-auto' />
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No products found
            </h3>
            <p className='text-gray-600'>
              Try adjusting your search criteria or browse all categories
            </p>
            <Button
              className='mt-4'
              onClick={async () => {
                setSelectedCategory("");
                const data = await fetchProducts();
                setFilteredProducts(data);
              }}
            >
              Show All Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
