import { NextRequest, NextResponse } from "next/server";
import { updateKelas, deleteKelas, getKelasById } from "@/services/classService";
import { KelasFormData } from "@/types";
import { isTenantAuthenticated, getTenantId, unauthorizedResponse } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// GET /api/kelas/[id] - Get kelas by ID
export async function GET(request: NextRequest, { params }: Params) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const { id } = await params;
    const kelas = await getKelasById(id);

    if (!kelas) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    // Verify kelas belongs to tenant
    if (kelas.Tenant_ID && kelas.Tenant_ID !== tenantId) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: kelas });
  } catch (error) {
    console.error("Error fetching kelas:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data kelas" },
      { status: 500 }
    );
  }
}

// PUT /api/kelas/[id] - Update kelas
export async function PUT(request: NextRequest, { params }: Params) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const { id } = await params;
    const body: Partial<KelasFormData> = await request.json();

    // Verify kelas exists and belongs to tenant
    const existing = await getKelasById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }
    if (existing.Tenant_ID && existing.Tenant_ID !== tenantId) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak" },
        { status: 403 }
      );
    }

    const updated = await updateKelas(id, body);

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Data kelas berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating kelas:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data kelas" },
      { status: 500 }
    );
  }
}

// DELETE /api/kelas/[id] - Hapus kelas
export async function DELETE(request: NextRequest, { params }: Params) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const { id } = await params;

    // Verify kelas exists and belongs to tenant
    const existing = await getKelasById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }
    if (existing.Tenant_ID && existing.Tenant_ID !== tenantId) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak" },
        { status: 403 }
      );
    }

    const success = await deleteKelas(id);

    return NextResponse.json({
      success: true,
      message: "Kelas berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting kelas:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus kelas" },
      { status: 500 }
    );
  }
}
