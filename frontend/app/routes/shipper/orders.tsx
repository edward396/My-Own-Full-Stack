import type { Route } from "./+types/orders";
import { useAuth } from "~/lib/auth";
import { Link, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { fetchOrdersByHub } from "~/lib/api";
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
} from "~/components/ui/icons";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Active Orders - Shipper Dashboard" },
    {
      name: "description",
      content: "Manage your delivery orders on Lazada Lite",
    },
  ];
}

export default function ShipperOrders() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);

  // Redirect if not authenticated or not a shipper
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    if (user?.role !== "shipper") {
      navigate("/");
      return;
    }

    // Get orders for this shipper's hub
    (async () => {
      if (user.distributionHub) {
        const hubOrders = await fetchOrdersByHub(user.distributionHub);
        setOrders(hubOrders);
      }
    })();
  }, [isAuthenticated, user, navigate]);

  if (!user || user.role !== "shipper") {
    return null; // Will redirect
  }

  const totalOrders = orders.length;
  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.orderDate);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  }).length;

  const totalValue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center'>
              <Truck className='h-6 w-6' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                Active Orders
              </h1>
              <p className='text-gray-600'>
                {user.distributionHub} Distribution Hub
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Active Orders
              </CardTitle>
              <Package className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{totalOrders}</div>
              <p className='text-xs text-muted-foreground'>
                Ready for delivery
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Today's Orders
              </CardTitle>
              <Clock className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{todayOrders}</div>
              <p className='text-xs text-muted-foreground'>Placed today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Value</CardTitle>
              <CheckCircle className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>${totalValue.toFixed(2)}</div>
              <p className='text-xs text-muted-foreground'>Orders to deliver</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card>
            <CardContent className='text-center py-12'>
              <div className='text-gray-400 mb-4'>
                <Truck className='h-16 w-16 mx-auto' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No active orders
              </h3>
              <p className='text-gray-600 mb-6'>
                There are currently no orders waiting for delivery in your hub (
                {user.distributionHub}). Check back later for new orders.
              </p>
              <Button onClick={() => window.location.reload()}>
                Refresh Orders
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-6'>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-semibold'>Delivery Queue</h2>
              <div className='text-sm text-gray-600'>
                {orders.length} order{orders.length !== 1 ? "s" : ""} pending
                delivery
              </div>
            </div>

            <div className='space-y-4'>
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className='hover:shadow-md transition-shadow'
                >
                  <CardContent className='p-6'>
                    <div className='flex justify-between items-start mb-4'>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-3'>
                          <h3 className='font-semibold text-lg'>
                            Order {order.id}
                          </h3>
                          <Badge variant='secondary'>{order.status}</Badge>
                        </div>
                        <p className='text-gray-600 flex items-center gap-2'>
                          <MapPin className='h-4 w-4' />
                          {order.customerName} • {user.distributionHub} Hub
                        </p>
                      </div>
                      <div className='text-right'>
                        <div className='text-xl font-bold text-gray-900'>
                          ${order.total.toFixed(2)}
                        </div>
                        <div className='text-sm text-gray-600'>
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <div>
                        <h4 className='font-medium text-sm text-gray-900 mb-2'>
                          Delivery Address:
                        </h4>
                        <p className='text-sm text-gray-700 bg-gray-50 p-3 rounded'>
                          {order.customerAddress}
                        </p>
                      </div>

                      <div>
                        <h4 className='font-medium text-sm text-gray-900 mb-2'>
                          Items to Deliver:
                        </h4>
                        <div className='space-y-1'>
                          {order.items.map((item: any, index: number) => (
                            <div
                              key={index}
                              className='flex justify-between text-sm'
                            >
                              <span>
                                {item.quantity}x {item.productName}
                              </span>
                              <span className='font-medium'>
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className='flex justify-between items-center pt-3 border-t'>
                        <div className='text-sm text-gray-600'>
                          Ordered:{" "}
                          {new Date(order.orderDate).toLocaleDateString()} at{" "}
                          {new Date(order.orderDate).toLocaleTimeString()}
                        </div>
                        <Link to={`/shipper/orders/${order.id}`}>
                          <Button>Manage Delivery</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Shipper Info */}
        <div className='mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6'>
          <h3 className='font-semibold text-gray-900 mb-3'>
            📦 Delivery Guidelines
          </h3>
          <ul className='text-gray-700 text-sm space-y-2'>
            <li>• Always verify the delivery address before departing</li>
            <li>• Confirm customer identity before handing over packages</li>
            <li>
              • Take photos of delivered packages when customer is unavailable
            </li>
            <li>• Contact customers if you encounter delivery issues</li>
            <li>• Update order status promptly after each delivery</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
