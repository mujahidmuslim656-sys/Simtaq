import { NextRequest, NextResponse } from "next/server";
import * as sheets from "@/services/googleSheets";

// GET - Ambil semua guru (filter by tenant_id)
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.cookies.get("tenant_id")?.value;
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const guru = await sheets.getAllGuru(tenantId);
    return NextResponse.json({ success: true, data: guru });
  } catch (error) {
    console.error("Get guru error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data guru" },
      { status: 500 }
    );
  }
}

// POST - Tambah guru baru
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
    if (!data.Nama || data.Nama.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Nama wajib diisi" },
        { status: 400 }
      );
    }

    if (!data.No_WA || data.No_WA.trim() === "") {
      return NextResponse.json(
        { success: false, error: "No. WhatsApp wajib diisi" },
        { status: 400 }
      );
    }

    const newGuru = await sheets.createGuru({ ...data, tenant_id: tenantId });
    return NextResponse.json({ success: true, data: newGuru });
  } catch (error) {
    console.error("Create guru error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambah guru" },
      { status: 500 }
    );
  }
}

// PUT - Update guru
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
        { success: false, error: "ID guru diperlukan" },
        { status: 400 }
      );
    }

    const updated = await sheets.updateGuru(id, data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update guru error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengupdate guru" },
      { status: 500 }
    );
  }
}
