import { NextResponse } from "next/server";
import { retrieveCommentCountByRecipeId } from "@/server/userInteractions";

export async function GET(
  request: Request,
  { params }: { params: { recipeId?: string } }
): Promise<Response> {
  try {
    const { recipeId } = await params;

    if (!recipeId) {
      return NextResponse.json({ error: "RecipeId required" }, { status: 400 });
    }

    const result = await retrieveCommentCountByRecipeId(recipeId);

    return NextResponse.json(result, {
      status: result ? 200 : 400,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
