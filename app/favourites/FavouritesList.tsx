"use client";
import { useContext, useState } from "react";
import {
  AuthContext,
  RecipesContext,
  UserInteractionsContext,
} from "../context/context";
import { RecipeWithRating } from "@/types/recipes";
import RecipeCardExpanded from "@/components/RecipeCardExpanded";

export default function FavouritesList({
  initialRecipes,
  userId,
}: {
  initialRecipes: RecipeWithRating[];
  userId?: string;
}) {
  const contextAuth = useContext(AuthContext);
  const contextRecipes = useContext(RecipesContext);
  const contextUserInteraction = useContext(UserInteractionsContext);
  const [recipes, setRecipes] = useState<RecipeWithRating[]>(initialRecipes);

  async function toggleFavourite(recipeId: string): Promise<void> {
    if (!userId || !contextUserInteraction) return;

    await contextUserInteraction.removeFavouriteRecipe(userId, recipeId);
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-20">
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <RecipeCardExpanded
            key={recipe.id}
            recipe={recipe}
            user={contextAuth?.user}
            deleteRecipe={contextRecipes?.deleteRecipe ?? (() => {})}
            toggleFavourite={() => toggleFavourite(recipe.id)}
            isFavourite
            retrieveRecipeRating={
              contextUserInteraction?.retrieveRecipeRatings ||
              (async () => null)
            }
            isFromMain={false}
          />
        ))
      ) : (
        <div className="flex justify-center items-center w-full h-[calc(100vh-200px)] text-gray-600 text-lg">
          No recipes available
        </div>
      )}
    </div>
  );
}
