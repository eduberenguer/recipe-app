"use client";
import { createContext } from "react";
import { useUser } from "../hooks/useAuth";
import { useRecipes } from "../hooks/useRecipe";
import { useUserInteractions } from "../hooks/useUserInteractions";

type AuthContextType = ReturnType<typeof useUser>;
type RecipesContextType = ReturnType<typeof useRecipes>;
type UserInteractionsContextType = ReturnType<typeof useUserInteractions>;

export const AuthContext = createContext<AuthContextType | null>(null);
export const RecipesContext = createContext<RecipesContextType | null>(null);
export const UserInteractionsContext =
  createContext<UserInteractionsContextType | null>(null);

export function ContexProvider({ children }: { children: React.ReactNode }) {
  const auth = useUser();
  const recipes = useRecipes();
  const userInteractions = useUserInteractions();

  return (
    <AuthContext.Provider value={auth}>
      <UserInteractionsContext.Provider value={userInteractions}>
        <RecipesContext.Provider value={recipes}>
          {children}
        </RecipesContext.Provider>
      </UserInteractionsContext.Provider>
    </AuthContext.Provider>
  );
}
