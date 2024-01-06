import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";

// Create TRPC router for menu
export const menuRouter = createTRPCRouter({
    // Procedure for adding a new menu item
    addMenuItem: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                description: z.string(),
                image: z.string(),
                available: z.boolean(),
                category: z.string(),
                price: z.number()
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.menuItem.create({
                data: {
                    name: input.name,
                    description: input.description,
                    image: input.image,
                    available: input.available,
                    category: input.category,
                    price: input.price,
                },
            });
        }),

    // Procedure for updating the availability of a menu item
    updateMenuItemAvailability: protectedProcedure
        .input(
            z.object({
                itemId: z.number(),
                available: z.boolean(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.menuItem.update({
                where: { id: input.itemId },
                data: { available: input.available },
            });
        }),

    // Procedure for deleting a menu item
    deleteMenuItem: protectedProcedure
        .input(
            z.object({
                itemId: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.menuItem.delete({
                where: { id: input.itemId },
            });
        }),


    // Procedure for fetching all menu items
    getAllMenuItems: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.menuItem.findMany();
    }),

});
