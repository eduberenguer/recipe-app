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

export async function retrieveAllRecipes() {
  const res = await fetch("/api/recipes/retrieveRecipes");

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error desconocido");
  }

  return res.json();
}
