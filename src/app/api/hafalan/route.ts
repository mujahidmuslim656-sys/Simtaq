import { NextRequest, NextResponse } from "next/server";
import * as sheets from "@/services/googleSheets";
import { isTenantAuthenticated, getTenantId, unauthorizedResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const { searchParams } = new URL(request.url);
    const santriId = searchParams.get("santriId");

    if (santriId) {
      if (!santriId.trim()) {
        return NextResponse.json(
          { success: false, message: "Parameter tidak valid" },
          { status: 400 }
        );
      }
      const hafalan = await sheets.getHafalanBySantri(tenantId || "", santriId);
      return NextResponse.json({ success: true, data: hafalan });
    }

    const hafalan = await sheets.getAllHafalan(tenantId || undefined);
    return NextResponse.json({ success: true, data: hafalan });
  } catch (error) {
    console.error("Get hafalan error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data hafalan" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const data = await request.json();

    if (!data.ID_Santri || !data.Surah) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const validStatuses = ["Belum", "Berkembang", "Lancar", "Perlu Murojaah"];
    if (data.Status && !validStatuses.includes(data.Status)) {
      return NextResponse.json(
        { success: false, message: "Status tidak valid" },
        { status: 400 }
      );
    }

    const newHafalan = await sheets.createHafalan({ ...data, tenant_id: tenantId });
    return NextResponse.json({ success: true, data: newHafalan });
  } catch (error) {
    console.error("Create hafalan error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menambah hafalan" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id, data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID diperlukan" },
        { status: 400 }
      );
    }

    const updated = await sheets.updateHafalan(id, data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update hafalan error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengupdate hafalan" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID diperlukan" },
        { status: 400 }
      );
    }

    await sheets.deleteHafalan(id);
    return NextResponse.json({ success: true, message: "Hafalan berhasil dihapus" });
  } catch (error) {
    console.error("Delete hafalan error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus hafalan" },
      { status: 500 }
    );
  }
}
