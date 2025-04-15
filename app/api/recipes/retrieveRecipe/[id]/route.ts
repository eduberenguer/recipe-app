import { retrieveRecipeById } from "@/server/recipes";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id?: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const result = await retrieveRecipeById(id);

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Recipe not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
