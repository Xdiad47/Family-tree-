import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CREDITS_COOKIE_KEY, FREE_CREDITS_TOTAL } from "@/constants/providers";

const readUsedCredits = async (): Promise<number> => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CREDITS_COOKIE_KEY)?.value ?? "0";
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed < 0) return 0;
  return Math.min(parsed, FREE_CREDITS_TOTAL);
};

const withPayload = async (used: number): Promise<NextResponse> => {
  const clampedUsed = Math.min(Math.max(0, used), FREE_CREDITS_TOTAL);
  const response = NextResponse.json({
    total: FREE_CREDITS_TOTAL,
    used: clampedUsed,
    remaining: Math.max(0, FREE_CREDITS_TOTAL - clampedUsed)
  });

  response.cookies.set(CREDITS_COOKIE_KEY, String(clampedUsed), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return response;
};

export async function GET() {
  const used = await readUsedCredits();
  return withPayload(used);
}

export async function POST(request: Request) {
  const currentUsed = await readUsedCredits();
  const body = (await request.json().catch(() => ({ action: "consume" }))) as { action?: string };

  if (body.action === "consume") {
    if (currentUsed >= FREE_CREDITS_TOTAL) {
      return withPayload(FREE_CREDITS_TOTAL);
    }
    return withPayload(currentUsed + 1);
  }

  if (body.action === "reset") {
    return withPayload(0);
  }

  return withPayload(currentUsed);
}
