import { retrieveRecipesByFilterName } from "@/server/recipes";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const title = url.searchParams.get("title");

    if (!title) {
      return NextResponse.json({ error: "Filter required" }, { status: 400 });
    }

    const result = await retrieveRecipesByFilterName(title);

    return NextResponse.json(result, {
      status: result ? 200 : 400,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Error desconocido",
      },
      { status: 500 }
    );
  }
}
