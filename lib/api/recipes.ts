export async function createNewRecipesApi(recipe: FormData) {
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

export async function retrieveAllRecipesApi() {
  const res = await fetch("/api/recipes/retrieveRecipes");

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error desconocido");
  }

  return res.json();
}

export async function deleteRecipeApi(recipeId: string) {
  const res = await fetch(`/api/recipes/deletedRecipes/${recipeId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error desconocido");
  }

  return true;
}

export async function retrieveRecipeByIdApi(recipeId: string) {
  const res = await fetch(`/api/recipes/retrieveRecipe/${recipeId}`);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error desconocido");
  }

  return res.json();
}
