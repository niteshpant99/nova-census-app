/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * @see https://trpc.io/docs/server/context
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
// import { Session } from '@supabase/supabase-js'; 
import { type Database } from '@/types/database';

/**
 * Context options for creating the inner TRPC context
 */
interface CreateInnerContextOptions {
  supabase: SupabaseClient<Database>;
  user: {
    id: string;
    role: string;
  } | null;
}

/**
 * Context options for creating the TRPC context
 */
export interface CreateContextOptions {
  req?: Request;
  headers?: Headers;
}

/**
 * Inner context creation with validated options
 */
// const createInnerTRPCContext = (opts: CreateInnerContextOptions) => {
//   return {
//     supabase: opts.supabase,
//     user: opts.user,
//   };
// };

// changed to fix type handling
type TRPCContext = {
  supabase: SupabaseClient<Database>;
  user: {
    id: string;
    role: string;
  } | null;
};

const createInnerTRPCContext = (opts: CreateInnerContextOptions): TRPCContext => {
  return {
    supabase: opts.supabase,
    user: opts.user,
  };
};

// type ResolvedTRPCContext = Promise<TRPCContext>;


/**
 * Creates context for incoming requests
 */
export const createTRPCContext = async (_opts: CreateContextOptions) => {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fix the unsafe assignment by explicitly typing the session response
  // const sessionResult = await supabase.auth.getSession();

  const { data: { session } } = await supabase.auth.getSession();


  let user: {
    id: string;
    role: string;
  } | null = null;

  
  if (session?.user?.id) {
    const profileResult = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileResult.error) {
      console.error('Error fetching user profile:', profileResult.error);
    }

    user = {
      id: session.user.id,
      role: profileResult.data?.role ?? 'viewer',
    };
  }
  return createInnerTRPCContext({
    supabase,
    user,
  });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer.
 * We also parse ZodErrors so that you get typesafety on the frontend if your procedure fails
 * due to validation errors on the backend.
 */

// Update the t initialization to explicitly handle async context
const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create({
  transformer: superjson,
});

// const t = initTRPC.context<ReturnType<typeof createTRPCContext>>().create({
//   transformer: superjson,
// });

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid context"
    });
  }

  const resolvedCtx = ctx;

  if (!resolvedCtx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in"
    });
  }

  return next({
    ctx: {
      user: resolvedCtx.user,
      supabase: resolvedCtx.supabase,
    },
  });
});

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API.
 * It does not guarantee that a user querying is authorized, but you can still access user session data
 * if they are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations that require authentication.
 * It guarantees that a user querying is authorized and provides their user context to the procedure.
 */
export const protectedProcedure = t.procedure.use(isAuthed);
