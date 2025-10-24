/**
 * FavoritesContext
 * - Provides per-user favorites state with localStorage persistence and backend sync
 * - Public API: favorites list, add, remove, toggle, has
 */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuthContext } from "./authContext";

type FavoriteId = string; // normalize ids as strings (works for slugs and ObjectIds)

/** Public methods exposed by the context */
type FavoritesContextValue = {
  favorites: FavoriteId[];
  add: (id: string | number) => Promise<void> | void;
  remove: (id: string | number) => Promise<void> | void;
  toggle: (id: string | number) => Promise<void> | void;
  has: (id: string | number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const BASE_STORAGE_KEY = "favorites";
const storageKeyFor = (userId?: string): string =>
  userId ? `${BASE_STORAGE_KEY}:${userId}` : BASE_STORAGE_KEY;
const toKey = (id: string | number): FavoriteId => String(id);
const API = {
  async list(token?: string) {
    const res = await fetch(import.meta.env.VITE_API_URL + '/api/favorites/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to load favorites');
    const data = await res.json();
    return (data.favorites || []) as Array<{ movieId: string }>;
  },
  async add(movieId: string, token?: string) {
    const res = await fetch(import.meta.env.VITE_API_URL + '/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      credentials: 'include',
      body: JSON.stringify({ movieId }),
    });
    if (!res.ok) throw new Error('Failed to add favorite');
  },
  async remove(movieId: string, token?: string) {
    const res = await fetch(import.meta.env.VITE_API_URL + `/api/favorites/${encodeURIComponent(movieId)}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      credentials: 'include',
    });
    if (!res.ok && res.status !== 404) throw new Error('Failed to remove favorite');
  }
};

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { state } = useAuthContext() as any;
  const userId: string | undefined = state?.user?.id ? String(state.user.id) : undefined;
  const token: string | undefined = state?.accessToken || localStorage.getItem('accessToken') || undefined;

  // Local state initialized per-user
  const [favorites, setFavorites] = useState<FavoriteId[]>(() => {
    try {
      const raw = localStorage.getItem(storageKeyFor(userId));
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.map((v) => String(v)) : [];
    } catch { return []; }
  });

  // Persist favorites per-user
  useEffect(() => {
    try { localStorage.setItem(storageKeyFor(userId), JSON.stringify(favorites)); } catch {}
  }, [favorites, userId]);

  // When user changes, load that user's favorites from local storage, then try backend
  useEffect(() => {
    // Load from local storage for this user
    try {
      const raw = localStorage.getItem(storageKeyFor(userId));
      const arr = raw ? JSON.parse(raw) : [];
      setFavorites(Array.isArray(arr) ? arr.map((v: any) => String(v)) : []);
    } catch {
      setFavorites([]);
    }

    // Fetch from backend if authenticated and merge (unique)
    if (!token) return;
    (async () => {
      try {
        const list = await API.list(token);
        const ids = list.map((f) => f.movieId);
        setFavorites((prev) => Array.from(new Set([...(prev || []), ...ids.map(String)])));
      } catch { /* ignore */ }
    })();
  }, [userId, token]);

  // Try to sync with backend when authenticated; fall back to local-only if fails
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return; // not authenticated; keep local
    (async () => {
      try {
        const list = await API.list(token);
        const ids = list.map((f) => f.movieId);
        setFavorites((prev) => (prev.length ? prev : ids));
      } catch { /* ignore, keep local */ }
    })();
  }, []);

  const api = useMemo<FavoritesContextValue>(() => {
    const add = async (id: string | number) => {
      const key = toKey(id);
      setFavorites((prev) => (prev.includes(key) ? prev : [...prev, key]));
      try { if (token) await API.add(key, token); } catch { /* keep local */ }
    };
    const remove = async (id: string | number) => {
      const key = toKey(id);
      setFavorites((prev) => prev.filter((x) => x !== key));
      try { if (token) await API.remove(key, token); } catch { /* keep local */ }
    };
    const toggle = async (id: string | number) => {
      const key = toKey(id);
      if (favorites.includes(key)) {
        await remove(key);
      } else {
        await add(key);
      }
    };
    const has = (id: string | number) => favorites.includes(toKey(id));
    return { favorites, add, remove, toggle, has };
  }, [favorites, token]);

  return <FavoritesContext.Provider value={api}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}
