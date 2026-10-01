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
    const forWali = searchParams.get("forWali");

    if (santriId) {
      if (!santriId.trim()) {
        return NextResponse.json(
          { success: false, message: "Parameter tidak valid" },
          { status: 400 }
        );
      }
      const catatan = await sheets.getCatatanBySantri(santriId, forWali === "true");
      return NextResponse.json({ success: true, data: catatan });
    }

    const catatan = await sheets.getAllCatatan();
    return NextResponse.json({ success: true, data: catatan });
  } catch (error) {
    console.error("Get catatan error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data catatan" },
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

    if (!data.ID_Santri || !data.Catatan) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Add tenant_id to data
    const newCatatan = await sheets.createCatatan({ ...data, tenant_id: tenantId });
    return NextResponse.json({ success: true, data: newCatatan });
  } catch (error) {
    console.error("Create catatan error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menambah catatan" },
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

    const updated = await sheets.updateCatatan(id, data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update catatan error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengupdate catatan" },
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

    await sheets.deleteCatatan(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete catatan error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus catatan" },
      { status: 500 }
    );
  }
}
