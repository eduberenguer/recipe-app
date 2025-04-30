import { sendMessage } from "@/server/userInteractions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fromUserId, toUserId, content } = body;

    if (!fromUserId || !toUserId || !content) {
      return NextResponse.json(
        { success: false, error: "Missing parameters" },
        { status: 400 }
      );
    }

    const result = await sendMessage(fromUserId, toUserId, content);

    return NextResponse.json({ success: true, message: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
