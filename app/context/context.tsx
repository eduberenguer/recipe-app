"use client";
import { createContext } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRecipes } from "../hooks/useRecipe";

type AuthContextType = ReturnType<typeof useAuth>;
type RecipesContextType = ReturnType<typeof useRecipes>;

export const AuthContext = createContext<AuthContextType | null>(null);
export const RecipesContext = createContext<RecipesContextType | null>(null);

export function ContexProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const recipes = useRecipes();

  return (
    <AuthContext.Provider value={auth}>
      <RecipesContext.Provider value={recipes}>
        {children}
      </RecipesContext.Provider>
    </AuthContext.Provider>
  );
}
