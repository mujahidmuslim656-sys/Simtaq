import { NextRequest, NextResponse } from "next/server";
import * as sheets from "@/services/googleSheets";
import { isTenantAuthenticated, getTenantId, unauthorizedResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
  // Check tenant authentication
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
      const progress = await sheets.getProgressBySantri(santriId);
      return NextResponse.json({ success: true, data: progress });
    }

    const progress = await sheets.getAllProgress();
    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    console.error("Get progress error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data progress" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Check tenant authentication
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const data = await request.json();

    if (!data.ID_Santri || !data.Kategori || !data.Materi) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const validStatuses = ["Perlu Bimbingan", "Berkembang", "Baik"];
    if (data.Status && !validStatuses.includes(data.Status)) {
      return NextResponse.json(
        { success: false, message: "Status tidak valid" },
        { status: 400 }
      );
    }

    // Add tenant_id to data
    const newProgress = await sheets.createProgress({ ...data, tenant_id: tenantId });
    return NextResponse.json({ success: true, data: newProgress });
  } catch (error) {
    console.error("Create progress error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menambah progress" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  // Check tenant authentication
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

    const updated = await sheets.updateProgress(id, data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update progress error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengupdate progress" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Check tenant authentication
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

    await sheets.deleteProgress(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete progress error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus progress" },
      { status: 500 }
    );
  }
}
