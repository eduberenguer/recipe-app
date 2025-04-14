// components/RecipesTable.tsx
"use client";
import Image from "next/image";
import { Recipe } from "@/types/recipes";
import photoSrc from "@/app/utils/photoSrc";

export default function RecipesTable({ recipes }: { recipes: Recipe[] }) {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2">Title</th>
          <th className="px-4 py-2">Servings</th>
          <th className="px-4 py-2">Favourites</th>
          <th className="px-4 py-2">Photo</th>
        </tr>
      </thead>
      <tbody>
        {recipes.map((recipe) => (
          <tr key={recipe.id} className="border-t">
            <td className="px-4 py-2">{recipe.title}</td>
            <td className="px-4 py-2">{recipe.description}</td>
            <td className="px-4 py-2">{recipe.favouritesCounter}</td>
            <td className="px-4 py-2">
              <Image
                src={photoSrc(recipe.id ?? "", recipe.photo as string)}
                alt={recipe.title}
                className="w-16 h-16 object-cover rounded"
                width={64}
                height={64}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
