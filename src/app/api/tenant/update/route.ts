import { NextRequest, NextResponse } from "next/server";
import { getTenantById, updateTenantProfile } from "@/services/tenantService";
import { isTenantAuthenticated, getTenantId, unauthorizedResponse } from "@/lib/auth";

// PUT - Update tenant profile
export async function PUT(request: NextRequest) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const { Nama_TPQ, Nama_Penanggung_Jawab, Email, Alamat } = await request.json();

    // Validasi input
    if (!Nama_TPQ || Nama_TPQ.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Nama TPQ wajib diisi" },
        { status: 400 }
      );
    }

    if (!Nama_Penanggung_Jawab || Nama_Penanggung_Jawab.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Nama penanggung jawab wajib diisi" },
        { status: 400 }
      );
    }

    if (!Email || Email.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Email wajib diisi" },
        { status: 400 }
      );
    }

    if (!Alamat || Alamat.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Alamat wajib diisi" },
        { status: 400 }
      );
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return NextResponse.json(
        { success: false, message: "Format email tidak valid" },
        { status: 400 }
      );
    }

    // Check if tenant exists
    const existingTenant = await getTenantById(tenantId || "");
    if (!existingTenant) {
      return NextResponse.json(
        { success: false, message: "Tenant tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update tenant via Google Sheets
    const updatedTenant = await updateTenantProfile(tenantId || "", {
      Nama_TPQ,
      Nama_Penanggung_Jawab,
      Email,
      Alamat,
    });

    if (!updatedTenant) {
      return NextResponse.json(
        { success: false, message: "Gagal mengupdate profil" },
        { status: 500 }
      );
    }

    // Update cookie tenant_name if changed
    const responseData = NextResponse.json({
      success: true,
      message: "Profil berhasil diupdate",
    });

    if (Nama_TPQ !== existingTenant.Nama_TPQ) {
      responseData.cookies.set("tenant_name", Nama_TPQ, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return responseData;
  } catch (error) {
    console.error("Update tenant error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengupdate profil" },
      { status: 500 }
    );
  }
}
