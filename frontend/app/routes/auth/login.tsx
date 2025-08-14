import type { Route } from "./+types/login";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "~/lib/validators";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useAuth } from "~/lib/auth";
import { loginApi } from "~/lib/api";
import { Link, useNavigate } from "react-router";
import { Field } from "~/components/shared/Field";
import { LogIn, Eye, EyeOff } from "~/components/ui/icons";
import { useState } from "react";
import type { z } from "zod";

type FormValues = z.infer<typeof loginSchema>;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - Lazada Lite" },
    { name: "description", content: "Sign in to your Lazada Lite account" },
  ];
}

export default function Login() {
  const { register, handleSubmit, formState, setError } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      const dto = await loginApi(data);
      login(dto as any);

      // Redirect based on role
      const redirectPath =
        dto.role === "vendor"
          ? "/vendor/products"
          : dto.role === "shipper"
            ? "/shipper/orders"
            : "/products";

      navigate(redirectPath);
    } catch (error) {
      setError("root", { message: "Invalid email or password" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-md mx-auto'>
        <Card>
          <CardHeader className='text-center'>
            <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
              <LogIn className='h-8 w-8' />
            </div>
            <CardTitle className='text-2xl'>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your Lazada Lite account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <Field
                id='email'
                label='Email'
                error={formState.errors.email?.message}
              >
                <Input
                  id='email'
                  type='email'
                  placeholder='Enter your email'
                  {...register("email")}
                />
              </Field>

              <Field
                id='password'
                label='Password'
                error={formState.errors.password?.message}
              >
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? "text" : "password"}
                    placeholder='Enter your password'
                    {...register("password")}
                  />
                  <button
                    type='button'
                    aria-label='Toggle password visibility'
                    aria-pressed={showPassword}
                    className='absolute inset-y-0 right-0 z-10 grid place-items-center px-3 text-gray-400 hover:text-gray-600'
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
              </Field>

              {formState.errors.root && (
                <p className='text-gray-900 text-sm text-center'>
                  {formState.errors.root.message}
                </p>
              )}

              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className='mt-6 space-y-4'>
              <div className='text-center text-sm text-gray-600'>
                Demo credentials: Try emails like vendor@example.com, shipper@example.com, or
                customer@example.com
              </div>

              <div className='border-t pt-4'>
                <p className='text-sm text-center text-gray-600 mb-4'>
                  Don't have an account? Choose your role:
                </p>
                <div className='grid grid-cols-1 gap-2'>
                  <Link to='/register/customer' className='w-full'>
                    <Button variant='outline' size='sm' className='w-full'>
                      Sign up as Customer
                    </Button>
                  </Link>
                  <div className='grid grid-cols-2 gap-2'>
                    <Link to='/register/vendor' className='w-full'>
                      <Button variant='outline' size='sm' className='w-full'>
                        Vendor
                      </Button>
                    </Link>
                    <Link to='/register/shipper' className='w-full'>
                      <Button variant='outline' size='sm' className='w-full'>
                        Shipper
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
