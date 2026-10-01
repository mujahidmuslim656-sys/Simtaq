import { NextRequest, NextResponse } from "next/server";
import * as sheets from "@/services/googleSheets";
import { isTenantAuthenticated, getTenantId, unauthorizedResponse } from "@/lib/auth";

// GET - Ambil semua kelas (filter by tenant_id)
export async function GET(request: NextRequest) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const kelas = await sheets.getAllKelas(tenantId || undefined);
    return NextResponse.json({ success: true, data: kelas });
  } catch (error) {
    console.error("Get kelas error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data kelas" },
      { status: 500 }
    );
  }
}

// POST - Tambah kelas baru
export async function POST(request: NextRequest) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const data = await request.json();

    // Validasi input
    if (!data.Nama_Kelas || data.Nama_Kelas.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Nama kelas wajib diisi" },
        { status: 400 }
      );
    }

    if (!data.ID_Guru || data.ID_Guru.trim() === "") {
      return NextResponse.json(
        { success: false, message: "ID Guru wajib diisi" },
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

    const newKelas = await sheets.createKelas({ ...data, tenant_id: tenantId });
    return NextResponse.json({ success: true, data: newKelas });
  } catch (error) {
    console.error("Create kelas error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menambah kelas" },
      { status: 500 }
    );
  }
}

// PUT - Update kelas
export async function PUT(request: NextRequest) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id, data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID kelas diperlukan" },
        { status: 400 }
      );
    }

    const updated = await sheets.updateKelas(id, data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update kelas error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengupdate kelas" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus kelas
export async function DELETE(request: NextRequest) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID kelas diperlukan" },
        { status: 400 }
      );
    }

    await sheets.deleteKelas(id);
    return NextResponse.json({ success: true, message: "Kelas berhasil dihapus" });
  } catch (error) {
    console.error("Delete kelas error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus kelas" },
      { status: 500 }
    );
  }
}
