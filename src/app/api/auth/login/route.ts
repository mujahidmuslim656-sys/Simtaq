import { NextRequest, NextResponse } from "next/server";
import { validateTenantLogin } from "@/services/tenantService";

// Rate limiting storage (in-memory, use Redis in production)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt || now > attempt.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }

  if (attempt.count >= MAX_ATTEMPTS) {
    return false;
  }

  attempt.count++;
  return true;
}

// POST - Login tenant (TPQ)
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: "Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit." },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Format email tidak valid" },
        { status: 400 }
      );
    }

    // Validasi login sebagai tenant (password sudah di-hash di client)
    const tenant = await validateTenantLogin(email, password);

    if (tenant) {
      const response = NextResponse.json({
        success: true,
        message: "Login berhasil",
        data: {
          tenant_id: tenant.Tenant_ID,
          nama_tpq: tenant.Nama_TPQ,
          email: tenant.Email,
          paket: tenant.Paket,
          max_santri: tenant.Max_Santri,
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
      response.cookies.set("tenant_id", tenant.Tenant_ID, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      // Set cookie tenant_name (for branding)
      response.cookies.set("tenant_name", tenant.Nama_TPQ, {
        httpOnly: false, // Allow client-side access for branding
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
