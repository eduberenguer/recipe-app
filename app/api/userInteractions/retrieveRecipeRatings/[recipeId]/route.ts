import { retrieveRecipeRatings } from "@/server/userInteractions";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { recipeId?: string } }
): Promise<Response> {
  try {
    const { recipeId } = await params;

    if (!recipeId) {
      return NextResponse.json(
        { error: "RecipeID is required" },
        { status: 400 }
      );
    }

    const result = await retrieveRecipeRatings(recipeId);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
