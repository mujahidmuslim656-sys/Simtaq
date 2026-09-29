import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simtaq - Sistem Informasi Manajemen Taman Pengajian Al-Quran",
  description: "Sistem informasi untuk mengelola data santri, guru, kelas, absensi, dan hafalan Taman Pengajian Al-Quran",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
