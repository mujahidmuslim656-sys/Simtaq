"use client";

import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import IslamicPattern from "@/components/IslamicPattern";

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

const plans = [
  {
    name: "Free",
    price: "Gratis",
    description: "Untuk TPQ kecil yang baru memulai",
    features: [
      "10 santri",
      "3 guru",
      "1 kelas",
      "Semua fitur dasar",
      "Support via email",
    ],
    cta: "Daftar Gratis",
    popular: false,
  },
  {
    name: "Pro",
    price: "Rp 49.000",
    period: "/bulan",
    description: "Untuk TPQ yang berkembang",
    features: [
      "100 santri",
      "20 guru",
      "5 kelas",
      "Semua fitur dasar",
      "Prioritas support",
      "Backup data berkala",
    ],
    cta: "Upgrade ke Pro",
    popular: true,
  },
];

const colorClasses: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  green: { bg: "bg-green-50", text: "text-green-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
  yellow: { bg: "bg-yellow-50", text: "text-yellow-600" },
  red: { bg: "bg-red-50", text: "text-red-600" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600" },
};

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-18">
            <Logo size="md" />
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/login")}
                className="px-5 py-2.5 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 min-h-[44px]"
              >
                Masuk
              </button>
              <button
                onClick={() => router.push("/register")}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 min-h-[44px]"
              >
                Daftar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white overflow-hidden">
        <IslamicPattern variant="light" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" />

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-gold-400/10 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gold-400/10 rounded-full blur-xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white/5 rounded-full animate-float" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6 md:mb-8">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary-100">Sistem Informasi Manajemen TPQ</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
              Sim<span className="text-gold-400">taq</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-primary-100 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
              Sistem Informasi Manajemen Taman Pengajian Al-Quran. Kelola data santri, guru, absensi, hafalan, dan iuran secara digital, terpusat, dan mudah diakses.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => router.push("/register")}
                className="px-8 py-4 text-base font-semibold text-primary-900 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-primary-800 min-h-[48px]"
              >
                Daftar Gratis
              </button>
              <button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 text-base font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary-800 min-h-[48px]"
              >
                Lihat Fitur
              </button>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-20 lg:py-28 bg-gray-50 relative">
        <IslamicPattern variant="dark" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-gold-700 bg-gold-50 rounded-full border border-gold-200 mb-3 md:mb-4">
              Fitur Unggulan
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Fitur Lengkap
            </h2>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola TPQ secara digital
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {features.map((feature) => {
              const colors = colorClasses[feature.color];
              return (
                <div
                  key={feature.title}
                  className="group bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gold-200 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 ${colors.bg} rounded-lg ${colors.text} shrink-0 group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm md:text-base text-gray-500 mt-1 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative bg-gradient-to-br from-primary-800 to-primary-900 py-16 md:py-20 lg:py-24 overflow-hidden">
        <IslamicPattern variant="light" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
              Statistik Kami
            </h2>
            <p className="text-base md:text-lg text-primary-200">Pencapaian dan pertumbuhan TPQ kami</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gold-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-primary-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-20 lg:py-28 bg-gray-50 relative">
        <IslamicPattern variant="dark" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-gold-700 bg-gold-50 rounded-full border border-gold-200 mb-3 md:mb-4">
              Harga Terjangkau
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Pilih Paket yang Sesuai
            </h2>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
              Mulai gratis, upgrade kapan saja sesuai kebutuhan TPQ Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl p-6 md:p-8 shadow-sm border-2 transition-all duration-300 hover:shadow-lg ${
                  plan.popular
                    ? "border-gold-400 hover:border-gold-500"
                    : "border-gray-200 hover:border-primary-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md">
                      PALING POPULER
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl md:text-4xl font-bold text-primary-600">{plan.price}</span>
                    {plan.period && <span className="text-gray-500">{plan.period}</span>}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => router.push(plan.popular ? "/register" : "/register")}
                  className={`w-full py-3.5 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[48px] ${
                    plan.popular
                      ? "text-white bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 focus:ring-gold-400"
                      : "text-primary-700 bg-primary-50 hover:bg-primary-100 focus:ring-primary-500"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 pattern-islamic opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-900 mb-3 md:mb-4">
            Siap Memulai?
          </h2>
          <p className="text-base md:text-lg text-primary-800/80 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Daftarkan TPQ Anda sekarang dan mulai kelola data secara digital
          </p>
          <button
            onClick={() => router.push("/register")}
            className="px-8 py-4 text-base font-semibold text-white bg-primary-700 hover:bg-primary-800 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gold-400 min-h-[48px]"
          >
            Daftar Sekarang
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Logo size="md" className="[&>span]:text-white" />
            <p className="text-sm text-center md:text-right">
              &copy; {new Date().getFullYear()} TPQ Digital. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
