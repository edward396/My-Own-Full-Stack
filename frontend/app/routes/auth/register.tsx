import type { Route } from "./+types/register";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  customerRegistrationSchema,
  vendorRegistrationSchema,
  shipperRegistrationSchema,
} from "~/lib/validators";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useAuth } from "~/lib/auth";
import {
  registerCustomerApi,
  registerVendorApi,
  registerShipperApi,
} from "~/lib/api";
import { Link, useNavigate, useParams } from "react-router";
import { Field } from "~/components/shared/Field";
import { UserPlus, Store, Truck, Eye, EyeOff } from "~/components/ui/icons";
import { useState } from "react";
import type { z } from "zod";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type CustomerForm = z.infer<typeof customerRegistrationSchema>;
type VendorForm = z.infer<typeof vendorRegistrationSchema>;
type ShipperForm = z.infer<typeof shipperRegistrationSchema>;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create Account - Lazada Lite" },
    {
      name: "description",
      content: "Register as customer, vendor, or shipper",
    },
  ];
}

type Role = "customer" | "vendor" | "shipper";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const params = useParams();
  const initialRole = (params.role as Role | undefined) ?? "customer";
  const [activeTab, setActiveTab] = useState<Role>(initialRole);

  // Password visibility states
  const [showCustomerPassword, setShowCustomerPassword] = useState(false);
  const [showVendorPassword, setShowVendorPassword] = useState(false);
  const [showShipperPassword, setShowShipperPassword] = useState(false);

  function onTabChange(next: string) {
    const role = (next as Role) ?? "customer";
    setActiveTab(role);
    // Keep URL in sync for deep-linking
    if (role === "customer") {
      navigate("/register/customer");
    } else {
      navigate(`/register/${role}`);
    }
  }

  const customerForm = useForm<CustomerForm>({
    resolver: zodResolver(customerRegistrationSchema),
  });
  const vendorForm = useForm<VendorForm>({
    resolver: zodResolver(vendorRegistrationSchema),
  });
  const shipperForm = useForm<ShipperForm>({
    resolver: zodResolver(shipperRegistrationSchema),
  });

  async function onCustomerSubmit(data: CustomerForm) {
    setLoading(true);
    try {
      await registerCustomerApi(data);
      toast.success("Customer account created successfully! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to create customer account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function onVendorSubmit(data: VendorForm) {
    setLoading(true);
    try {
      await registerVendorApi(data);
      toast.success("Vendor account created successfully! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to create vendor account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function onShipperSubmit(data: ShipperForm) {
    setLoading(true);
    try {
      await registerShipperApi(data);
      toast.success("Shipper account created successfully! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to create shipper account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='container mx-auto px-4 py-10'>
      <div className='max-w-[450px] mx-auto'>
        <Tabs value={activeTab} onValueChange={onTabChange} className='gap-1'>
          <TabsList className='mx-auto mb-6'>
            <TabsTrigger value='customer'>Customer</TabsTrigger>
            <TabsTrigger value='vendor'>Vendor</TabsTrigger>
            <TabsTrigger value='shipper'>Shipper</TabsTrigger>
          </TabsList>

          <Card>
            <CardHeader className='text-center pb-2 pt-6'>
              <CardTitle className='text-2xl'>Create your account</CardTitle>
              <CardDescription>
                Select a role and complete the form
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-4'>
              {/* Customer */}
              <TabsContent value='customer'>
                <div className='text-center mb-6'>
                  <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center'>
                    <UserPlus className='h-8 w-8' />
                  </div>
                </div>
                <form
                  onSubmit={customerForm.handleSubmit(onCustomerSubmit)}
                  className='space-y-5'
                >
                  <Field
                    id='c_email'
                    label='Email'
                    error={customerForm.formState.errors.email?.message}
                  >
                    <Input
                      id='c_email'
                      type='email'
                      placeholder='your.email@example.com'
                      {...customerForm.register("email")}
                    />
                  </Field>
                  <Field
                    id='c_username'
                    label='Username'
                    error={customerForm.formState.errors.username?.message}
                  >
                    <Input
                      id='c_username'
                      placeholder='8-15 characters'
                      {...customerForm.register("username")}
                    />
                  </Field>
                  <Field
                    id='c_password'
                    label='Password'
                    error={customerForm.formState.errors.password?.message}
                  >
                    <div className='relative'>
                      <Input
                        id='c_password'
                        type={showCustomerPassword ? "text" : "password"}
                        placeholder='8-20 chars'
                        {...customerForm.register("password")}
                      />
                      <button
                        type='button'
                        aria-label='Toggle password visibility'
                        aria-pressed={showCustomerPassword}
                        className='absolute inset-y-0 right-0 z-10 grid place-items-center px-3 text-gray-400 hover:text-gray-600'
                        onClick={() => setShowCustomerPassword((v) => !v)}
                      >
                        {showCustomerPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </button>
                    </div>
                  </Field>
                  <Field
                    id='c_name'
                    label='Full Name'
                    error={customerForm.formState.errors.name?.message}
                  >
                    <Input
                      id='c_name'
                      placeholder='Your full name'
                      {...customerForm.register("name")}
                    />
                  </Field>
                  <Field
                    id='c_address'
                    label='Address'
                    error={customerForm.formState.errors.address?.message}
                  >
                    <Input
                      id='c_address'
                      placeholder='Your delivery address'
                      {...customerForm.register("address")}
                    />
                  </Field>
                  <Button type='submit' className='w-full' disabled={loading}>
                    {loading ? "Creating..." : "Create Customer Account"}
                  </Button>
                </form>
              </TabsContent>

              {/* Vendor */}
              <TabsContent value='vendor'>
                <div className='text-center mb-6'>
                  <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center'>
                    <Store className='h-8 w-8' />
                  </div>
                </div>
                <form
                  onSubmit={vendorForm.handleSubmit(onVendorSubmit)}
                  className='space-y-5'
                >
                  <Field
                    id='v_email'
                    label='Email'
                    error={vendorForm.formState.errors.email?.message}
                  >
                    <Input
                      id='v_email'
                      type='email'
                      placeholder='vendor@example.com'
                      {...vendorForm.register("email")}
                    />
                  </Field>
                  <Field
                    id='v_username'
                    label='Username'
                    error={vendorForm.formState.errors.username?.message}
                  >
                    <Input
                      id='v_username'
                      placeholder='8-15 characters'
                      {...vendorForm.register("username")}
                    />
                  </Field>
                  <Field
                    id='v_password'
                    label='Password'
                    error={vendorForm.formState.errors.password?.message}
                  >
                    <div className='relative'>
                      <Input
                        id='v_password'
                        type={showVendorPassword ? "text" : "password"}
                        placeholder='8-20 chars'
                        {...vendorForm.register("password")}
                      />
                      <button
                        type='button'
                        aria-label='Toggle password visibility'
                        aria-pressed={showVendorPassword}
                        className='absolute inset-y-0 right-0 z-10 grid place-items-center px-3 text-gray-400 hover:text-gray-600'
                        onClick={() => setShowVendorPassword((v) => !v)}
                      >
                        {showVendorPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </button>
                    </div>
                  </Field>
                  <Field
                    id='v_businessName'
                    label='Business Name'
                    error={vendorForm.formState.errors.businessName?.message}
                  >
                    <Input
                      id='v_businessName'
                      placeholder='Your business name'
                      {...vendorForm.register("businessName")}
                    />
                  </Field>
                  <Field
                    id='v_businessAddress'
                    label='Business Address'
                    error={vendorForm.formState.errors.businessAddress?.message}
                  >
                    <Input
                      id='v_businessAddress'
                      placeholder='Your business address'
                      {...vendorForm.register("businessAddress")}
                    />
                  </Field>
                  <Button type='submit' className='w-full' disabled={loading}>
                    {loading ? "Creating..." : "Create Vendor Account"}
                  </Button>
                </form>
              </TabsContent>

              {/* Shipper */}
              <TabsContent value='shipper'>
                <div className='text-center mb-6'>
                  <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center'>
                    <Truck className='h-8 w-8' />
                  </div>
                </div>
                <form
                  onSubmit={shipperForm.handleSubmit(onShipperSubmit)}
                  className='space-y-5'
                >
                  <Field
                    id='s_email'
                    label='Email'
                    error={shipperForm.formState.errors.email?.message}
                  >
                    <Input
                      id='s_email'
                      type='email'
                      placeholder='shipper@example.com'
                      {...shipperForm.register("email")}
                    />
                  </Field>
                  <Field
                    id='s_username'
                    label='Username'
                    error={shipperForm.formState.errors.username?.message}
                  >
                    <Input
                      id='s_username'
                      placeholder='8-15 characters'
                      {...shipperForm.register("username")}
                    />
                  </Field>
                  <Field
                    id='s_password'
                    label='Password'
                    error={shipperForm.formState.errors.password?.message}
                  >
                    <div className='relative'>
                      <Input
                        id='s_password'
                        type={showShipperPassword ? "text" : "password"}
                        placeholder='8-20 chars'
                        {...shipperForm.register("password")}
                      />
                      <button
                        type='button'
                        aria-label='Toggle password visibility'
                        aria-pressed={showShipperPassword}
                        className='absolute inset-y-0 right-0 z-10 grid place-items-center px-3 text-gray-400 hover:text-gray-600'
                        onClick={() => setShowShipperPassword((v) => !v)}
                      >
                        {showShipperPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </button>
                    </div>
                  </Field>
                  <Field
                    id='s_hub'
                    label='Distribution Hub'
                    error={shipperForm.formState.errors.hub?.message}
                  >
                    <Controller
                      name='hub'
                      control={shipperForm.control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select your preferred distribution hub' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='hcm_hub'>Ho Chi Minh</SelectItem>
                            <SelectItem value='dn_hub'>Da Nang</SelectItem>
                            <SelectItem value='hn_hub'>Hanoi</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <Button type='submit' className='w-full' disabled={loading}>
                    {loading ? "Creating..." : "Create Shipper Account"}
                  </Button>
                </form>
              </TabsContent>

              <div className='mt-6 text-center'>
                <p className='text-sm text-gray-600'>
                  Already have an account?{" "}
                  <Link to='/login' className='underline'>
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
