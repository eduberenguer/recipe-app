// components/RecipesListMobile.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { Recipe } from "@/types/recipes";
import photoSrc from "@/app/utils/photoSrc";
import { FaMagnifyingGlass } from "react-icons/fa6";

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
        </div>
      ))}
    </div>
  );
}
