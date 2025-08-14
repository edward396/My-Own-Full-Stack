import type { Route } from "./+types/add-product";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "~/lib/validators";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useAuth } from "~/lib/auth";
import { Link, useNavigate } from "react-router";
import { Field } from "~/components/shared/Field";
import { Package, ArrowLeft, Upload, Info } from "~/components/ui/icons";
import { useState, useEffect } from "react";
import type { z } from "zod";
import { toast } from "sonner";
import { createProductApi } from "~/lib/api";

type FormValues = z.infer<typeof productSchema>;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Add New Product - Vendor Dashboard" },
    { name: "description", content: "Add a new product to your catalog" },
  ];
}

export default function AddProduct() {
  const { register, handleSubmit, setValue, formState, watch } =
    useForm<FormValues>({
      resolver: zodResolver(productSchema) as any,
    });
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const description = watch("description");
  const name = watch("name");

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
  }, [isAuthenticated, user, navigate]);

  if (!user || user.role !== "vendor") {
    return null; // Will redirect
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      await createProductApi({
        name: data.name,
        price: Number(data.price),
        description: data.description,
        image: (data as any).image ?? null,
      });

      toast.success("Product added");
      navigate("/vendor/products");
    } catch (error) {
      toast.error("Failed to add product. Please try again.");
      console.error("Error adding product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setValue("image", file as any);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-2xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <Link
            to='/vendor/products'
            className='inline-flex items-center underline mb-4'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to My Products
          </Link>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center'>
              <Package className='h-6 w-6' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                Add New Product
              </h1>
              <p className='text-gray-600'>
                Fill in the details to list your product
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>
              Provide accurate details to help customers find and choose your
              product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <Field
                id='name'
                label='Product Name'
                error={formState.errors.name?.message}
              >
                <Input
                  id='name'
                  placeholder='Enter product name (10-20 characters)'
                  {...register("name")}
                />
                <div className='text-xs text-gray-500 mt-1'>
                  {name?.length || 0}/20 characters{" "}
                  {name && name.length < 10 && "(minimum 10)"}
                </div>
              </Field>

              <Field
                id='price'
                label='Price (USD)'
                error={formState.errors.price?.message}
              >
                <Input
                  id='price'
                  type='number'
                  step='0.01'
                  placeholder='0.00'
                  {...register("price")}
                />
              </Field>

              <Field id='image' label='Product Image'>
                <div className='space-y-4'>
                  <Input
                    id='image'
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                  />
                  {previewImage && (
                    <div className='border rounded-lg p-4'>
                      <p className='text-sm font-medium mb-2'>Image Preview:</p>
                      <img
                        src={previewImage}
                        alt='Product preview'
                        className='w-32 h-32 object-cover rounded-lg'
                      />
                    </div>
                  )}
                </div>
              </Field>

              <Field
                id='description'
                label='Product Description'
                error={formState.errors.description?.message}
              >
                <Textarea
                  id='description'
                  rows={5}
                  placeholder='Describe your product in detail (max 500 characters)'
                  {...register("description")}
                />
                <div className='text-xs text-gray-500 mt-1'>
                  {description?.length || 0}/500 characters
                </div>
              </Field>

              {/* Requirements Info */}
              <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
                <div className='flex items-start gap-3'>
                  <Info className='h-5 w-5 mt-0.5' />
                  <div>
                    <h4 className='font-medium text-gray-900 mb-2'>
                      Product Requirements
                    </h4>
                    <ul className='text-gray-700 text-sm space-y-1'>
                      <li>• Product name must be 10-20 characters long</li>
                      <li>• Price must be a positive number</li>
                      <li>• Description should be under 500 characters</li>
                      <li>• High-quality product image is recommended</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className='flex gap-4'>
                <Button
                  type='submit'
                  className='flex-1'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Upload className='mr-2 h-4 w-4 animate-spin' />
                      Adding Product...
                    </>
                  ) : (
                    <>
                      <Package className='mr-2 h-4 w-4' />
                      Add Product
                    </>
                  )}
                </Button>
                <Link to='/vendor/products'>
                  <Button variant='outline' type='button'>
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips */}
        <div className='mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6'>
          <h3 className='font-semibold text-gray-900 mb-3'>
            💡 Product Listing Tips
          </h3>
          <ul className='text-gray-700 text-sm space-y-2'>
            <li>• Use clear, well-lit photos from multiple angles</li>
            <li>• Include key features and benefits in the description</li>
            <li>• Research competitor pricing for similar products</li>
            <li>• Highlight what makes your product unique</li>
            <li>
              • Include size, weight, or dimension information when relevant
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
