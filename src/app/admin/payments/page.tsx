"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";

interface Tenant {
  Tenant_ID: string;
  Nama_TPQ: string;
}

interface Payment {
  Payment_ID: string;
  Tenant_ID: string;
  Subscription_ID: string;
  Jumlah: number;
  Status: string;
  Created_At: string;
}

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tenantsRes, paymentsRes] = await Promise.all([
        fetch("/api/admin?type=tenants"),
        fetch("/api/admin?type=payments"),
      ]);

      if (tenantsRes.status === 403 || tenantsRes.status === 401) {
        router.push("/admin/login");
        return;
      }

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
        body: JSON.stringify({ payment_id: paymentId, approved, verified_by: "admin" }),
      });

      const data = await response.json();
      if (data.success) loadData();
    } catch (error) {
      console.error("Failed to verify payment:", error);
    } finally {
      setVerifying(null);
    }
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

  const pendingCount = payments.filter((p) => p.Status === "pending").length;

  return (
    <AdminLayout>
      <PageHeader
        title="Pembayaran"
        subtitle={`${pendingCount} pembayaran menunggu verifikasi`}
      />

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

      {payments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Belum ada pembayaran</p>
        </div>
      )}
    </AdminLayout>
  );
}
