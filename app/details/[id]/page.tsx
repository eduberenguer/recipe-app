"use client";
import { useContext, useEffect } from "react";
import Image from "next/image";
import { RecipesContext } from "../../context/context";
import { useParams } from "next/navigation";
import photoSrc from "@/app/utils/photoSrc";

export default function Details() {
  const { id } = useParams();
  const recipes = useContext(RecipesContext);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (typeof id === "string") {
        await recipes?.retrieveRecipe(id);
      }
    };

    fetchRecipe();
  }, [id]);

  return (
    <div>
      <h1>Details</h1>
      {recipes?.stateRecipe ? (
        <div>
          <div>
            <h2>{recipes.stateRecipe.title}</h2>
            <Image
              src={photoSrc(
                recipes.stateRecipe.id,
                recipes.stateRecipe.photo as string
              )}
              alt={recipes.stateRecipe.title}
              width={300}
              height={200}
            />
            {recipes.stateRecipe.ingredients.map((ingredient, index) => {
              return (
                <div key={index}>
                  <p>{ingredient.name}</p>
                  <p>{ingredient.quantity}</p>
                </div>
              );
            })}
          </div>
          <p>{recipes.stateRecipe.description}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
