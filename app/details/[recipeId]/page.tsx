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
import ForkRating from "@/components/ForkRating";
import { incrementRecipeViews } from "@/server/recipes";

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
        } catch {
          setRating(null);
        }
      }
    };
    fetchRecipe();
  }, [recipeId]);

  useEffect(() => {
    if (typeof recipeId !== "string") return;
    const viewedKey = `viewed_${recipeId}`;
    if (sessionStorage.getItem(viewedKey)) return;
    incrementRecipeViews(recipeId);
    sessionStorage.setItem(viewedKey, "true");
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
        } catch {}
      }
    };
    checkIfRated();
  }, [recipeId, rating]);

  const handleAddRating = async (
    recipeId: string,
    newRating: number
  ): Promise<void> => {
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
    } catch {}
  };

  function renderRatingSection(): React.ReactNode {
    if (contextRecipes?.stateRecipe?.owner === contextUser?.user?.id) {
      return null;
    }
    if (alreadyRated) {
      return (
        <p className="italic text-green-700">You already rated this recipe.</p>
      );
    }
    return (
      <RatingForm
        recipeId={recipeId as string}
        handleAddRating={handleAddRating}
      />
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {contextRecipes?.stateRecipe &&
        Object.keys(contextRecipes?.stateRecipe).length > 0 ? (
          <div className="bg-white rounded-3xl shadow-xl flex flex-col md:flex-row gap-10 p-8 md:p-12 animate-fadein">
            <div className="md:w-1/2 w-full flex flex-col gap-6">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={photoSrc(
                    contextRecipes.stateRecipe.id ?? "",
                    contextRecipes.stateRecipe.photo as string
                  )}
                  alt={contextRecipes.stateRecipe.title || "Recipe image"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-row gap-2 items-center mt-2">
                {rating && rating.count > 0 ? (
                  <>
                    <ForkRating rating={rating.average} />
                    <span className="text-base text-gray-700 font-medium">
                      ({rating.count} ratings)
                    </span>
                  </>
                ) : (
                  <span className="text-base text-gray-400 italic">
                    No ratings
                  </span>
                )}
              </div>
              <p className="mt-2 text-gray-600 text-lg leading-relaxed">
                {contextRecipes.stateRecipe.description}
              </p>
            </div>
            <div className="flex-1 flex flex-col gap-8">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                  {contextRecipes.stateRecipe.title}
                </h1>
                <h2 className="font-semibold text-lg mb-2 text-gray-800">
                  Ingredients
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  {contextRecipes.stateRecipe.ingredients?.map(
                    (ingredient, index) => (
                      <li key={index} className="text-gray-700 text-base">
                        <span className="font-medium">{ingredient.name}:</span>{" "}
                        {ingredient.quantity} {ingredient.unity}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className="mt-4">{renderRatingSection()}</div>
            </div>
          </div>
        ) : (
          <CustomSpinner message={"Loading recipe details..."} />
        )}
      </div>
    </main>
  );
}
