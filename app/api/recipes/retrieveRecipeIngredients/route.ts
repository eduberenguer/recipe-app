import { NextResponse } from "next/server";
import { retrieveRecipeIngredients } from "@/server/recipes";

export async function GET(): Promise<Response> {
  try {
    const result = await retrieveRecipeIngredients();

    return NextResponse.json(result, {
      status: result ? 200 : 400,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: "Database error",
      },
      { status: 500 }
    );
  }
}
