# Nova Census Dashboard

A mobile-optimized web application designed to digitize the daily census reporting process at Nova Hospital in Nepal. This app allows nurses to input census data efficiently, automatically generates WhatsApp-compatible messages, and provides administrators with insightful analytics through an interactive dashboard.

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- pnpm package manager

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Key Features

- Mobile-optimized data entry form
- Sequential department navigation
- Auto-save functionality
- WhatsApp message generation
- Interactive analytics dashboard
- Role-based access control

## Tech Stack

- **Frontend**: 
  - Next.js 15 (App Router)
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Tremor for charts
  - tRPC for API calls

- **Backend/Database**: 
  - Supabase (PostgreSQL)
  - Row-level security
  - Authentication

## Project Structure

- `src/app` - Next.js app router pages
- `src/components` - UI components organized by feature
- `src/hooks` - Custom React hooks
- `src/lib` - Utilities, schemas, and services
- `src/server` - tRPC routers and API endpoints
- `src/types` - TypeScript type definitions

## Development Commands

```bash
# Format code
pnpm format:write

# Check types
pnpm typecheck

# Lint code
pnpm lint

# Run both lint and typecheck
pnpm check

# Run in preview mode
pnpm preview
```

## Deployment

The application is deployed on Vercel, with database hosted on Supabase.

## Documentation

For detailed documentation about the project requirements and specifications, see [PRD.md](./PRD.md).

For refactoring and code improvement plans, see [REFACTORING_PLAN.md](./REFACTORING_PLAN.md).