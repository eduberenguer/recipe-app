import { deleteRecipeById } from "@/server/recipes";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id?: string } }
) {
  try {
    if (!params || !params.id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const { id } = params;

    deleteRecipeById(id);

    return NextResponse.json({ success: true, message: "Receta eliminada" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Error eliminando la receta" },
      { status: 500 }
    );
  }
}
