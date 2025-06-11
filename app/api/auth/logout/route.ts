import { NextResponse } from "next/server";

export async function POST(): Promise<Response> {
  return NextResponse.json(
    { success: true, message: "Logged out" },
    { status: 200 }
  );
}
