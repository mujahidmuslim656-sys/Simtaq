import { NextRequest, NextResponse } from "next/server";
import * as sheets from "@/services/googleSheets";

// GET - Ambil absensi
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kelasId = searchParams.get("kelasId");
    const tanggal = searchParams.get("tanggal");
    const santriId = searchParams.get("santriId");

    if (kelasId && tanggal) {
      if (!kelasId.trim() || !tanggal.trim()) {
        return NextResponse.json(
          { success: false, error: "Parameter tidak valid" },
          { status: 400 }
        );
      }
      const absensi = await sheets.getAbsensiByKelasAndTanggal(kelasId, tanggal);
      return NextResponse.json({ success: true, data: absensi });
    }

    if (santriId) {
      if (!santriId.trim()) {
        return NextResponse.json(
          { success: false, error: "Parameter tidak valid" },
          { status: 400 }
        );
      }
      const stats = await sheets.getAbsensiStats(santriId);
      return NextResponse.json({ success: true, data: stats });
    }

    return NextResponse.json(
      { success: false, error: "Parameter tidak valid" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Get absensi error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data absensi" },
      { status: 500 }
    );
  }
}

// POST - Simpan absensi (batch)
export async function POST(request: NextRequest) {
  try {
    const { absensiList } = await request.json();

    if (!absensiList || !Array.isArray(absensiList) || absensiList.length === 0) {
      return NextResponse.json(
        { success: false, error: "Data absensi tidak valid" },
        { status: 400 }
      );
    }

    // Validasi setiap item
    for (const item of absensiList) {
      if (!item.ID_Santri || !item.ID_Kelas || !item.Tanggal || !item.Status) {
        return NextResponse.json(
          { success: false, error: "Data absensi tidak lengkap" },
          { status: 400 }
        );
      }

      const validStatuses = ["Hadir", "Izin", "Sakit", "Alpa"];
      if (!validStatuses.includes(item.Status)) {
        return NextResponse.json(
          { success: false, error: "Status absensi tidak valid" },
          { status: 400 }
        );
      }
    }

    const saved = await sheets.saveAbsensi(absensiList);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error("Save absensi error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan absensi" },
      { status: 500 }
    );
  }
}
