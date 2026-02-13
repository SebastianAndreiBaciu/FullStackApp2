**Purpose**
- **Context:** Short guidance for AI coding agents to be productive in this repo (ASP.NET Core backend + React + Vite frontend).

**Big Picture**
- **Backend:** ASP.NET Core Web API using controllers and HotChocolate GraphQL. Main app entry: [BackendApi/Program.cs](BackendApi/Program.cs#L1-L120). Data access uses EF Core via `AppDbContext` ([BackendApi/Data/AppDbContext.cs](BackendApi/Data/AppDbContext.cs#L1-L60)).
- **Frontend:** React + TypeScript (Vite) with Apollo Client talking to the GraphQL endpoint at `/graphql`. Client config: [frontend/src/graphql/client.ts](frontend/src/graphql/client.ts#L1-L40).

**Auth & Security**
- **JWT:** Tokens created by `JwtService` ([BackendApi/Services/JwtService.cs](BackendApi/Services/JwtService.cs#L1-L120)) using settings in [BackendApi/appsettings.json](BackendApi/appsettings.json#L1-L40).
- **Login/Register:** REST endpoints at `POST /api/auth/register` and `POST /api/auth/login` in [BackendApi/Controllers/AuthController.cs](BackendApi/Controllers/AuthController.cs#L1-L200). Passwords are hashed with BCrypt.
- **Auth usage:** Frontend stores token in `localStorage` (key `token`) and Apollo adds an `Authorization: Bearer <token>` header. See [frontend/src/graphql/client.ts](frontend/src/graphql/client.ts#L1-L40).

**GraphQL patterns**
- **Schema registration:** Query and Mutation types wired in Program: `.AddQueryType<...>().AddMutationType<...>()` (see [BackendApi/Program.cs](BackendApi/Program.cs#L1-L120)).
- **Mutations require authenticated user:** Mutation implementations read the HTTP context claims (see [BackendApi/GraphQL/Mutation.cs](BackendApi/GraphQL/Mutation.cs#L1-L200)). Note: `JwtService` issues `sub` (JwtRegisteredClaimNames.Sub) while mutations read `ClaimTypes.NameIdentifier` — be careful when tracing auth claims.

**Database & Migrations**
- **DbContext:** [BackendApi/Data/AppDbContext.cs](BackendApi/Data/AppDbContext.cs#L1-L40) exposes `Users` and `Evenimente` DbSets.
- **Migrations folder:** [BackendApi/Migrations](BackendApi/Migrations) contains EF migrations; use `dotnet ef` to add/update migrations and `dotnet ef database update` to apply them.

**Important files to inspect when changing behavior**
- **Auth flow:** [BackendApi/Controllers/AuthController.cs](BackendApi/Controllers/AuthController.cs#L1-L200) and [BackendApi/Services/JwtService.cs](BackendApi/Services/JwtService.cs#L1-L120).
- **GraphQL server & CORS:** [BackendApi/Program.cs](BackendApi/Program.cs#L1-L120).
- **Frontend GraphQL usage:** [frontend/src/graphql/queries.ts](frontend/src/graphql/queries.ts#L1-L200) and components in [frontend/src/components](frontend/src/components).

**Dev / Build / Run (quick commands)**
- **Backend (local):**
  - Build: `dotnet build ./BackendApi`
  - Run: `dotnet run --project BackendApi` (or `cd BackendApi && dotnet run`).
  - Apply migrations: `dotnet ef database update --project BackendApi --startup-project BackendApi` (ensure `dotnet-ef` is installed).
- **Frontend (local):**
  - Install: `npm install` in `/frontend`
  - Dev server: `npm run dev` (Vite; default port 5173). Backend CORS already allows common dev ports.

**Project-specific conventions & gotchas**
- **CORS:** Program.cs explicitly allows `http://localhost:5173`, `5174` and `3000` — update when changing frontend dev ports ([BackendApi/Program.cs](BackendApi/Program.cs#L1-L120)).
- **JWT claim mapping:** Watch claim names — `JwtService` sets `sub` but GraphQL mutations search for `ClaimTypes.NameIdentifier`. Verify claim resolution when debugging auth issues.
- **Password hashing:** Uses BCrypt in controller; when creating seed/test users, use `BCrypt.Net.BCrypt.HashPassword(...)`.
- **GraphQL endpoint path:** GraphQL is exposed by HotChocolate via `MapGraphQL()` (default path `/graphql`). Frontend expects `http://localhost:5295/graphql` by default in `client.ts` — adjust if backend port changes.

**Frontend libraries & UI stack**
- This project uses React + Vite. If adding UI libraries, prefer Tailwind CSS + `shadcn/ui` (see https://ui.shadcn.com/) for component patterns. T  ypical integration steps:
  - Install Tailwind dependencies: `tailwindcss`, `postcss`, `autoprefixer` and add `tailwind.config.cjs` + `postcss.config.cjs`.
  - Add Tailwind directives to a CSS entry (we created `src/styles/tailwind.css`) and import it from `src/main.tsx`.
  - Follow `shadcn/ui` docs to generate or copy components; `shadcn` expects Tailwind and Radix primitives.
- **React Query:** this repo includes `@tanstack/react-query` for client data-fetching. Use `QueryClient` and `QueryClientProvider` at app root (wrap `App`), then use `useQuery` / `useMutation` in components.

**When editing code**
- Inspect the corresponding controller/graph type and `AppDbContext` first for data model changes.
- Update or add EF migration when changing models (`dotnet ef migrations add <Name>`). Run `dotnet ef database update` to apply.

If anything here is unclear or you want more details (port mappings, CI, or how auth claims are resolved at runtime), tell me which area to expand.
