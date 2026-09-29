import { NextRequest, NextResponse } from "next/server";

// POST - Login admin
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validasi input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Validasi sederhana untuk MVP
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (username === adminUsername && password === adminPassword) {
      const response = NextResponse.json({
        success: true,
        message: "Login berhasil",
        data: { username },
      });

      // Set cookie untuk status login
      response.cookies.set("isLoggedIn", "true", {
        httpOnly: true, // true untuk keamanan (tidak bisa dibaca JavaScript)
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 hari
        path: "/",
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: "Username atau password salah" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
