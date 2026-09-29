import { NextRequest, NextResponse } from "next/server";
import { validateTenantLogin } from "@/services/tenantService";

// POST - Login tenant (TPQ)
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Validasi login sebagai tenant
    const tenant = validateTenantLogin(email, password);

    if (tenant) {
      const response = NextResponse.json({
        success: true,
        message: "Login berhasil",
        data: {
          tenant_id: tenant.tenant_id,
          nama_tpq: tenant.nama_tpq,
          email: tenant.email,
          paket: tenant.paket,
          max_santri: tenant.max_santri,
        },
      });

      // Set cookie untuk status login tenant
      response.cookies.set("isLoggedIn", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 hari
        path: "/",
      });

      // Set cookie tenant_id
      response.cookies.set("tenant_id", tenant.tenant_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    // Fallback ke admin login (untuk backward compatibility)
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (email === adminUsername && password === adminPassword) {
      const response = NextResponse.json({
        success: true,
        message: "Login berhasil sebagai admin",
        data: { username: adminUsername, role: "admin" },
      });

      response.cookies.set("isLoggedIn", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Email atau password salah" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
