"use client";
import { useContext, useEffect, useState } from "react";
import {
  AuthContext,
  RecipesContext,
  UserInteractionsContext,
} from "../context/context";

import { RecipeWithRating } from "@/types/recipes";
import CustomSpinner from "@/components/CustomSpinner";
import RecipeCardExpanded from "@/components/RecipeCardExpanded";

export default function Favourites() {
  const contextAuth = useContext(AuthContext);
  const contextRecipes = useContext(RecipesContext);
  const contextUserInteraction = useContext(UserInteractionsContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFavourites() {
      if (contextAuth?.user?.id && contextUserInteraction) {
        await contextUserInteraction.retrieveFavouritesList(
          contextAuth.user.id
        );
        setIsLoading(false);
      }
    }

    fetchFavourites();
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
    }
  }

  if (isLoading || !contextAuth || !contextRecipes) {
    return <CustomSpinner message={"Loading favourites..."} />;
  }

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex-grow text-center">
          My favourites recipes
        </h2>
      </header>
      <div className="flex flex-wrap justify-center gap-4 mt-20">
        {(contextUserInteraction?.favouritesRecipes ?? []).length > 0 ? (
          contextUserInteraction?.favouritesRecipes.map(
            (recipe: RecipeWithRating) => {
              return (
                <RecipeCardExpanded
                  key={recipe.id}
                  recipe={recipe}
                  user={contextAuth?.user}
                  deleteRecipe={contextRecipes?.deleteRecipe ?? (() => {})}
                  toggleFavourite={() => toggleFavourite(recipe.id)}
                  isFavourite={contextUserInteraction?.favouritesRecipes.some(
                    (fav) => fav.id === recipe.id
                  )}
                  retrieveRecipeRating={
                    contextUserInteraction?.retrieveRecipeRatings ||
                    (async () => {})
                  }
                  isFromMain={false}
                />
              );
            }
          )
        ) : (
          <div className="flex justify-center items-center w-full h-[calc(100vh-200px)] text-gray-600 text-lg">
            No recipes available
          </div>
        )}
      </div>
    </div>
  );
}
