import { NextRequest, NextResponse } from "next/server";
import * as sheets from "@/services/googleSheets";

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.cookies.get("tenant_id")?.value;
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");

    if (active === "true") {
      const pengumuman = await sheets.getActivePengumuman(tenantId);
      return NextResponse.json({ success: true, data: pengumuman });
    }

    const pengumuman = await sheets.getAllPengumuman(tenantId);
    return NextResponse.json({ success: true, data: pengumuman });
  } catch (error) {
    console.error("Get pengumuman error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data pengumuman" },
      { status: 500 }
    );
  }
}

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

    if (!data.Judul || !data.Isi) {
      return NextResponse.json(
        { success: false, error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const validStatuses = ["Aktif", "Nonaktif"];
    if (data.Status && !validStatuses.includes(data.Status)) {
      return NextResponse.json(
        { success: false, error: "Status tidak valid" },
        { status: 400 }
      );
    }

    const newPengumuman = await sheets.createPengumuman({ ...data, tenant_id: tenantId });
    return NextResponse.json({ success: true, data: newPengumuman });
  } catch (error) {
    console.error("Create pengumuman error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambah pengumuman" },
      { status: 500 }
    );
  }
}

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
        { success: false, error: "ID diperlukan" },
        { status: 400 }
      );
    }

    const updated = await sheets.updatePengumuman(id, data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update pengumuman error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengupdate pengumuman" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const tenantId = request.cookies.get("tenant_id")?.value;
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID diperlukan" },
        { status: 400 }
      );
    }

    await sheets.deletePengumuman(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete pengumuman error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus pengumuman" },
      { status: 500 }
    );
  }
}
