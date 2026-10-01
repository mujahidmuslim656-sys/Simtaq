"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TenantLayout from "@/components/layout/TenantLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import PageHeader from "@/components/ui/PageHeader";

export default function SettingsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    Nama_TPQ: "",
    Nama_Penanggung_Jawab: "",
    Email: "",
    Alamat: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paket, setPaket] = useState("free");

  useEffect(() => {
    fetchTenantData();
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const [subRes, tenantRes] = await Promise.all([
        fetch("/api/subscription"),
        fetch("/api/tenant/me"),
      ]);
      const subData = await subRes.json();
      const tenantData = await tenantRes.json();
      // Paket dari profil tenant adalah sumber utama, fallback ke subscription
      if (tenantData.success && tenantData.data?.Paket) {
        setPaket(tenantData.data.Paket);
      } else if (subData.success && subData.data?.Paket) {
        setPaket(subData.data.Paket);
      }
    } catch (err) {
      console.error("Failed to fetch subscription:", err);
    }
  };

  const fetchTenantData = async () => {
    try {
      setFetching(true);
      const response = await fetch("/api/tenant/me");
      const data = await response.json();

      if (data.success && data.data) {
        setFormData({
          Nama_TPQ: data.data.Nama_TPQ || "",
          Nama_Penanggung_Jawab: data.data.Nama_Penanggung_Jawab || "",
          Email: data.data.Email || "",
          Alamat: data.data.Alamat || "",
        });
      } else {
        // Fallback to tenant_name cookie
        const cookies = document.cookie;
        const tenantNameMatch = cookies.match(/tenant_name=([^;]+)/);
        if (tenantNameMatch) {
          setFormData((prev) => ({
            ...prev,
            Nama_TPQ: decodeURIComponent(tenantNameMatch[1]),
          }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch tenant data:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/tenant/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Profil berhasil diupdate!");
        // Update cookie if name changed
        if (formData.Nama_TPQ) {
          document.cookie = `tenant_name=${encodeURIComponent(formData.Nama_TPQ)}; path=/; max-age=${60 * 60 * 24 * 7}`;
        }
      } else {
        setError(data.message || "Gagal mengupdate profil");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <TenantLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </TenantLayout>
    );
  }

  return (
    <TenantLayout>
      <PageHeader
        title="Pengaturan Profil"
        subtitle="Kelola informasi TPQ Anda"
      />

      <div className="max-w-2xl">
        <Card title="Informasi TPQ">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama TPQ"
              value={formData.Nama_TPQ}
              onChange={(e) => setFormData({ ...formData, Nama_TPQ: e.target.value })}
              placeholder="Masukkan nama TPQ"
              required
            />
            <Input
              label="Nama Penanggung Jawab"
              value={formData.Nama_Penanggung_Jawab}
              onChange={(e) => setFormData({ ...formData, Nama_Penanggung_Jawab: e.target.value })}
              placeholder="Masukkan nama penanggung jawab"
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.Email}
              onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
              placeholder="Masukkan email"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Alamat
              </label>
              <textarea
                value={formData.Alamat}
                onChange={(e) => setFormData({ ...formData, Alamat: e.target.value })}
                placeholder="Masukkan alamat TPQ"
                rows={3}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-none"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/dashboard")}
                className="flex-1"
              >
                Kembali
              </Button>
              <Button
                type="submit"
                variant="gold"
                loading={loading}
                className="flex-1"
              >
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </Card>

        <Card title="Informasi Paket" className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Paket Saat Ini</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{paket}</p>
            </div>
            {paket === "pro" ? (
              <span className="px-3 py-1.5 text-sm font-medium bg-gold-100 text-gold-700 rounded-lg">
                Paket Aktif
              </span>
            ) : (
              <Button variant="gold" onClick={() => router.push("/upgrade")}>
                Upgrade ke Pro
              </Button>
            )}
          </div>
        </Card>
      </div>
    </TenantLayout>
  );
}
