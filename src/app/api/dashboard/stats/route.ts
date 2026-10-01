import { NextRequest, NextResponse } from "next/server";
import { getAllSantri, getAllGuru, getAllKelas } from "@/services/googleSheets";
import { isTenantAuthenticated, getTenantId, unauthorizedResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
  // Check tenant authentication
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const [santri, guru, kelas] = await Promise.all([
      getAllSantri(tenantId || undefined),
      getAllGuru(tenantId || undefined),
      getAllKelas(tenantId || undefined),
    ]);

    const activeSantri = santri.filter((s) => s.Status === "Aktif").length;

    return NextResponse.json({
      success: true,
      data: {
        totalSantri: activeSantri,
        totalGuru: guru.length,
        totalKelas: kelas.length,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat statistik" },
      { status: 500 }
    );
  }
}
