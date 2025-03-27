import { NextResponse } from "next/server";
import { createRecipe } from "@/server/recipes";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const recipe = Object.fromEntries(formData.entries());
    recipe.ingredients = JSON.parse(recipe.ingredients as string);

    const result = await createRecipe(recipe);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Unkwown error",
      },
      { status: 500 }
    );
  }
}
