import { addRecipeRating } from "@/server/userInteractions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const newRecipeRating = await req.json();

    const result = await addRecipeRating(newRecipeRating);

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
