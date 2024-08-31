import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("session_id");

  if (sessionId && isValidSessionId(sessionId)) {
    return NextResponse.redirect(new URL("/order", request.url));
  }

  return NextResponse.json({ error: "Invalid session_id" }, { status: 400 });
}

function isValidSessionId(sessionId: string): boolean {
  return sessionId.startsWith("cs_test_");
}

//http://localhost:3000/order?session_id=cs_test_b1Qm7aVvvf4tHmGMuhNn8dP7WCAIDb0DCaRsEOfLH6nnLCmSnHLzEag8Qs
