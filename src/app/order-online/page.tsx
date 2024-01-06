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

    const handleCounterChange = (id: number, value: number) => {
        setCounts((prevCounts) => ({
            ...prevCounts,
            [id]: value >= 0 ? value : 0,
        }));
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

    const renderCounter = (id: number) => {
        const count = counts[id] || 0;
        return (
            <div className="flex">
                <Button variant="outline" size="icon" onClick={() => handleCounterChange(id, count - 1)}>
                    <Minus />
                </Button>
                <Input value={count} readOnly className="w-10" />
                <Button variant="outline" size="icon" onClick={() => handleCounterChange(id, count + 1)}>
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
    })

    const submitOrder = async () => {
        const selectedItems = Object.entries(counts)
            .filter(([id, count]) => count > 0)
            .map(([id, count]) => ({ menuItemId: parseInt(id), quantity: count }));

        if (selectedItems.length === 0) {
            // Handle the case where no items are selected
            return;
        }

        try {
            await createOrder.mutate({
                mobile: "1234567890", // Replace with the actual mobile number
                order: "Online Order", // Replace with the order details
                completed: false,
                orderItems: selectedItems,
            });

            // Order submitted successfully, you can show a success message or redirect
            console.log("Order submitted successfully!");
        } catch (error) {
            // Handle the error (e.g., show an error message)
            console.error("Error submitting order:", error);
        }
    };

    return (
        <>
            {menuItemData.map((data: any) => (
                <Card key={data.id} className="p-2 m-4 w-1/3">
                    <CardTitle className="flex justify-between items-center">
                        {data.name}
                        <Badge variant="outline" className="rounded p-2">
                            {data.available ? "available" : "Not available"}
                        </Badge>
                    </CardTitle>
                    <CardContent>{data.description}</CardContent>
                    <CardFooter className="flex justify-between p-0">
                        {renderCounter(data.id)}
                        <div className="flex space-x-2">
                            <Button disabled={counts[data.id] == 0 || counts[data.id] == undefined} variant={"secondary"} onClick={() => removeFromCart(data.id)}>Remove</Button>
                        </div>
                    </CardFooter>
                </Card>
            ))}
            <div className="mt-4">
                <h2>Your Cart</h2>
                {getItemsInCart().map((cartItem) => (
                    <div key={cartItem.id} className="flex justify-between items-center p-2 border-b">
                        <div>
                            <strong>{cartItem.name}</strong> - Quantity: {cartItem.quantity}
                        </div>
                        <Button
                            variant="secondary"
                            onClick={() => removeFromCart(cartItem.id)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-4">
                <Button onClick={submitOrder}>Submit Order</Button>
            </div>
        </>
    );
};

export default OrderOnline;
