import { NextResponse } from "next/server";
import { retrieveAllRecipes } from "@/server/recipes";

export async function GET() {
  try {
    const result = await retrieveAllRecipes();

    return NextResponse.json(result, {
      status: result ? 200 : 400,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
