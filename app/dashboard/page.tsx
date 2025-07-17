"use client";

import { useContext, useEffect } from "react";
import { AuthContext, RecipesContext } from "../context/context";
import RecipesListMobile from "./RecipesListMobile/recipesListMobile";
import RecipesTableDesktop from "./RecipesTableDesktop/recipesTableDesktop";
import { useIsMobile } from "../hooks/useIsMobile";
import { RecipeWithRating } from "@/types/recipes";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const contextAuth = useContext(AuthContext);
  const contextRecipes = useContext(RecipesContext);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (contextAuth?.user?.id && contextRecipes) {
      contextRecipes.retrieveRecipesByUserId(contextAuth.user.id);
    }
  }, [contextAuth?.user?.id]);

  const recipes = contextRecipes?.stateUserRecipes || [];

  return (
    <div className="p-4">
      <header className="flex justify-between items-center px-4">
        <h2 className="text-2xl font-bold mb-4">
          {contextAuth?.user?.name
            ? `${contextAuth.user.name.toUpperCase()}'S RECIPES`
            : "MY RECIPES"}
        </h2>
        <Button
          backgroundColor="bg-blue-600"
          hoverColor="hover:bg-blue-700"
          onClick={() => {
            router.push("/favourites");
          }}
        >
          Favourites
        </Button>
      </header>

      {isMobile ? (
        <RecipesListMobile
          recipes={recipes as RecipeWithRating[]}
          toggleVisibleRecipe={
            contextRecipes?.toggleVisibleRecipe || (() => Promise.resolve())
          }
          deleteRecipe={
            contextRecipes?.deleteRecipe || (() => Promise.resolve())
          }
        />
      ) : (
        <RecipesTableDesktop
          recipes={recipes as RecipeWithRating[]}
          toggleVisibleRecipe={
            contextRecipes?.toggleVisibleRecipe || (() => Promise.resolve())
          }
          deleteRecipe={
            contextRecipes?.deleteRecipe || (() => Promise.resolve())
          }
        />
      )}
    </div>
  );
}
