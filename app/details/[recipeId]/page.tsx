"use client";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import {
  AuthContext,
  RecipesContext,
  UserInteractionsContext,
} from "../../context/context";
import { useParams } from "next/navigation";
import photoSrc from "@/app/utils/photoSrc";
import CustomSpinner from "@/components/CustomSpinner";

import RatingForm from "@/components/RatingForm";

export default function Details() {
  const { recipeId } = useParams();
  const contextRecipes = useContext(RecipesContext);
  const contextUser = useContext(AuthContext);
  const contextUserInteraction = useContext(UserInteractionsContext);
  const [rating, setRating] = useState<{
    average: number;
    count: number;
  } | null>(null);
  const [alreadyRated, setAlreadyRated] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (typeof recipeId === "string" && contextRecipes) {
        contextRecipes.clearStateRecipe?.();
        await contextRecipes.retrieveRecipe(recipeId);

        try {
          const data = await contextUserInteraction?.retrieveRecipeRatings(
            recipeId
          );
          if (data) {
            setRating(data);
          } else {
            setRating(null);
          }
        } catch (error) {
          console.error("Error retrieving rating:", error);
          setRating(null);
        }
      }
    };

    fetchRecipe();
  }, [recipeId]);

  useEffect(() => {
    const checkIfRated = async () => {
      if (contextUser?.user?.id && typeof recipeId === "string") {
        try {
          const result = await contextUserInteraction?.checkUserHasRated(
            contextUser?.user.id,
            recipeId
          );

          if (result) {
            setAlreadyRated(result);
          }
        } catch (error) {
          console.error("Error checking if rated:", error);
        }
      }
    };

    checkIfRated();
  }, [recipeId, rating]);

  const handleAddRating = async (recipeId: string, newRating: number) => {
    try {
      await contextUserInteraction?.addRecipeRating({
        userId: contextUser?.user?.id ?? "",
        recipeId: recipeId ?? "",
        rating: newRating,
      });

      const newRatingData = await contextUserInteraction?.retrieveRecipeRatings(
        recipeId
      );
      setRating(newRatingData ?? null);
    } catch (error) {
      console.error("Error adding rating:", error);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-6">Recipe Details</h1>
      {contextRecipes?.stateRecipe &&
      Object.keys(contextRecipes?.stateRecipe).length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md flex gap-8">
          <div className="flex-shrink-0 w-2/3">
            <Image
              src={photoSrc(
                contextRecipes.stateRecipe.id ?? "",
                contextRecipes.stateRecipe.photo as string
              )}
              alt={contextRecipes.stateRecipe.title || "Recipe image"}
              width={250}
              height={200}
              className="rounded-lg"
            />
            <p className="mt-4 text-gray-600">
              {contextRecipes.stateRecipe.description}
            </p>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">
              {contextRecipes.stateRecipe.title}
            </h2>
            {rating ? (
              <div className="mb-4 text-gray-700">
                <p className="font-semibold">
                  Rating: {rating.average.toFixed(1)} ({rating.count} ratings)
                </p>
              </div>
            ) : (
              <p className="mb-4 text-gray-400 italic">No ratings yet</p>
            )}
            <div>
              <h3 className="font-semibold text-lg mb-2">Ingredients</h3>
              <ul className="list-disc pl-6 space-y-2">
                {contextRecipes.stateRecipe.ingredients?.map(
                  (ingredient, index) => (
                    <li key={index} className="text-gray-700">
                      <span className="font-medium">{ingredient.name}:</span>{" "}
                      {ingredient.quantity} {ingredient.unity}
                    </li>
                  )
                )}
              </ul>
            </div>
            {alreadyRated ? (
              <p className="italic text-green-700">
                You already rated this recipe.
              </p>
            ) : (
              <RatingForm
                recipeId={recipeId as string}
                handleAddRating={handleAddRating}
              />
            )}
          </div>
        </div>
      ) : (
        <CustomSpinner message={"Loading recipe details..."} />
      )}
    </div>
  );
}
