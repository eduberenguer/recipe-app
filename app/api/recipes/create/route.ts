import { NextResponse } from "next/server";
import { createRecipe } from "@/server/recipes";

export async function POST(req: Request) {
  console.log("req", req);
  try {
    const formData = await req.formData();
    console.log("req.formData resolved:", formData); // Muestra el objeto formData

    const recipe = Object.fromEntries(formData.entries());
    recipe.ingredients = JSON.parse(recipe.ingredients as string);
    console.log("Processed recipe:", recipe); // Verifica el objeto procesado

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
