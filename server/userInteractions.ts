"use server";
import { ToggleFavouriteRecipe } from "@/types/userInteractions/index";
import pb from "@/lib/pocketbase";
import { Recipe } from "@/types/recipes/index";

export async function retrieveFavourites(userId: string): Promise<Recipe[]> {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const favouritesRecords = await pb.collection("favourites").getFullList({
      filter: `userId="${userId}"`,
      expand: "recipeId",
    });

    const favouriteRecipes: Recipe[] = favouritesRecords
      .map((record) => record.expand?.recipeId)
      .filter((recipe): recipe is Recipe => !!recipe);

    return favouriteRecipes;
  } catch (error) {
    console.error("Error fetching favourites:", error);
    throw new Error("Error fetching favourites");
  }
}

export async function addFavouriteRecipe(
  newAddFavouriteRecipe: ToggleFavouriteRecipe
) {
  try {
    const user = await pb
      .collection("favourites")
      .create(newAddFavouriteRecipe);

    return { success: true, user };
  } catch (error) {
    console.error("Error fetching favourites:", error);
    throw new Error("Error fetching favourites");
  }
}

export async function removeFavourite(
  userId: string,
  recipeId: string
): Promise<boolean> {
  try {
    const favourites = await pb.collection("favourites").getFullList({
      filter: `userId = "${userId}" && recipeId = "${recipeId}"`,
    });

    if (favourites.length === 0) {
      console.warn("Favourite not found");
      return false;
    }

    await Promise.all(
      favourites.map((fav) => pb.collection("favourites").delete(fav.id))
    );

    return true;
  } catch (error) {
    console.error("Error removing favourite:", error);
    throw new Error("Error removing favourite");
  }
}
