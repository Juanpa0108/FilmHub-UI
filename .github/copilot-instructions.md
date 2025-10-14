# Copilot instructions for FilmHub (React + Vite)

Use these repo-specific notes to be productive fast. Favor concrete imports/paths shown here over generic patterns.

## Overview
- App is a React 19 + Vite project. The actual app lives under `FilmHub/` with `FilmHub/src` and `FilmHub/public`.
- Routing is centralized in `FilmHub/src/main.jsx` using `react-router-dom` v7. The whole app is wrapped by `AuthProvider` from `FilmHub/src/API/authContext.jsx`.
- Page-level components live in `FilmHub/src/screens/**`. Reusable UI lives in `FilmHub/src/components/**`.
- Movie data for listings/details is static via `FilmHub/src/screens/carrouselScreen/movieData.js`.

## Run, build, test
- Dev server: npm run dev
- Build: npm run build; Preview: npm run preview
- Lint: npm run lint; Tests: npm test | npm run test:watch | npm run test:coverage
- Note: Vite expects `index.html` at the project root. In this repo, the app is under `FilmHub/`; adapt cwd accordingly if needed.

## Auth flow (custom hook + context)
- Hook: `FilmHub/src/API/auth.js` exposes `{ state, register, login, logout, refreshToken, user }` and handles:
  - localStorage: `user`, `accessToken`, `refreshToken`
  - token expiry with SweetAlert2 prompt and periodic check (1 min)
  - refresh endpoint call on confirm; otherwise `logout()`
- Context: `FilmHub/src/API/authContext.jsx` creates `AuthProvider` and `useAuthContext()`.
- API endpoints are hardcoded to `http://18.230.67.228:31479/api/users/...` (register/login/refresh). Include `credentials: 'include'` on login.

Example usage inside a screen:
```jsx
import { useAuthContext } from "../../API/authContext";
const { user, login, logout } = useAuthContext();
```

## Routing & pages
- Routes are defined in `FilmHub/src/main.jsx`:
  - `/`, `/login`, `/register`, `/recovery`, `/carrousel_principal`, `/categories`, `/my-reviews`, `/premieres`, `/movie/:id`.
- To add a page: create under `FilmHub/src/screens/<page>/<page>.jsx`, export default component, then add a `<Route>` in `main.jsx`.

## UI, data, and assets
- Carousels use Materialize CSS JS init (`materialize-css`) in `components/MovieCarrousel/MovieCarrousel.jsx` via `M.Carousel.init`.
- CSS: Most screens/components import plain `.css`; CSS Modules are used selectively (e.g., `components/SearchBar/Searchbar.module.css`).
- Static images are served from `FilmHub/public` with absolute paths like `/images/...` or `/movie/...`.
- Results pattern: search state is lifted to `screens/mainScreen/principal.jsx`; `components/SearchBar/Searchbar.jsx` filters suggestions and calls `onSearch`. `screens/resultsScreen/resultsScreen.jsx` renders list items using `components/movieResult/movieResult.jsx`.

## Testing setup & patterns
- Jest + Testing Library with `setupTests.js` providing:
  - jsdom env, jest-dom, mocks for localStorage, fetch, SweetAlert2.
- File patterns: tests in `__tests__/**/*.test.{js,jsx}` or alongside `src/**/*.test.{js,jsx}`.
- Accessibility roles/attributes are added in components (e.g., `role="carousel"`, `role="list"`) to simplify queries in tests.
- Note: `jest.config.cjs` maps `^src/(.*)$` to `<rootDir>/src/$1`, but source here is under `FilmHub/src`. Prefer relative imports in tests or adjust mapper if you relocate tests.

## Conventions to follow
- Keep page-level components in `FilmHub/src/screens/**` and reusable pieces in `FilmHub/src/components/**`.
- Use `useAuthContext()` for auth-aware behavior; don’t access localStorage directly.
- For new routes, import the screen and declare the `<Route>` in `main.jsx`.
- For new carousels/Materialize widgets, init in `useEffect` as in `MovieCarrousel.jsx`.
- When loading assets, prefer `/...` absolute paths pointing to `FilmHub/public`.

## Common pitfalls
- Mixing alias imports: avoid `src/...` unless you update Jest/Vite aliases; current code uses relative paths.
- Token expiry UI is SweetAlert2-driven; avoid parallel prompts—respect `sessionPromptActive` logic in `auth.js`.
- The movies domain data is static; ensure new UIs read from or extend `movieData.js` unless integrating a backend.

## Quick examples
- Add a route in `main.jsx`:
```jsx
import NewPage from "./screens/newPage/newPage";
<Route path="/new" element={<NewPage />} />
```
- Use Searchbar from a parent:
```jsx
<Searchbar onSearch={setQuery} suggestions={moviesData.map(m=>m.title)} />
```
