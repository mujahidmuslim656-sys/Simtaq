"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Card from "@/components/ui/Card";

interface SantriRow {
  Jenis_Kelamin?: string;
  Status?: string;
  ID_Kelas?: string;
}

interface KelasRow {
  ID_Kelas?: string;
  Nama_Kelas?: string;
}

interface IuranStats {
  totalTagihan: number;
  totalPembayaran: number;
  totalTunggakan: number;
}

interface DashboardChartsProps {
  santri: SantriRow[];
  kelas: KelasRow[];
  iuranStats: IuranStats | null;
  paket?: string;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"];

export default function DashboardCharts({ santri, kelas, iuranStats, paket }: DashboardChartsProps) {
  // Santri per kelas
  const kelasMap = new Map(kelas.map((k) => [k.ID_Kelas, k.Nama_Kelas || k.ID_Kelas]));
  const countByKelas = santri.reduce<Record<string, number>>((acc, s) => {
    const key = s.ID_Kelas && kelasMap.has(s.ID_Kelas) ? (kelasMap.get(s.ID_Kelas) as string) : "Tanpa Kelas";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const santriPerKelas = Object.entries(countByKelas).map(([name, jumlah]) => ({ name, jumlah }));

  // Santri per jenis kelamin
  const jkCount = santri.reduce<Record<string, number>>((acc, s) => {
    const key = s.Jenis_Kelamin === "P" ? "Perempuan" : "Laki-laki";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const genderData = Object.entries(jkCount).map(([name, value]) => ({ name, value }));

  // Santri per status
  const statusCount = santri.reduce<Record<string, number>>((acc, s) => {
    const key = s.Status || "Lainnya";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

  // Iuran
  const iuranData = iuranStats
    ? [
        { name: "Tagihan", nominal: iuranStats.totalTagihan },
        { name: "Pembayaran", nominal: iuranStats.totalPembayaran },
        { name: "Tunggakan", nominal: iuranStats.totalTunggakan },
      ]
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
      <Card title="Santri per Kelas/Jilid">
        <div className="h-72">
          {santriPerKelas.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={santriPerKelas} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="jumlah" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center pt-24">Belum ada data</p>
          )}
        </div>
      </Card>

      <Card title="Komposisi Jenis Kelamin">
        <div className="h-72">
          {genderData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {genderData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center pt-24">Belum ada data</p>
          )}
        </div>
      </Card>

      <Card title="Status Santri">
        <div className="h-72">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} label>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center pt-24">Belum ada data</p>
          )}
        </div>
      </Card>

      {paket === "pro" && (
      <Card title="Ringkasan Iuran">
        <div className="h-72">
          {iuranStats ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={iuranData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip formatter={(value) => `Rp ${Number(value).toLocaleString("id-ID")}`} />
                <Bar dataKey="nominal" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center pt-24">Belum ada data</p>
          )}
        </div>
      </Card>
      )}
    </div>
  );
}
