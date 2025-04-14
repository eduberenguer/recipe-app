import { ToggleFavouriteRecipe } from "@/types/userInteractions/index";

export async function retrieveFavouritesApi(id: string) {
  const res = await fetch(`/api/userInteractions/retrieveFavourites/${id}`);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error");
  }

  return res.json();
}

export async function addFavouriteRecipeApi(
  newAddFavourite: ToggleFavouriteRecipe
) {
  const res = await fetch("/api/userInteractions/addFavouriteRecipe", {
    method: "POST",
    body: JSON.stringify(newAddFavourite),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error");
  }
  return res;
}

export async function addRemoveRecipeApi(
  newAddFavourite: ToggleFavouriteRecipe
) {
  const res = await fetch(
    `/api/userInteractions/removeFavouriteRecipe/${newAddFavourite.userId}/${newAddFavourite.recipeId}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error");
  }

  return res.json();
}
