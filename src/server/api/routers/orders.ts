// Import necessary modules and types
import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";

// Create TRPC router for orders
export const ordersRouter = createTRPCRouter({
    // Procedure for making a new order
    // Procedure for making a new order
    makeOrder: protectedProcedure.input(
        z.object({
            mobile: z.string(),
            order: z.string(),
            completed: z.boolean(),
            orderItems: z.array(
                z.object({
                    menuItemId: z.number(),
                    quantity: z.number(),
                })
            ),
        })
    )
        .mutation(async ({ ctx, input }) => {
            // Step 1: Create the order
            const newOrder = await ctx.db.orders.create({
                data: {
                    userId: ctx.session.user.id,
                    mobile: input.mobile,
                    order: input.order,
                    completed: input.completed || false,
                },
            });

            await Promise.all(
                input.orderItems.map(async ({ menuItemId, quantity }) => {
                    // Fetch the menu item details
                    const menuItem = await ctx.db.menuItem.findUnique({
                        where: { id: menuItemId },
                    })
                    if (!menuItem) {
                        throw new Error(`Menu item with ID ${menuItemId} not found`);
                    }
                    return ctx.db.orderItem.create({
                        data: {
                            orderId: newOrder.id,
                            menuItemId,
                            quantity,
                            total: menuItem.price * quantity,
                        },
                    });
                })
            );

            return newOrder;
        }),

    updateOrder: protectedProcedure.input(
        z.object({
            orderId: z.number(),
            completed: z.boolean(),
        })
    )
        .mutation(async ({ ctx, input }) => {
            const updatedOrder = await ctx.db.orders.update({
                where: { id: input.orderId },
                data: {
                    completed: input.completed || false,
                },
            });

            return updatedOrder;
        }),

    deleteOrder: protectedProcedure.input(
        z.object({
            orderId: z.number(),
        })
    )
        .mutation(async ({ ctx, input }) => {
            // Step 1: Delete associated order items
            await ctx.db.orderItem.deleteMany({
                where: { orderId: input.orderId },
            });

            // Step 2: Delete the order itself
            await ctx.db.orders.delete({
                where: { id: input.orderId },
            });

            return true;
        }),

    getAllOrders: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        const userOrders = await ctx.db.orders.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: {
                        menuItem: true,
                    },
                },
            },
        });

        return userOrders;
    }),

});

// Create TRPC router for order items
export const orderItemsRouter = createTRPCRouter({
    // Procedure for updating an order item
    updateOrderItem: protectedProcedure
        .input(
            z.object({
                orderItemId: z.number(),
                menuItemId: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Update the menu item associated with the order item
            const updatedOrderItem = await ctx.db.orderItem.update({
                where: { id: input.orderItemId },
                data: {
                    menuItemId: input.menuItemId,
                },
            });

            return updatedOrderItem;
        }),

    // Procedure for deleting an order item
    deleteOrderItem: protectedProcedure
        .input(
            z.object({
                orderItemId: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Delete the order item
            await ctx.db.orderItem.delete({
                where: { id: input.orderItemId },
            });

            return true;
        }),

});
