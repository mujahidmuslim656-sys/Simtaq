"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
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

export default function AdminTenantsPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin?type=tenants");
      if (res.status === 403 || res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.success) setTenants(data.data);
    } catch (error) {
      console.error("Failed to load tenants:", error);
    } finally {
      setLoading(false);
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
      const response = await fetch(`/api/admin/tenants/${tenantId}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) loadData();
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
        title="Daftar TPQ"
        subtitle={`Kelola ${tenants.length} TPQ terdaftar`}
      />

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

      {tenants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Belum ada TPQ terdaftar</p>
        </div>
      )}

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
