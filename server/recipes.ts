"use server";
import pb from "@/lib/pocketbase";
import { Recipe } from "@/types/recipes/index";

export async function createRecipe(recipe: Partial<Recipe>) {
  try {
    const user = await pb.collection("recipes").create(recipe);

    return { success: true, user };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error");
  }
}

export async function retrieveAllRecipes(): Promise<Partial<Recipe>[]> {
  try {
    const data = await pb.collection("recipes").getFullList({
      sort: "title",
    });

    return data;
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
    console.error("Error deleting orphan favourites:", error);
    throw new Error("Error deleting orphan favourites");
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
