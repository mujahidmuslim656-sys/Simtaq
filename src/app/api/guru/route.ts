import { NextRequest, NextResponse } from "next/server";
import * as sheets from "@/services/googleSheets";
import { isTenantAuthenticated, getTenantId, unauthorizedResponse } from "@/lib/auth";

// GET - Ambil semua guru (filter by tenant_id)
export async function GET(request: NextRequest) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const guru = await sheets.getAllGuru(tenantId || undefined);
    return NextResponse.json({ success: true, data: guru });
  } catch (error) {
    console.error("Get guru error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data guru" },
      { status: 500 }
    );
  }
}

// POST - Tambah guru baru
export async function POST(request: NextRequest) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const data = await request.json();

    // Validasi input
    if (!data.Nama || data.Nama.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Nama wajib diisi" },
        { status: 400 }
      );
    }

    if (!data.No_WA || data.No_WA.trim() === "") {
      return NextResponse.json(
        { success: false, message: "No. WhatsApp wajib diisi" },
        { status: 400 }
      );
    }

    // Validasi Status
    if (data.Status && !["Aktif", "Nonaktif"].includes(data.Status)) {
      return NextResponse.json(
        { success: false, message: "Status harus Aktif atau Nonaktif" },
        { status: 400 }
      );
    }

    const newGuru = await sheets.createGuru({ ...data, tenant_id: tenantId });
    return NextResponse.json({ success: true, data: newGuru });
  } catch (error) {
    console.error("Create guru error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menambah guru" },
      { status: 500 }
    );
  }
}

// PUT - Update guru
export async function PUT(request: NextRequest) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id, data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID guru diperlukan" },
        { status: 400 }
      );
    }

    const updated = await sheets.updateGuru(id, data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update guru error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengupdate guru" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus guru
export async function DELETE(request: NextRequest) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID guru diperlukan" },
        { status: 400 }
      );
    }

    await sheets.deleteGuru(id);
    return NextResponse.json({ success: true, message: "Guru berhasil dihapus" });
  } catch (error) {
    console.error("Delete guru error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus guru" },
      { status: 500 }
    );
  }
}
