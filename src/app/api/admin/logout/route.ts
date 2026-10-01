import { NextResponse } from "next/server";

// POST - Admin logout
export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logout berhasil",
  });

  // Clear cookies
  response.cookies.set("isAdmin", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("isLoggedIn", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
