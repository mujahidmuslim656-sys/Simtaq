import { NextResponse } from "next/server";
import { updateSantri, deactivateSantri, getSantriById } from "@/services/studentService";
import { SantriFormData } from "@/types";

type Params = { params: Promise<{ id: string }> };

// PUT /api/santri/[id] - Update santri
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body: Partial<SantriFormData> = await request.json();

    const updated = await updateSantri(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Santri tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Data santri berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating santri:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data santri" },
      { status: 500 }
    );
  }
}

// DELETE /api/santri/[id] - Nonaktifkan santri
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const success = await deactivateSantri(id);

    if (!success) {
      return NextResponse.json(
        { success: false, message: "Santri tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Santri berhasil dinonaktifkan",
    });
  } catch (error) {
    console.error("Error deactivating santri:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menonaktifkan santri" },
      { status: 500 }
    );
  }
}

// GET /api/santri/[id] - Get santri by ID
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const santri = await getSantriById(id);

    if (!santri) {
      return NextResponse.json(
        { success: false, message: "Santri tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: santri });
  } catch (error) {
    console.error("Error fetching santri:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data santri" },
      { status: 500 }
    );
  }
}
