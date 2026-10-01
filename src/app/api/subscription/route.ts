import { NextRequest, NextResponse } from "next/server";
import { createSubscription, getSubscriptionByTenant, createPayment } from "@/services/tenantService";
import { isTenantAuthenticated, getTenantId, unauthorizedResponse } from "@/lib/auth";

// GET - Get subscription by tenant_id
export async function GET(request: NextRequest) {
  // Check tenant authentication
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  try {
    const tenantId = getTenantId(request);
    const paramTenantId = request.nextUrl.searchParams.get("tenant_id");

    // Use tenant_id from cookie, not from query param (security)
    const targetTenantId = tenantId || paramTenantId;

    if (!targetTenantId) {
      return NextResponse.json(
        { success: false, message: "tenant_id diperlukan" },
        { status: 400 }
      );
    }

    const subscription = await getSubscriptionByTenant(targetTenantId);

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
  // Check tenant authentication
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);

  try {
    const { paket, harga, bukti_transfer } = await request.json();

    if (!paket || !harga) {
      return NextResponse.json(
        { success: false, message: "paket dan harga wajib diisi" },
        { status: 400 }
      );
    }

    // Validate paket value
    if (!["free", "pro"].includes(paket)) {
      return NextResponse.json(
        { success: false, message: "Paket tidak valid" },
        { status: 400 }
      );
    }

    // Validate harga is a positive number
    if (typeof harga !== "number" || harga <= 0) {
      return NextResponse.json(
        { success: false, message: "Harga harus angka positif" },
        { status: 400 }
      );
    }

    // Use tenant_id from cookie, not from request body (security)
    const subscription = await createSubscription({
      tenant_id: tenantId!,
      paket,
      harga,
    });

    // Buat payment record
    const payment = await createPayment({
      tenant_id: tenantId!,
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
