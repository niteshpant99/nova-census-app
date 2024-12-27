// src/server/api/root.ts

import { createTRPCRouter } from './trpc';
import { censusRouter } from "./routers/census";
import { dashboardRouter } from "./routers/dashboard";

export const AppRouter = createTRPCRouter({
  census: censusRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof AppRouter

// export type AppRouter = typeof appRouter; // This commented line can remain as is

// Add createCaller export
export const createCaller = AppRouter.createCaller;