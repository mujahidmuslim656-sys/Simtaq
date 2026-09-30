"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

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
  const [activeTab, setActiveTab] = useState<"tenants" | "payments">("tenants");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const cookies = document.cookie;
    if (!cookies.includes("isLoggedIn=true")) {
      router.push("/login");
      return;
    }
    loadData();
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [tenantsRes, paymentsRes] = await Promise.all([
        fetch("/api/admin?type=tenants"),
        fetch("/api/admin?type=payments"),
      ]);

      const tenantsData = await tenantsRes.json();
      const paymentsData = await paymentsRes.json();

      if (tenantsData.success) setTenants(tenantsData.data);
      if (paymentsData.success) setPayments(paymentsData.data);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" />
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Admin Panel</span>
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Lihat Landing
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("tenants")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "tenants"
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Daftar TPQ ({tenants.length})
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "payments"
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Pembayaran ({payments.filter((p) => p.Status === "pending").length} pending)
          </button>
        </div>

        {/* Tenants Tab */}
        {activeTab === "tenants" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      TPQ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Penanggung Jawab
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Paket
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Terdaftar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tenants.map((tenant) => (
                    <tr key={tenant.Tenant_ID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{tenant.Nama_TPQ}</p>
                          <p className="text-xs text-gray-500">{tenant.Email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {tenant.Nama_Penanggung_Jawab}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            tenant.Paket === "pro"
                              ? "bg-gold-100 text-gold-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {tenant.Paket.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            tenant.Status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {tenant.Status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(tenant.Created_At).toLocaleDateString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {tenants.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Belum ada TPQ terdaftar</p>
              </div>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Tenant ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Jumlah
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.Payment_ID} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                        {payment.Payment_ID}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {payment.Tenant_ID}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        Rp {payment.Jumlah.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            payment.Status === "approved"
                              ? "bg-green-100 text-green-800"
                              : payment.Status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {payment.Status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(payment.Created_At).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-4 py-3">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {payments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Belum ada pembayaran</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
