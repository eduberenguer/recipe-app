"use server";
import pb from "@/lib/pocketbase";
import { Recipe } from "@/types/recipes";
import { retrieveRecipeRatings } from "./userInteractions";

export async function createRecipe(recipe: Partial<Recipe>) {
  try {
    recipe.isVisible = true;
    const recipeData = await pb.collection("recipes").create(recipe);

    return { success: true, recipeData };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error");
  }
}

export async function retrieveAllRecipes(): Promise<
  (Partial<Recipe> & { rating: { average: number; count: number } })[]
> {
  try {
    const data = await pb.collection("recipes").getFullList({
      sort: "-created",
      $autoCancel: false,
      filter: `isVisible = true`,
    });

    const recipesWithRatings = await Promise.all(
      data.map(async (recipe) => {
        const rating = await retrieveRecipeRatings(recipe.id);
        return {
          ...recipe,
          rating,
        };
      })
    );

    return recipesWithRatings;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error");
  }
}

export async function deleteOrphanFavourites() {
  try {
    const orphanFavourites = await pb.collection("favourites").getFullList({
      filter: `recipeId = null`,
    });

    await Promise.all(
      orphanFavourites.map(async (fav) => {
        await pb.collection("favourites").delete(fav.id);
      })
    );

    console.log("Orphan favourites deleted successfully.");
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Something wrong" };
  }
}

export async function updateRecipe(id: string, data: Partial<Recipe>) {
  try {
    const updated = await pb.collection("recipes").update(id, data);
    return updated;
  } catch (error) {
    throw new Error(`Error updating recipe: ${(error as Error).message}`);
  }
}

export async function deleteRecipeById(recipeId: string): Promise<boolean> {
  try {
    const data = await pb.collection("recipes").delete(recipeId);

    if (data) deleteOrphanFavourites();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error");
  }
}

export async function incrementRecipeViews(recipeId: string) {
  try {
    const recipe = await pb.collection("recipes").getOne(recipeId);
    await pb.collection("recipes").update(recipeId, {
      views: (recipe.views ?? 0) + 1,
    });
  } catch (error) {
    console.error("Error incrementing views:", error);
  }
}

export async function retrieveRecipeById(
  recipe: string
): Promise<Partial<Recipe>> {
  try {
    const data = await pb.collection("recipes").getOne(recipe);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error");
  }
}

export async function retrieveRecipesByFilterName(
  filter: string
): Promise<Recipe[]> {
  try {
    const data = await pb.collection("recipes").getList(1, 50, {
      filter: `title ~ "${filter}"`,
    });

    return data.items as unknown as Recipe[];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error");
  }
}

export async function retrieveRecipesByUserId(
  userId: string
): Promise<Recipe[]> {
  try {
    const data = await pb.collection("recipes").getList(1, 50, {
      filter: `owner = "${userId}"`,
    });

    return data.items as unknown as Recipe[];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error");
  }
}
