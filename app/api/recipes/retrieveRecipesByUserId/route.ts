import { retrieveRecipesByUserId } from "@/server/recipes";
import { retrieveRecipeRatings } from "@/server/userInteractions";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("owner");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await retrieveRecipesByUserId(userId);

    if (!result || !Array.isArray(result)) {
      return NextResponse.json(null, { status: 400 });
    }

    const recipesWithRatings = await Promise.all(
      result.map(async (recipe) => {
        const rating = await retrieveRecipeRatings(recipe.id);
        return {
          ...recipe,
          rating,
        };
      })
    );

    return NextResponse.json(recipesWithRatings, {
      status: result ? 200 : 400,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        error: `Error retrieving recipes by userId: ${error}`,
      },
      { status: 500 }
    );
  }
}
