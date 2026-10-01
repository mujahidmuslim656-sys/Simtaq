import { NextRequest, NextResponse } from "next/server";
import { getTenantById } from "@/services/tenantService";
import { isTenantAuthenticated, getTenantId, unauthorizedResponse } from "@/lib/auth";

// GET - Get current logged-in tenant profile
export async function GET(request: NextRequest) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);
  if (!tenantId) {
    return NextResponse.json(
      { success: false, message: "tenant_id tidak ditemukan" },
      { status: 400 }
    );
  }

  try {
    const tenant = await getTenantById(tenantId);
    if (!tenant) {
      return NextResponse.json(
        { success: false, message: "Tenant tidak ditemukan" },
        { status: 404 }
      );
    }

    const { Password_Hash: _passwordHash, ...safeTenant } = tenant;
    return NextResponse.json({ success: true, data: safeTenant });
  } catch (error) {
    console.error("Get tenant me error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat profil" },
      { status: 500 }
    );
  }
}
