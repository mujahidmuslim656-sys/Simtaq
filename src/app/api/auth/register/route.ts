import { NextRequest, NextResponse } from "next/server";
import { createTenant } from "@/services/tenantService";

// POST - Registrasi TPQ baru
export async function POST(request: NextRequest) {
  try {
    const { nama_tpq, nama_penanggung_jawab, email, password, alamat } = await request.json();

    // Validasi input
    if (!nama_tpq || !nama_penanggung_jawab || !email || !password || !alamat) {
      return NextResponse.json(
        { success: false, message: "Semua field wajib diisi" },
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

    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    // Buat tenant
    const tenant = await createTenant({
      nama_tpq,
      nama_penanggung_jawab,
      email,
      password,
      alamat,
    });

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil! Silakan login.",
      data: {
        tenant_id: tenant.Tenant_ID,
        nama_tpq: tenant.Nama_TPQ,
        email: tenant.Email,
        paket: tenant.Paket,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan. Silakan coba lagi.",
      },
      { status: 500 }
    );
  }
}
