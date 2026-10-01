import { NextRequest, NextResponse } from "next/server";
import { updateTenantPlan, getTenantById } from "@/services/tenantService";
import { isAdminAuthenticated, forbiddenResponse } from "@/lib/auth";

// PUT - Update tenant (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check admin authentication
  if (!isAdminAuthenticated(request)) {
    return forbiddenResponse("Akses ditolak. Hanya admin yang dapat mengakses.");
  }

  try {
    const { id } = await params;
    const data = await request.json();

    // Check if tenant exists
    const existingTenant = await getTenantById(id);
    if (!existingTenant) {
      return NextResponse.json(
        { success: false, message: "Tenant tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update tenant plan if paket is changed
    if (data.Paket) {
      const validPackages = ["free", "pro"];
      if (!validPackages.includes(data.Paket)) {
        return NextResponse.json(
          { success: false, message: "Paket tidak valid" },
          { status: 400 }
        );
      }
      await updateTenantPlan(id, data.Paket);
    }

    return NextResponse.json({
      success: true,
      message: "Tenant berhasil diupdate",
    });
  } catch (error) {
    console.error("Update tenant error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengupdate tenant" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus tenant (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check admin authentication
  if (!isAdminAuthenticated(request)) {
    return forbiddenResponse("Akses ditolak. Hanya admin yang dapat mengakses.");
  }

  try {
    const { id } = await params;

    // Check if tenant exists
    const existingTenant = await getTenantById(id);
    if (!existingTenant) {
      return NextResponse.json(
        { success: false, message: "Tenant tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete tenant from Google Sheets via Apps Script
    const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!APPS_SCRIPT_URL) {
      return NextResponse.json(
        { success: false, message: "Server error: Apps Script URL not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "deleteTenant",
        tenantId: id,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || "Gagal menghapus tenant" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tenant berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete tenant error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus tenant" },
      { status: 500 }
    );
  }
}
