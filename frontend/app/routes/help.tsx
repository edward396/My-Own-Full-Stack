import type { Route } from "./+types/help";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  ShoppingBag,
  Package,
  Truck,
  HelpCircle,
  Mail,
  Phone,
  MessageSquare,
} from "~/components/ui/icons";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Help & Support - Lazada Lite" },
    {
      name: "description",
      content: "Get help and support for Lazada Lite platform",
    },
  ];
}

export default function Help() {
  const faqs = [
    {
      category: "General",
      icon: <HelpCircle className='h-5 w-5' />,
      questions: [
        {
          q: "What is Lazada Lite?",
          a: "Lazada Lite is an educational e-commerce platform designed to demonstrate modern web development practices. It supports three user roles: customers, vendors, and shippers.",
        },
        {
          q: "How do I create an account?",
          a: "Click on 'Sign Up' in the header and choose your role (Customer, Vendor, or Shipper). Fill out the required information including username, password, and role-specific details.",
        },
        {
          q: "Is this a real shopping platform?",
          a: "No, this is a student project created for educational purposes. No real transactions occur, and no actual products are sold.",
        },
      ],
    },
    {
      category: "For Customers",
      icon: <ShoppingBag className='h-5 w-5' />,
      questions: [
        {
          q: "How do I browse products?",
          a: "Navigate to the 'Browse Products' page from the header menu. You can search by name and filter by price range to find products you're interested in.",
        },
        {
          q: "How do I add items to my cart?",
          a: "On any product detail page, click the 'Add to shopping cart' button. You can view and manage your cart by clicking on the cart icon or visiting the cart page.",
        },
        {
          q: "How do I place an order?",
          a: "After adding items to your cart, go to the cart page and click the 'Order' button. This will simulate placing an order and empty your cart.",
        },
      ],
    },
    {
      category: "For Vendors",
      icon: <Package className='h-5 w-5' />,
      questions: [
        {
          q: "How do I add products to sell?",
          a: "After logging in as a vendor, go to 'My Products' and click 'Add New Product'. Fill out the product information including name (10-20 characters), price, description (max 500 characters), and upload an image.",
        },
        {
          q: "What are the product requirements?",
          a: "Product names must be 10-20 characters long, prices must be positive numbers, descriptions can be up to 500 characters, and you must upload a product image.",
        },
        {
          q: "How do I manage my existing products?",
          a: "Visit the 'My Products' page to view all your listed products. You can see product details, images, and pricing information.",
        },
      ],
    },
    {
      category: "For Shippers",
      icon: <Truck className='h-5 w-5' />,
      questions: [
        {
          q: "How do I view available orders?",
          a: "After logging in as a shipper, go to 'Active Orders' to see all orders assigned to your distribution hub that need to be delivered.",
        },
        {
          q: "How do I update order status?",
          a: "Click on any order to view its details. You can then mark it as 'Delivered' or 'Cancel' the order if needed.",
        },
        {
          q: "Which distribution hubs are available?",
          a: "Currently, there are three distribution hubs: Ho Chi Minh, Da Nang, and Hanoi. You select your hub during registration.",
        },
      ],
    },
  ];

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Help & Support
          </h1>
          <p className='text-xl text-gray-600'>
            Find answers to common questions and get help with using Lazada Lite
          </p>
        </div>

        {/* Quick Contact */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
          <Card className='text-center'>
            <CardHeader>
              <div className='mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2'>
                <Mail className='h-6 w-6' />
              </div>
              <CardTitle className='text-lg'>Email Support</CardTitle>
              <CardDescription>Get help via email</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-gray-600'>
                For educational project questions, contact your instructor
              </p>
              <Badge variant='secondary' className='mt-2'>
                Educational Project
              </Badge>
            </CardContent>
          </Card>

          <Card className='text-center'>
            <CardHeader>
              <div className='mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2'>
                <MessageSquare className='h-6 w-6' />
              </div>
              <CardTitle className='text-lg'>Documentation</CardTitle>
              <CardDescription>Check project docs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-gray-600'>
                Refer to the project README and course materials
              </p>
              <Badge variant='secondary' className='mt-2'>
                GitHub Repository
              </Badge>
            </CardContent>
          </Card>

          <Card className='text-center'>
            <CardHeader>
              <div className='mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2'>
                <Phone className='h-6 w-6' />
              </div>
              <CardTitle className='text-lg'>Office Hours</CardTitle>
              <CardDescription>In-person assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-gray-600'>
                Visit your instructor during scheduled office hours
              </p>
              <Badge variant='secondary' className='mt-2'>
                In-Person Support
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Sections */}
        <div className='space-y-8'>
          {faqs.map((category, index) => (
            <div key={index}>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center'>
                  {category.icon}
                </div>
                <h2 className='text-2xl font-semibold text-gray-900'>
                  {category.category}
                </h2>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {category.questions.map((faq, qIndex) => (
                  <Card key={qIndex}>
                    <CardHeader>
                      <CardTitle className='text-lg'>{faq.q}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='text-gray-600'>{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Technical Information */}
        <div className='mt-16 bg-gray-50 rounded-lg p-8'>
          <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
            Technical Information
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <h3 className='font-semibold text-gray-900 mb-3'>
                System Requirements
              </h3>
              <ul className='text-sm text-gray-600 space-y-2'>
                <li>• Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                <li>• JavaScript enabled</li>
                <li>• Internet connection</li>
                <li>• Cookies and local storage enabled</li>
              </ul>
            </div>
            <div>
              <h3 className='font-semibold text-gray-900 mb-3'>
                Known Limitations
              </h3>
              <ul className='text-sm text-gray-600 space-y-2'>
                <li>• This is a demo application for educational purposes</li>
                <li>• No real payment processing</li>
                <li>• Data is stored locally in browser</li>
                <li>• No actual shipping or delivery</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Educational Notice */}
        <div className='mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6'>
          <h3 className='font-semibold text-gray-900 mb-2'>
            Educational Project
          </h3>
          <p className='text-gray-700'>
            This platform is created as part of a Full Stack Development course
            (2025B). It demonstrates modern web development practices including
            React Router v7, TypeScript, Tailwind CSS, and component-based
            architecture. For course-related questions, please contact your
            instructor or refer to the course syllabus.
          </p>
        </div>
      </div>
    </div>
  );
}
