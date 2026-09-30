import { NextRequest, NextResponse } from "next/server";
import { createSubscription, getSubscriptionByTenant, createPayment } from "@/services/tenantService";

// GET - Get subscription by tenant_id
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.nextUrl.searchParams.get("tenant_id");

    if (!tenantId) {
      return NextResponse.json(
        { success: false, message: "tenant_id diperlukan" },
        { status: 400 }
      );
    }

    const subscription = await getSubscriptionByTenant(tenantId);

    if (!subscription) {
      return NextResponse.json(
        { success: false, message: "Subscription tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}

// POST - Create subscription (upgrade paket)
export async function POST(request: NextRequest) {
  try {
    const { tenant_id, paket, harga, bukti_transfer } = await request.json();

    if (!tenant_id || !paket || !harga) {
      return NextResponse.json(
        { success: false, message: "tenant_id, paket, dan harga wajib diisi" },
        { status: 400 }
      );
    }

    // Buat subscription
    const subscription = await createSubscription({
      tenant_id,
      paket,
      harga,
    });

    // Buat payment record
    const payment = await createPayment({
      tenant_id,
      subscription_id: subscription.Subscription_ID,
      jumlah: harga,
      bukti_transfer: bukti_transfer || "",
    });

    return NextResponse.json({
      success: true,
      message: "Pembayaran berhasil dibuat. Menunggu verifikasi admin.",
      data: {
        subscription,
        payment,
      },
    });
  } catch (error) {
    console.error("Create subscription error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
