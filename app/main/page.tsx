"use client";
import { useContext, useEffect } from "react";
import Image from "next/image";
import { AuthContext, RecipesContext } from "../context/context";
import checkOwnerRecipe from "../utils/check.owner.recipe";
import Link from "next/link";
import photoSrc from "../utils/photoSrc";
import Button from "@/components/Button";
import FilterByName from "@/components/filterByName";

export default function Main() {
  const contextAuth = useContext(AuthContext);
  const contextRecipes = useContext(RecipesContext);

  useEffect(() => {
    contextRecipes?.retrieveRecipesList();
  }, []);

  return (
    <div className="p-6">
      <header className="flex flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Recipe Collection
        </h2>
        <FilterByName />
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {contextRecipes?.stateAllRecipes.map((recipe) => {
          return (
            <div
              key={recipe.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden max-w-[320px] h-auto mx-auto transition-transform duration-200 hover:scale-105"
            >
              <div className="relative">
                <Link href={`/details/${recipe.id}`}>
                  <Image
                    src={photoSrc(recipe.id, recipe.photo as string)}
                    alt={recipe.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-md"
                  />
                </Link>
                {contextAuth?.user?.id &&
                  checkOwnerRecipe(contextAuth.user.id, recipe.owner) && (
                    <Button
                      onClick={() => contextRecipes?.deleteRecipe(recipe.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
                    >
                      X
                    </Button>
                  )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {recipe.title}
                </h3>
                <p className="text-gray-600 text-sm">{`${recipe.servings} servings`}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
