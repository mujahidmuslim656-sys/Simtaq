import { NextResponse } from "next/server";
import { getAllSantri } from "@/services/googleSheets";

export async function GET() {
  try {
    const santri = await getAllSantri();
    const activeSantri = santri.filter((s) => s.Status === "Aktif").length;

    return NextResponse.json({
      success: true,
      data: {
        totalSantri: activeSantri,
        totalGuru: 0,
        totalKelas: 0,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Gagal memuat statistik" },
      { status: 500 }
    );
  }
}
