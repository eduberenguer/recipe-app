import { hasUserRatedRecipe } from "@/server/userInteractions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const recipeId = searchParams.get("recipeId");

  if (!userId || !recipeId) {
    return NextResponse.json(
      { success: false, error: "Missing params" },
      { status: 400 }
    );
  }

  const result = await hasUserRatedRecipe(userId, recipeId);
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
