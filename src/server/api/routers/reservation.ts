
import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure
  } from "~/server/api/trpc";

// Create TRPC router for reservation
export const reservationRouter = createTRPCRouter({
    // Procedure for making a reservation
    makeReservation: protectedProcedure
        .input(
            z.object({
                time: z.string(),
                date: z.string(), // You might want to use a more specific date type
                request: z.string(),
                people: z.number().min(1),
                mobile: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {

            return await ctx.db.reservation.create({
                data: {
                    userId: ctx.session.user.id,
                    time: input.time,
                    date: new Date(input.date), // Convert date string to Date object
                    request: input.request,
                    people: (input.people).toString(),
                    mobile: (input.mobile),
                },
            });
        }),

    // Procedure for fetching reservations
    getReservations: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.reservation.findMany({
            where: { userId: ctx.session.user.id },
            orderBy: { date: 'asc', time: 'asc' },
        });
    }),
    getReservationsByUserId: protectedProcedure.query(async ({ ctx }) => {
        // Fetch reservations based on user ID
        return ctx.db.reservation.findMany({
            where: { userId: ctx.session.user.id },
        });
    }),
    cancelReservation: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const reservation = await ctx.db.reservation.findUnique({
        where: { id: input.id, userId: ctx.session.user.id },
      });
      if (!reservation) {
        throw new Error("Reservation not found");
      }
      await ctx.db.reservation.delete({ where: { id: reservation.id } });
      return { success: true };
    }),
});
