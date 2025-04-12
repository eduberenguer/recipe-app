"use client";
import { useContext, useEffect, useState } from "react";
import {
  AuthContext,
  RecipesContext,
  UserInteractionsContext,
} from "../context/context";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/types";

export default function Favourites() {
  const contextAuth = useContext(AuthContext);
  const contextRecipes = useContext(RecipesContext);
  const contextUserInteraction = useContext(UserInteractionsContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (contextAuth) {
      if (contextAuth.user?.id) {
        contextUserInteraction?.retrieveFavouritesList(contextAuth.user.id);
        setIsLoading(false);
      }
    }
  }, []);

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
      {(contextUserInteraction?.stateFavouritesList ?? []).length > 0 ? (
        contextUserInteraction?.stateFavouritesList.map((recipe: Recipe) => {
          return (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              user={contextAuth?.user}
              deleteRecipe={contextRecipes?.deleteRecipe ?? (() => {})}
            />
          );
        })
      ) : (
        <div>No recipes available</div>
      )}
    </div>
  );
}
