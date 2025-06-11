import { NextResponse } from "next/server";
import { retrieveFavourites } from "@/server/userInteractions";

export async function GET(
  request: Request,
  { params }: { params: { id?: string } }
): Promise<Response> {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const result = await retrieveFavourites(id);

    return NextResponse.json(result, {
      status: result ? 200 : 400,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
