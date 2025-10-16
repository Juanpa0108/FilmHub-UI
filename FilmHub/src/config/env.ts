// Centralized access to Vite environment variables (TypeScript)
// Note: Vite only exposes variables prefixed with VITE_

const stripTrailingSlash = (url: string | undefined): string =>
  typeof url === 'string' ? url.replace(/\/+$/, '') : '';

export const API_URL: string = stripTrailingSlash(import.meta.env.VITE_API_URL);
export const TMDB_KEY: string = import.meta.env.VITE_TMDB_KEY ?? '';
export const API_KEY: string = import.meta.env.VITE_API_KEY ?? '';

// Convenience helpers
export const apiPath = (path: string = ''): string => {
  const base = API_URL;
  if (!base) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};
