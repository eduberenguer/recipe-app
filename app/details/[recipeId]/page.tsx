"use client";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import {
  AuthContext,
  AuthContextType,
  RecipesContext,
  RecipesContextType,
  UserInteractionsContext,
  UserInteractionsContextType,
} from "../../context/context";
import { useParams } from "next/navigation";
import photoSrc from "@/app/utils/photoSrc";
import CustomSpinner from "@/components/CustomSpinner";
import RatingForm from "@/components/RatingForm";
import ForkRating from "@/components/ForkRating";
import { incrementRecipeViews } from "@/server/recipes";
import { CommentsRecipe } from "@/types/userInteractions";
import Comments from "@/components/Comments";
import { extractTimedSteps } from "@/app/utils/extractTimedSteps";
import { DescriptionRecipe } from "@/components/DescriptionRecipe";
import { ALLERGEN_ICONS } from "@/types/recipes";
import { getDifficultyColor } from "@/app/utils/getDifficultyColor";
import SendRecipeButton from "@/components/SendRecipeButton";

export default function Details() {
  const { recipeId } = useParams();
  const contextRecipes = useContext<RecipesContextType | null>(RecipesContext);
  const contextUser = useContext<AuthContextType | null>(AuthContext);
  const contextUserInteraction = useContext<UserInteractionsContextType | null>(
    UserInteractionsContext
  );
  const [rating, setRating] = useState<{
    average: number;
    count: number;
  } | null>(null);
  const [alreadyRated, setAlreadyRated] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentsRecipe[]>([]);
  const [loadingComments, setLoadingComments] = useState<boolean>(true);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [activeTimer, setActiveTimer] = useState<{
    minutes: number;
    secondsLeft: number;
    intervalId: NodeJS.Timeout | null;
  } | null>(null);

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

  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const allComments =
          await contextUserInteraction?.retrieveCommentsRecipe(
            contextUser?.user?.id ?? "",
            typeof recipeId === "string" ? recipeId : ""
          );

        setComments(allComments ?? []);
      } catch {
        setComments([]);
      } finally {
        setLoadingComments(false);
      }
    };
    if (recipeId) fetchComments();
  }, [recipeId]);

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

  const steps = extractTimedSteps(
    contextRecipes?.stateRecipe?.description || ""
  );

  return (
    <main className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-4npxl mx-auto px-4 py-10">
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
                  loadingComments={loadingComments}
                  comments={comments}
                  userId={contextUser?.user?.id ?? ""}
                  recipeId={recipeId as string}
                  setComments={setComments}
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
                    {contextRecipes.stateRecipe.title}
                  </h1>
                  <span className="text-sm text-gray-500 p-2">
                    ⏱ {contextRecipes.stateRecipe.duration}m
                  </span>
                  <span
                    className={`text-sm p-2 rounded-full font-semibold ${getDifficultyColor(
                      contextRecipes.stateRecipe.difficulty || "easy"
                    )}`}
                  >
                    {contextRecipes.stateRecipe.difficulty || "easy"}
                  </span>
                  <span>
                    <SendRecipeButton
                      recipeTitle={contextRecipes.stateRecipe.title}
                      recipeDescription={contextRecipes.stateRecipe.description}
                      recipeLink={`http://localhost:3000/recipes/${contextRecipes.stateRecipe.id}`}
                    />
                  </span>
                </div>
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
              {contextRecipes.stateRecipe.allergens &&
                contextRecipes.stateRecipe.allergens.length > 0 && (
                  <div>
                    <h2 className="font-semibold text-lg mb-2 text-gray-800">
                      Allergens
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {contextRecipes.stateRecipe.allergens.map(
                        (allergen, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-full text-red-700 text-sm font-medium"
                          >
                            <span className="text-lg">
                              {ALLERGEN_ICONS[allergen].icon}
                            </span>
                            <span className="capitalize">{allergen}</span>
                          </div>
                        )
                      )}
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
