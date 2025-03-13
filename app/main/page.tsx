"use client";
import { useContext, useEffect } from "react";
import { RecipesContext } from "../context/context";

export default function Main() {
  const contextRecipes = useContext(RecipesContext);

  useEffect(() => {
    contextRecipes?.retrieveRecipesList();
  }, []);

  return (
    <div>
      <h2>MAIN</h2>
      {contextRecipes?.stateRecipes.map((recipe, key) => {
        return <p key={key}>{recipe.title}</p>;
      })}
    </div>
  );
}
