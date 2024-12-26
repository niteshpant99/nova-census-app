// src/server/api/root.ts

import {createTRPCRouter } from './trpc';

import { censusRouter } from "./routers/census";

export const AppRouter = createTRPCRouter({
  census: censusRouter,
});

export type AppRouter = typeof AppRouter

// export type AppRouter = typeof appRouter;

// Add createCaller export
export const createCaller = AppRouter.createCaller;