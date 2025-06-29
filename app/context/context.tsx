"use client";
import { createContext } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRecipes } from "../hooks/useRecipe";
import { useUserInteractions } from "../hooks/useUserInteractions";

export type AuthContextType = ReturnType<typeof useAuth>;
export type RecipesContextType = ReturnType<typeof useRecipes>;
export type UserInteractionsContextType = ReturnType<
  typeof useUserInteractions
>;

export const AuthContext = createContext<AuthContextType | null>(null);
export const RecipesContext = createContext<RecipesContextType | null>(null);
export const UserInteractionsContext =
  createContext<UserInteractionsContextType | null>(null);

export function ContexProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const recipes = useRecipes();
  const userInteractions = useUserInteractions();

  return (
    <AuthContext.Provider value={auth}>
      <RecipesContext.Provider value={recipes}>
        <UserInteractionsContext.Provider value={userInteractions}>
          {children}
        </UserInteractionsContext.Provider>
      </RecipesContext.Provider>
    </AuthContext.Provider>
  );
}
