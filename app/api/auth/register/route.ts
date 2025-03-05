import { registerUser } from "@/server/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const result = await registerUser(name, email, password);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Error desconocido",
      },
      { status: 500 }
    );
  }
}
