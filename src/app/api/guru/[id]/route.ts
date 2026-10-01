import { NextRequest, NextResponse } from "next/server";
import { updateGuru, deleteGuru, getGuruById } from "@/services/teacherService";
import { GuruFormData } from "@/types";
import { isTenantAuthenticated, getTenantId, unauthorizedResponse } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// GET /api/guru/[id] - Get guru by ID
export async function GET(request: NextRequest, { params }: Params) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const { id } = await params;
    const guru = await getGuruById(id);

    if (!guru) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

    // Verify guru belongs to tenant
    if (guru.Tenant_ID && guru.Tenant_ID !== tenantId) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: guru });
  } catch (error) {
    console.error("Error fetching guru:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data guru" },
      { status: 500 }
    );
  }
}

// PUT /api/guru/[id] - Update guru
export async function PUT(request: NextRequest, { params }: Params) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const { id } = await params;
    const body: Partial<GuruFormData> = await request.json();

    // Verify guru exists and belongs to tenant
    const existing = await getGuruById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }
    if (existing.Tenant_ID && existing.Tenant_ID !== tenantId) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak" },
        { status: 403 }
      );
    }

    const updated = await updateGuru(id, body);

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Data guru berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating guru:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data guru" },
      { status: 500 }
    );
  }
}

// DELETE /api/guru/[id] - Hapus guru
export async function DELETE(request: NextRequest, { params }: Params) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const { id } = await params;

    // Verify guru exists and belongs to tenant
    const existing = await getGuruById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }
    if (existing.Tenant_ID && existing.Tenant_ID !== tenantId) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak" },
        { status: 403 }
      );
    }

    const success = await deleteGuru(id);

    return NextResponse.json({
      success: true,
      message: "Guru berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting guru:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus guru" },
      { status: 500 }
    );
  }
}
