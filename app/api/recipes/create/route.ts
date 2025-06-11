import { NextResponse } from "next/server";
import { createRecipe } from "@/server/recipes";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const photo = formData.get("photo");

    const entries = Array.from(formData.entries()).filter(
      ([key]) => key !== "photo"
    );

    const recipe = Object.fromEntries(entries);

    if (typeof recipe.ingredients === "string") {
      recipe.ingredients = JSON.parse(recipe.ingredients);
    }

    if (photo) {
      recipe.photo = photo;
    }

    const result = await createRecipe(recipe);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
