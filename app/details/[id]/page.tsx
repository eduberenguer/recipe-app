"use client";
import { useContext, useEffect } from "react";
import Image from "next/image";
import { RecipesContext } from "../../context/context";
import { useParams } from "next/navigation";
import photoSrc from "@/app/utils/photoSrc";
import CustomSpinner from "@/components/CustomSpinner";

export default function Details() {
  const { id } = useParams();
  const recipes = useContext(RecipesContext);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (typeof id === "string" && recipes) {
        recipes.clearStateRecipe?.();
        await recipes.retrieveRecipe(id);
      }
    };

    fetchRecipe();
  }, [id]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-6">Recipe Details</h1>
      {recipes?.stateRecipe ? (
        <div className="bg-white p-6 rounded-lg shadow-md flex gap-8">
          <div className="flex-shrink-0 w-2/3">
            <Image
              src={photoSrc(
                recipes.stateRecipe.id ?? "",
                recipes.stateRecipe.photo as string
              )}
              alt={recipes.stateRecipe.title || "Recipe image"}
              width={250}
              height={200}
              className="rounded-lg"
            />
            <p className="mt-4 text-gray-600">
              {recipes.stateRecipe.description}
            </p>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">
              {recipes.stateRecipe.title}
            </h2>
            <div>
              <h3 className="font-semibold text-lg mb-2">Ingredients</h3>
              <ul className="list-disc pl-6 space-y-2">
                {recipes.stateRecipe.ingredients?.map((ingredient, index) => (
                  <li key={index} className="text-gray-700">
                    <span className="font-medium">{ingredient.name}:</span>{" "}
                    {ingredient.quantity} {ingredient.unity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <CustomSpinner message={"Loading recipe details..."} />
      )}
    </div>
  );
}
