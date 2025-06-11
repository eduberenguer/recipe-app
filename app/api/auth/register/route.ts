import { NextResponse } from "next/server";
import { registerUser } from "@/server/auth";

export async function POST(req: Request): Promise<Response> {
  try {
    const { name, email, password } = await req.json();
    const result = await registerUser(name, email, password);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Something wrong",
      },
      { status: 500 }
    );
  }
}
