// components/RecipesTable.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { RecipeWithRating } from "@/types/recipes";
import photoSrc from "@/app/utils/photoSrc";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { Eye, EyeOff } from "lucide-react";

export default function RecipesTable({
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
    <table
      className="w-full text-left border-collapse"
      data-testid="recipes-table-desktop"
    >
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2">Title</th>
          <th className="px-4 py-2">Servings</th>
          <th className="px-4 py-2">Favourites</th>
          <th className="px-4 py-2">Rating</th>
          <th className="px-4 py-2">Photo</th>
          <th className="px-4 py-2">Is visible</th>
          <th className="px-4 py-2">Delete</th>
        </tr>
      </thead>
      <tbody>
        {recipes.map((recipe) => (
          <tr key={recipe.id} className="border-t text-left">
            <td className="px-4 py-2">
              <Link
                href={`/details/${recipe.id}`}
                className="inline-flex items-center gap-1 cursor-pointer transition duration-300 ease-in-out hover:shadow-md hover:bg-blue-200 px-2 py-1 rounded-md"
              >
                {recipe.title} <FaMagnifyingGlass className="text-base" />
              </Link>
            </td>
            <td className="px-4 py-2">{recipe.servings}</td>
            <td className="px-4 py-2">{recipe.favouritesCounter}</td>
            <td className="px-4 py-2">
              {recipe.rating && (
                <span>
                  {recipe.rating.average} ({recipe.rating.count} ratings)
                </span>
              )}
            </td>
            <td className="px-4 py-2">
              <Image
                src={photoSrc(recipe.id ?? "", recipe.photo as string)}
                alt={recipe.title}
                className="w-16 h-16 object-cover rounded transition duration-500 ease-in-out transform hover:scale-125 hover:rotate-1 hover:shadow-xl hover:z-10"
                width={64}
                height={64}
              />
            </td>
            <td className="px-4 py-2 text-center">
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
            </td>
            <td className="px-4 py-2">
              <button
                onClick={() => deleteRecipe(recipe.id)}
                className="p-2 text-red-600 hover:text-red-800 rounded cursor-pointer"
              >
                <MdDeleteForever className="text-3xl" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
