"use server";
import pb from "@/lib/pocketbase";
import { Recipe } from "@/types";

export async function retrieveFavourites(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const userRecord = await pb
      .collection("users")
      .getFirstListItem(`id = "${userId}"`);

    if (!userRecord) {
      throw new Error("User not found");
    }

    const favouriteRecipeIds = userRecord.favourites || [];

    if (!Array.isArray(favouriteRecipeIds)) {
      throw new Error("Invalid favourites format");
    }

    let favouriteRecipes: Recipe[] = [];

    if (favouriteRecipeIds.length > 0) {
      try {
        const filter = favouriteRecipeIds
          .map((id: string) => `id="${id}"`)
          .join(" || ");

        favouriteRecipes = await pb.collection("recipes").getFullList({
          filter,
        });
      } catch (error) {
        console.error("Error fetching recipes:", error);
        throw new Error("Failed to fetch favourite recipes");
      }
    }

    return favouriteRecipes;
  } catch (error) {
    console.error("Error fetching favourites:", error);
    throw new Error("Error fetching favourites");
  }
}
