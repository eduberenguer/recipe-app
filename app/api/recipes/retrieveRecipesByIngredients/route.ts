import { NextResponse } from "next/server";
import { retrieveRecipesByIngredients } from "@/server/recipes";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url!);
    const ingredientsParam = url.searchParams.get("ingredients");
    if (!ingredientsParam) {
      return NextResponse.json(
        { error: "No ingredients provided" },
        { status: 400 }
      );
    }
    const ingredients = ingredientsParam
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    const recipes = await retrieveRecipesByIngredients(ingredients);

    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
