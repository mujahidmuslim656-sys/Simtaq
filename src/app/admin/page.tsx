"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import StatsCard from "@/components/ui/StatsCard";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";

interface Tenant {
  Tenant_ID: string;
  Nama_TPQ: string;
  Email: string;
  Paket: string;
  Status: string;
  Created_At: string;
}

export default function AdminOverviewPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [stats, setStats] = useState({
    totalTenants: 0,
    activeTenants: 0,
    pendingPayments: 0,
    proTenants: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tenantsRes, statsRes] = await Promise.all([
        fetch("/api/admin?type=tenants"),
        fetch("/api/admin?type=stats"),
      ]);

      if (tenantsRes.status === 403 || tenantsRes.status === 401) {
        router.push("/admin/login");
        return;
      }

      const tenantsData = await tenantsRes.json();
      const statsData = await statsRes.json();

      if (tenantsData.success) setTenants(tenantsData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
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

  return (
    <AdminLayout>
      <PageHeader
        title="Dashboard Admin"
        subtitle="Pantau keseluruhan platform Simtaq"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
          {tenants.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">Belum ada TPQ terdaftar</p>
          )}
        </div>
      </Card>
    </AdminLayout>
  );
}
