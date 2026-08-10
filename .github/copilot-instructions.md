# Copilot instructions

## Repository context
- This workspace contains a MERN-style accommodation booking app with a separate backend and frontend.
- The backend entry point is [BackEnd/app.js](BackEnd/app.js) and the frontend entry point is [FrontEnd/src/App.jsx](FrontEnd/src/App.jsx).

## Preferred implementation style
- Follow the existing domain-based organization in the backend and feature-based organization in the frontend.
- Keep changes focused and compatible with the current Express and React patterns.
- Reuse existing validation, middleware, and component conventions before introducing new helpers.

## When making changes
- Update related files together when a feature spans routes, controllers, schemas, or UI pages.
- Preserve current authentication, error handling, and API response patterns.
- Prefer incremental improvements over broad refactors.

## Useful commands
- Backend: `cd BackEnd && npm run dev`
- Frontend: `cd FrontEnd && npm run dev`
- Frontend build check: `cd FrontEnd && npm run build`
