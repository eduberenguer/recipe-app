import { retrieveRecipesByUserId } from "@/server/recipes";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("owner");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await retrieveRecipesByUserId(userId);

    return NextResponse.json(result, {
      status: result ? 200 : 400,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          `Error retrieving recipes by userId: ${error}` || "Database error",
      },
      { status: 500 }
    );
  }
}
