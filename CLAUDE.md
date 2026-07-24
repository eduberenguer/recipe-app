# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # start dev server (Next.js + Turbopack)
npm run build             # production build
npm run lint               # next lint

npm run test               # jest --watch
npm run test:coverage      # jest run once with coverage report
npx jest path/to/file.test.ts       # run a single test file
npx jest -t "test name"              # run tests matching a name

npx cypress open           # e2e tests (interactive), requires dev server running on localhost:3000
npx cypress run            # e2e tests (headless)
```

Jest is configured with `ts-jest` + `jsdom`, path alias `@/*` → project root, and CSS modules mocked via `identity-obj-proxy` (see `jest.config.ts`). API route tests live next to their `route.ts` (e.g. `app/api/recipes/create/create.test.ts`).

## Architecture

Stack: Next.js 15 (App Router) + TypeScript, PocketBase as the backend/DB, TanStack Query for server state, React Context for auth/session, Tailwind CSS.

### Layered flow (most of the app)

```
Component → custom hook (app/hooks or app/queries) → API route (app/api/**/route.ts) → server function (server/*.ts) → PocketBase (lib/pocketbase.ts)
```

- `server/*.ts` — `"use server"` functions that talk to PocketBase directly (`pb.collection(...)`) and shape the response into the app's domain types (`types/*`). This is the only layer that should import `lib/pocketbase.ts`.
- `app/api/**/route.ts` — Next.js route handlers that call the `server/*` functions; each has a co-located `*.test.ts` using Supertest-style request tests.
- `app/queries/*.ts` — TanStack Query hooks (`useQuery`/`useMutation`) that call the API routes; query keys are centralized in `lib/queryKeys.ts` (`recipeKeys`, `userInteractionKeys`) — reuse these factories instead of inlining key arrays so invalidation stays consistent.
- `app/hooks/*.ts` — non-query hooks (`useAuth`, `useUserInteractions`, `useIsMobile`).
- `app/context/context.tsx` — wires `useAuth`/`useUserInteractions` into `AuthContext`/`UserInteractionsContext`, exposed via `ContexProvider`. Consumers read `ReturnType<typeof useAuth>` etc. rather than a hand-written interface.
- `app/providers/QueryProvider.tsx` — the app-wide `QueryClient` (1 min `staleTime`, `retry: 1`).

### Hexagonal slice: AI recipe generation

The one feature deliberately built with Ports & Adapters, since it's the most likely to change providers (swap OpenAI, swap PocketBase) and benefits most from isolated testing:

```
core/domain/generatedRecipe.ts        → domain type (GeneratedRecipe)
core/ports/AIRecipeAssistant.ts       → contract: generateRecipe(userMessage)
core/ports/RecipeSearcher.ts          → contract: searchByIngredients(ingredients)
adapters/ai/OpenAIRecipeAssistant.ts             → implements AIRecipeAssistant via OpenAI tool-calling
adapters/persistence/PocketBaseRecipeSearcher.ts → implements RecipeSearcher via PocketBase
app/api/userInteractions/aiChat/route.ts         → composition root: wires concrete adapters to the ports
```

`core/` has zero dependency on Next.js/OpenAI/PocketBase — only contracts and domain types. `OpenAIRecipeAssistant` depends on the `RecipeSearcher` port, never on `PocketBaseRecipeSearcher` directly, so either the AI provider or the DB could be swapped by editing `route.ts` alone. This pattern is intentionally scoped to this one feature, not the whole codebase.

### Auth & routing

- Session is a cookie (`authUser`) checked in `middleware.ts`.
- Protected routes: `/chat`, `/profile`, `/main`, `/favourites`, `/dashboard` — redirect to `/` if no `authUser` cookie.
- `/recipes` is the public/logged-out preview of the catalog; logged-in users are redirected from `/recipes` to `/main` (which has the full catalog with filters/favourites).
- `next.config.ts` has permanent redirects for old route names: `/create-recipes` → `/create.recipes`, `/personal-chef` → `/personal.chef`.

### Path alias

`@/*` maps to the project root (`tsconfig.json` and `jest.config.ts` both define it) — use it instead of relative `../../..` imports.
