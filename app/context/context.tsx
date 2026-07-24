"use client";
import { createContext } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUserInteractions } from "../hooks/useUserInteractions";

export type AuthContextType = ReturnType<typeof useAuth>;
export type UserInteractionsContextType = ReturnType<
  typeof useUserInteractions
>;

export const AuthContext = createContext<AuthContextType | null>(null);
export const UserInteractionsContext =
  createContext<UserInteractionsContextType | null>(null);

export function ContexProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const userInteractions = useUserInteractions();

  return (
    <AuthContext.Provider value={auth}>
      <UserInteractionsContext.Provider value={userInteractions}>
        {children}
      </UserInteractionsContext.Provider>
    </AuthContext.Provider>
  );
}
