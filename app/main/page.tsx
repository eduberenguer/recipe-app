"use client";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { AuthContext, RecipesContext } from "../context/context";
import checkOwnerRecipe from "../utils/check.owner.recipe";
import Link from "next/link";
import photoSrc from "../utils/photoSrc";
import Button from "@/components/Button";
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
        {" "}
        {contextRecipes.stateAllRecipes.length > 0 ? (
          contextRecipes.stateAllRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden w-[420px] h-[350px] mx-auto transition-transform duration-200 hover:scale-105 flex flex-col justify-between"
            >
              <div className="relative w-full">
                <Link href={`/details/${recipe.id}`}>
                  <Image
                    src={photoSrc(recipe.id, recipe.photo as string)}
                    alt={recipe.title}
                    width={420}
                    height={250}
                    className="w-full h-64 object-cover rounded-t-md"
                  />
                </Link>
                {contextAuth.user?.id &&
                  checkOwnerRecipe(contextAuth.user.id, recipe.owner) && (
                    <Button
                      onClick={() => contextRecipes?.deleteRecipe(recipe.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
                      role="button"
                    >
                      X
                    </Button>
                  )}
              </div>
              <div className="p-4 flex flex-col justify-between flex-grow">
                <h3 className="text-xl font-semibold text-gray-900">
                  {recipe.title}
                </h3>
                <p className="text-gray-600 text-sm">{`${recipe.servings} servings`}</p>
              </div>
            </div>
          ))
        ) : (
          <div>No recipes available</div>
        )}
      </div>
    </div>
  );
}
