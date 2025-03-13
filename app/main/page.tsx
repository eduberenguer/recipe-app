"use client";
import { useContext, useEffect } from "react";
import Image from "next/image";
import { AuthContext, RecipesContext } from "../context/context";
import checkOwnerRecipe from "../utils/check.owner.recipe";

export default function Main() {
  const contextAuth = useContext(AuthContext);
  const contextRecipes = useContext(RecipesContext);

  const POCKETBASE_URL = process.env.NEXT_PUBLIC_PHOTO_URL!;

  useEffect(() => {
    contextRecipes?.retrieveRecipesList();
  }, []);

  const photoSrc = (recipeId: string, photoRecipe: string) => {
    return `${POCKETBASE_URL}/${recipeId}/${photoRecipe}`;
  };

  return (
    <div>
      <h2>MAIN</h2>
      {contextRecipes?.stateRecipes.map((recipe, key) => {
        return (
          <div key={key}>
            <p>{recipe.title}</p> <p>{`${recipe.servings} servings`}</p>
            <Image
              src={photoSrc(recipe.id, recipe.photo as string)}
              alt={recipe.title}
              width={300}
              height={200}
            />
            {contextAuth?.user?.id &&
              checkOwnerRecipe(contextAuth.user.id, recipe.owner) && (
                <button
                  onClick={() => contextRecipes?.deleteRecipeById(recipe.id)}
                >
                  DELETE
                </button>
              )}
          </div>
        );
      })}
    </div>
  );
}
