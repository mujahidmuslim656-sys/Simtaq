"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import StatsCard from "@/components/ui/StatsCard";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";

interface Tenant {
  Tenant_ID: string;
  Nama_TPQ: string;
  Nama_Penanggung_Jawab: string;
  Email: string;
  Paket: string;
  Status: string;
  Max_Santri: number;
  Created_At: string;
}

interface Payment {
  Payment_ID: string;
  Tenant_ID: string;
  Subscription_ID: string;
  Jumlah: number;
  Status: string;
  Created_At: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "tenants" | "payments">("overview");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState({
    totalTenants: 0,
    activeTenants: 0,
    pendingPayments: 0,
    proTenants: 0,
  });
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState({
    Nama_TPQ: "",
    Nama_Penanggung_Jawab: "",
    Email: "",
    Paket: "free",
    Status: "active",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tenantsRes, paymentsRes, statsRes] = await Promise.all([
        fetch("/api/admin?type=tenants"),
        fetch("/api/admin?type=payments"),
        fetch("/api/admin?type=stats"),
      ]);

      // Check if unauthorized
      if (tenantsRes.status === 403 || tenantsRes.status === 401) {
        router.push("/admin/login");
        return;
      }

      const tenantsData = await tenantsRes.json();
      const paymentsData = await paymentsRes.json();
      const statsData = await statsRes.json();

      if (tenantsData.success) setTenants(tenantsData.data);
      if (paymentsData.success) setPayments(paymentsData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (paymentId: string, approved: boolean) => {
    setVerifying(paymentId);
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_id: paymentId,
          approved,
          verified_by: "admin",
        }),
      });

      const data = await response.json();
      if (data.success) {
        loadData();
      }
    } catch (error) {
      console.error("Failed to verify payment:", error);
    } finally {
      setVerifying(null);
    }
  };

  const handleEditTenant = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setFormData({
      Nama_TPQ: tenant.Nama_TPQ || "",
      Nama_Penanggung_Jawab: tenant.Nama_Penanggung_Jawab || "",
      Email: tenant.Email || "",
      Paket: tenant.Paket || "free",
      Status: tenant.Status || "active",
    });
    setIsModalOpen(true);
  };

  const handleDeleteTenant = async (tenantId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus TPQ ini? Semua data akan dihapus.")) return;
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        loadData();
      }
    } catch (error) {
      console.error("Failed to delete tenant:", error);
    }
  };

  const handleSaveTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/tenants/${editingTenant?.Tenant_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setIsModalOpen(false);
        setEditingTenant(null);
        loadData();
      } else {
        setError(data.message || "Gagal menyimpan data");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Pantau perkembangan pendaftar TPQ dan verifikasi pembayaran"
        action={
          <Button variant="secondary" onClick={handleLogout}>
            Keluar
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
            activeTab === "overview"
              ? "bg-primary-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("tenants")}
          className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
            activeTab === "tenants"
              ? "bg-primary-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Daftar TPQ ({tenants.length})
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
            activeTab === "payments"
              ? "bg-primary-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Pembayaran ({payments.filter((p) => p.Status === "pending").length} pending)
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total TPQ"
              value={stats.totalTenants}
              color="blue"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />
            <StatsCard
              title="TPQ Active"
              value={stats.activeTenants}
              color="green"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatsCard
              title="TPQ Pro"
              value={stats.proTenants}
              color="gold"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              }
            />
            <StatsCard
              title="Pending Payments"
              value={stats.pendingPayments}
              color="purple"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          {/* Recent Tenants */}
          <Card title="TPQ Terbaru" subtitle="5 TPQ yang baru mendaftar">
            <div className="space-y-3">
              {tenants.slice(0, 5).map((tenant) => (
                <div key={tenant.Tenant_ID} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{tenant.Nama_TPQ}</p>
                    <p className="text-sm text-gray-500">{tenant.Email}</p>
                  </div>
                  <Badge variant={tenant.Paket === "pro" ? "gold" : "default"}>
                    {tenant.Paket.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tenants Tab */}
      {activeTab === "tenants" && (
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TPQ</TableHead>
                <TableHead>Penanggung Jawab</TableHead>
                <TableHead>Paket</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Terdaftar</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.Tenant_ID}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{tenant.Nama_TPQ}</p>
                      <p className="text-xs text-gray-500">{tenant.Email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{tenant.Nama_Penanggung_Jawab}</TableCell>
                  <TableCell>
                    <Badge variant={tenant.Paket === "pro" ? "gold" : "default"}>
                      {tenant.Paket.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tenant.Status === "active" ? "success" : "danger"}>
                      {tenant.Status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(tenant.Created_At).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEditTenant(tenant)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDeleteTenant(tenant.Tenant_ID)}>
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === "payments" && (
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>TPQ</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => {
                const tenant = tenants.find((t) => t.Tenant_ID === payment.Tenant_ID);
                return (
                  <TableRow key={payment.Payment_ID}>
                    <TableCell className="font-mono text-xs">{payment.Payment_ID}</TableCell>
                    <TableCell>{tenant?.Nama_TPQ || payment.Tenant_ID}</TableCell>
                    <TableCell>Rp {payment.Jumlah.toLocaleString("id-ID")}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.Status === "approved"
                            ? "success"
                            : payment.Status === "rejected"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {payment.Status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(payment.Created_At).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell>
                      {payment.Status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVerifyPayment(payment.Payment_ID, true)}
                            disabled={verifying === payment.Payment_ID}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerifyPayment(payment.Payment_ID, false)}
                            disabled={verifying === payment.Payment_ID}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {tenants.length === 0 && activeTab === "tenants" && (
        <div className="text-center py-12">
          <p className="text-gray-500">Belum ada TPQ terdaftar</p>
        </div>
      )}

      {payments.length === 0 && activeTab === "payments" && (
        <div className="text-center py-12">
          <p className="text-gray-500">Belum ada pembayaran</p>
        </div>
      )}

      {/* Edit Tenant Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTenant(null); }}
        title="Edit Tenant"
      >
        <form onSubmit={handleSaveTenant} className="space-y-4">
          <Input label="Nama TPQ" value={formData.Nama_TPQ} onChange={(e) => setFormData({ ...formData, Nama_TPQ: e.target.value })} />
          <Input label="Nama Penanggung Jawab" value={formData.Nama_Penanggung_Jawab} onChange={(e) => setFormData({ ...formData, Nama_Penanggung_Jawab: e.target.value })} />
          <Input label="Email" type="email" value={formData.Email} onChange={(e) => setFormData({ ...formData, Email: e.target.value })} />
          <Select label="Paket" value={formData.Paket} onChange={(e) => setFormData({ ...formData, Paket: e.target.value })}>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
          </Select>
          <Select label="Status" value={formData.Status} onChange={(e) => setFormData({ ...formData, Status: e.target.value })}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </Select>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => { setIsModalOpen(false); setEditingTenant(null); }}>
              Batal
            </Button>
            <Button type="submit" variant="gold" className="flex-1" loading={saving}>
              Simpan
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
