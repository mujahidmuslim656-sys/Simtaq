import { NextResponse } from "next/server";
import { updateGuru, deleteGuru, getGuruById } from "@/services/teacherService";
import { GuruFormData } from "@/types";

type Params = { params: Promise<{ id: string }> };

// PUT /api/guru/[id] - Update guru
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body: Partial<GuruFormData> = await request.json();

    const updated = await updateGuru(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Data guru berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating guru:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data guru" },
      { status: 500 }
    );
  }
}

// DELETE /api/guru/[id] - Hapus guru
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const success = await deleteGuru(id);

    if (!success) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Guru berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting guru:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus guru" },
      { status: 500 }
    );
  }
}

// GET /api/guru/[id] - Get guru by ID
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const guru = await getGuruById(id);

    if (!guru) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: guru });
  } catch (error) {
    console.error("Error fetching guru:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data guru" },
      { status: 500 }
    );
  }
}
