import { NextRequest, NextResponse } from "next/server";
import * as sheets from "@/services/googleSheets";

// GET - Ambil semua guru
export async function GET() {
  try {
    const guru = await sheets.getAllGuru();
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

    const newGuru = await sheets.createGuru(data);
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
