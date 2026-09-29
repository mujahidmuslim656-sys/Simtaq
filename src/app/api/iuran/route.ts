import { NextRequest, NextResponse } from "next/server";
import * as sheets from "@/services/googleSheets";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const santriId = searchParams.get("santriId");
    const stats = searchParams.get("stats");

    if (stats === "true") {
      const statsData = await sheets.getIuranStats();
      return NextResponse.json({ success: true, data: statsData });
    }

    if (santriId) {
      if (!santriId.trim()) {
        return NextResponse.json(
          { success: false, error: "Parameter tidak valid" },
          { status: 400 }
        );
      }
      const iuran = await sheets.getIuranBySantri(santriId);
      return NextResponse.json({ success: true, data: iuran });
    }

    const iuran = await sheets.getAllIuran();
    return NextResponse.json({ success: true, data: iuran });
  } catch (error) {
    console.error("Get iuran error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data iuran" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.ID_Santri || !data.Bulan || !data.Jenis || !data.Nominal) {
      return NextResponse.json(
        { success: false, error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    if (typeof data.Nominal !== "number" || data.Nominal < 0) {
      return NextResponse.json(
        { success: false, error: "Nominal harus angka positif" },
        { status: 400 }
      );
    }

    const validStatuses = ["Lunas", "Belum Bayar"];
    if (data.Status && !validStatuses.includes(data.Status)) {
      return NextResponse.json(
        { success: false, error: "Status tidak valid" },
        { status: 400 }
      );
    }

    const newIuran = await sheets.createIuran(data);
    return NextResponse.json({ success: true, data: newIuran });
  } catch (error) {
    console.error("Create iuran error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambah iuran" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID diperlukan" },
        { status: 400 }
      );
    }

    const updated = await sheets.updateIuran(id, data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update iuran error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengupdate iuran" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID diperlukan" },
        { status: 400 }
      );
    }

    await sheets.deleteIuran(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete iuran error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus iuran" },
      { status: 500 }
    );
  }
}
