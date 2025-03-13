"use server";
import pb from "@/lib/pocketbase";
import { Recipe } from "@/types";

export async function createRecipe(recipe: Partial<Recipe>) {
  try {
    const user = await pb.collection("recipes").create(recipe);

    return { success: true, user };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Ocurrió un error desconocido");
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
    throw new Error("Ocurrió un error desconocido");
  }
}

export async function deleteRecipeById(recipeId: string): Promise<boolean> {
  try {
    const data = await pb.collection("recipes").delete(recipeId);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Ocurrió un error desconocido");
  }
}
