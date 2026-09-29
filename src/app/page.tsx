"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const features = [
  {
    title: "Data Santri",
    description: "Kelola data santri secara terpusat dan terorganisir",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    color: "blue",
  },
  {
    title: "Data Guru",
    description: "Kelola data guru dan pengajar TPQ",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: "green",
  },
  {
    title: "Absensi",
    description: "Catat kehadiran santri dengan mudah dan cepat",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    color: "purple",
  },
  {
    title: "Hafalan",
    description: "Pantau hafalan santri per surah dan status",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.32.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.32.477-4.5 1.253" />
      </svg>
    ),
    color: "yellow",
  },
  {
    title: "Iuran",
    description: "Kelola pembayaran iuran santri secara transparan",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "red",
  },
  {
    title: "Pengumuman",
    description: "Sampaikan informasi dan pengumuman dengan mudah",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    color: "indigo",
  },
];

const stats = [
  { label: "Total Santri", value: "50+" },
  { label: "Total Guru", value: "10+" },
  { label: "Total Kelas", value: "5+" },
  { label: "Tahun Berdiri", value: "2020" },
];

const colorClasses: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
  red: { bg: "bg-red-100", text: "text-red-600" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-600" },
};

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TPQ</span>
              </div>
              <span className="ml-2 text-lg md:text-xl font-bold text-gray-900">Simtaq</span>
            </div>
            <Button onClick={() => router.push("/login")} size="md">
              Masuk
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Simtaq
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-primary-100 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
              Sistem Informasi Manajemen Taman Pengajian Al-Quran. Kelola data santri, guru, absensi, hafalan, dan iuran secara digital, terpusat, dan mudah diakses.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100 w-full sm:w-auto"
                onClick={() => router.push("/login")}
              >
                Masuk ke Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Fitur Lengkap
            </h2>
            <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola TPQ secara digital
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature) => {
              const colors = colorClasses[feature.color];
              return (
                <Card key={feature.title} className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className={`p-2.5 md:p-3 ${colors.bg} rounded-lg ${colors.text} shrink-0`}>
                      {feature.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Statistik Kami
            </h2>
            <p className="text-sm sm:text-base text-gray-500">Pencapaian dan pertumbuhan TPQ kami</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-600 mb-1 md:mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
            Siap Memulai?
          </h2>
          <p className="text-sm sm:text-base text-primary-100 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Masuk ke dashboard untuk mulai mengelola data Taman Pengajian Al-Quran Anda secara digital
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="bg-white text-primary-600 hover:bg-gray-100 w-full sm:w-auto"
            onClick={() => router.push("/login")}
          >
            Masuk Sekarang
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TPQ</span>
              </div>
              <span className="ml-2 text-base md:text-lg font-bold text-white">Simtaq</span>
            </div>
            <p className="text-sm text-center md:text-right">
              &copy; {new Date().getFullYear()} TPQ Digital. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
