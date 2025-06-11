import { loginUser } from "@/server/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
  try {
    const { email, password } = await req.json();
    const result = await loginUser(email, password);

    return NextResponse.json(result, {
      status: result.success ? 201 : 400,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Something wrong",
      },
      { status: 500 }
    );
  }
}
