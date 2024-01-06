import { postRouter } from "~/server/api/routers/post";
import { reservationRouter } from "./routers/reservation";
import { createTRPCRouter } from "~/server/api/trpc";
import { menuRouter } from "./routers/menu";
import { ordersRouter } from "./routers/orders";
import { blobUploadRouter } from "./routers/image";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  reservation: reservationRouter,
  menu: menuRouter,
  orders: ordersRouter,
  file: blobUploadRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
