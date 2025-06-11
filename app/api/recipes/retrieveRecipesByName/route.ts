import { retrieveRecipesByFilterName } from "@/server/recipes";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<Response> {
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
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: "Database error",
      },
      { status: 500 }
    );
  }
}
