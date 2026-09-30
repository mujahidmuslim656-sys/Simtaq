import { NextRequest, NextResponse } from "next/server";
import { getAllTenants, getAllPayments, verifyPayment, getAdminStats } from "@/services/tenantService";

// GET - Get all tenants (admin only)
export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type");

    if (type === "tenants") {
      const tenants = await getAllTenants();
      return NextResponse.json({
        success: true,
        data: tenants,
      });
    }

    if (type === "payments") {
      const payments = await getAllPayments();
      return NextResponse.json({
        success: true,
        data: payments,
      });
    }

    if (type === "stats") {
      const stats = await getAdminStats();
      return NextResponse.json({
        success: true,
        data: stats,
      });
    }

    return NextResponse.json(
      { success: false, message: "Type tidak valid" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}

// POST - Verify payment (admin only)
export async function POST(request: NextRequest) {
  try {
    const { payment_id, approved, verified_by } = await request.json();

    if (!payment_id || approved === undefined || !verified_by) {
      return NextResponse.json(
        { success: false, message: "payment_id, approved, dan verified_by wajib diisi" },
        { status: 400 }
      );
    }

    const payment = await verifyPayment(payment_id, approved, verified_by);

    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Payment tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: approved ? "Pembayaran disetujui" : "Pembayaran ditolak",
      data: payment,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
