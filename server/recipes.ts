"use server";
import pb from "@/lib/pocketbase";
import { Recipe } from "@/types";

export async function createRecipe(recipe: Partial<Recipe>) {
  try {
    const user = await pb.collection("recipes").create(recipe);

    return { success: true, user };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Ocurrió un error desconocido" };
  }
}
