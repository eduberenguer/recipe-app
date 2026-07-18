import { NextResponse } from "next/server";
import { fetchPexelsImageUrl } from "@/app/utils/pexelsImageUrl";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("query");

    if (!query) {
      return NextResponse.json({ error: "No query provided" }, { status: 400 });
    }

    const imageUrl = await fetchPexelsImageUrl(query);

    return NextResponse.json({ url: imageUrl }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
