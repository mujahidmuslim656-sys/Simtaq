import { NextRequest, NextResponse } from "next/server";
import { getTenantById } from "@/services/tenantService";
import { isTenantAuthenticated, getTenantId, unauthorizedResponse, forbiddenResponse } from "@/lib/auth";

// GET - Get tenant profile by ID (only own tenant)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;
    const tenantId = getTenantId(request);

    // Tenant hanya boleh membaca profilnya sendiri
    if (!tenantId || tenantId !== id) {
      return forbiddenResponse("Akses ditolak");
    }

    const tenant = await getTenantById(id);
    if (!tenant) {
      return NextResponse.json(
        { success: false, message: "Tenant tidak ditemukan" },
        { status: 404 }
      );
    }

    // Jangan kirim Password_Hash ke client
    const { Password_Hash: _passwordHash, ...safeTenant } = tenant;

    return NextResponse.json({ success: true, data: safeTenant });
  } catch (error) {
    console.error("Get tenant error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat profil" },
      { status: 500 }
    );
  }
}
