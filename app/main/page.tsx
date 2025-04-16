"use client";
import { useContext, useEffect, useState } from "react";
import {
  AuthContext,
  RecipesContext,
  UserInteractionsContext,
} from "../context/context";

import RecipeCard from "@/components/RecipeCard";
import FilterByName from "@/components/FilterByName";
import CustomSpinner from "@/components/CustomSpinner";

export default function Main() {
  const contextAuth = useContext(AuthContext);
  const contextRecipes = useContext(RecipesContext);
  const contextUserInteraction = useContext(UserInteractionsContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (contextRecipes) {
      contextRecipes.retrieveRecipesList();
      setIsLoading(false);
    }
  }, []);

  async function toggleFavourite(recipeId: string) {
    if (!contextAuth?.user?.id || !contextUserInteraction) return;

    const isFav = contextUserInteraction.favouritesRecipes.some(
      (fav) => fav.id === recipeId
    );

    if (isFav) {
      await contextUserInteraction.removeFavouriteRecipe(
        contextAuth.user.id,
        recipeId
      );
    } else {
      await contextUserInteraction.addFavouriteRecipe(
        contextAuth.user.id,
        recipeId
      );
    }
  }

  if (isLoading || !contextAuth || !contextRecipes) {
    return <CustomSpinner message={"Loading recipes..."} />;
  }

  return (
    <div className="p-6">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 px-4 py-3 bg-white shadow-md rounded-xl border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          🍽️ Recipes Collection
        </h2>
        <div className="right-0">
          <div className="px-4 py-2 flex items-center gap-2 transition-all duration-300 hover:shadow-lg">
            <FilterByName />
          </div>
        </div>
      </header>

      <div className="flex flex-wrap justify-center gap-4 mt-20">
        {contextRecipes.stateAllRecipes.length > 0 ? (
          contextRecipes.stateAllRecipes.map((recipe) => {
            return (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                user={contextAuth.user}
                deleteRecipe={contextRecipes.deleteRecipe}
                toggleFavourite={() => toggleFavourite(recipe.id)}
                isFavourite={contextUserInteraction?.favouritesRecipes.some(
                  (fav) => fav.id === recipe.id
                )}
                isFromMain={true}
              />
            );
          })
        ) : (
          <div className="flex justify-center items-center w-full h-[calc(100vh-200px)] text-gray-600 text-lg">
            No recipes available
          </div>
        )}
      </div>
    </div>
  );
}
