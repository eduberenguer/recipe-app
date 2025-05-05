"use server";
import pb from "@/lib/pocketbase";
import {
  ToggleFavouriteRecipe,
  AddRecipeRating,
} from "@/types/userInteractions";
import { Recipe } from "@/types/recipes";
import { User } from "@/types/auth";

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

    const recipesWithRatings = await Promise.all(
      favouriteRecipes.map(async (recipe) => {
        const rating = await retrieveRecipeRatings(recipe.id);
        return {
          ...recipe,
          rating,
        };
      })
    );

    return recipesWithRatings;
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

export async function retrieveRecipeRatings(
  recipeId: string
): Promise<{ average: number; count: number }> {
  try {
    const result = await pb.collection("ratings").getFullList({
      filter: `recipeId="${recipeId}"`,
      $autoCancel: false,
    });

    if (!result || result.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = result.reduce((acc, curr) => acc + curr.rating, 0);
    const average = sum / result.length;

    return {
      average: parseFloat(average.toFixed(1)),
      count: result.length,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error");
  }
}

export async function addRecipeRating(newRecipeRating: AddRecipeRating) {
  try {
    const userExists = await pb
      .collection("users")
      .getOne(newRecipeRating.userId);
    const recipeExists = await pb
      .collection("recipes")
      .getOne(newRecipeRating.recipeId);

    if (!userExists) {
      throw new Error("User not found");
    }
    if (!recipeExists) {
      throw new Error("Recipe not found");
    }

    const result = await pb.collection("ratings").create(newRecipeRating);

    return { success: true, result };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Something wrong" };
  }
}

export async function hasUserRatedRecipe(userId: string, recipeId: string) {
  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const records = await pb.collection("ratings").getFullList({
      filter: `userId = "${userId.trim()}" && recipeId = "${recipeId.trim()}"`,
    });

    return { success: true, alreadyRated: records.length > 0 };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Something went wrong" };
  }
}

export async function sendMessage(
  fromUserId: string,
  toUserId: string,
  content: string
) {
  const message = await pb.collection("messages").create({
    from: fromUserId,
    to: toUserId,
    content,
  });

  return message;
}

export async function searchUsersByUsername(query: string) {
  const results = await pb.collection("users").getList(1, 10, {
    filter: `name ~ "${query}"`,
  });

  return results.items.map((user) => ({
    id: user.id,
    name: user.name,
  }));
}

export async function getMessagesBetweenUsers(
  fromUserId: string,
  toUserId: string
) {
  const result = await pb.collection("messages").getFullList({
    filter: `(
      (from="${fromUserId}" && to="${toUserId}") ||
      (from="${toUserId}" && to="${fromUserId}")
    )`,
    sort: "created",
  });

  return result;
}

export async function getConversationsForUser(userId: string): Promise<User[]> {
  const result = await pb.collection("messages").getFullList({
    filter: `from = "${userId}" || to = "${userId}"`,
    expand: "from,to",
  });

  const userMap = new Map<string, User>();

  for (const msg of result) {
    const other =
      msg.expand && (msg.from === userId ? msg.expand.to : msg.expand.from);
    if (other && !userMap.has(other.id)) {
      userMap.set(other.id, {
        id: other.id,
        name: other.name,
        email: other.email,
        created: other.created,
        updated: other.updated,
      });
    }
  }

  return Array.from(userMap.values());
}
