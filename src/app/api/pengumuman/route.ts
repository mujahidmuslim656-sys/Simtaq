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
    const active = searchParams.get("active");

    if (active === "true") {
      const pengumuman = await sheets.getActivePengumuman(tenantId || undefined);
      return NextResponse.json({ success: true, data: pengumuman });
    }

    const pengumuman = await sheets.getAllPengumuman(tenantId || undefined);
    return NextResponse.json({ success: true, data: pengumuman });
  } catch (error) {
    console.error("Get pengumuman error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data pengumuman" },
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

    if (!data.Judul || !data.Isi) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const validStatuses = ["Aktif", "Nonaktif"];
    if (data.Status && !validStatuses.includes(data.Status)) {
      return NextResponse.json(
        { success: false, message: "Status tidak valid" },
        { status: 400 }
      );
    }

    const newPengumuman = await sheets.createPengumuman({ ...data, tenant_id: tenantId });
    return NextResponse.json({ success: true, data: newPengumuman });
  } catch (error) {
    console.error("Create pengumuman error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menambah pengumuman" },
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

    const updated = await sheets.updatePengumuman(id, data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update pengumuman error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengupdate pengumuman" },
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

    await sheets.deletePengumuman(id);
    return NextResponse.json({ success: true, message: "Pengumuman berhasil dihapus" });
  } catch (error) {
    console.error("Delete pengumuman error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus pengumuman" },
      { status: 500 }
    );
  }
}
