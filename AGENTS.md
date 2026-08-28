# AGENTS.md

This repository is a full-stack Airbnb-style app split into a backend and a frontend.

## Project structure
- Backend code lives in [BackEnd](BackEnd) and uses Node.js, Express, and ESM modules.
- Route/controller modules are organized by domain (for example [BackEnd/User](BackEnd/User), [BackEnd/Listings](BackEnd/Listings), [BackEnd/Booking](BackEnd/Booking), and [BackEnd/Transaction](BackEnd/Transaction)).
- Frontend code lives in [FrontEnd/src](FrontEnd/src) and uses React, Vite, and React Router.
- Feature-oriented pages live under [FrontEnd/src/Features](FrontEnd/src/Features), while shared UI lives under [FrontEnd/src/components](FrontEnd/src/components).

## Working conventions
- Keep changes localized and consistent with the existing folder structure.
- Prefer the existing patterns over introducing new abstractions.
- Backend changes should usually update the relevant route, controller, and validation/schema files together.
- Frontend changes should stay aligned with the current feature/page organization and shared component usage.
- Preserve the current style for imports, naming, and module structure.

## Common commands
- Backend development: `cd BackEnd && npm run dev`
- Backend start: `cd BackEnd && npm run start`
- Frontend development: `cd FrontEnd && npm run dev`
- Frontend build: `cd FrontEnd && npm run build`
- Frontend lint: `cd FrontEnd && npm run lint`

## Guidance for inline suggestions
- Prefer small, reversible edits that match the repository’s current style.
- When changing API behavior, keep the backend contract and frontend usage in sync.
- Preserve existing authentication, validation, and middleware behavior unless the request explicitly requires otherwise.
- Avoid introducing new dependencies unless they are clearly justified and already fit the existing architecture.
- For booking, listing, auth, and review flows, follow the surrounding module conventions instead of inventing a new pattern.
