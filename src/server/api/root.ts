import { createTRPCRouter } from "./trpc";
import { censusRouter } from "./routers/census";

export const AppRouter = createTRPCRouter({
  census: censusRouter,
});