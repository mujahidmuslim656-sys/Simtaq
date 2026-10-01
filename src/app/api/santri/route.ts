import { NextRequest, NextResponse } from "next/server";
import * as sheets from "@/services/googleSheets";
import { isTenantAuthenticated, getTenantId, unauthorizedResponse } from "@/lib/auth";

// GET - Ambil semua santri (filter by tenant_id)
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.cookies.get("tenant_id")?.value;
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const santri = await sheets.getAllSantri(tenantId);
    return NextResponse.json({ success: true, data: santri });
  } catch (error) {
    console.error("Get santri error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data santri" },
      { status: 500 }
    );
  }
}

// POST - Tambah santri baru
export async function POST(request: NextRequest) {
  // Check tenant authentication
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const data = await request.json();

    // Validasi input
    if (!data.Nama || data.Nama.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Nama wajib diisi" },
        { status: 400 }
      );
    }

    if (!data.NIS || data.NIS.trim() === "") {
      return NextResponse.json(
        { success: false, message: "NIS wajib diisi" },
        { status: 400 }
      );
    }

    if (!data.Nama_Wali || data.Nama_Wali.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Nama wali wajib diisi" },
        { status: 400 }
      );
    }

    // Validasi Jenis_Kelamin
    if (data.Jenis_Kelamin && !["L", "P"].includes(data.Jenis_Kelamin)) {
      return NextResponse.json(
        { success: false, message: "Jenis kelamin harus L atau P" },
        { status: 400 }
      );
    }

    // Validasi Status
    if (data.Status && !["Aktif", "Nonaktif"].includes(data.Status)) {
      return NextResponse.json(
        { success: false, message: "Status harus Aktif atau Nonaktif" },
        { status: 400 }
      );
    }

    // Validasi ID_Kelas jika diisi
    if (data.ID_Kelas) {
      const kelasList = await sheets.getAllKelas(tenantId || undefined);
      const kelasExists = kelasList.some((k) => k.ID_Kelas === data.ID_Kelas);
      if (!kelasExists) {
        return NextResponse.json(
          { success: false, message: "ID Kelas tidak valid" },
          { status: 400 }
        );
      }
    }

    const newSantri = await sheets.createSantri({ ...data, tenant_id: tenantId });
    return NextResponse.json({ success: true, data: newSantri });
  } catch (error) {
    console.error("Create santri error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menambah santri" },
      { status: 500 }
    );
  }
}

// PUT - Update santri
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
        { success: false, error: "ID santri diperlukan" },
        { status: 400 }
      );
    }

    const updated = await sheets.updateSantri(id, data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update santri error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengupdate santri" },
      { status: 500 }
    );
  }
}

// DELETE - Nonaktifkan santri
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
        { success: false, error: "ID santri diperlukan" },
        { status: 400 }
      );
    }

    await sheets.deactivateSantri(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Deactivate santri error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menonaktifkan santri" },
      { status: 500 }
    );
  }
}
