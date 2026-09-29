// ============================================
// TENANT SERVICE
// Manajemen data TPQ (tenant) untuk SaaS
// ============================================

import { randomBytes } from "crypto";

// Types
export interface Tenant {
  tenant_id: string;
  nama_tpq: string;
  nama_penanggung_jawab: string;
  email: string;
  password_hash: string;
  alamat: string;
  paket: "free" | "pro";
  status: "active" | "inactive" | "suspended";
  max_santri: number;
  created_at: string;
}

export interface Subscription {
  subscription_id: string;
  tenant_id: string;
  paket: "free" | "pro";
  harga: number;
  mulai_berlaku: string;
  expired_at: string;
  status: "active" | "expired" | "cancelled";
}

export interface Payment {
  payment_id: string;
  tenant_id: string;
  subscription_id: string;
  jumlah: number;
  metode: string;
  bukti_transfer: string;
  status: "pending" | "approved" | "rejected";
  verified_by: string;
  verified_at: string;
  created_at: string;
}

// Simple hash function untuk MVP (ganti dengan bcrypt di produksi)
function simpleHash(password: string): string {
  return randomBytes(16).toString("hex") + Buffer.from(password).toString("base64");
}

function verifyHash(password: string, hash: string): boolean {
  const encoded = randomBytes(16).toString("hex") + Buffer.from(password).toString("base64");
  return encoded === hash;
}

// Generate unique ID
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${randomBytes(4).toString("hex")}`;
}

// In-memory storage untuk MVP (ganti dengan database di produksi)
let tenants: Tenant[] = [];
let subscriptions: Subscription[] = [];
let payments: Payment[] = [];

// Load dari localStorage jika ada (client-side)
function loadFromStorage(): void {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("simtaq_tenants");
    if (stored) {
      tenants = JSON.parse(stored);
    }
    const storedSubs = localStorage.getItem("simtaq_subscriptions");
    if (storedSubs) {
      subscriptions = JSON.parse(storedSubs);
    }
    const storedPayments = localStorage.getItem("simtaq_payments");
    if (storedPayments) {
      payments = JSON.parse(storedPayments);
    }
  }
}

// Save ke localStorage (client-side)
function saveToStorage(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("simtaq_tenants", JSON.stringify(tenants));
    localStorage.setItem("simtaq_subscriptions", JSON.stringify(subscriptions));
    localStorage.setItem("simtaq_payments", JSON.stringify(payments));
  }
}

// ============================================
// TENANT OPERATIONS
// ============================================

export function getAllTenants(): Tenant[] {
  loadFromStorage();
  return tenants;
}

export function getTenantById(tenantId: string): Tenant | null {
  loadFromStorage();
  return tenants.find((t) => t.tenant_id === tenantId) || null;
}

export function getTenantByEmail(email: string): Tenant | null {
  loadFromStorage();
  return tenants.find((t) => t.email === email) || null;
}

export function createTenant(data: {
  nama_tpq: string;
  nama_penanggung_jawab: string;
  email: string;
  password: string;
  alamat: string;
}): Tenant {
  loadFromStorage();

  // Cek email sudah terdaftar
  if (tenants.find((t) => t.email === data.email)) {
    throw new Error("Email sudah terdaftar");
  }

  const tenant: Tenant = {
    tenant_id: generateId("TPQ"),
    nama_tpq: data.nama_tpq,
    nama_penanggung_jawab: data.nama_penanggung_jawab,
    email: data.email,
    password_hash: simpleHash(data.password),
    alamat: data.alamat,
    paket: "free",
    status: "active",
    max_santri: 10,
    created_at: new Date().toISOString(),
  };

  tenants.push(tenant);

  // Buat subscription free
  const subscription: Subscription = {
    subscription_id: generateId("SUB"),
    tenant_id: tenant.tenant_id,
    paket: "free",
    harga: 0,
    mulai_berlaku: new Date().toISOString(),
    expired_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 tahun
    status: "active",
  };
  subscriptions.push(subscription);

  saveToStorage();
  return tenant;
}

export function validateTenantLogin(email: string, password: string): Tenant | null {
  loadFromStorage();
  const tenant = tenants.find((t) => t.email === email);
  if (tenant && verifyHash(password, tenant.password_hash)) {
    return tenant;
  }
  return null;
}

export function updateTenantPlan(tenantId: string, paket: "free" | "pro"): Tenant | null {
  loadFromStorage();
  const tenant = tenants.find((t) => t.tenant_id === tenantId);
  if (tenant) {
    tenant.paket = paket;
    tenant.max_santri = paket === "pro" ? 100 : 10;
    saveToStorage();
    return tenant;
  }
  return null;
}

// ============================================
// SUBSCRIPTION OPERATIONS
// ============================================

export function getSubscriptionByTenant(tenantId: string): Subscription | null {
  loadFromStorage();
  return subscriptions.find((s) => s.tenant_id === tenantId) || null;
}

export function createSubscription(data: {
  tenant_id: string;
  paket: "free" | "pro";
  harga: number;
}): Subscription {
  loadFromStorage();

  // Cancel existing active subscription
  subscriptions = subscriptions.map((s) =>
    s.tenant_id === data.tenant_id && s.status === "active"
      ? { ...s, status: "cancelled" as const }
      : s
  );

  const subscription: Subscription = {
    subscription_id: generateId("SUB"),
    tenant_id: data.tenant_id,
    paket: data.paket,
    harga: data.harga,
    mulai_berlaku: new Date().toISOString(),
    expired_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 hari
    status: "active",
  };

  subscriptions.push(subscription);
  saveToStorage();
  return subscription;
}

// ============================================
// PAYMENT OPERATIONS
// ============================================

export function createPayment(data: {
  tenant_id: string;
  subscription_id: string;
  jumlah: number;
  bukti_transfer: string;
}): Payment {
  loadFromStorage();

  const payment: Payment = {
    payment_id: generateId("PAY"),
    tenant_id: data.tenant_id,
    subscription_id: data.subscription_id,
    jumlah: data.jumlah,
    metode: "transfer_bank",
    bukti_transfer: data.bukti_transfer,
    status: "pending",
    verified_by: "",
    verified_at: "",
    created_at: new Date().toISOString(),
  };

  payments.push(payment);
  saveToStorage();
  return payment;
}

export function getAllPayments(): Payment[] {
  loadFromStorage();
  return payments;
}

export function getPaymentsByTenant(tenantId: string): Payment[] {
  loadFromStorage();
  return payments.filter((p) => p.tenant_id === tenantId);
}

export function verifyPayment(paymentId: string, approved: boolean, verifiedBy: string): Payment | null {
  loadFromStorage();
  const payment = payments.find((p) => p.payment_id === paymentId);
  if (payment) {
    payment.status = approved ? "approved" : "rejected";
    payment.verified_by = verifiedBy;
    payment.verified_at = new Date().toISOString();

    // Jika approved, update tenant plan
    if (approved) {
      const subscription = subscriptions.find((s) => s.subscription_id === payment.subscription_id);
      if (subscription) {
        updateTenantPlan(payment.tenant_id, subscription.paket);
      }
    }

    saveToStorage();
    return payment;
  }
  return null;
}

// ============================================
// ADMIN OPERATIONS
// ============================================

export function getAdminStats(): {
  totalTenants: number;
  activeTenants: number;
  pendingPayments: number;
  proTenants: number;
} {
  loadFromStorage();
  return {
    totalTenants: tenants.length,
    activeTenants: tenants.filter((t) => t.status === "active").length,
    pendingPayments: payments.filter((p) => p.status === "pending").length,
    proTenants: tenants.filter((t) => t.paket === "pro").length,
  };
}
