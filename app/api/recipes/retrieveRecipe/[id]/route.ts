import { retrieveRecipeById } from "@/server/recipes";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id?: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const result = await retrieveRecipeById(id);

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Receta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Error eliminando la receta" },
      { status: 500 }
    );
  }
}
