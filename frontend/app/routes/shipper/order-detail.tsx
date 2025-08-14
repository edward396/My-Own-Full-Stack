import type { Route } from "./+types/order-detail";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
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
import { useAuth } from "~/lib/auth";
import { fetchOrder, updateOrderStatusApi } from "~/lib/api";
import { toast } from "sonner";
import {
  ArrowLeft,
  MapPin,
  Package,
  CheckCircle,
  XCircle,
  Phone,
  Clock,
  Truck,
} from "~/components/ui/icons";

export function meta({ params }: Route.MetaArgs) {
  const order: any = undefined;
  return [
    {
      title: order
        ? `Order ${order.id} - Delivery Management`
        : "Order Not Found",
    },
    { name: "description", content: "Manage delivery for customer order" },
  ];
}

export default function OrderDetail() {
  const { orderId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"delivered" | "cancelled" | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    if (user?.role !== "shipper") {
      navigate("/");
      return;
    }

    (async () => {
      const foundOrder = await fetchOrder(orderId!);
      if (!foundOrder) {
        navigate("/shipper/orders");
        return;
      }
      if (foundOrder.hubName !== user.distributionHub) {
        navigate("/shipper/orders");
        return;
      }
      setOrder(foundOrder);
    })();
  }, [orderId, isAuthenticated, user, navigate]);

  if (!user || user.role !== "shipper" || !order) {
    return null; // Will redirect
  }

  const handleUpdateStatus = (status: "delivered" | "cancelled") => {
    setPendingAction(status);
    setConfirmDialogOpen(true);
  };

  const confirmUpdateStatus = async () => {
    if (!pendingAction) return;
    
    const status = pendingAction;
    const action = status === "delivered" ? "mark as delivered" : "cancel";

    setIsUpdating(true);
    setConfirmDialogOpen(false);
    
    try {
      const { success } = await updateOrderStatusApi(order.id, status);
      if (success) {
        toast.success(
          status === "delivered"
            ? "Order marked as delivered"
            : "Order cancelled"
        );
        navigate("/shipper/orders");
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      toast.error("Failed to update order. Please try again.");
      console.error("Error updating order:", error);
    } finally {
      setIsUpdating(false);
      setPendingAction(null);
    }
  };

  const cancelUpdateStatus = () => {
    setConfirmDialogOpen(false);
    setPendingAction(null);
  };

  if (order.status !== "active") {
    navigate("/shipper/orders");
    return null;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <Link
            to='/shipper/orders'
            className='inline-flex items-center underline mb-4'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Active Orders
          </Link>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center'>
              <Truck className='h-6 w-6' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                Order {order.id}
              </h1>
              <div className='flex items-center gap-2'>
                <p className='text-gray-600'>{user.distributionHub} Hub</p>
                <Badge variant='secondary'>{order.status}</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Order Details */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <MapPin className='h-5 w-5' />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <h4 className='font-medium text-gray-900 mb-2'>Customer:</h4>
                  <p className='text-lg font-semibold'>{order.customerName}</p>
                </div>

                <div>
                  <h4 className='font-medium text-gray-900 mb-2'>
                    Delivery Address:
                  </h4>
                  <div className='bg-gray-50 p-4 rounded-lg'>
                    <p className='text-gray-800'>{order.customerAddress}</p>
                  </div>
                </div>

                <div className='flex items-center gap-4 text-sm text-gray-600'>
                  <div className='flex items-center gap-1'>
                    <Clock className='h-4 w-4' />
                    <span>
                      Ordered: {new Date(order.orderDate).toLocaleString()}
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Phone className='h-4 w-4' />
                    <span>Contact: +84 xxx-xxx-xxx</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items to Deliver */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Package className='h-5 w-5' />
                  Items to Deliver
                </CardTitle>
                <CardDescription>
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}{" "}
                  in this order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {order.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'
                    >
                      <div>
                        <h4 className='font-medium'>{item.productName}</h4>
                        <p className='text-sm text-gray-600'>
                          Quantity: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className='text-right'>
                        <div className='font-semibold'>
                          ${(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className='border-t pt-3'>
                    <div className='flex justify-between items-center font-bold text-lg'>
                      <span>Total Amount:</span>
                      <span className='text-gray-900'>
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Panel */}
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Delivery Actions</CardTitle>
                <CardDescription>
                  Update the order status after delivery
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <Button
                  className='w-full'
                  size='lg'
                  onClick={() => handleUpdateStatus("delivered")}
                  disabled={isUpdating}
                >
                  <CheckCircle className='mr-2 h-5 w-5' />
                  {isUpdating ? "Updating..." : "Mark as Delivered"}
                </Button>

                <Button
                  variant='destructive'
                  className='w-full'
                  onClick={() => handleUpdateStatus("cancelled")}
                  disabled={isUpdating}
                >
                  <XCircle className='mr-2 h-5 w-5' />
                  Cancel Order
                </Button>

                <div className='text-xs text-gray-600 space-y-1 pt-2 border-t'>
                  <p>• Confirm delivery address before departing</p>
                  <p>• Verify customer identity at delivery</p>
                  <p>• Update status promptly after delivery</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span>Order ID:</span>
                  <span className='font-medium'>{order.id}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>Hub:</span>
                  <span className='font-medium'>{order.hubName}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>Items:</span>
                  <span className='font-medium'>{order.items.length}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>Status:</span>
                  <Badge variant='secondary' className='text-xs'>
                    {order.status}
                  </Badge>
                </div>
                <div className='border-t pt-3'>
                  <div className='flex justify-between font-bold'>
                    <span>Total Value:</span>
                    <span className='text-gray-900'>
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardContent className='p-4 bg-gray-50 border-gray-200'>
                <h4 className='font-medium text-gray-900 mb-2'>Need Help?</h4>
                <p className='text-gray-700 text-sm mb-2'>
                  Contact dispatch for delivery issues
                </p>
                <Button variant='outline' size='sm' className='w-full'>
                  <Phone className='mr-2 h-4 w-4' />
                  Call Support: 1900-xxxx
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction === "delivered" ? "Mark Order as Delivered" : "Cancel Order"}
            </DialogTitle>
            <DialogDescription>
              {pendingAction === "delivered"
                ? `Are you sure you want to mark order ${order?.id} as delivered? This action cannot be undone.`
                : `Are you sure you want to cancel order ${order?.id}? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelUpdateStatus}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              variant={pendingAction === "delivered" ? "default" : "destructive"}
              onClick={confirmUpdateStatus}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : 
                pendingAction === "delivered" ? "Mark as Delivered" : "Cancel Order"
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
