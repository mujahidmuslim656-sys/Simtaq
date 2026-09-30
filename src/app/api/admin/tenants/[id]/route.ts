import { NextRequest, NextResponse } from "next/server";
import { updateTenantPlan, getTenantById } from "@/services/tenantService";

// PUT - Update tenant (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Update tenant plan if paket is changed
    if (data.Paket) {
      await updateTenantPlan(id, data.Paket);
    }

    // TODO: Update other tenant fields (Nama_TPQ, Email, etc.) via Google Sheets

    return NextResponse.json({
      success: true,
      message: "Tenant berhasil diupdate",
    });
  } catch (error) {
    console.error("Update tenant error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengupdate tenant" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus tenant (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // TODO: Delete tenant from Google Sheets
    // TODO: Delete all tenant data (santri, guru, kelas, etc.)

    return NextResponse.json({
      success: true,
      message: "Tenant berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete tenant error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus tenant" },
      { status: 500 }
    );
  }
}
