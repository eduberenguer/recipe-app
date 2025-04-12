"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext, RecipesContext } from "../context/context";

import RecipeCard from "@/components/RecipeCard";
import FilterByName from "@/components/FilterByName";

export default function Main() {
  const contextAuth = useContext(AuthContext);
  const contextRecipes = useContext(RecipesContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (contextRecipes) {
      contextRecipes.retrieveRecipesList();
      setIsLoading(false);
    }
  }, []);

  if (isLoading || !contextAuth || !contextRecipes) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex-grow text-center">
          Recipes Collection
        </h2>
        <FilterByName />
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
              />
            );
          })
        ) : (
          <div>No recipes available</div>
        )}
      </div>
    </div>
  );
}
