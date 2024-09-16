import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination"
import {
    Truck,
    ListFilter,
    PlusCircle,
    MoreVertical,
    CreditCard,
    ChevronLeft,
    ChevronRight
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Details_order({ order }) {
    if (!order) return null;



    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                        Order {order.id}
                    </CardTitle>
                    <CardDescription>Date: {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1">
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                        <Truck className="h-3.5 w-3.5" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="outline" className="h-8 w-8">
                                <MoreVertical className="h-3.5 w-3.5" />
                                <span className="sr-only">More</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Export</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Trash</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                    <div className="font-semibold">Order Details</div>
                    <ul className="grid gap-3">
                        {order.orderDetails
                            .filter(item => item.menusetId === null)
                            .map(item => (
                                <li key={item.id} className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        {item.menu.name} x <span>{item.quantity}</span>
                                    </span>
                                    <span>RM {item.price.toFixed(2)}</span>
                                </li>
                            ))}

                        {Object.entries(
                            order.orderDetails
                                .filter(item => item.menusetId !== null)
                                .reduce((acc, item) => {
                                    // ตรวจสอบว่ามีเซ็ตนี้อยู่แล้วหรือยัง ถ้าไม่มีก็เพิ่มเข้าไป
                                    if (!acc[item.menusetId]) {
                                        acc[item.menusetId] = [];
                                    }
                                    acc[item.menusetId].push(item);
                                    return acc;
                                }, {})
                        ).map(([setId, items]) => (
                            <li key={setId}>
                                <strong>Set {setId}</strong>
                                <ul>
                                    {items.map(item => (
                                        <li key={item.id} className=" pl-3 flex items-center justify-between">
                                            <span>{item.menu.name} x {item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}



                    </ul>
                    <Separator className="my-2" />
                    <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>${order.totalPrice}</span>
                        </li>
                        <li className="flex items-center justify-between font-semibold">
                            <span className="text-muted-foreground">Total</span>
                            <span>${order.totalPrice}</span>
                        </li>
                    </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                        <div className="font-semibold">Shipping Information</div>
                        <address className="grid gap-0.5 not-italic ">
                            Address
                            <span className="text-muted-foreground" >{order.customer.address || 'test'}</span>

                        </address>
                    </div>
                </div>
                <Separator className="my-4" />

                {order.orderSource.id === 1 && (
                    <div className="grid gap-3">
                        <div className="font-semibold">Customer Information</div>
                        <dl className="grid gap-3">
                            <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Customer</dt>
                                <dd>{order.customer.name} {order.customer.lastname}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Email</dt>
                                <dd>
                                    <a href={`mailto:${order.customer.email}`}>{order.customer.email}</a>
                                </dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Phone</dt>
                                <dd>
                                    <a href={`tel:${order.customer.tel}`}>{order.customer.tel}</a>
                                </dd>
                            </div>
                        </dl>
                    </div>
                )}

                <Separator className="my-4" />
                <div className="grid gap-3">
                    <div className="font-semibold">Payment Information</div>
                    <dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                            <dt className="flex items-center gap-1 text-muted-foreground">
                                <CreditCard className="h-4 w-4" />
                                {order.payment.method}
                            </dt>
                            <dd>{order.payment.status}</dd>
                        </div>
                    </dl>
                </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                    Updated <time dateTime={order.updatedAt}>{new Date(order.updatedAt).toLocaleDateString()}</time>
                </div>
                {/* <Pagination className="ml-auto mr-0 w-auto">
                    <PaginationContent>
                        <PaginationItem>
                            <Button size="icon" variant="outline" className="h-6 w-6">
                                <ChevronLeft className="h-3.5 w-3.5" />
                                <span className="sr-only">Previous Order</span>
                            </Button>
                        </PaginationItem>
                        <PaginationItem>
                            <Button size="icon" variant="outline" className="h-6 w-6">
                                <ChevronRight className="h-3.5 w-3.5" />
                                <span className="sr-only">Next Order</span>
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination> */}
            </CardFooter>
        </Card>
    )
}
