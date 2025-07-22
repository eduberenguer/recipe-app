import { Recipe } from "@/types/recipes";

export async function createNewRecipesApi(recipe: FormData): Promise<Recipe> {
  const res = await fetch("/api/recipes/create", {
    method: "POST",
    body: recipe,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error desconocido");
  }

  return res.json();
}

export async function retrieveAllRecipesApi(): Promise<Recipe[]> {
  const res = await fetch("/api/recipes/retrieveRecipes");

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error desconocido");
  }

  return res.json();
}

export async function toggleVisibleRecipeApi(
  recipeId: string,
  newIsVisible: boolean
): Promise<string> {
  const res = await fetch(`/api/recipes/toggleVisibleRecipe/${recipeId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isVisible: newIsVisible }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error");
  }

  return recipeId;
}

export async function deleteRecipeApi(recipeId: string): Promise<string> {
  const res = await fetch(`/api/recipes/deletedRecipes/${recipeId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error");
  }

  return recipeId;
}

export async function retrieveRecipeByIdApi(recipeId: string): Promise<Recipe> {
  const res = await fetch(`/api/recipes/retrieveRecipe/${recipeId}`);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error");
  }

  return res.json();
}

export async function retrieveRecipesByFilterNameApi(
  filter: string
): Promise<Recipe[]> {
  const res = await fetch(`/api/recipes/retrieveRecipesByName?title=${filter}`);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error");
  }

  return res.json();
}

export async function retrieveRecipesByUserIdApi(
  userId: string
): Promise<Recipe[]> {
  const res = await fetch(
    `/api/recipes/retrieveRecipesByUserId?owner=${userId}`
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error");
  }
  return res.json();
}

export async function retrieveRecipeIngredientsApi(): Promise<Recipe[]> {
  const res = await fetch(`/api/recipes/retrieveRecipeIngredients`);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error");
  }
  return res.json();
}

export async function retrieveRecipesByIngredientsApi(
  ingredients: string[]
): Promise<Recipe[]> {
  const params = new URLSearchParams({
    ingredients: ingredients.join(","),
  });

  const res = await fetch(
    `/api/recipes/retrieveRecipesByIngredients?${params.toString()}`
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error");
  }
  return res.json();
}
