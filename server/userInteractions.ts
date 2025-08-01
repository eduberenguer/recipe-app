"use server";
import pb from "@/lib/pocketbase";
import {
  ToggleFavouriteRecipe,
  AddRecipeRating,
  MessageRecord,
  UserInteractionsServerResponse,
  BaseMessage,
  CommentsRecipe,
  NewCommentRecipe,
  ToogleLikeCommentRecipe,
} from "@/types/userInteractions";
import { Recipe } from "@/types/recipes";
import { User, UserWithName } from "@/types/auth";

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
): Promise<UserInteractionsServerResponse> {
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

    return { success: true };
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

export async function addRecipeRating(
  newRecipeRating: AddRecipeRating
): Promise<UserInteractionsServerResponse> {
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

    await pb.collection("ratings").create(newRecipeRating);

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Something wrong" };
  }
}

export async function hasUserRatedRecipe(
  userId: string,
  recipeId: string
): Promise<UserInteractionsServerResponse> {
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
): Promise<BaseMessage> {
  const message = await pb.collection("messages").create({
    from: fromUserId,
    to: toUserId,
    content,
  });

  const sentMessage: BaseMessage = {
    id: message.id,
    fromUserId: message.from,
    toUserId: message.to,
    content: message.content,
    created: message.created,
  };

  return sentMessage;
}

export async function searchUsersByUsername(
  query: string
): Promise<UserWithName[]> {
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
): Promise<MessageRecord[]> {
  const result = await pb.collection("messages").getFullList<MessageRecord>({
    filter: `(
      (from="${fromUserId}" && to="${toUserId}") ||
      (from="${toUserId}" && to="${fromUserId}")
    )`,
    expand: "from",
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

export async function getUserLikedComments(
  userId: string,
  recipeId: string
): Promise<string[]> {
  const comments = await pb.collection("comments").getFullList(undefined, {
    filter: `recipeId="${recipeId}"`,
    fields: "id",
  });

  const commentIds = comments.map((c) => c.id);

  const likes = await pb.collection("comment_likes").getFullList(undefined, {
    filter: `userId="${userId}" && commentId in ("${commentIds.join('","')}")`,
  });

  return likes.map((like) => like.commentId);
}

export async function retrieveCommentsRecipe(
  recipeId: string
): Promise<CommentsRecipe[]> {
  const comments = await pb.collection("comments").getFullList<CommentsRecipe>({
    filter: `recipeId = "${recipeId}"`,
    expand: "userId",
  });

  return comments;
}

export async function createNewCommentRecipe(
  newCommentRecipe: NewCommentRecipe
): Promise<UserInteractionsServerResponse> {
  try {
    await pb.collection("comments").create(newCommentRecipe);

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Something wrong" };
  }
}

export async function toggleLikeCommentRecipe(
  data: ToogleLikeCommentRecipe
): Promise<UserInteractionsServerResponse> {
  try {
    const comment = await pb.collection("comments").getOne(data.commentId);
    const existingLikes = await pb.collection("comment_likes").getFullList(1, {
      filter: `userId="${data.userId}" && commentId="${data.commentId}"`,
    });

    if (existingLikes.length > 0) {
      await pb.collection("comment_likes").delete(existingLikes[0].id);

      await pb.collection("comments").update(data.commentId, {
        commentLikes: Math.max(0, (comment.commentLikes || 1) - 1),
      });
    } else {
      await pb.collection("comment_likes").create({
        userId: data.userId,
        commentId: data.commentId,
      });

      await pb.collection("comments").update(data.commentId, {
        commentLikes: (comment.commentLikes || 0) + 1,
      });
    }

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Something went wrong" };
  }
}

export async function getUserLikedCommentIds(
  userId: string
): Promise<string[]> {
  const likes = await pb.collection("comment_likes").getFullList({
    filter: `userId = "${userId}"`,
  });

  return likes.map((like) => like.commentId);
}

export async function retrieveCommentCountByRecipeId(
  recipeId: string
): Promise<number> {
  try {
    const result = await pb.collection("comments").getList(1, 1, {
      filter: `recipeId = "${recipeId}"`,
    });

    return result.totalItems;
  } catch (error) {
    console.error("Error retrieving comment count:", error);
    return 0;
  }
}
