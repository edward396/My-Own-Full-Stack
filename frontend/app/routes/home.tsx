import type { Route } from "./+types/home";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ShoppingBag, Package, Truck, Star } from "~/components/ui/icons";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lazada Lite - E-Commerce Platform" },
    {
      name: "description",
      content: "Welcome to Lazada Lite - Your one-stop e-commerce solution",
    },
  ];
}

export default function Home() {
  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Hero Section */}
      <section className='text-center py-16 bg-gray-50 rounded-2xl mb-16'>
        <div className='max-w-3xl mx-auto'>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
            Welcome to <span className='underline'>Lazada Lite</span>
          </h1>
          <p className='text-xl text-gray-600 mb-8'>
            A simplified e-commerce platform for customers, vendors, and
            shippers. Discover amazing products, grow your business, or join our
            delivery network.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link to='/products'>
              <Button size='lg' className='text-lg px-8'>
                <ShoppingBag className='mr-2 h-5 w-5' />
                Browse Products
              </Button>
            </Link>
            <Link to='/register/vendor'>
              <Button variant='outline' size='lg' className='text-lg px-8'>
                Start Selling
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Join Our Community
          </h2>
          <p className='text-lg text-gray-600'>
            Choose your role and start your journey with us
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <Card className='text-center hover:shadow-lg transition-shadow'>
            <CardHeader>
              <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                <ShoppingBag className='h-8 w-8' />
              </div>
              <CardTitle>For Customers</CardTitle>
              <CardDescription>
                Discover and purchase amazing products from verified vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='text-sm text-gray-600 space-y-2 mb-6'>
                <li>• Browse thousands of products</li>
                <li>• Secure shopping experience</li>
                <li>• Easy cart and checkout</li>
                <li>• Order tracking</li>
              </ul>
              <Link to='/register/customer'>
                <Button className='w-full'>Sign Up as Customer</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className='text-center hover:shadow-lg transition-shadow'>
            <CardHeader>
              <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                <Package className='h-8 w-8' />
              </div>
              <CardTitle>For Vendors</CardTitle>
              <CardDescription>
                Start your online business and reach thousands of customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='text-sm text-gray-600 space-y-2 mb-6'>
                <li>• List and manage products</li>
                <li>• Business dashboard</li>
                <li>• Order management</li>
                <li>• Analytics and insights</li>
              </ul>
              <Link to='/register/vendor'>
                <Button className='w-full' variant='outline'>
                  Sign Up as Vendor
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className='text-center hover:shadow-lg transition-shadow'>
            <CardHeader>
              <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                <Truck className='h-8 w-8' />
              </div>
              <CardTitle>For Shippers</CardTitle>
              <CardDescription>
                Join our delivery network and help connect buyers with sellers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='text-sm text-gray-600 space-y-2 mb-6'>
                <li>• Flexible delivery schedules</li>
                <li>• Multiple hub locations</li>
                <li>• Order tracking system</li>
                <li>• Competitive earnings</li>
              </ul>
              <Link to='/register/shipper'>
                <Button className='w-full' variant='outline'>
                  Sign Up as Shipper
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-16 bg-gray-50 rounded-2xl'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Platform Statistics
          </h2>
          <p className='text-lg text-gray-600'>
            Growing community of users across Vietnam
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
          <div>
            <div className='text-3xl font-bold text-gray-900 mb-2'>1,000+</div>
            <div className='text-gray-600'>Active Customers</div>
          </div>
          <div>
            <div className='text-3xl font-bold text-gray-900 mb-2'>200+</div>
            <div className='text-gray-600'>Verified Vendors</div>
          </div>
          <div>
            <div className='text-3xl font-bold text-gray-900 mb-2'>50+</div>
            <div className='text-gray-600'>Trusted Shippers</div>
          </div>
          <div>
            <div className='text-3xl font-bold text-gray-900 mb-2'>3</div>
            <div className='text-gray-600'>Distribution Hubs</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='text-center py-16'>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          Ready to Get Started?
        </h2>
        <p className='text-lg text-gray-600 mb-8 max-w-2xl mx-auto'>
          Join thousands of users who trust Lazada Lite for their e-commerce
          needs. Whether you're buying, selling, or delivering, we've got you
          covered.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link to='/login'>
            <Button size='lg' variant='outline' className='text-lg px-8'>
              Sign In
            </Button>
          </Link>
          <Link to='/products'>
            <Button size='lg' className='text-lg px-8'>
              Explore Products
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
