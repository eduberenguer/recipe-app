"use client";
import { useContext, useState } from "react";
import { AuthContext } from "../context/context";
import { RecipeWithRating } from "@/types/recipes";
import RecipeCardExpanded from "@/components/RecipeCardExpanded";
import { retrieveRecipeRatingsApi } from "@/lib/api/userInteractions";
import { useDeleteRecipeMutation } from "@/app/queries/recipes";
import { useRemoveFavouriteMutation } from "@/app/queries/userInteractions";

export default function FavouritesList({
  initialRecipes,
  userId,
}: {
  initialRecipes: RecipeWithRating[];
  userId?: string;
}) {
  const contextAuth = useContext(AuthContext);
  const deleteRecipeMutation = useDeleteRecipeMutation();
  const removeFavouriteMutation = useRemoveFavouriteMutation();
  const [recipes, setRecipes] = useState<RecipeWithRating[]>(initialRecipes);

  async function toggleFavourite(recipeId: string): Promise<void> {
    if (!userId) return;

    await removeFavouriteMutation.mutateAsync({ userId, recipeId });
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
            deleteRecipe={(recipeId) => deleteRecipeMutation.mutate(recipeId)}
            toggleFavourite={() => toggleFavourite(recipe.id)}
            isFavourite
            retrieveRecipeRating={retrieveRecipeRatingsApi}
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
