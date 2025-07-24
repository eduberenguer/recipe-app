import { NextResponse } from "next/server";
import { createNewCommentRecipe } from "@/server/userInteractions";

export async function POST(req: Request): Promise<Response> {
  try {
    const newCommentRecipe = await req.json();
    const result = await createNewCommentRecipe(newCommentRecipe);

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
