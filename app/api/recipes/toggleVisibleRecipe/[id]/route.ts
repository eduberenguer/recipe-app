import { NextRequest, NextResponse } from "next/server";
import { updateRecipe } from "@/server/recipes";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const { id } = await params;
    const { isVisible } = await req.json();
    const result = await updateRecipe(id, { isVisible });

    return NextResponse.json({ success: true, recipe: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
