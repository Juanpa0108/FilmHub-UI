import { createContext, useContext, type ReactNode } from "react";
import useAuth from "./auth"; // .js está bien con allowJs; si lo renombras a .ts, deja "./auth"

type AuthContextValue = ReturnType<typeof useAuth>; 
// Si TS no infiere (porque useAuth es JS y devuelve 'any'),
// puedes reemplazar por un tipo explícito:
// type AuthContextValue = {
//   user: { id: string; name: string; email: string } | null;
//   token?: string;
//   login: (u: { id: string; name: string; email: string }, token?: string) => void;
//   logout: () => void;
// };

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth() as AuthContextValue;
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de un AuthProvider");
  }
  return context;
}