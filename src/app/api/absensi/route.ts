import { NextRequest, NextResponse } from "next/server";
import * as sheets from "@/services/googleSheets";
import { isTenantAuthenticated, getTenantId, unauthorizedResponse } from "@/lib/auth";

// GET - Ambil absensi (filter by tenant_id)
export async function GET(request: NextRequest) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const { searchParams } = new URL(request.url);
    const kelasId = searchParams.get("kelasId");
    const tanggal = searchParams.get("tanggal");
    const santriId = searchParams.get("santriId");

    if (kelasId && tanggal) {
      if (!kelasId.trim() || !tanggal.trim()) {
        return NextResponse.json(
          { success: false, message: "Parameter tidak valid" },
          { status: 400 }
        );
      }
      const absensi = await sheets.getAbsensiByKelasAndTanggal(tenantId || "", kelasId, tanggal);
      return NextResponse.json({ success: true, data: absensi });
    }

    if (santriId) {
      if (!santriId.trim()) {
        return NextResponse.json(
          { success: false, message: "Parameter tidak valid" },
          { status: 400 }
        );
      }
      const stats = await sheets.getAbsensiStats(tenantId || "", santriId);
      return NextResponse.json({ success: true, data: stats });
    }

    return NextResponse.json(
      { success: false, message: "Parameter tidak valid" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Get absensi error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data absensi" },
      { status: 500 }
    );
  }
}

// POST - Simpan absensi (batch)
export async function POST(request: NextRequest) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const { absensiList } = await request.json();

    if (!absensiList || !Array.isArray(absensiList) || absensiList.length === 0) {
      return NextResponse.json(
        { success: false, message: "Data absensi tidak valid" },
        { status: 400 }
      );
    }

    // Validasi setiap item
    for (const item of absensiList) {
      if (!item.ID_Santri || !item.ID_Kelas || !item.Tanggal || !item.Status) {
        return NextResponse.json(
          { success: false, message: "Data absensi tidak lengkap" },
          { status: 400 }
        );
      }

      const validStatuses = ["Hadir", "Izin", "Sakit", "Alpa"];
      if (!validStatuses.includes(item.Status)) {
        return NextResponse.json(
          { success: false, message: "Status absensi tidak valid" },
          { status: 400 }
        );
      }
    }

    // Add tenant_id to each item
    const dataWithTenant = absensiList.map((item: Record<string, unknown>) => ({
      ...item,
      tenant_id: tenantId,
    }));

    const saved = await sheets.saveAbsensi(dataWithTenant);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error("Save absensi error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan absensi" },
      { status: 500 }
    );
  }
}
