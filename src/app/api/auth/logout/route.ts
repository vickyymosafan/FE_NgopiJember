import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "ngopi_token";

export async function POST() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  return NextResponse.json({ success: true, message: "Logout berhasil." });
}