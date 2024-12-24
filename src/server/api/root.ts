import { createTRPCRouter } from "./trpc";
import { censusRouter } from "./routers/census";

export const appRouter = createTRPCRouter({
  census: censusRouter,
});