import { NextResponse } from "next/server";
import { toggleLikeCommentRecipe } from "@/server/userInteractions";

export async function POST(req: Request): Promise<Response> {
  try {
    const data = await req.json();
    const { userId, commentId } = data;

    if (!userId || !commentId) {
      return NextResponse.json(
        { success: false, error: "Missing parameters" },
        { status: 400 }
      );
    }

    const result = await toggleLikeCommentRecipe({ userId, commentId });

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || "Unknown error" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
