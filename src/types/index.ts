// ============================================
// TYPES - Definisi tipe data untuk TPQ Digital
// ============================================

export interface Santri {
  ID_Santri: string;
  NIS: string;
  Nama: string;
  Jenis_Kelamin: "L" | "P";
  Tanggal_Lahir: string;
  Nama_Wali: string;
  No_WA: string;
  ID_Kelas: string;
  Status: "Aktif" | "Nonaktif";
  Access_Token: string;
  Created_At: string;
  Updated_At: string;
}

export interface Guru {
  ID_Guru: string;
  Nama: string;
  No_WA: string;
  Email: string;
  Status: "Aktif" | "Nonaktif";
  Created_At: string;
}

export interface Kelas {
  ID_Kelas: string;
  Nama_Kelas: string;
  ID_Guru: string;
  Hari: string;
  Jam: string;
  Status: "Aktif" | "Nonaktif";
}

export interface Absensi {
  ID_Absensi: string;
  Tanggal: string;
  ID_Santri: string;
  ID_Kelas: string;
  Status: "Hadir" | "Izin" | "Sakit" | "Alpa";
  ID_Guru: string;
  Catatan: string;
  Created_At: string;
}

export interface Progress {
  ID_Progress: string;
  Tanggal: string;
  ID_Santri: string;
  Kategori: string;
  Materi: string;
  Status: "Perlu Bimbingan" | "Berkembang" | "Baik";
  Catatan: string;
  ID_Guru: string;
  Created_At: string;
}

export interface Hafalan {
  ID_Hafalan: string;
  ID_Santri: string;
  Tanggal: string;
  Surah: string;
  Status: "Belum" | "Berkembang" | "Lancar" | "Perlu Murojaah";
  Catatan: string;
  ID_Guru: string;
  Created_At: string;
}

export interface Catatan {
  ID_Catatan: string;
  ID_Santri: string;
  Tanggal: string;
  ID_Guru: string;
  Catatan: string;
  Tampil_Ke_Wali: boolean;
  Created_At: string;
}

export interface Iuran {
  ID_Iuran: string;
  ID_Santri: string;
  Bulan: string;
  Jenis: string;
  Nominal: number;
  Status: "Lunas" | "Belum Bayar";
  Tanggal_Bayar: string;
  Catatan: string;
  Created_At: string;
}

export interface Pengumuman {
  ID_Pengumuman: string;
  Judul: string;
  Isi: string;
  Tanggal_Publish: string;
  Tanggal_Expired: string;
  Status: "Aktif" | "Nonaktif";
  Created_By: string;
  Created_At: string;
}

export interface Config {
  key: string;
  value: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form types
export interface SantriFormData {
  NIS: string;
  Nama: string;
  Jenis_Kelamin: string;
  Tanggal_Lahir: string;
  Nama_Wali: string;
  No_WA: string;
  ID_Kelas: string;
  Status: string;
}

export interface GuruFormData {
  Nama: string;
  No_WA: string;
  Email: string;
  Status: string;
}

export interface KelasFormData {
  Nama_Kelas: string;
  ID_Guru: string;
  Hari: string;
  Jam: string;
  Status: string;
}
