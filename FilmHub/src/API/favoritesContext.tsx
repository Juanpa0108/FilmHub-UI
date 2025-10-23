import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type FavoritesContextValue = {
  favorites: number[];
  add: (id: number) => void;
  remove: (id: number) => void;
  toggle: (id: number) => void;
  has: (id: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const STORAGE_KEY = "favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.filter((n: unknown) => typeof n === "number") : [];
    } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)); } catch {}
  }, [favorites]);

  const api = useMemo<FavoritesContextValue>(() => ({
    favorites,
    add: (id: number) => setFavorites((prev) => prev.includes(id) ? prev : [...prev, id]),
    remove: (id: number) => setFavorites((prev) => prev.filter((x) => x !== id)),
    toggle: (id: number) => setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]),
    has: (id: number) => favorites.includes(id),
  }), [favorites]);

  return <FavoritesContext.Provider value={api}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites debe usarse dentro de FavoritesProvider");
  return ctx;
}
