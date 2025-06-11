import { deleteRecipeById } from "@/server/recipes";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id?: string } }
): Promise<Response> {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await deleteRecipeById(id);

    return NextResponse.json({ success: true, message: "Recipe deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Error deleting recipe" },
      { status: 500 }
    );
  }
}
