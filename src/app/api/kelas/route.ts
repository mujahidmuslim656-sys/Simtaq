import { NextRequest, NextResponse } from "next/server";
import * as sheets from "@/services/googleSheets";

// GET - Ambil semua kelas (filter by tenant_id)
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.cookies.get("tenant_id")?.value;
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const kelas = await sheets.getAllKelas(tenantId);
    return NextResponse.json({ success: true, data: kelas });
  } catch (error) {
    console.error("Get kelas error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data kelas" },
      { status: 500 }
    );
  }
}

// POST - Tambah kelas baru
export async function POST(request: NextRequest) {
  try {
    const tenantId = request.cookies.get("tenant_id")?.value;
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validasi input
    if (!data.Nama_Kelas || data.Nama_Kelas.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Nama kelas wajib diisi" },
        { status: 400 }
      );
    }

    if (!data.ID_Guru || data.ID_Guru.trim() === "") {
      return NextResponse.json(
        { success: false, error: "ID Guru wajib diisi" },
        { status: 400 }
      );
    }

    const newKelas = await sheets.createKelas({ ...data, tenant_id: tenantId });
    return NextResponse.json({ success: true, data: newKelas });
  } catch (error) {
    console.error("Create kelas error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambah kelas" },
      { status: 500 }
    );
  }
}

// PUT - Update kelas
export async function PUT(request: NextRequest) {
  try {
    const tenantId = request.cookies.get("tenant_id")?.value;
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID kelas diperlukan" },
        { status: 400 }
      );
    }

    const updated = await sheets.updateKelas(id, data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update kelas error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengupdate kelas" },
      { status: 500 }
    );
  }
}
