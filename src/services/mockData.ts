// ============================================
// MOCK DATA STORE
// Data dummy in-memory untuk development/testing
// ============================================

import { Santri, Guru, Kelas } from "@/types";

// ============================================
// DUMMY DATA
// ============================================

let santriData: Santri[] = [
  {
    ID_Santri: "SANTRI-001",
    NIS: "2024001",
    Nama: "Ahmad Fauzi",
    Jenis_Kelamin: "L",
    Tanggal_Lahir: "2015-03-15",
    Nama_Wali: "Budi Santoso",
    No_WA: "081234567890",
    ID_Kelas: "KELAS-001",
    Status: "Aktif",
    Access_Token: "token_ahmad_001",
    Created_At: "2024-01-15T08:00:00Z",
    Updated_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Santri: "SANTRI-002",
    NIS: "2024002",
    Nama: "Fatimah Azzahra",
    Jenis_Kelamin: "P",
    Tanggal_Lahir: "2015-05-20",
    Nama_Wali: "Siti Aminah",
    No_WA: "081234567891",
    ID_Kelas: "KELAS-001",
    Status: "Aktif",
    Access_Token: "token_fatimah_002",
    Created_At: "2024-01-15T08:00:00Z",
    Updated_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Santri: "SANTRI-003",
    NIS: "2024003",
    Nama: "Muhammad Rizki",
    Jenis_Kelamin: "L",
    Tanggal_Lahir: "2014-08-10",
    Nama_Wali: "Andi Wijaya",
    No_WA: "081234567892",
    ID_Kelas: "KELAS-002",
    Status: "Aktif",
    Access_Token: "token_rizki_003",
    Created_At: "2024-01-15T08:00:00Z",
    Updated_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Santri: "SANTRI-004",
    NIS: "2024004",
    Nama: "Aisyah Putri",
    Jenis_Kelamin: "P",
    Tanggal_Lahir: "2015-01-25",
    Nama_Wali: "Dewi Lestari",
    No_WA: "081234567893",
    ID_Kelas: "KELAS-001",
    Status: "Aktif",
    Access_Token: "token_aisyah_004",
    Created_At: "2024-01-15T08:00:00Z",
    Updated_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Santri: "SANTRI-005",
    NIS: "2024005",
    Nama: "Umar Faruq",
    Jenis_Kelamin: "L",
    Tanggal_Lahir: "2014-11-05",
    Nama_Wali: "Hassan Ali",
    No_WA: "081234567894",
    ID_Kelas: "KELAS-002",
    Status: "Aktif",
    Access_Token: "token_umar_005",
    Created_At: "2024-01-15T08:00:00Z",
    Updated_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Santri: "SANTRI-006",
    NIS: "2024006",
    Nama: "Khadijah Nur",
    Jenis_Kelamin: "P",
    Tanggal_Lahir: "2015-07-12",
    Nama_Wali: "Fatimah Zahra",
    No_WA: "081234567895",
    ID_Kelas: "KELAS-003",
    Status: "Aktif",
    Access_Token: "token_khadijah_006",
    Created_At: "2024-01-15T08:00:00Z",
    Updated_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Santri: "SANTRI-007",
    NIS: "2024007",
    Nama: "Ali Murtadho",
    Jenis_Kelamin: "L",
    Tanggal_Lahir: "2014-09-18",
    Nama_Wali: "Umar Hadi",
    No_WA: "081234567896",
    ID_Kelas: "KELAS-002",
    Status: "Aktif",
    Access_Token: "token_ali_007",
    Created_At: "2024-01-15T08:00:00Z",
    Updated_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Santri: "SANTRI-008",
    NIS: "2024008",
    Nama: "Zainab Kamila",
    Jenis_Kelamin: "P",
    Tanggal_Lahir: "2015-04-22",
    Nama_Wali: "Aminah Sari",
    No_WA: "081234567897",
    ID_Kelas: "KELAS-003",
    Status: "Aktif",
    Access_Token: "token_zainab_008",
    Created_At: "2024-01-15T08:00:00Z",
    Updated_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Santri: "SANTRI-009",
    NIS: "2024009",
    Nama: "Ibrahim Khalil",
    Jenis_Kelamin: "L",
    Tanggal_Lahir: "2014-12-08",
    Nama_Wali: "Yusuf Ibrahim",
    No_WA: "081234567898",
    ID_Kelas: "KELAS-004",
    Status: "Aktif",
    Access_Token: "token_ibrahim_009",
    Created_At: "2024-01-15T08:00:00Z",
    Updated_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Santri: "SANTRI-010",
    NIS: "2024010",
    Nama: "Maryam Salsabila",
    Jenis_Kelamin: "P",
    Tanggal_Lahir: "2015-06-30",
    Nama_Wali: "Salsabila Putri",
    No_WA: "081234567899",
    ID_Kelas: "KELAS-003",
    Status: "Aktif",
    Access_Token: "token_maryam_010",
    Created_At: "2024-01-15T08:00:00Z",
    Updated_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Santri: "SANTRI-011",
    NIS: "2024011",
    Nama: "Hamzah Abdillah",
    Jenis_Kelamin: "L",
    Tanggal_Lahir: "2014-10-14",
    Nama_Wali: "Abdillah Rahman",
    No_WA: "081234567800",
    ID_Kelas: "KELAS-004",
    Status: "Aktif",
    Access_Token: "token_hamzah_011",
    Created_At: "2024-01-15T08:00:00Z",
    Updated_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Santri: "SANTRI-012",
    NIS: "2024012",
    Nama: "Ruqayyah Aulia",
    Jenis_Kelamin: "P",
    Tanggal_Lahir: "2015-02-28",
    Nama_Wali: "Aulia Rahma",
    No_WA: "081234567801",
    ID_Kelas: "KELAS-005",
    Status: "Aktif",
    Access_Token: "token_ruqayyah_012",
    Created_At: "2024-01-15T08:00:00Z",
    Updated_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Santri: "SANTRI-013",
    NIS: "2024013",
    Nama: "Salman Alfarisi",
    Jenis_Kelamin: "L",
    Tanggal_Lahir: "2014-07-19",
    Nama_Wali: "Alfarisi Salman",
    No_WA: "081234567802",
    ID_Kelas: "KELAS-004",
    Status: "Aktif",
    Access_Token: "token_salman_013",
    Created_At: "2024-01-15T08:00:00Z",
    Updated_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Santri: "SANTRI-014",
    NIS: "2024014",
    Nama: "Naila Haura",
    Jenis_Kelamin: "P",
    Tanggal_Lahir: "2015-08-11",
    Nama_Wali: "Haura Naila",
    No_WA: "081234567803",
    ID_Kelas: "KELAS-005",
    Status: "Aktif",
    Access_Token: "token_naila_014",
    Created_At: "2024-01-15T08:00:00Z",
    Updated_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Santri: "SANTRI-015",
    NIS: "2024015",
    Nama: "Zaidan Hakim",
    Jenis_Kelamin: "L",
    Tanggal_Lahir: "2014-11-23",
    Nama_Wali: "Hakim Zaidan",
    No_WA: "081234567804",
    ID_Kelas: "KELAS-005",
    Status: "Nonaktif",
    Access_Token: "token_zaidan_015",
    Created_At: "2024-01-15T08:00:00Z",
    Updated_At: "2024-01-15T08:00:00Z",
  },
];

let guruData: Guru[] = [
  {
    ID_Guru: "GURU-001",
    Nama: "Ustadz Ahmad Syaifuddin",
    No_WA: "081234567890",
    Email: "ahmad@tpq.com",
    Status: "Aktif",
    Created_At: "2024-01-01T08:00:00Z",
  },
  {
    ID_Guru: "GURU-002",
    Nama: "Ustadz Yusuf Hamdani",
    No_WA: "081234567891",
    Email: "yusuf@tpq.com",
    Status: "Aktif",
    Created_At: "2024-01-01T08:00:00Z",
  },
  {
    ID_Guru: "GURU-003",
    Nama: "Ustadzah Fatimah Azzahra",
    No_WA: "081234567892",
    Email: "fatimah@tpq.com",
    Status: "Aktif",
    Created_At: "2024-01-01T08:00:00Z",
  },
  {
    ID_Guru: "GURU-004",
    Nama: "Ustadz Muhammad Rizki",
    No_WA: "081234567893",
    Email: "rizki@tpq.com",
    Status: "Aktif",
    Created_At: "2024-01-01T08:00:00Z",
  },
  {
    ID_Guru: "GURU-005",
    Nama: "Ustadzah Aisyah Putri",
    No_WA: "081234567894",
    Email: "aisyah@tpq.com",
    Status: "Nonaktif",
    Created_At: "2024-01-01T08:00:00Z",
  },
];

let kelasData: Kelas[] = [
  {
    ID_Kelas: "KELAS-001",
    Nama_Kelas: "Iqra 1A",
    ID_Guru: "GURU-001",
    Hari: "Senin",
    Jam: "15:30",
    Status: "Aktif",
  },
  {
    ID_Kelas: "KELAS-002",
    Nama_Kelas: "Iqra 2A",
    ID_Guru: "GURU-002",
    Hari: "Selasa",
    Jam: "15:30",
    Status: "Aktif",
  },
  {
    ID_Kelas: "KELAS-003",
    Nama_Kelas: "Iqra 3A",
    ID_Guru: "GURU-003",
    Hari: "Rabu",
    Jam: "15:30",
    Status: "Aktif",
  },
  {
    ID_Kelas: "KELAS-004",
    Nama_Kelas: "Tahfidz 1",
    ID_Guru: "GURU-004",
    Hari: "Kamis",
    Jam: "15:30",
    Status: "Aktif",
  },
  {
    ID_Kelas: "KELAS-005",
    Nama_Kelas: "Tahfidz 2",
    ID_Guru: "GURU-001",
    Hari: "Jumat",
    Jam: "15:30",
    Status: "Aktif",
  },
];

// ============================================
// SANTRI OPERATIONS
// ============================================

export function getAllSantri(): Santri[] {
  return [...santriData];
}

export function getSantriById(id: string): Santri | null {
  return santriData.find((s) => s.ID_Santri === id) || null;
}

export function createSantri(data: Omit<Santri, "ID_Santri" | "Access_Token" | "Created_At" | "Updated_At">): Santri {
  const now = new Date().toISOString();
  const newSantri: Santri = {
    ID_Santri: `SANTRI-${Date.now()}`,
    ...data,
    Access_Token: `token_${Math.random().toString(36).substring(2, 15)}`,
    Created_At: now,
    Updated_At: now,
  };
  santriData.push(newSantri);
  return newSantri;
}

export function updateSantri(id: string, data: Partial<Santri>): Santri | null {
  const index = santriData.findIndex((s) => s.ID_Santri === id);
  if (index === -1) return null;

  santriData[index] = {
    ...santriData[index],
    ...data,
    Updated_At: new Date().toISOString(),
  };
  return santriData[index];
}

export function deactivateSantri(id: string): boolean {
  const index = santriData.findIndex((s) => s.ID_Santri === id);
  if (index === -1) return false;

  santriData[index].Status = "Nonaktif";
  santriData[index].Updated_At = new Date().toISOString();
  return true;
}

export function searchSantri(query: string): Santri[] {
  const lowerQuery = query.toLowerCase();
  return santriData.filter(
    (s) =>
      s.Nama.toLowerCase().includes(lowerQuery) ||
      s.NIS.toLowerCase().includes(lowerQuery) ||
      s.Nama_Wali.toLowerCase().includes(lowerQuery)
  );
}

export function getSantriByKelas(kelasId: string): Santri[] {
  return santriData.filter((s) => s.ID_Kelas === kelasId && s.Status === "Aktif");
}

export function getSantriByStatus(status: "Aktif" | "Nonaktif"): Santri[] {
  return santriData.filter((s) => s.Status === status);
}

// ============================================
// GURU OPERATIONS
// ============================================

export function getAllGuru(): Guru[] {
  return [...guruData];
}

export function getGuruById(id: string): Guru | null {
  return guruData.find((g) => g.ID_Guru === id) || null;
}

export function createGuru(data: Omit<Guru, "ID_Guru" | "Created_At">): Guru {
  const now = new Date().toISOString();
  const newGuru: Guru = {
    ID_Guru: `GURU-${Date.now()}`,
    ...data,
    Created_At: now,
  };
  guruData.push(newGuru);
  return newGuru;
}

export function updateGuru(id: string, data: Partial<Guru>): Guru | null {
  const index = guruData.findIndex((g) => g.ID_Guru === id);
  if (index === -1) return null;

  guruData[index] = { ...guruData[index], ...data };
  return guruData[index];
}

// ============================================
// KELAS OPERATIONS
// ============================================

export function getAllKelas(): Kelas[] {
  return [...kelasData];
}

export function getKelasById(id: string): Kelas | null {
  return kelasData.find((k) => k.ID_Kelas === id) || null;
}

export function createKelas(data: Omit<Kelas, "ID_Kelas">): Kelas {
  const newKelas: Kelas = {
    ID_Kelas: `KELAS-${Date.now()}`,
    ...data,
  };
  kelasData.push(newKelas);
  return newKelas;
}

export function updateKelas(id: string, data: Partial<Kelas>): Kelas | null {
  const index = kelasData.findIndex((k) => k.ID_Kelas === id);
  if (index === -1) return null;

  kelasData[index] = { ...kelasData[index], ...data };
  return kelasData[index];
}
