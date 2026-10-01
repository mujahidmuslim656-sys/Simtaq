import { NextRequest, NextResponse } from "next/server";
import { updateSantri, deactivateSantri, getSantriById } from "@/services/studentService";
import { SantriFormData } from "@/types";
import { isTenantAuthenticated, getTenantId, unauthorizedResponse } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// GET /api/santri/[id] - Get santri by ID
export async function GET(request: NextRequest, { params }: Params) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const { id } = await params;
    const santri = await getSantriById(id);

    if (!santri) {
      return NextResponse.json(
        { success: false, message: "Santri tidak ditemukan" },
        { status: 404 }
      );
    }

    // Verify santri belongs to tenant
    if (santri.Tenant_ID && santri.Tenant_ID !== tenantId) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: santri });
  } catch (error) {
    console.error("Error fetching santri:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data santri" },
      { status: 500 }
    );
  }
}

// PUT /api/santri/[id] - Update santri
export async function PUT(request: NextRequest, { params }: Params) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const { id } = await params;
    const body: Partial<SantriFormData> = await request.json();

    // Verify santri exists and belongs to tenant
    const existing = await getSantriById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Santri tidak ditemukan" },
        { status: 404 }
      );
    }
    if (existing.Tenant_ID && existing.Tenant_ID !== tenantId) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak" },
        { status: 403 }
      );
    }

    const updated = await updateSantri(id, body);

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Data santri berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating santri:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data santri" },
      { status: 500 }
    );
  }
}

// DELETE /api/santri/[id] - Nonaktifkan santri
export async function DELETE(request: NextRequest, { params }: Params) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const { id } = await params;

    // Verify santri exists and belongs to tenant
    const existing = await getSantriById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Santri tidak ditemukan" },
        { status: 404 }
      );
    }
    if (existing.Tenant_ID && existing.Tenant_ID !== tenantId) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak" },
        { status: 403 }
      );
    }

    const success = await deactivateSantri(id);

    return NextResponse.json({
      success: true,
      message: "Santri berhasil dinonaktifkan",
    });
  } catch (error) {
    console.error("Error deactivating santri:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menonaktifkan santri" },
      { status: 500 }
    );
  }
}
