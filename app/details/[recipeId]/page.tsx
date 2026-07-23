"use client";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { AuthContext, AuthContextType } from "../../context/context";
import { useParams } from "next/navigation";
import photoSrc from "@/app/utils/photoSrc";
import CustomSpinner from "@/components/CustomSpinner";
import RatingForm from "@/components/RatingForm";
import ForkRating from "@/components/ForkRating";
import { incrementRecipeViews } from "@/server/recipes";
import Comments from "@/components/Comments";
import { extractTimedSteps } from "@/app/utils/extractTimedSteps";
import { DescriptionRecipe } from "@/components/DescriptionRecipe";
import { ALLERGEN_ICONS } from "@/types/recipes";
import { getDifficultyColor } from "@/app/utils/getDifficultyColor";
import SendRecipeButton from "@/components/SendRecipeButton";
import { useRecipeQuery } from "@/app/queries/recipes";
import {
  useAddRecipeRatingMutation,
  useCheckUserHasRatedQuery,
  useRecipeRatingsQuery,
} from "@/app/queries/userInteractions";

export default function Details() {
  const { recipeId } = useParams();
  const recipeIdStr = typeof recipeId === "string" ? recipeId : undefined;
  const contextUser = useContext<AuthContextType | null>(AuthContext);

  const { data: recipe } = useRecipeQuery(recipeIdStr);
  const { data: rating } = useRecipeRatingsQuery(recipeIdStr);
  const { data: alreadyRated } = useCheckUserHasRatedQuery(
    contextUser?.user?.id,
    recipeIdStr,
  );
  const addRecipeRatingMutation = useAddRecipeRatingMutation();

  const [showComments, setShowComments] = useState<boolean>(false);
  const [activeTimer, setActiveTimer] = useState<{
    minutes: number;
    secondsLeft: number;
    intervalId: NodeJS.Timeout | null;
  } | null>(null);

  useEffect(() => {
    if (typeof recipeId !== "string") return;
    const viewedKey = `viewed_${recipeId}`;
    if (sessionStorage.getItem(viewedKey)) return;
    incrementRecipeViews(recipeId);
    sessionStorage.setItem(viewedKey, "true");
  }, [recipeId]);

  const handleAddRating = async (
    recipeId: string,
    newRating: number,
  ): Promise<void> => {
    try {
      await addRecipeRatingMutation.mutateAsync({
        userId: contextUser?.user?.id ?? "",
        recipeId: recipeId ?? "",
        rating: newRating,
      });
    } catch {}
  };

  function renderRatingSection(): React.ReactNode {
    if (!contextUser?.user?.id) {
      return <p className="italic">Sign in to rate this recipe.</p>;
    }
    if (recipe?.owner === contextUser?.user?.id) {
      return <p className="italic">You can´t rate your own recipe.</p>;
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

  const steps = extractTimedSteps(recipe?.description || "");

  return (
    <main className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-4npxl mx-auto px-4 py-10">
        {recipe ? (
          <div className="bg-white rounded-3xl shadow-xl flex flex-col md:flex-row gap-10 p-8 md:p-12 animate-fadein">
            <div className="md:w-1/2 w-full flex flex-col gap-6">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={photoSrc(recipe.id ?? "", recipe.photo as string)}
                  alt={recipe.title || "Recipe image"}
                  fill
                  sizes="100vw"
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
              <div className="flex gap-2 mb-6 justify-between w-full">
                <button
                  className={`px-6 py-2 rounded-full font-bold shadow transition-all duration-200 cursor-pointer
                  ${
                    !showComments
                      ? "bg-[#6366F1] text-white scale-105"
                      : "bg-white text-[#6366F1] hover:bg-[#6366F1]/10"
                  }
                `}
                  style={{ boxShadow: "0 2px 8px 0 rgba(99,102,241,0.08)" }}
                  onClick={() => setShowComments(false)}
                >
                  Description
                </button>
                <button
                  className={`px-6 py-2 rounded-full font-bold shadow transition-all duration-200 cursor-pointer
                  ${
                    showComments
                      ? "bg-[#6366F1] text-white scale-105"
                      : "bg-white text-[#6366F1] hover:bg-[#6366F1]/10"
                  }
                `}
                  style={{ boxShadow: "0 2px 8px 0 rgba(99,102,241,0.08)" }}
                  onClick={() => setShowComments(true)}
                >
                  Comments
                </button>
              </div>
              {showComments ? (
                <Comments
                  userId={contextUser?.user?.id ?? ""}
                  recipeId={recipeId as string}
                />
              ) : (
                <DescriptionRecipe
                  steps={steps.map(({ text, minutes }) => ({
                    text,
                    minutes: minutes === null ? 0 : minutes,
                  }))}
                  activeTimer={
                    activeTimer
                      ? {
                          secondsLeft: activeTimer.secondsLeft,
                          intervalId:
                            activeTimer.intervalId ?? setTimeout(() => {}, 0),
                        }
                      : null
                  }
                  setActiveTimer={(timer) => {
                    if (timer) {
                      setActiveTimer({
                        minutes: 0,
                        secondsLeft: timer.secondsLeft,
                        intervalId: timer.intervalId,
                      });
                    } else {
                      setActiveTimer(null);
                    }
                  }}
                />
              )}
            </div>
            <div className="flex-1 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center mb-4 gap-4">
                  <h1 className="text-3xl font-extrabold text-gray-900">
                    {recipe.title}
                  </h1>
                  <span className="text-sm text-gray-500 p-2">
                    ⏱ {recipe.duration}m
                  </span>
                  <span
                    className={`text-sm p-2 rounded-full font-semibold ${getDifficultyColor(
                      recipe.difficulty || "easy",
                    )}`}
                  >
                    {recipe.difficulty || "easy"}
                  </span>
                  <SendRecipeButton
                    recipeTitle={recipe.title}
                    recipeDescription={recipe.description}
                    recipeLink={`http://localhost:3000/recipes/${recipe.id}`}
                  />
                </div>
                <h2 className="font-semibold text-lg mb-2 text-gray-800">
                  Ingredients
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  {recipe.ingredients?.map((ingredient, index) => (
                    <li key={index} className="text-gray-700 text-base">
                      <span className="font-medium">{ingredient.name}:</span>{" "}
                      {ingredient.quantity} {ingredient.unity}
                    </li>
                  ))}
                </ul>
              </div>
              {recipe.allergens && recipe.allergens.length > 0 && (
                <div>
                  <h2 className="font-semibold text-lg mb-2 text-gray-800">
                    Allergens
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {recipe.allergens.map((allergen, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-full text-red-700 text-sm font-medium"
                      >
                        <span className="text-lg">
                          {ALLERGEN_ICONS[allergen].icon}
                        </span>
                        <span className="capitalize">{allergen}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
