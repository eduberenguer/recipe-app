import { NextResponse } from "next/server";
import { addFavouriteRecipe } from "@/server/userInteractions";

export async function POST(req: Request): Promise<Response> {
  try {
    const newAddFavourite = await req.json();
    const result = await addFavouriteRecipe(newAddFavourite);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
