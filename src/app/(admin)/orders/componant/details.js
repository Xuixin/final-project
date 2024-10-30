import {
    Dialog,

    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Truck,
    CreditCard,
    Check,
    Package,
    MapPin,
    User,
    Phone,
    Mail,
    Clock,
    AlertCircle
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shipping } from "./shipping";

export function Details_order({ order, fetchOrders }) {
    if (!order) return null;

    const getStatusConfig = (status) => {
        const configs = {
            'Pending': {
                bgColor: 'bg-yellow-50',
                textColor: 'text-yellow-700',
                borderColor: 'border-yellow-200',
                badge: 'bg-yellow-100 text-yellow-800',
                icon: <Clock className="h-4 w-4" />,
            },
            'Shipped': {
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-700',
                borderColor: 'border-blue-200',
                badge: 'bg-blue-100 text-blue-800',
                icon: <Truck className="h-4 w-4" />,
            },
            'Delivered': {
                bgColor: 'bg-green-50',
                textColor: 'text-green-700',
                borderColor: 'border-green-200',
                badge: 'bg-green-100 text-green-800',
                icon: <Check className="h-4 w-4" />,
            },
            'Cancelled': {
                bgColor: 'bg-red-50',
                textColor: 'text-red-700',
                borderColor: 'border-red-200',
                badge: 'bg-red-100 text-red-800',
                icon: <AlertCircle className="h-4 w-4" />,
            },
        };
        return configs[status] || configs['Pending'];
    };

    const statusConfig = getStatusConfig(order.shipping?.status || 'Pending');

    return (
        <Card className="max-w-3xl mx-auto shadow-lg">
            <CardHeader className={`${statusConfig.bgColor} border-b ${statusConfig.borderColor}`}>
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className={`flex items-center gap-2 text-xl font-bold ${statusConfig.textColor}`}>
                            <Package className="h-5 w-5" />
                            Order #{order.id}
                        </CardTitle>
                        <CardDescription className="text-sm">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={`${statusConfig.badge} flex items-center gap-1`}>
                            {statusConfig.icon}
                            {order.shipping?.status || 'Pending'}
                        </Badge>
                        {order.orderSource.id === 1 && order.shipping.status !== 'Cancelled' && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="hover:bg-white/90"
                                        disabled={order.shipping?.status === 'Delivered' || order.shipping.status === 'Shipped'}
                                    >
                                        <Truck className="h-4 w-4 mr-1" />
                                        Update Shipping
                                    </Button>
                                </DialogTrigger>
                                <Shipping orderId={order.id} fetchOrders={fetchOrders} />
                            </Dialog>
                        )}
                    </div>
                </div>
            </CardHeader>

            <ScrollArea className="h-[calc(100vh-12rem)]">
                <CardContent className="p-6">
                    <div className="space-y-6">
                        {/* Order Items Section */}
                        <section>
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Order Items
                            </h3>
                            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                {order.orderDetails
                                    .filter(item => item.menusetId === null)
                                    .map(item => (
                                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                                                    <Package className="h-5 w-5 text-gray-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{item.menu.name}</p>
                                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-semibold">RM {item.price.toFixed(2)}</p>
                                        </div>
                                    ))}

                                {/* Menu Sets */}
                                {Object.entries(
                                    order.orderDetails
                                        .filter(item => item.menusetId !== null)
                                        .reduce((acc, item) => {
                                            if (!acc[item.menusetId]) {
                                                acc[item.menusetId] = [];
                                            }
                                            acc[item.menusetId].push(item);
                                            return acc;
                                        }, {})
                                ).map(([setId, items]) => (
                                    <div key={setId} className="bg-white p-3 rounded-lg shadow-sm">
                                        <p className="font-semibold mb-2">Set {setId}</p>
                                        <div className="pl-4 space-y-2">
                                            {items.map(item => (
                                                <div key={item.id} className="flex justify-between text-sm">
                                                    <span>{item.menu.name} x {item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <Separator />

                        {/* Price Summary */}
                        <section className="bg-gray-50 p-4 rounded-lg">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>RM {order.totalPrice.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span className="text-lg">RM {order.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </section>

                        {order.orderSource.id === 1 && (
                            <>
                                <Separator />

                                {/* Shipping Information */}
                                <section>
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Shipping Information
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-600 mb-2">Delivery Address:</p>
                                        <p className="font-medium">{order.customer.address || 'Address not provided'}</p>
                                    </div>
                                </section>

                                {/* Customer Information */}
                                <section>
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Customer Information
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                        <div className="flex items-center gap-3">
                                            <User className="h-4 w-4 text-gray-500" />
                                            <span className="font-medium">{order.customer.name} {order.customer.lastname}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <a href={`mailto:${order.customer.email}`} className="text-blue-600 hover:underline">
                                                {order.customer.email}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-gray-500" />
                                            <a href={`tel:${order.customer.tel}`} className="text-blue-600 hover:underline">
                                                {order.customer.tel}
                                            </a>
                                        </div>
                                    </div>
                                </section>
                            </>
                        )}

                        <Separator />

                        {/* Payment Information */}
                        <section>
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Information
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">
                                            {order.payment ? order.payment?.method : 'Incomplete'}
                                        </span>
                                    </div>
                                    <Badge variant={order.payment ? 'success' : 'secondary'}>
                                        {order.payment ? order.payment.status : 'Incomplete'}
                                    </Badge>
                                </div>
                            </div>
                        </section>
                    </div>
                </CardContent>
            </ScrollArea>

            <CardFooter className="border-t bg-gray-50 px-6 py-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </CardFooter>
        </Card>
    );
}