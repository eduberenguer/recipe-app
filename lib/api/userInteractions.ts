import {
  AddRecipeRating,
  ToggleFavouriteRecipe,
} from "@/types/userInteractions";

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

export async function removeRecipeApi(newAddFavourite: ToggleFavouriteRecipe) {
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

export async function retrieveRecipeRatingsApi(recipeId: string) {
  const res = await fetch(
    `/api/userInteractions/retrieveRecipeRatings/${recipeId}`,
    {
      method: "GET",
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error");
  }

  return await res.json();
}

export async function addRecipeRatingApi(addRecipeRating: AddRecipeRating) {
  const res = await fetch(`/api/userInteractions/addRecipeRating/`, {
    method: "POST",
    body: JSON.stringify(addRecipeRating),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error");
  }

  return await res.json();
}

export async function checkUserHasRatedApi(userId: string, recipeId: string) {
  const res = await fetch(
    `/api/userInteractions/hasUserRatedRecipe?userId=${userId}&recipeId=${recipeId}`
  );
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Error checking rating status");
  }
  return await res.json();
}

export async function sendMessageApi(
  fromUserId: string,
  toUserId: string,
  content: string
) {
  const response = await fetch("/api/userInteractions/sendMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fromUserId, toUserId, content }),
  });

  const result = await response.json();

  if (!response.ok) throw new Error(result.error || "Failed to send message");

  return result.message;
}

export async function sendMessageAiApi(content: string) {
  const response = await fetch("/api/userInteractions/aiChat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  const result = await response.json();

  if (!response.ok) throw new Error(result.error || "Failed to send message");

  return result.message;
}
