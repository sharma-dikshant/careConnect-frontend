# CareConnect Frontend

React 19 single-page app for the CareConnect healthcare platform. Provides
role-specific portals for doctors and patients on top of the NestJS backend.

See the top-level [`DEVELOPER_GUIDE.md`](../DEVELOPER_GUIDE.md) for how this
app fits into the broader stack.

---

## Features

### Doctor portal (`/doctor/*`)
- Dashboard with today's appointments and pending tasks
- Appointment management (view, track, update)
- Patient records and history
- Care-protocol authoring and assignment
- Professional profile (specialisation, credentials, contact)

### Patient portal (`/patient/*`)
- Health dashboard (upcoming appointments, recent updates)
- Appointment booking against available doctor slots
- Personal profile and basic health records
- Document upload (PDF) that is ingested by the RAG server for AI-assisted chat

### Shared
- In-appointment chat with the AI bot (RAG-backed) and the other party
- Appointment detail view
- Role-based routing with a protected-route guard

---

## Tech stack

- [React 19](https://react.dev/) + [Vite 7](https://vitejs.dev/)
- [React Router v7](https://reactrouter.com/)
- [TanStack Query v5](https://tanstack.com/query/latest) + [Axios](https://axios-http.com/)
- [Tailwind CSS v3](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix primitives)
- [Lucide React](https://lucide.dev/) icons
- [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/) for client-side PDF export

---

## Project structure

```
careConnect-frontend/
├── public/                     # Static assets
├── src/
│   ├── api/
│   │   ├── axiosInstance.js    # Shared axios client + JWT interceptor
│   │   └── services/           # One file per API surface (auth, appointments, ...)
│   ├── components/
│   │   ├── ai/                 # AI guide, insights
│   │   ├── appointments/       # Cards, forms, list items
│   │   ├── chat/               # Messaging UI (user + bot)
│   │   ├── devices/            # Wearable device widgets
│   │   ├── layout/             # AppShell, AuthLayout
│   │   ├── protocols/          # Care-protocol UI
│   │   └── ui/                 # shadcn primitives (Button, Dialog, ...)
│   ├── context/
│   │   └── AuthContext.jsx     # Global auth state
│   ├── hooks/                  # React Query hooks per feature
│   ├── lib/
│   │   ├── constants.js        # Routes, roles, query keys, env wrappers
│   │   ├── queryClient.js      # React Query defaults
│   │   ├── pdfGenerator.js     # html2pdf wrapper
│   │   └── utils.js            # cn(), date helpers, etc.
│   ├── pages/
│   │   ├── auth/               # LoginPage, SignupDoctorPage, SignupPatientPage
│   │   ├── doctor/             # Dashboard, Appointments, Protocols, ...
│   │   ├── patient/            # Dashboard, Appointments, ...
│   │   └── shared/             # Home, AppointmentDetail, Profile, NotFound
│   ├── routes/
│   │   ├── AppRouter.jsx       # Full route tree
│   │   ├── ProtectedRoute.jsx  # Auth + role guard
│   │   └── PublicRoute.jsx     # Redirect if already logged in
│   ├── App.jsx
│   ├── index.css               # Tailwind directives
│   └── main.jsx
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Getting started

### Prerequisites
- Node.js 18+ (22 recommended to match the rest of the monorepo)
- A running backend. Either:
  - Start the full stack from `careConnect-server/docker-compose.yml`, or
  - Point `VITE_API_BASE_URL` at an existing backend deployment.

### Local setup

```bash
npm install
cp .env.example .env        # edit VITE_API_BASE_URL if needed
npm run dev
```

The dev server starts on `http://localhost:5173` with HMR.

### Docker

```bash
docker compose up -d        # start
docker compose down         # stop
```

---

## Scripts

| Command            | What it does                                    |
|--------------------|-------------------------------------------------|
| `npm run dev`      | Vite dev server with HMR on port 5173           |
| `npm run build`    | Production bundle into `dist/`                  |
| `npm run preview`  | Serve the production build locally              |
| `npm run lint`     | Run ESLint                                      |

---

## Environment

| Variable              | Required | Default / Example                  |
|-----------------------|----------|------------------------------------|
| `VITE_API_BASE_URL`   | yes      | `http://localhost:3000`            |

Vite only exposes variables prefixed with `VITE_` to client code. Anything
sensitive belongs in the backend, not here.

---

## Backend contract

- All requests go through the axios instance at `src/api/axiosInstance.js`,
  which reads `VITE_API_BASE_URL` at build time and attaches
  `Authorization: Bearer <token>` from `localStorage.cc_token` on every call.
- A `401` response clears the token and routes to `/login`.
- Response shapes come from the backend's `ApiResponseDto` wrapper; service
  files in `src/api/services/` unwrap them so components receive plain data.

When adding a new API call:

1. Add a function to the matching file under `src/api/services/`.
2. Wrap it in a React Query hook under `src/hooks/`.
3. Define any new query-key in `src/lib/constants.js` so invalidations stay
   consistent.

---

## Routing and guards

- `src/routes/AppRouter.jsx` is the full route tree.
- `ProtectedRoute` blocks unauthenticated access; it also enforces role
  (doctor vs patient) via `AuthContext`.
- `PublicRoute` redirects already-authenticated users away from `/login` and
  `/signup`.

---

## Styling

- Tailwind utility classes are the default. Composition helper `cn()` lives
  in `src/lib/utils.js`.
- shadcn primitives sit under `src/components/ui/` and are intentionally
  copied-in (not imported from a library) so they can be customised.
- Global tokens live in `tailwind.config.js`.

---

## Contributing

1. Create a feature branch off `main`.
2. Keep components small; push shared pieces into `components/ui/` or
   `components/<feature>/`.
3. Run `npm run lint` before opening a PR.
4. Verify the happy path in a browser — there is no full E2E suite yet.
