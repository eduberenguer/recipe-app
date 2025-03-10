"use client";
import { createContext } from "react";
import { useAuth } from "../hooks/useAuth";

type AuthContextType = ReturnType<typeof useAuth>;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
