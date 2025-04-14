// components/RecipesListMobile.tsx
"use client";
import Image from "next/image";
import { Recipe } from "@/types/recipes";
import photoSrc from "@/app/utils/photoSrc";

export default function RecipesListMobile({ recipes }: { recipes: Recipe[] }) {
  return (
    <div className="flex flex-col gap-6">
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
          <div className="p-4">
            <h3 className="text-lg font-semibold">{recipe.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Servings: {recipe.servings}
            </p>
            <p className="text-sm text-gray-600">
              Favourites: {recipe.favouritesCounter}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
