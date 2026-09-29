import { NextResponse } from "next/server";
import { updateKelas, deleteKelas, getKelasById } from "@/services/classService";
import { KelasFormData } from "@/types";

type Params = { params: Promise<{ id: string }> };

// PUT /api/kelas/[id] - Update kelas
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body: Partial<KelasFormData> = await request.json();

    const updated = await updateKelas(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Data kelas berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating kelas:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data kelas" },
      { status: 500 }
    );
  }
}

// DELETE /api/kelas/[id] - Hapus kelas
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const success = await deleteKelas(id);

    if (!success) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kelas berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting kelas:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus kelas" },
      { status: 500 }
    );
  }
}

// GET /api/kelas/[id] - Get kelas by ID
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const kelas = await getKelasById(id);

    if (!kelas) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: kelas });
  } catch (error) {
    console.error("Error fetching kelas:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data kelas" },
      { status: 500 }
    );
  }
}
