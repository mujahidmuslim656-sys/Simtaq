import { NextResponse } from "next/server";

// POST - Logout
export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logout berhasil",
    });

    // Hapus cookie dengan konfigurasi yang sama dengan saat set
    response.cookies.set("isLoggedIn", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    // Hapus cookie tenant_id
    response.cookies.set("tenant_id", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
