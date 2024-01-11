import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { put } from "@vercel/blob";

export const blobUploadRouter = createTRPCRouter({
  uploadFile: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        data: z.instanceof(File),
      })
    )
    .mutation(async ({ input }) => {
      const blob = await put(input.filename, input.data, {
        access: "public",
      });

      return { blobUrl: blob.url };
    }),
});
