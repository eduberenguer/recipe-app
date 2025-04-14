"use client";
import { useContext, useEffect, useState } from "react";
import {
  AuthContext,
  RecipesContext,
  UserInteractionsContext,
} from "../context/context";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/types/recipes/index";

export default function Favourites() {
  const contextAuth = useContext(AuthContext);
  const contextRecipes = useContext(RecipesContext);
  const contextUserInteraction = useContext(UserInteractionsContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (contextAuth?.user?.id && contextUserInteraction) {
      contextUserInteraction.retrieveFavouritesList(contextAuth.user.id);
      setIsLoading(false);
    }
  }, [contextAuth?.user?.id]);

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
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex-grow text-center">
          My favourites recipes
        </h2>
      </header>
      <div className="flex flex-wrap justify-center gap-4 mt-20"></div>
      {(contextUserInteraction?.favouritesRecipes ?? []).length > 0 ? (
        contextUserInteraction?.favouritesRecipes.map((recipe: Recipe) => {
          return (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              user={contextAuth?.user}
              deleteRecipe={contextRecipes?.deleteRecipe ?? (() => {})}
              toggleFavourite={() => toggleFavourite(recipe.id)}
              isFavourite={contextUserInteraction?.favouritesRecipes.some(
                (fav) => fav.id === recipe.id
              )}
              isFromMain={false}
            />
          );
        })
      ) : (
        <div className="flex justify-center items-center w-full h-[calc(100vh-200px)] text-gray-600 text-lg">
          No recipes available
        </div>
      )}
    </div>
  );
}
