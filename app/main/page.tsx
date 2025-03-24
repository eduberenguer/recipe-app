"use client";
import { useContext, useEffect } from "react";
import Image from "next/image";
import { AuthContext, RecipesContext } from "../context/context";
import checkOwnerRecipe from "../utils/check.owner.recipe";
import Link from "next/link";
import photoSrc from "../utils/photoSrc";

export default function Main() {
  const contextAuth = useContext(AuthContext);
  const contextRecipes = useContext(RecipesContext);

  useEffect(() => {
    contextRecipes?.retrieveRecipesList();
  }, []);

  return (
    <div>
      <h2>MAIN</h2>
      {contextRecipes?.stateAllRecipes.map((recipe, key) => {
        return (
          <div key={key}>
            <Link href={`/details/${recipe.id}`}>
              <p>{recipe.title}</p> <p>{`${recipe.servings} servings`}</p>
              <Image
                src={photoSrc(recipe.id, recipe.photo as string)}
                alt={recipe.title}
                width={300}
                height={200}
              />
            </Link>
            {contextAuth?.user?.id &&
              checkOwnerRecipe(contextAuth.user.id, recipe.owner) && (
                <button onClick={() => contextRecipes?.deleteRecipe(recipe.id)}>
                  DELETE
                </button>
              )}
          </div>
        );
      })}
    </div>
  );
}
