import type { Route } from "./+types/products";
import { useAuth } from "~/lib/auth";
import { Link, useNavigate } from "react-router";
import { deleteVendorProductApi, editVendorProductApi } from "~/lib/api";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
// Remove dependency on local mock data - we'll fetch from API instead
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
} from "~/components/ui/icons";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Products - Vendor Dashboard" },
    { name: "description", content: "Manage your products on Lazada Lite" },
  ];
}

export default function VendorProducts() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<any | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    price: 0,
    description: "",
    image: "",
  });

  // Fetch vendor products from API
  const fetchVendorProducts = async (vendorId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api-test/vendor/products?vendorId=${encodeURIComponent(vendorId)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setProducts(data.products || []);
      } else {
        throw new Error(data.error || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching vendor products:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not authenticated or not a vendor
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    if (user?.role !== "vendor") {
      navigate("/");
      return;
    }

    // Fetch vendor products from API
    fetchVendorProducts(user.id);
  }, [isAuthenticated, user, navigate]);

  if (!user || user.role !== "vendor") {
    return null; // Will redirect
  }

  const handleDeleteProduct = (product: any) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (productToDelete && user) {
      try {
        setDeleting(true);

        // Call the delete API
        const result = await deleteVendorProductApi(
          productToDelete.id,
          user.id
        );

        if (result.success) {
          // Remove product from local state
          setProducts(products.filter((p) => p.id !== productToDelete.id));
          setDeleteDialogOpen(false);
          setProductToDelete(null);

          // Optional: Show success message
          console.log("Product deleted successfully:", result.message);
        } else {
          throw new Error("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product. Please try again.");
      } finally {
        setDeleting(false);
      }
    }
  };

  const cancelDeleteProduct = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleEditProduct = (product: any) => {
    setProductToEdit(product);
    setEditForm({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image || product.imageUrl || "",
    });
    setEditDialogOpen(true);
  };

  const confirmEditProduct = async () => {
    if (productToEdit && user) {
      try {
        setEditing(true);

        // Call the edit API
        const result = await editVendorProductApi(
          productToEdit.id,
          user.id,
          editForm
        );

        if (result.success && result.updatedProduct) {
          // Update product in local state
          setProducts(
            products.map((p) =>
              p.id === productToEdit.id ? result.updatedProduct : p
            )
          );
          setEditDialogOpen(false);
          setProductToEdit(null);

          // Optional: Show success message
          console.log("Product updated successfully:", result.message);
        } else {
          throw new Error("Failed to update product");
        }
      } catch (error) {
        console.error("Error updating product:", error);
        toast.error("Failed to update product. Please try again.");
      } finally {
        setEditing(false);
      }
    }
  };

  const cancelEditProduct = () => {
    setEditDialogOpen(false);
    setProductToEdit(null);
    setEditForm({
      name: "",
      price: 0,
      description: "",
      image: "",
    });
  };

  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.inStock).length;
  const averageRating =
    products.length > 0
      ? products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length
      : 0;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>My Products</h1>
            <p className='text-gray-600'>
              Manage your product catalog and inventory
            </p>
          </div>
          <Link to='/vendor/products/new'>
            <Button size='lg'>
              <Plus className='mr-2 h-5 w-5' />
              Add New Product
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Products
              </CardTitle>
              <Package className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{totalProducts}</div>
              <p className='text-xs text-muted-foreground'>
                {inStockProducts} in stock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Revenue (Mock)
              </CardTitle>
              <TrendingUp className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {totalProducts > 0
                  ? `$${(products.reduce((sum, p) => sum + p.price, 0) / totalProducts).toFixed(2)}`
                  : "$0.00"}
              </div>
              <p className='text-xs text-muted-foreground'>
                Average product price
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Average Rating
              </CardTitle>
              <Eye className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
              </div>
              <p className='text-xs text-muted-foreground'>
                Customer satisfaction
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Products List */}
        {loading ? (
          <Card>
            <CardContent className='text-center py-12'>
              <div className='text-gray-400 mb-4'>
                <Package className='h-16 w-16 mx-auto animate-pulse' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                Loading products...
              </h3>
              <p className='text-gray-600'>
                Please wait while we fetch your products.
              </p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className='text-center py-12'>
              <div className='text-red-400 mb-4'>
                <Package className='h-16 w-16 mx-auto' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                Failed to load products
              </h3>
              <p className='text-gray-600 mb-6'>{error}</p>
              <Button onClick={() => fetchVendorProducts(user?.id || "")}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className='text-center py-12'>
              <div className='text-gray-400 mb-4'>
                <Package className='h-16 w-16 mx-auto' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No products yet
              </h3>
              <p className='text-gray-600 mb-6'>
                Start by adding your first product to begin selling on our
                platform.
              </p>
              <Link to='/vendor/products/new'>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  Add Your First Product
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-6'>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-semibold'>Product Catalog</h2>
              <div className='text-sm text-gray-600'>
                Showing {products.length} product
                {products.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {products.map((product) => (
                <Card
                  key={product.id}
                  className='group hover:shadow-lg transition-shadow py-0'
                >
                  <CardHeader className='p-0'>
                    <div className='aspect-square overflow-hidden rounded-t-lg bg-gray-100'>
                      <img
                        src={product.image || product.imageUrl}
                        alt={product.name}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                    </div>
                  </CardHeader>
                  <CardContent className='p-4'>
                    <div className='space-y-3'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-1'>
                          <Badge variant='secondary' className='text-xs mr-2'>
                            {product.category}
                          </Badge>
                          {product.inStock ? (
                            <Badge
                              variant='default'
                              className='bg-gray-100 text-gray-900 text-xs'
                            >
                              In Stock
                            </Badge>
                          ) : (
                            <Badge variant='destructive' className='text-xs'>
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <CardTitle className='text-lg line-clamp-2'>
                          {product.name}
                        </CardTitle>
                        <div className='text-2xl font-bold text-gray-900 mt-2'>
                          ${product.price}
                        </div>
                      </div>

                      <div className='text-sm text-gray-600 space-y-1'>
                        <div className='flex justify-between'>
                          <span>Rating:</span>
                          <span>
                            {product.rating}/5 ({product.reviewCount} reviews)
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Mock Sales:</span>
                          <span>
                            {Math.floor(Math.random() * 50) + 1} units
                          </span>
                        </div>
                      </div>

                      <div className='flex gap-2'>
                        <Link to={`/products/${product.id}`} className='flex-1'>
                          <Button
                            variant='outline'
                            size='sm'
                            className='w-full'
                          >
                            <Eye className='mr-2 h-4 w-4' />
                            View
                          </Button>
                        </Link>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleEditProduct(product)}
                          className='hover:underline'
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleDeleteProduct(product)}
                          className='hover:underline'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Business Tips */}
        <div className='mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6'>
          <h3 className='font-semibold text-gray-900 mb-3'>
            💡 Tips for Success
          </h3>
          <ul className='text-gray-700 text-sm space-y-2'>
            <li>• Add high-quality product images to increase sales</li>
            <li>
              • Write detailed descriptions with key features and benefits
            </li>
            <li>• Competitive pricing helps your products stand out</li>
            <li>• Respond quickly to customer inquiries and reviews</li>
            <li>• Keep your inventory updated to avoid overselling</li>
          </ul>
        </div>
      </div>

      {/* Delete Product Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className='flex items-center space-x-4 p-4 bg-gray-50 rounded-lg'>
            {productToDelete && (
              <>
                <img
                  src={productToDelete.image || productToDelete.imageUrl}
                  alt={productToDelete.name}
                  className='w-16 h-16 object-cover rounded-lg'
                />
                <div>
                  <h4 className='font-medium text-gray-900'>
                    {productToDelete.name}
                  </h4>
                  <p className='text-sm text-gray-600'>
                    ${productToDelete.price}
                  </p>
                  <Badge variant='secondary' className='text-xs mt-1'>
                    {productToDelete.category}
                  </Badge>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={cancelDeleteProduct}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={confirmDeleteProduct}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className='sm:max-w-[525px]'>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details for "{productToEdit?.name}".
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='edit-name' className='text-right'>
                Name
              </Label>
              <Input
                id='edit-name'
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className='col-span-3'
                placeholder='Product name (10-20 characters)'
              />
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='edit-price' className='text-right'>
                Price
              </Label>
              <Input
                id='edit-price'
                type='number'
                step='0.01'
                min='0'
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                className='col-span-3'
                placeholder='0.00'
              />
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='edit-image' className='text-right'>
                Image URL
              </Label>
              <Input
                id='edit-image'
                value={editForm.image}
                onChange={(e) =>
                  setEditForm({ ...editForm, image: e.target.value })
                }
                className='col-span-3'
                placeholder='https://example.com/image.jpg'
              />
            </div>

            <div className='grid grid-cols-4 items-start gap-4'>
              <Label htmlFor='edit-description' className='text-right pt-2'>
                Description
              </Label>
              <Textarea
                id='edit-description'
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className='col-span-3'
                placeholder='Product description (max 500 characters)'
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={cancelEditProduct}
              disabled={editing}
            >
              Cancel
            </Button>
            <Button onClick={confirmEditProduct} disabled={editing}>
              {editing ? "Updating..." : "Update Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
