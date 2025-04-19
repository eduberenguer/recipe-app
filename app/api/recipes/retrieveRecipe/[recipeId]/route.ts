import { retrieveRecipeById } from "@/server/recipes";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { recipeId?: string } }
) {
  try {
    const { recipeId } = await params;

    if (!recipeId) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const result = await retrieveRecipeById(recipeId);

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Recipe not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
