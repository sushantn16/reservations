"use client"
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { Card, CardContent, CardFooter, CardTitle } from "~/@/components/card";
import { Badge } from "~/@/components/badge";
import { Button } from "~/@/components/button";
import { Minus, Plus } from "lucide-react";
import { Input } from "~/@/components/input";
import { useState } from "react";

type Counts = Record<number, number>;

const OrderOnline = () => {
    const [counts, setCounts] = useState<Counts>({});
    const [total, setTotal] = useState<number>(0);

    const handleCounterChange = (id: number, value: number) => {
        setCounts((prevCounts) => ({
            ...prevCounts,
            [id]: value >= 0 ? value : 0,
        }));
        calculateTotal();
    };

    const getItemsInCart = () => {
        return Object.entries(counts)
            .filter(([id, count]) => count > 0)
            .map(([id, count]) => {
                const menuItem = menuItemData.find((item) => item.id === parseInt(id));
                if (menuItem) {
                    return { ...menuItem, quantity: count };
                } else {
                    return null;
                }
            })
            .filter((cartItem): cartItem is NonNullable<typeof cartItem> => cartItem !== null);
    };

    const calculateTotal = () => {
        const itemsInCart = getItemsInCart();
        const totalAmount = itemsInCart.reduce((total, cartItem) => {
            return total + cartItem.price * cartItem.quantity;
        }, 0);
        setTotal(totalAmount);
    };

    const renderCounter = (id: number) => {
        const count = counts[id] || 0;
        return (
            <div className="flex items-center">
                <Button size="icon" className="m-2" onClick={() => handleCounterChange(id, count - 1)}>
                    <Minus />
                </Button>
                <Input value={count} readOnly className="w-10" />
                <Button size="icon" className="m-2" onClick={() => handleCounterChange(id, count + 1)}>
                    <Plus />
                </Button>
            </div>
        );
    };

    const menuItems = api.menu.getAllMenuItems.useQuery();
    const menuItemData = menuItems.data || [];

    const removeFromCart = (id: number) => {
        handleCounterChange(id, (counts[id] || 0) - 1);
    };

    const createOrder = api.orders.makeOrder.useMutation({
        onSuccess: () => {
            toast.success("Order item has been added");
        },
    });

    const submitOrder = async () => {
        const selectedItems = Object.entries(counts)
            .filter(([id, count]) => count > 0)
            .map(([id, count]) => ({ menuItemId: parseInt(id), quantity: count }));

        if (selectedItems.length === 0) {
            // Handle the case where no items are selected
            return;
        }
        createOrder.mutate({
            mobile: "1234567890", // Replace with the actual mobile number
            order: "Online Order", // Replace with the order details
            completed: false,
            orderItems: selectedItems,
        });

        calculateTotal();
    };

    return (
        <div className="flex p-5">
            <div className="w-2/3">
                {menuItemData.map((data: any) => (
                    <Card key={data.id} className="flex p-2 m-4 justify-between">
                        <CardContent>
                            <CardTitle className="flex justify-between items-center">
                                {data.name}
                                <Badge variant="outline" className="rounded p-2">
                                    {data.available ? "available" : "Not available"}
                                </Badge>
                            </CardTitle>
                            {data.description}
                        </CardContent>
                        <CardContent className="flex p-0 items-center">
                            <div className="mr-10">{data.price}</div>
                            {renderCounter(data.id)}
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="w-1/3 m-4">
                {getItemsInCart().length > 0 &&
                    <Card>
                        <CardTitle className="p-6">Your Cart</CardTitle>
                        <CardContent>
                            {getItemsInCart().map((cartItem) => (
                                <div key={cartItem.id} className="flex justify-between items-center p-2 border-b">
                                    <div>
                                        <strong>{cartItem.name} </strong>- {cartItem.price} x {cartItem.quantity}
                                    </div>
                                    <Button
                                        variant="secondary"
                                        onClick={() => removeFromCart(cartItem.id)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <p className="flex justify-end mt-4">Total: {total}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={submitOrder}>Submit Order</Button>
                        </CardFooter>
                    </Card>
                }
            </div>
        </div>
    );
};

export default OrderOnline;
