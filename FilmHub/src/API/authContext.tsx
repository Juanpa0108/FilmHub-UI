/**
 * AuthContext
 * - Thin wrapper around useAuth hook to expose auth state/actions via React Context
 */
import { createContext, useContext, type ReactNode } from "react";
import useAuth from "./auth"; // .js works with allowJs; if you rename to .ts, keep "./auth"

type AuthContextValue = ReturnType<typeof useAuth>; 
// If TS can't infer because useAuth is JS and returns 'any', you can replace with an explicit type:
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
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}