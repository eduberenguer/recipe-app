"use server";
import pb from "@/lib/pocketbase";
import { Recipe, RecipeServerResponse } from "@/types/recipes";
import { retrieveRecipeRatings } from "./userInteractions";

export async function createRecipe(
  recipe: Partial<Recipe>
): Promise<RecipeServerResponse> {
  try {
    recipe.isVisible = true;
    const recipeData = await pb.collection("recipes").create(recipe);

    const newRecipe: Recipe = {
      id: recipeData.id,
      owner: recipeData.owner,
      title: recipeData.title,
      servings: recipeData.servings,
      ingredients: recipeData.ingredients,
      photo: recipeData.photo,
      favouritesCounter: recipeData.favouritesCounter,
      description: recipeData.description,
      views: recipeData.views,
      isVisible: recipeData.isVisible,
      created: recipeData.created,
      allergens: recipeData.allergens,
      duration: recipeData.duration,
      difficulty: recipeData.difficulty,
    };

    return { success: true, recipe: newRecipe };
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
      expand: "owner",
    });

    const recipesWithRatings = await Promise.all(
      data.map(async (recipe) => {
        const rating = await retrieveRecipeRatings(recipe.id);

        const owner = recipe.expand?.owner;
        const ownerName =
          typeof owner === "object" && owner !== null ? owner.name : "Unknown";

        return {
          ...recipe,
          rating,
          ownerName,
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

export async function deleteOrphanFavourites(): Promise<RecipeServerResponse> {
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

  return { success: true };
}

export async function updateRecipe(
  id: string,
  data: Partial<Recipe>
): Promise<RecipeServerResponse> {
  try {
    const updated = await pb.collection("recipes").update(id, data);

    const updatedRecipe: Recipe = {
      id: updated.id,
      owner: updated.owner,
      title: updated.title,
      servings: updated.servings,
      ingredients: updated.ingredients,
      photo: updated.photo,
      favouritesCounter: updated.favouritesCounter,
      description: updated.description,
      views: updated.views,
      isVisible: updated.isVisible,
      created: updated.created,
      allergens: updated.allergens,
      duration: updated.duration,
      difficulty: updated.difficulty,
    };

    return { success: true, recipe: updatedRecipe };
  } catch (error) {
    throw new Error(`Error updating recipe: ${(error as Error).message}`);
  }
}

export async function deleteRecipeById(recipeId: string): Promise<boolean> {
  try {
    const response = await pb.collection("recipes").delete(recipeId);

    if (response) deleteOrphanFavourites();

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error");
  }
}

export async function incrementRecipeViews(recipeId: string): Promise<void> {
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
      filter: `title ~ "${filter}" && isVisible = true`,
      expand: "owner",
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

export async function retrieveRecipeIngredients(): Promise<string[]> {
  try {
    const data = await pb.collection("recipes").getFullList({
      sort: "-created",
      $autoCancel: false,
      filter: `isVisible = true`,
    });

    const allIngredients = data
      .flatMap((recipe) => (recipe as unknown as Recipe).ingredients || [])
      .map((ingredient: { name: string }) =>
        ingredient.name?.trim().toLowerCase()
      )
      .filter(Boolean);

    const uniqueIngredients = Array.from(new Set(allIngredients));

    uniqueIngredients.sort();

    return uniqueIngredients;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error");
  }
}

export async function retrieveRecipesByIngredients(
  ingredients: string[]
): Promise<Recipe[]> {
  try {
    const data = await pb.collection("recipes").getFullList({
      filter: `isVisible = true`,
      expand: "owner",
    });

    const searchSet = new Set(ingredients.map((i) => i.trim().toLowerCase()));

    const filtered = data.filter((recipe) =>
      ((recipe as unknown as Recipe).ingredients || []).some(
        (ingredients: { name: string }) =>
          searchSet.has(ingredients.name?.trim().toLowerCase())
      )
    );

    return filtered as unknown as Recipe[];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error");
  }
}
