import { deleteRecipeById } from "@/server/recipes";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id?: string } }
) {
  try {
    if (!params || !params.id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const { id } = params;

    deleteRecipeById(id);

    return NextResponse.json({ success: true, message: "Recipe deleted" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Error deleting recipe" },
      { status: 500 }
    );
  }
}
