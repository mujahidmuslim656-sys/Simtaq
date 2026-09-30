// ============================================
// TENANT SERVICE
// Manajemen data TPQ (tenant) via Google Sheets
// ============================================

const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

// Types
export interface Tenant {
  Tenant_ID: string;
  Nama_TPQ: string;
  Nama_Penanggung_Jawab: string;
  Email: string;
  Password_Hash: string;
  Alamat: string;
  Paket: "free" | "pro";
  Status: "active" | "inactive" | "suspended";
  Max_Santri: number;
  Created_At: string;
  Updated_At: string;
}

export interface Subscription {
  Subscription_ID: string;
  Tenant_ID: string;
  Paket: "free" | "pro";
  Harga: number;
  Mulai_Berlaku: string;
  Expired_At: string;
  Status: "active" | "expired" | "cancelled";
  Created_At: string;
}

export interface Payment {
  Payment_ID: string;
  Tenant_ID: string;
  Subscription_ID: string;
  Jumlah: number;
  Metode: string;
  Bukti_Transfer: string;
  Status: "pending" | "approved" | "rejected";
  Verified_By: string;
  Verified_At: string;
  Created_At: string;
}

// Helper: Call Apps Script API
async function callAppsScript(
  method: "GET" | "POST",
  params: Record<string, string> = {},
  body: Record<string, unknown> = {}
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  if (!APPS_SCRIPT_URL) {
    return { success: false, error: "GOOGLE_APPS_SCRIPT_URL tidak dikonfigurasi" };
  }

  try {
    let url = APPS_SCRIPT_URL;
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value);
    });

    if (method === "GET" && queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const options: RequestInit = {
      method,
      headers: { "Content-Type": "text/plain;charset=utf-8" },
    };

    if (method === "POST") {
      const formData = new URLSearchParams();
      formData.append("action", params.action || "");
      Object.entries(body).forEach(([key, value]) => {
        if (key !== "action") {
          formData.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
        }
      });
      options.body = formData.toString();
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("callAppsScript error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal terhubung ke Google Sheets",
    };
  }
}

// ============================================
// TENANT OPERATIONS
// ============================================

export async function getAllTenants(): Promise<Tenant[]> {
  const result = await callAppsScript("GET", { action: "getTenants" });
  if (result.success) {
    return (result.data as Tenant[]) || [];
  }
  throw new Error(result.error || "Gagal memuat data tenant");
}

export async function getTenantById(tenantId: string): Promise<Tenant | null> {
  const result = await callAppsScript("GET", {
    action: "getTenantById",
    tenantId,
  });
  if (result.success) {
    return (result.data as Tenant) || null;
  }
  return null;
}

export async function getTenantByEmail(email: string): Promise<Tenant | null> {
  const result = await callAppsScript("GET", {
    action: "getTenantByEmail",
    email,
  });
  if (result.success) {
    return (result.data as Tenant) || null;
  }
  return null;
}

export async function createTenant(data: {
  nama_tpq: string;
  nama_penanggung_jawab: string;
  email: string;
  password: string;
  alamat: string;
}): Promise<Tenant> {
  const result = await callAppsScript("POST", { action: "createTenant" }, data);
  if (result.success) {
    return result.data as Tenant;
  }
  throw new Error(result.error || "Gagal membuat tenant");
}

export async function validateTenantLogin(email: string, password: string): Promise<Tenant | null> {
  const result = await callAppsScript("POST", { action: "loginTenant" }, { email, password });
  if (result.success) {
    return result.data as Tenant;
  }
  return null;
}

export async function updateTenantPlan(tenantId: string, paket: "free" | "pro"): Promise<Tenant | null> {
  const result = await callAppsScript("POST", { action: "updateTenantPlan" }, { tenantId, paket });
  if (result.success) {
    return result.data as Tenant;
  }
  return null;
}

// ============================================
// SUBSCRIPTION OPERATIONS
// ============================================

export async function getSubscriptionByTenant(tenantId: string): Promise<Subscription | null> {
  const result = await callAppsScript("GET", {
    action: "getSubscriptionByTenant",
    tenantId,
  });
  if (result.success) {
    return (result.data as Subscription) || null;
  }
  return null;
}

export async function createSubscription(data: {
  tenant_id: string;
  paket: "free" | "pro";
  harga: number;
}): Promise<Subscription> {
  const result = await callAppsScript("POST", { action: "createSubscription" }, data);
  if (result.success) {
    return result.data as Subscription;
  }
  throw new Error(result.error || "Gagal membuat subscription");
}

// ============================================
// PAYMENT OPERATIONS
// ============================================

export async function getAllPayments(): Promise<Payment[]> {
  const result = await callAppsScript("GET", { action: "getPayments" });
  if (result.success) {
    return (result.data as Payment[]) || [];
  }
  throw new Error(result.error || "Gagal memuat data pembayaran");
}

export async function getPaymentsByTenant(tenantId: string): Promise<Payment[]> {
  const result = await callAppsScript("GET", {
    action: "getPaymentsByTenant",
    tenantId,
  });
  if (result.success) {
    return (result.data as Payment[]) || [];
  }
  throw new Error(result.error || "Gagal memuat data pembayaran");
}

export async function createPayment(data: {
  tenant_id: string;
  subscription_id: string;
  jumlah: number;
  bukti_transfer: string;
}): Promise<Payment> {
  const result = await callAppsScript("POST", { action: "createPayment" }, data);
  if (result.success) {
    return result.data as Payment;
  }
  throw new Error(result.error || "Gagal membuat pembayaran");
}

export async function verifyPayment(paymentId: string, approved: boolean, verifiedBy: string): Promise<Payment | null> {
  const result = await callAppsScript("POST", { action: "verifyPayment" }, { paymentId, approved, verifiedBy });
  if (result.success) {
    return result.data as Payment;
  }
  return null;
}

// ============================================
// ADMIN OPERATIONS
// ============================================

export async function getAdminStats(): Promise<{
  totalTenants: number;
  activeTenants: number;
  pendingPayments: number;
  proTenants: number;
}> {
  const result = await callAppsScript("GET", { action: "getAdminStats" });
  if (result.success) {
    return result.data as {
      totalTenants: number;
      activeTenants: number;
      pendingPayments: number;
      proTenants: number;
    };
  }
  throw new Error(result.error || "Gagal memuat statistik admin");
}
