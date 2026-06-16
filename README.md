# MediSync AI — Healthcare Dashboard

A modern healthcare dashboard for managing patients and appointments, built as a focused
showcase of the **React 19 + Next.js 16** feature surface — Server Actions, RSC + Suspense
streaming, `useOptimistic`/`useActionState`/`useFormStatus`, Zod dual-validation, the React
Compiler, a real database, drag-and-drop, and optimistic mutations.

> **Scope:** a portfolio / demo piece, not a production product. There is intentionally **no
> authentication or multi-tenancy** — it's a single-operator demo. (For real PHI this would need
> auth, authorization, encryption, and audit logging — out of scope here.)

---

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js **16.2.4** (App Router, Turbopack, React Compiler) |
| UI runtime | React **19.2.4** |
| Database | SQLite + **Prisma 7** (better-sqlite3 driver adapter) |
| Validation | **Zod 4** (shared client + server schema) |
| Forms | **React Hook Form 7** (multi-step, field arrays) |
| Data fetching (client) | **TanStack Query 5** (optimistic mutations) |
| Drag & drop | **@dnd-kit** |
| State | **Zustand 5** (UI state), React **Context** (theme) |
| Styling | **Tailwind CSS v4** + shadcn/ui (Radix primitives) |
| Language | **TypeScript 5** (strict) |

---

## Getting started

Requires Node 20+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Set up the database (creates a local SQLite dev.db, runs migrations,
#    and generates the Prisma client)
npm run db:migrate

# 3. Seed demo data (3 patients + 5 appointments)
npm run db:seed

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and head to **/dashboard**.

The database connection string lives in `.env` (`DATABASE_URL="file:./dev.db"`); a default is
created for you. `dev.db` and the generated Prisma client (`lib/generated/`) are gitignored.

### Useful scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (React Compiler enabled) |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Apply Prisma migrations (creates/updates `dev.db`) |
| `npm run db:seed` | Reset + seed demo data |
| `npm run db:studio` | Open Prisma Studio to browse the DB |

---

## What's inside

- **Dashboard** (`/dashboard`) — patient list (server-fetched from the DB), live search, two
  add-patient paths, and a recent-appointments table. Patient names link to detail pages.
- **Patient detail** (`/dashboard/patient/[id]`) — RSC + Suspense streaming with a skeleton
  fallback and a per-patient dynamic page title.
- **Appointment board** (`/dashboard/appointments`) — a Kanban board; drag appointments between
  status columns with optimistic updates and rollback on failure.
- **Quick add** — a simple Server-Action form with an instant optimistic row.
- **Patient intake** — a rich multi-step form (medications + emergency contacts as field arrays)
  validated by the same schema on the client and the server.
- **Theme** — light / dark / system toggle.

---

## React 19 + Next 16 features used

This project exists to demonstrate the modern React/Next surface. Where each lives:

| Feature | Where |
|---|---|
| **Server Actions** | `app/actions.ts`, `app/appointments/actions.ts` (create/delete/move, all DB-backed) |
| **`useActionState`** | `components/dashboard/patient-form.tsx` (quick add) |
| **`useOptimistic`** | `components/dashboard/dashboard-client.tsx` (new patient row appears instantly) |
| **`useFormStatus`** | `patient-form.tsx` (`SubmitButton` reads pending state without prop-drilling) |
| **RSC + Suspense streaming** | `app/dashboard/patient/[id]/page.tsx` + `loading.tsx` |
| **`generateMetadata`** | patient detail page (dynamic `"<name> — MediSync AI"` title) |
| **Zod — one schema, two trust levels** | `patientIntakeSchema` in `types/patient.ts` validates in RHF (client UX) **and** in the Server Action (security) |
| **React Compiler** | enabled in `next.config.ts` (`reactCompiler: true`) |
| **Real persistence** | Prisma + SQLite (`prisma/schema.prisma`, `lib/prisma.ts`); Server Actions write, `revalidatePath` refreshes |
| **Drag-and-drop** | @dnd-kit board (`components/appointments/`) |
| **React Query optimistic + rollback** | `appointment-board.tsx` (`onMutate`/`onError`/`onSettled`) |
| **React Hook Form + field arrays** | `patient-intake-form.tsx` (medications[], emergency contacts[]) |
| **Zustand** | UI state (`store/ui.ts` sidebar, `store/toast.ts` toasts) |
| **React Context** | theme provider (`components/providers/theme-provider.tsx`) |

---

## Project structure

```
app/                     App Router pages, layouts, Server Actions
  actions.ts             patient create/delete + rich intake actions
  dashboard/             dashboard, appointments board, patient detail
components/
  appointments/          dnd-kit board (board, column, card)
  dashboard/             dashboard UI (forms, table, sidebar, header, theme toggle)
  providers/             QueryProvider, ThemeProvider
  ui/                    shadcn/ui primitives
lib/
  prisma.ts              Prisma client singleton
  patients.ts            server-only patient reads
  appointments.ts        server-only appointment reads
  generated/             generated Prisma client (gitignored)
prisma/
  schema.prisma          Patient + Appointment models
  migrations/            migration history
  seed.ts                demo data
store/                   Zustand stores (ui, toast)
types/                   domain types + Zod schemas
```

---

## Notes

- `npm run build` runs with the React Compiler enabled (it adds Babel build time). One component
  (the RHF intake form) is intentionally skipped by the compiler because React Hook Form's
  `watch()` can't be safely auto-memoized — RHF handles its own optimization there.
- A fresh clone won't run until the database is set up — run the `db:migrate` + `db:seed` steps above.
