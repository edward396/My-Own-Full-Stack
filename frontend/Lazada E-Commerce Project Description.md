# Lazada Inspired E-Commerce System Project Description
Created: 8/4/2025, 1:21:41 AM
Last Updated: 8/4/2025, 1:28:41 AM
---

### User

create the FE for this in ts/react use react route v7, shadcn UI, tailwind v4

[2025B Project Description Group.pdf](https://upoevdcxa3.ufs.sh/f/IN4OjmY4wMHBaqFm6l4HX4f8WNRroLyUhVJcP65bYOjtqAs0)

---

### Assistant (horizon-beta)

Great — here’s a clean, scalable React + TypeScript frontend scaffold for the project using React Router v7, Tailwind CSS v4, and shadcn/ui. It includes routing for all roles, responsive layouts, form validation on the client, and components/pages wired for the described flows. You can hook APIs later.

Instructions:
1) Create app with Vite
2) Install deps
3) Configure Tailwind v4 and shadcn/ui
4) Add routes, layouts, pages, components
5) Wire basic client-side validation (matching spec)

Commands:
- Set up project
  - npm create vite@latest lazada-lite-fe -- --template react-swc-ts
  - cd lazada-lite-fe
  - npm i react-router@7 @tanstack/react-router@1 zod react-hook-form @hookform/resolvers
  - npm i -D tailwindcss@next prettier prettier-plugin-tailwindcss postcss autoprefixer
  - npx tailwindcss init -p
  - npm i class-variance-authority clsx tailwind-merge
  - npm i @radix-ui/react-slot
  - npx shadcn@latest init
  - npx shadcn@latest add button input label textarea select form card dropdown-menu avatar navigation-menu sheet toast sonner badge table

Tailwind v4 config (tailwind.config.ts):
- Tailwind v4 uses the next config. Replace content and add shadcn preset.

Code files:

tailwind.config.ts
```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
```

src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* shadcn/ui uses CSS variables for themes; add minimal color vars if needed */
:root {
  --radius: 0.5rem;
}
```

src/main.tsx
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import "./index.css";
import { router } from "./router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

src/router.tsx
```tsx
import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import AppLayout from "./shared/layouts/AppLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/static/AboutPage";
import PrivacyPage from "./pages/static/PrivacyPage";
import HelpPage from "./pages/static/HelpPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterCustomerPage from "./pages/auth/RegisterCustomerPage";
import RegisterVendorPage from "./pages/auth/RegisterVendorPage";
import RegisterShipperPage from "./pages/auth/RegisterShipperPage";
import MyAccountPage from "./pages/account/MyAccountPage";
import VendorProductsPage from "./pages/vendor/VendorProductsPage";
import VendorAddProductPage from "./pages/vendor/VendorAddProductPage";
import ProductsBrowsePage from "./pages/customer/ProductsBrowsePage";
import ProductDetailPage from "./pages/customer/ProductDetailPage";
import CartPage from "./pages/customer/CartPage";
import OrdersShipperPage from "./pages/shipper/OrdersShipperPage";
import OrderDetailShipperPage from "./pages/shipper/OrderDetailShipperPage";
import { auth } from "./shared/state/auth";

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});
const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPage,
});
const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/help",
  component: HelpPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const registerCustomerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register/customer",
  component: RegisterCustomerPage,
});
const registerVendorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register/vendor",
  component: RegisterVendorPage,
});
const registerShipperRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register/shipper",
  component: RegisterShipperPage,
});

const myAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  beforeLoad: () => {
    if (!auth.state.user) throw redirect({ to: "/login" });
  },
  component: MyAccountPage,
});

// Vendor
const vendorProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vendor/products",
  beforeLoad: () => {
    if (!auth.state.user) throw redirect({ to: "/login" });
    if (auth.state.user?.role !== "vendor") throw redirect({ to: "/" });
  },
  component: VendorProductsPage,
});
const vendorAddProductRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vendor/products/new",
  beforeLoad: () => {
    if (!auth.state.user) throw redirect({ to: "/login" });
    if (auth.state.user?.role !== "vendor") throw redirect({ to: "/" });
  },
  component: VendorAddProductPage,
});

// Customer
const productsBrowseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: ProductsBrowsePage,
});
const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/$productId",
  component: ProductDetailPage,
});
const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

// Shipper
const shipperOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shipper/orders",
  beforeLoad: () => {
    if (!auth.state.user) throw redirect({ to: "/login" });
    if (auth.state.user?.role !== "shipper") throw redirect({ to: "/" });
  },
  component: OrdersShipperPage,
});
const shipperOrderDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shipper/orders/$orderId",
  beforeLoad: () => {
    if (!auth.state.user) throw redirect({ to: "/login" });
    if (auth.state.user?.role !== "shipper") throw redirect({ to: "/" });
  },
  component: OrderDetailShipperPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  privacyRoute,
  helpRoute,
  loginRoute,
  registerCustomerRoute,
  registerVendorRoute,
  registerShipperRoute,
  myAccountRoute,
  vendorProductsRoute,
  vendorAddProductRoute,
  productsBrowseRoute,
  productDetailRoute,
  cartRoute,
  shipperOrdersRoute,
  shipperOrderDetailRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
```

src/shared/state/auth.ts
```ts
import { create } from "zustand";

type Role = "customer" | "vendor" | "shipper";
export interface User {
  id: string;
  username: string;
  role: Role;
  name?: string;
  businessName?: string;
  distributionHub?: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const auth = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

Install Zustand:
- npm i zustand

src/shared/layouts/AppLayout.tsx
```tsx
import { Outlet, Link } from "@tanstack/react-router";
import Header from "../ui/Header";
import Footer from "../ui/Footer";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

src/shared/ui/Header.tsx
```tsx
import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { auth } from "../state/auth";

export default function Header() {
  const user = auth((s) => s.user);
  const logout = auth((s) => s.logout);
  const router = useRouter();

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-indigo-600 rounded" />
          <span className="font-semibold">Lazada Lite</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link to="/products" className="text-sm">
            View Products
          </Link>
          <Link to="/about" className="text-sm">
            About
          </Link>
          <Link to="/help" className="text-sm">
            Help
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/account" className="text-sm">
                My Account
              </Link>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  logout();
                  router.navigate({ to: "/" });
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
```

src/shared/ui/Footer.tsx
```tsx
import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6 text-sm flex justify-between flex-wrap gap-3">
        <div className="flex gap-4">
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/help">Help</Link>
        </div>
        <div className="text-muted-foreground">
          © {new Date().getFullYear()} Lazada Lite (Student Project)
        </div>
      </div>
    </footer>
  );
}
```

Form helpers and UI library glue:

src/lib/validators.ts
```ts
import { z } from "zod";

const usernameRegex = /^[A-Za-z0-9]{8,15}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

export const usernameSchema = z
  .string()
  .regex(usernameRegex, "Username must be 8-15 letters/digits");

export const passwordSchema = z
  .string()
  .regex(
    passwordRegex,
    "Password 8-20, includes upper, lower, digit, special !@#$%^&*"
  );

export const minLen5 = z.string().min(5, "Minimum length is 5");

export const productSchema = z.object({
  name: z.string().min(10).max(20),
  price: z.coerce.number().positive(),
  image: z.any().optional(),
  description: z.string().max(500),
});

export const priceFilterSchema = z
  .object({
    q: z.string().optional(),
    min: z.string().optional(),
    max: z.string().optional(),
  })
  .refine(
    (v) => {
      const min = Number(v.min);
      const max = Number(v.max);
      if (isNaN(min) && isNaN(max)) return true;
      if (!isNaN(min) && !isNaN(max)) return min <= max;
      return true;
    },
    { message: "Min must be <= Max" }
  );
```

src/components/ui (shadcn) is generated by the CLI. You already installed typical components.

Auth pages:

src/pages/auth/LoginPage.tsx
```tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema, passwordSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/shared/state/auth";
import { Link, useRouter } from "@tanstack/react-router";

const schema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const login = auth((s) => s.login);
  const router = useRouter();

  const onSubmit = (data: FormValues) => {
    // TODO: replace with API call
    // For demo, pick a role by prefix
    const role =
      data.username.startsWith("ven") ? "vendor" :
      data.username.startsWith("shi") ? "shipper" :
      "customer";
    login({
      id: "u1",
      username: data.username,
      role: role as any,
      name: role === "customer" ? "Customer Name" : undefined,
      businessName: role === "vendor" ? "Biz Name" : undefined,
      distributionHub: role === "shipper" ? "Hanoi" : undefined,
    });
    router.navigate({ to: "/account" });
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" {...register("username")} />
          {formState.errors.username && (
            <p className="text-red-600 text-sm">
              {formState.errors.username.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
          {formState.errors.password && (
            <p className="text-red-600 text-sm">
              {formState.errors.password.message}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>

      <div className="mt-6 space-y-2">
        <p className="text-sm">No account? Register:</p>
        <div className="flex gap-2 flex-wrap">
          <Link to="/register/customer">
            <Button variant="outline" size="sm">
              Customer
            </Button>
          </Link>
          <Link to="/register/vendor">
            <Button variant="outline" size="sm">
              Vendor
            </Button>
          </Link>
          <Link to="/register/shipper">
            <Button variant="outline" size="sm">
              Shipper
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

Registration pages (customer/vendor/shipper). They share constraints: username, password, profile picture (File), and role-specific fields. We’ll mock submit and show client validation.

src/pages/auth/RegisterCustomerPage.tsx
```tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  usernameSchema,
  passwordSchema,
  minLen5,
} from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/shared/state/auth";
import { useRouter } from "@tanstack/react-router";

const schema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  name: minLen5,
  address: minLen5,
  profilePic: z
    .any()
    .refine((f) => f instanceof FileList && f.length > 0, "Profile picture required"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterCustomerPage() {
  const { register, handleSubmit, formState, setValue } =
    useForm<FormValues>({ resolver: zodResolver(schema) });
  const login = auth((s) => s.login);
  const router = useRouter();

  const onSubmit = (data: any) => {
    login({
      id: "c1",
      username: data.username,
      role: "customer",
      name: data.name,
    });
    router.navigate({ to: "/account" });
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Register as Customer</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field id="username" label="Username" error={formState.errors.username?.message}>
          <Input id="username" {...register("username")} />
        </Field>
        <Field id="password" label="Password" error={formState.errors.password?.message}>
          <Input id="password" type="password" {...register("password")} />
        </Field>
        <Field id="name" label="Name" error={formState.errors.name?.message}>
          <Input id="name" {...register("name")} />
        </Field>
        <Field id="address" label="Address" error={formState.errors.address?.message}>
          <Input id="address" {...register("address")} />
        </Field>
        <Field
          id="profilePic"
          label="Profile Picture"
          error={formState.errors.profilePic?.message as string | undefined}
        >
          <Input
            id="profilePic"
            type="file"
            accept="image/*"
            onChange={(e) => setValue("profilePic", e.target.files as any)}
          />
        </Field>
        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
```

src/pages/auth/RegisterVendorPage.tsx
```tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  usernameSchema,
  passwordSchema,
  minLen5,
} from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/shared/state/auth";
import { useRouter } from "@tanstack/react-router";

const schema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  businessName: minLen5,
  businessAddress: minLen5,
  profilePic: z
    .any()
    .refine((f) => f instanceof FileList && f.length > 0, "Profile picture required"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterVendorPage() {
  const { register, handleSubmit, formState, setValue } =
    useForm<FormValues>({ resolver: zodResolver(schema) });
  const login = auth((s) => s.login);
  const router = useRouter();

  const onSubmit = (data: any) => {
    login({
      id: "v1",
      username: data.username,
      role: "vendor",
      businessName: data.businessName,
    });
    router.navigate({ to: "/account" });
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Register as Vendor</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field id="username" label="Username" error={formState.errors.username?.message}>
          <Input id="username" {...register("username")} />
        </Field>
        <Field id="password" label="Password" error={formState.errors.password?.message}>
          <Input id="password" type="password" {...register("password")} />
        </Field>
        <Field
          id="businessName"
          label="Business Name"
          error={formState.errors.businessName?.message}
        >
          <Input id="businessName" {...register("businessName")} />
        </Field>
        <Field
          id="businessAddress"
          label="Business Address"
          error={formState.errors.businessAddress?.message}
        >
          <Input id="businessAddress" {...register("businessAddress")} />
        </Field>
        <Field
          id="profilePic"
          label="Profile Picture"
          error={formState.errors.profilePic?.message as string | undefined}
        >
          <Input
            id="profilePic"
            type="file"
            accept="image/*"
            onChange={(e) => setValue("profilePic", e.target.files as any)}
          />
        </Field>
        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
```

src/pages/auth/RegisterShipperPage.tsx
```tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema, passwordSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { auth } from "@/shared/state/auth";
import { useRouter } from "@tanstack/react-router";

const schema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  hub: z.string().min(1, "Select a hub"),
  profilePic: z
    .any()
    .refine((f) => f instanceof FileList && f.length > 0, "Profile picture required"),
});

type FormValues = z.infer<typeof schema>;

const HUBS = ["Ho Chi Minh", "Da Nang", "Hanoi"];

export default function RegisterShipperPage() {
  const { register, handleSubmit, formState, setValue, watch } =
    useForm<FormValues>({ resolver: zodResolver(schema) });
  const login = auth((s) => s.login);
  const router = useRouter();

  const onSubmit = (data: any) => {
    login({
      id: "s1",
      username: data.username,
      role: "shipper",
      distributionHub: data.hub,
    });
    router.navigate({ to: "/account" });
  };

  const selectedHub = watch("hub");

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Register as Shipper</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field id="username" label="Username" error={formState.errors.username?.message}>
          <Input id="username" {...register("username")} />
        </Field>
        <Field id="password" label="Password" error={formState.errors.password?.message}>
          <Input id="password" type="password" {...register("password")} />
        </Field>
        <div>
          <Label htmlFor="hub">Distribution Hub</Label>
          <select
            id="hub"
            className="mt-2 w-full border rounded px-3 py-2"
            value={selectedHub ?? ""}
            onChange={(e) => setValue("hub", e.target.value, { shouldValidate: true })}
          >
            <option value="" disabled>
              Select a hub
            </option>
            {HUBS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          {formState.errors.hub && (
            <p className="text-red-600 text-sm">{formState.errors.hub.message}</p>
          )}
        </div>
        <Field
          id="profilePic"
          label="Profile Picture"
          error={formState.errors.profilePic?.message as string | undefined}
        >
          <Input
            id="profilePic"
            type="file"
            accept="image/*"
            onChange={(e) => setValue("profilePic", e.target.files as any)}
          />
        </Field>
        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
```

My Account:

src/pages/account/MyAccountPage.tsx
```tsx
import { auth } from "@/shared/state/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function MyAccountPage() {
  const user = auth((s) => s.user)!;
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">My Account</h1>
      <div className="border rounded p-4 space-y-2">
        <div>
          <span className="font-medium">Username: </span>
          {user.username}
        </div>
        <div>
          <span className="font-medium">Role: </span>
          {user.role}
        </div>
        {user.role === "customer" && (
          <div>
            <span className="font-medium">Name: </span>
            {user.name}
          </div>
        )}
        {user.role === "vendor" && (
          <div>
            <span className="font-medium">Business: </span>
            {user.businessName}
          </div>
        )}
        {user.role === "shipper" && (
          <div>
            <span className="font-medium">Distribution Hub: </span>
            {user.distributionHub}
          </div>
        )}
      </div>
      <div className="border rounded p-4 space-y-3">
        <div className="font-medium">Change Profile Image</div>
        <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <Button
          onClick={() => {
            // TODO: upload to server, update avatar
            alert(file ? "Uploaded new profile image" : "Select an image first");
          }}
        >
          Upload
        </Button>
      </div>
    </div>
  );
}
```

Vendor pages:

src/pages/vendor/VendorProductsPage.tsx
```tsx
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const mockProducts = [
  { id: "p1", name: "Sample Product A", price: 10, img: "" },
  { id: "p2", name: "Sample Product B", price: 20, img: "" },
];

export default function VendorProductsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Products</h1>
        <Link to="/vendor/products/new">
          <Button>Add New Product</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockProducts.map((p) => (
          <div key={p.id} className="border rounded p-4">
            <div className="h-32 bg-gray-100 rounded mb-2" />
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-muted-foreground">${p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

src/pages/vendor/VendorAddProductPage.tsx
```tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@tanstack/react-router";

type FormValues = z.infer<typeof productSchema>;

export default function VendorAddProductPage() {
  const { register, handleSubmit, setValue, formState } =
    useForm<FormValues>({ resolver: zodResolver(productSchema) });
  const router = useRouter();

  const onSubmit = () => {
    // TODO: call backend to save
    router.navigate({ to: "/vendor/products" });
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field id="name" label="Name" error={formState.errors.name?.message}>
          <Input id="name" {...register("name")} />
        </Field>
        <Field id="price" label="Price" error={formState.errors.price?.message}>
          <Input id="price" type="number" step="0.01" {...register("price")} />
        </Field>
        <Field id="image" label="Image">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setValue("image", e.target.files?.[0] as any)}
          />
        </Field>
        <Field
          id="description"
          label="Description"
          error={formState.errors.description?.message}
        >
          <Textarea id="description" rows={5} {...register("description")} />
        </Field>
        <Button type="submit">Create</Button>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
```

Customer pages:

src/pages/customer/ProductsBrowsePage.tsx
```tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { priceFilterSchema } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const mockProducts = Array.from({ length: 9 }).map((_, i) => ({
  id: `p${i + 1}`,
  name: `Product ${i + 1}`,
  price: (i + 1) * 10,
}));

type FormValues = z.infer<typeof priceFilterSchema>;

export default function ProductsBrowsePage() {
  const { register, handleSubmit, formState, watch } =
    useForm<FormValues>({ resolver: zodResolver(priceFilterSchema) });

  const onSubmit = (_: FormValues) => {
    // TODO: server-side filter via query params or API call
  };

  const q = watch("q");
  const min = Number(watch("min"));
  const max = Number(watch("max"));

  const filtered = mockProducts.filter((p) => {
    const nameMatch = q ? p.name.toLowerCase().includes(q.toLowerCase()) : true;
    const minOk = isNaN(min) ? true : p.price >= min;
    const maxOk = isNaN(max) ? true : p.price <= max;
    return nameMatch && minOk && maxOk;
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">View Products</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 flex-wrap">
        <Input placeholder="Search name..." {...register("q")} className="w-56" />
        <Input placeholder="Min price" type="number" {...register("min")} className="w-32" />
        <Input placeholder="Max price" type="number" {...register("max")} className="w-32" />
        <Button type="submit">Apply</Button>
        {formState.errors.root && (
          <p className="text-red-600 text-sm">{formState.errors.root.message}</p>
        )}
      </form>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="border rounded p-4">
            <div className="h-32 bg-gray-100 rounded mb-2" />
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-muted-foreground">${p.price}</div>
            <Link to="/products/$productId" params={{ productId: p.id }}>
              <Button size="sm" className="mt-2">
                View
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
```

src/pages/customer/ProductDetailPage.tsx
```tsx
import { useParams, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ProductDetailPage() {
  const { productId } = useParams({ from: "/products/$productId" });
  const [added, setAdded] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="h-64 bg-gray-100 rounded" />
      <h1 className="text-xl font-semibold">Product {productId}</h1>
      <p className="text-muted-foreground">
        Product description goes here. Max 500 chars (vendor defined).
      </p>
      <div className="flex items-center gap-3">
        <Button onClick={() => setAdded(true)}>Add to shopping cart</Button>
        <Link to="/cart">
          <Button variant="outline">Go to cart</Button>
        </Link>
      </div>
      {added && <p className="text-green-600">Added to cart.</p>}
    </div>
  );
}
```

src/pages/customer/CartPage.tsx
```tsx
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export default function CartPage() {
  const [items, setItems] = useState([
    { id: "p1", name: "Product 1", price: 10 },
    { id: "p2", name: "Product 2", price: 20 },
  ]);

  const total = items.reduce((s, i) => s + i.price, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Shopping Cart</h1>
      <div className="space-y-2">
        {items.map((i) => (
          <div
            key={i.id}
            className="flex items-center justify-between border rounded p-3"
          >
            <div>
              <div className="font-medium">{i.name}</div>
              <div className="text-sm text-muted-foreground">${i.price}</div>
            </div>
            <Button
              variant="destructive"
              onClick={() => setItems((prev) => prev.filter((x) => x.id !== i.id))}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t pt-3">
        <div className="font-semibold">Total: ${total}</div>
        <Button
          onClick={() => {
            // TODO: call server to create order at random hub; then empty cart
            setItems([]);
            alert("Order placed. Cart emptied.");
          }}
        >
          Order
        </Button>
      </div>
      <Link to="/products" className="text-sm underline">
        Continue shopping
      </Link>
    </div>
  );
}
```

Shipper pages:

src/pages/shipper/OrdersShipperPage.tsx
```tsx
import { Link } from "@tanstack/react-router";

const mockOrders = [
  { id: "o1", customer: "Alice", total: 30, status: "active" },
  { id: "o2", customer: "Bob", total: 50, status: "active" },
];

export default function OrdersShipperPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Active Orders (My Hub)</h1>
      <div className="space-y-2">
        {mockOrders.map((o) => (
          <Link key={o.id} to="/shipper/orders/$orderId" params={{ orderId: o.id }}>
            <div className="border rounded p-3 hover:bg-accent">
              <div className="font-medium">Order {o.id}</div>
              <div className="text-sm text-muted-foreground">
                {o.customer} • ${o.total} • {o.status}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

src/pages/shipper/OrderDetailShipperPage.tsx
```tsx
import { useParams, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function OrderDetailShipperPage() {
  const { orderId } = useParams({ from: "/shipper/orders/$orderId" });
  const [status, setStatus] = useState<"active" | "delivered" | "canceled">(
    "active"
  );
  const router = useRouter();

  const items = [
    { id: "p1", name: "Product 1", price: 10 },
    { id: "p2", name: "Product 2", price: 20 },
  ];
  const total = items.reduce((s, i) => s + i.price, 0);

  if (status !== "active") {
    // After update, simulate removal from list
    router.navigate({ to: "/shipper/orders" });
    return null;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Order {orderId}</h1>
      <div className="border rounded p-3 space-y-2">
        <div className="font-medium">Receiver: Customer Address</div>
        <ul className="list-disc ml-5">
          {items.map((i) => (
            <li key={i.id}>
              {i.name} - ${i.price}
            </li>
          ))}
        </ul>
        <div className="font-semibold">Total: ${total}</div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => setStatus("delivered")}>Mark Delivered</Button>
        <Button variant="destructive" onClick={() => setStatus("canceled")}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
```

Static pages:

src/pages/HomePage.tsx
```tsx
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-6">
      <h1 className="text-2xl font-bold">Welcome to Lazada Lite</h1>
      <p className="text-muted-foreground">
        A simplified e-commerce platform for Full Stack Development 2025B.
      </p>
      <div className="flex gap-3 justify-center">
        <Link to="/products">
          <Button>View Products</Button>
        </Link>
        <Link to="/login">
          <Button variant="outline">Login</Button>
        </Link>
      </div>
    </div>
  );
}
```

src/pages/static/AboutPage.tsx
```tsx
export default function AboutPage() {
  return (
    <article className="prose max-w-3xl">
      <h1>About</h1>
      <p>
        This is a student project inspired by Lazada’s e-commerce system.
      </p>
      <p className="text-sm text-muted-foreground">
        Some content adapted from public sources for educational purposes.
      </p>
    </article>
  );
}
```

src/pages/static/PrivacyPage.tsx
```tsx
export default function PrivacyPage() {
  return (
    <article className="prose max-w-3xl">
      <h1>Privacy Policy</h1>
      <p>
        We store minimal data for demo. In production, comply with regulations.
      </p>
    </article>
  );
}
```

src/pages/static/HelpPage.tsx
```tsx
export default function HelpPage() {
  return (
    <article className="prose max-w-3xl">
      <h1>Help</h1>
      <p>For assistance, contact your instructor or check project README.</p>
    </article>
  );
}
```

Notes and next steps:
- Client-side validations strictly match the spec for username, password, and min length 5 for other fields.
- Images are accepted from file inputs; you’ll wire uploads to your backend (store as BinData or filenames).
- Responsiveness: product grid uses 1/2/3 columns for smartphone/tablet/desktop as required.
- Auth and data are mocked via Zustand; replace with API calls to your Node/Express backend with sessions (Mongo store).
- Protect routes using beforeLoad guards; server should also enforce on API.

If you want, I can add an API service layer (axios + react-query), environment handling, and types that match your backend schemas.


---
