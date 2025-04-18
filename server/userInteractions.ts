"use server";
import pb from "@/lib/pocketbase";
import { ToggleFavouriteRecipe } from "@/types/userInteractions";
import { Recipe } from "@/types/recipes";

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
    throw new Error(`Error fetching favourites: ${error}`);
  }
}

export async function addFavouriteRecipe(
  newAddFavouriteRecipe: ToggleFavouriteRecipe
) {
  try {
    const result = await pb
      .collection("favourites")
      .create(newAddFavouriteRecipe);

    if (result) {
      const recipe = await pb
        .collection("recipes")
        .getOne(newAddFavouriteRecipe.recipeId);

      const updatedFavouritesCounter = (recipe.favouritesCounter || 0) + 1;

      await pb.collection("recipes").update(newAddFavouriteRecipe.recipeId, {
        favouritesCounter: updatedFavouritesCounter,
      });
    }

    return { success: true, result };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Something wrong" };
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

    const result = await Promise.all(
      favourites.map((fav) => pb.collection("favourites").delete(fav.id))
    );

    if (result) {
      const recipe = await pb.collection("recipes").getOne(recipeId);

      const updatedFavouritesCounter = (recipe.favouritesCounter || 0) - 1;

      await pb.collection("recipes").update(recipeId, {
        favouritesCounter: updatedFavouritesCounter,
      });
    }

    return true;
  } catch (error) {
    throw new Error(`Error removing favourite: ${error}`);
  }
}
