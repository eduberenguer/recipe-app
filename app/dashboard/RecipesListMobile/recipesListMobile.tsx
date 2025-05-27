// components/RecipesListMobile.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { RecipeWithRating } from "@/types/recipes";
import photoSrc from "@/app/utils/photoSrc";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { Eye, EyeOff } from "lucide-react";

export default function RecipesListMobile({
  recipes,
  toggleVisibleRecipe,
  deleteRecipe,
}: {
  recipes: RecipeWithRating[];
  toggleVisibleRecipe: (
    recipeId: string,
    newIsVisible: boolean
  ) => Promise<void>;
  deleteRecipe: (recipeId: string) => Promise<void>;
}) {
  return (
    <div className="flex flex-col gap-3" data-testid="recipes-list-mobile">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="border rounded-2xl overflow-hidden bg-white shadow-md"
        >
          <Image
            src={photoSrc(recipe.id ?? "", recipe.photo as string)}
            alt={recipe.title}
            width={500}
            height={300}
            className="w-full h-52 object-cover"
          />
          <div className="flex flex-row space-around items-center p-4">
            <div className="p-2 flex-1">
              <h3 className="text-lg font-semibold">
                <Link
                  href={`/details/${recipe.id}`}
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  {recipe.title} <FaMagnifyingGlass className="text-base" />
                </Link>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Servings: {recipe.servings}
              </p>
              <p className="text-sm text-gray-600">
                Favourites: {recipe.favouritesCounter}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {recipe.rating.average} ({recipe.rating.count} ratings)
              </p>
              <button
                onClick={() =>
                  toggleVisibleRecipe(recipe.id, !recipe.isVisible)
                }
                className="p-2 text-black-600 hover:text-black-800 rounded cursor-pointer"
              >
                {recipe.isVisible ? (
                  <Eye className="text-3xl" />
                ) : (
                  <EyeOff className="text-3xl" />
                )}
              </button>
              <button
                onClick={() => deleteRecipe(recipe.id)}
                className="p-2 text-red-600 hover:text-red-800 rounded cursor-pointer"
              >
                <MdDeleteForever className="text-3xl" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
