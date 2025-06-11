import { removeFavourite } from "@/server/userInteractions";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { userId?: string; recipeId?: string } }
): Promise<Response> {
  try {
    const { userId, recipeId } = await params;

    if (!userId || !recipeId) {
      return NextResponse.json({ error: "Missins fields" }, { status: 400 });
    }

    await removeFavourite(userId, recipeId);

    return NextResponse.json({ success: true, message: "Favourite removed" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Error removing favourite: ${error}` },
      { status: 500 }
    );
  }
}
