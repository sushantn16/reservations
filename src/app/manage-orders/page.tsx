'use client'
import { api } from "~/trpc/react";
import { Card } from "~/@/components/card";
import { Badge } from "~/@/components/badge";

const ManageOrders = () => {

    const allOrders = api.orders.getAllOrders.useQuery()
    const orders = allOrders.data ?? []
    return (
        <>
            {orders.map((data, i: number) =>
                <Card key={i} className="w-full p-2 m-4 flex items-center justify-between">
                    <Badge variant="default" className='rounded p-2 m-3'>
                        {data.order}
                    </Badge>
                </Card>)}

        </>
    )
}
export default ManageOrders;