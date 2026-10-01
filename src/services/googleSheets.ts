// ============================================
// GOOGLE SHEETS SERVICE
// Koneksi ke Google Sheets via Apps Script
// ============================================

const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

// Timeout untuk fetch request (10 detik)
const FETCH_TIMEOUT = 10000;

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 detik

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 menit
const cache = new Map<string, { data: unknown; timestamp: number }>();

// Helper: Check if Apps Script URL is configured
function checkConfig(): void {
  if (!APPS_SCRIPT_URL) {
    throw new Error("GOOGLE_APPS_SCRIPT_URL tidak dikonfigurasi. Silakan cek file .env.local");
  }
}

// Helper: Delay untuk retry
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper: Fetch dengan timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Helper: Call Apps Script API dengan retry dan cache
async function callAppsScript(
  method: "GET" | "POST",
  params: Record<string, string> = {},
  body: Record<string, unknown> = {},
  useCache: boolean = false
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    checkConfig();

    // Check cache untuk GET requests
    if (method === "GET" && useCache) {
      const cacheKey = JSON.stringify({ method, params });
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return { success: true, data: cached.data };
      }
    }

    let url = APPS_SCRIPT_URL!;
    const queryParams = new URLSearchParams();

    // Add params untuk GET request
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value);
    });

    if (method === "GET" && queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const options: RequestInit = {
      method,
      headers: { "Content-Type": "application/json" },
    };

    // Untuk POST, kirim sebagai JSON (Apps Script baru menerima JSON)
    if (method === "POST") {
      const payload = { action: params.action || "", ...body };
      options.body = JSON.stringify(payload);
    }

    // Retry mechanism
    let lastError: Error | null = null;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await fetchWithTimeout(url, options, FETCH_TIMEOUT);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        // Validate response structure
        if (typeof result !== "object" || result === null) {
          throw new Error("Response tidak valid dari Apps Script");
        }

        // Cache GET requests
        if (method === "GET" && useCache) {
          const cacheKey = JSON.stringify({ method, params });
          cache.set(cacheKey, { data: result.data, timestamp: Date.now() });
        }

        return result;
      } catch (error) {
        lastError = error as Error;
        console.error(`Apps Script call attempt ${attempt + 1} failed:`, error);

        if (attempt < MAX_RETRIES - 1) {
          await delay(RETRY_DELAY * (attempt + 1)); // Exponential backoff
        }
      }
    }

    throw lastError || new Error("Gagal terhubung ke Google Sheets setelah percobaan ulang");
  } catch (error) {
    console.error("callAppsScript error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal terhubung ke Google Sheets",
    };
  }
}

// Helper: Clear cache
export function clearCache(): void {
  cache.clear();
}

// ============================================
// SANTRI
// ============================================

export async function getAllSantri(tenantId?: string): Promise<Record<string, string>[]> {
  const result = await callAppsScript("GET", { action: "getStudents", tenantId: tenantId || "" }, {}, true);
  if (result.success) {
    return (result.data as Record<string, string>[]) || [];
  }
  throw new Error(result.error || "Gagal memuat data santri");
}

export async function getSantriById(id: string): Promise<Record<string, string> | null> {
  const result = await callAppsScript("GET", {
    action: "getStudentById",
    id,
  });
  if (result.success) {
    return (result.data as Record<string, string>) || null;
  }
  return null;
}

export async function getSantriByToken(token: string): Promise<Record<string, string> | null> {
  const result = await callAppsScript("GET", {
    action: "getStudentByToken",
    token,
  });
  if (result.success) {
    return (result.data as Record<string, string>) || null;
  }
  return null;
}

export async function createSantri(data: Record<string, unknown>): Promise<Record<string, string>> {
  clearCache(); // Clear cache setelah create
  const result = await callAppsScript("POST", { action: "createStudent" }, data);
  if (result.success) {
    return result.data as Record<string, string>;
  }
  throw new Error(result.error || "Gagal menambah santri");
}

export async function updateSantri(id: string, data: Record<string, unknown>): Promise<Record<string, string>> {
  clearCache(); // Clear cache setelah update
  const result = await callAppsScript("POST", { action: "updateStudent" }, { id, ...data });
  if (result.success) {
    return result.data as Record<string, string>;
  }
  throw new Error(result.error || "Gagal mengupdate santri");
}

export async function deactivateSantri(id: string): Promise<boolean> {
  clearCache(); // Clear cache setelah deactivate
  const result = await callAppsScript("POST", { action: "deactivateStudent" }, { id });
  if (result.success) {
    return true;
  }
  throw new Error(result.error || "Gagal menonaktifkan santri");
}

// ============================================
// GURU
// ============================================

export async function getAllGuru(tenantId?: string): Promise<Record<string, string>[]> {
  const result = await callAppsScript("GET", { action: "getTeachers", tenantId: tenantId || "" }, {}, true);
  if (result.success) {
    return (result.data as Record<string, string>[]) || [];
  }
  throw new Error(result.error || "Gagal memuat data guru");
}

export async function createGuru(data: Record<string, unknown>): Promise<Record<string, string>> {
  clearCache();
  const result = await callAppsScript("POST", { action: "createTeacher" }, data);
  if (result.success) {
    return result.data as Record<string, string>;
  }
  throw new Error(result.error || "Gagal menambah guru");
}

export async function updateGuru(id: string, data: Record<string, unknown>): Promise<Record<string, string>> {
  clearCache();
  const result = await callAppsScript("POST", { action: "updateTeacher" }, { id, ...data });
  if (result.success) {
    return result.data as Record<string, string>;
  }
  throw new Error(result.error || "Gagal mengupdate guru");
}

// ============================================
// KELAS
// ============================================

export async function getAllKelas(tenantId?: string): Promise<Record<string, string>[]> {
  const result = await callAppsScript("GET", { action: "getClasses", tenantId: tenantId || "" }, {}, true);
  if (result.success) {
    return (result.data as Record<string, string>[]) || [];
  }
  throw new Error(result.error || "Gagal memuat data kelas");
}

export async function createKelas(data: Record<string, unknown>): Promise<Record<string, string>> {
  clearCache();
  const result = await callAppsScript("POST", { action: "createClass" }, data);
  if (result.success) {
    return result.data as Record<string, string>;
  }
  throw new Error(result.error || "Gagal menambah kelas");
}

export async function updateKelas(id: string, data: Record<string, unknown>): Promise<Record<string, string>> {
  clearCache();
  const result = await callAppsScript("POST", { action: "updateClass" }, { id, ...data });
  if (result.success) {
    return result.data as Record<string, string>;
  }
  throw new Error(result.error || "Gagal mengupdate kelas");
}

// ============================================
// ABSENSI
// ============================================

export async function getAbsensiByKelasAndTanggal(
  tenantId: string,
  kelasId: string,
  tanggal: string
): Promise<Record<string, string>[]> {
  const result = await callAppsScript("GET", {
    action: "getAttendance",
    tenantId,
    kelasId,
    tanggal,
  });
  if (result.success) {
    return (result.data as Record<string, string>[]) || [];
  }
  throw new Error(result.error || "Gagal memuat absensi");
}

export async function getAbsensiStats(
  tenantId: string,
  santriId: string
): Promise<{ hadir: number; izin: number; sakit: number; alpa: number; total: number; persentase: number }> {
  const result = await callAppsScript("GET", {
    action: "getAttendanceBySantri",
    tenantId,
    santriId,
  });
  if (result.success) {
    return result.data as {
      hadir: number;
      izin: number;
      sakit: number;
      alpa: number;
      total: number;
      persentase: number;
    };
  }
  throw new Error(result.error || "Gagal memuat statistik absensi");
}

export async function saveAbsensi(absensiList: Record<string, unknown>[]): Promise<Record<string, string>> {
  clearCache();
  const result = await callAppsScript("POST", { action: "saveAttendance" }, { absensiList: JSON.stringify(absensiList) });
  if (result.success) {
    return result.data as Record<string, string>;
  }
  throw new Error(result.error || "Gagal menyimpan absensi");
}

// ============================================
// PROGRESS
// ============================================

export async function getAllProgress(): Promise<Record<string, string>[]> {
  const result = await callAppsScript("GET", { action: "getProgress" }, {}, true);
  if (result.success) {
    return (result.data as Record<string, string>[]) || [];
  }
  throw new Error(result.error || "Gagal memuat progress");
}

export async function getProgressBySantri(santriId: string): Promise<Record<string, string>[]> {
  const result = await callAppsScript("GET", {
    action: "getProgress",
    santriId,
  });
  if (result.success) {
    return (result.data as Record<string, string>[]) || [];
  }
  throw new Error(result.error || "Gagal memuat progress");
}

export async function createProgress(data: Record<string, unknown>): Promise<Record<string, string>> {
  clearCache();
  const result = await callAppsScript("POST", { action: "createProgress" }, data);
  if (result.success) {
    return result.data as Record<string, string>;
  }
  throw new Error(result.error || "Gagal menambah progress");
}

export async function updateProgress(id: string, data: Record<string, unknown>): Promise<Record<string, string>> {
  clearCache();
  const result = await callAppsScript("POST", { action: "updateProgress" }, { id, ...data });
  if (result.success) {
    return result.data as Record<string, string>;
  }
  throw new Error(result.error || "Gagal mengupdate progress");
}

export async function deleteProgress(id: string): Promise<boolean> {
  clearCache();
  const result = await callAppsScript("POST", { action: "deleteProgress" }, { id });
  if (result.success) {
    return true;
  }
  throw new Error(result.error || "Gagal menghapus progress");
}

// ============================================
// HAFALAN
// ============================================

export async function getAllHafalan(tenantId?: string): Promise<Record<string, string>[]> {
  const result = await callAppsScript("GET", { action: "getHafalan", tenantId: tenantId || "" }, {}, true);
  if (result.success) {
    return (result.data as Record<string, string>[]) || [];
  }
  throw new Error(result.error || "Gagal memuat hafalan");
}

export async function getHafalanBySantri(tenantId: string, santriId: string): Promise<Record<string, string>[]> {
  const result = await callAppsScript("GET", {
    action: "getHafalan",
    tenantId,
    santriId,
  });
  if (result.success) {
    return (result.data as Record<string, string>[]) || [];
  }
  throw new Error(result.error || "Gagal memuat hafalan");
}

export async function createHafalan(data: Record<string, unknown>): Promise<Record<string, string>> {
  clearCache();
  const result = await callAppsScript("POST", { action: "createHafalan" }, data);
  if (result.success) {
    return result.data as Record<string, string>;
  }
  throw new Error(result.error || "Gagal menambah hafalan");
}

export async function updateHafalan(id: string, data: Record<string, unknown>): Promise<Record<string, string>> {
  clearCache();
  const result = await callAppsScript("POST", { action: "updateHafalan" }, { id, ...data });
  if (result.success) {
    return result.data as Record<string, string>;
  }
  throw new Error(result.error || "Gagal mengupdate hafalan");
}

export async function deleteHafalan(id: string): Promise<boolean> {
  clearCache();
  const result = await callAppsScript("POST", { action: "deleteHafalan" }, { id });
  if (result.success) {
    return true;
  }
  throw new Error(result.error || "Gagal menghapus hafalan");
}

// ============================================
// CATATAN
// ============================================

export async function getAllCatatan(): Promise<Record<string, unknown>[]> {
  const result = await callAppsScript("GET", { action: "getCatatan" }, {}, true);
  if (result.success) {
    return (result.data as Record<string, unknown>[]) || [];
  }
  throw new Error(result.error || "Gagal memuat catatan");
}

export async function getCatatanBySantri(
  santriId: string,
  forWali: boolean = false
): Promise<Record<string, unknown>[]> {
  const result = await callAppsScript("GET", {
    action: "getCatatan",
    santriId,
    forWali: forWali ? "true" : "false",
  });
  if (result.success) {
    return (result.data as Record<string, unknown>[]) || [];
  }
  throw new Error(result.error || "Gagal memuat catatan");
}

export async function createCatatan(data: Record<string, unknown>): Promise<Record<string, string>> {
  clearCache();
  const result = await callAppsScript("POST", { action: "createCatatan" }, data);
  if (result.success) {
    return result.data as Record<string, string>;
  }
  throw new Error(result.error || "Gagal menambah catatan");
}

export async function updateCatatan(id: string, data: Record<string, unknown>): Promise<Record<string, string>> {
  clearCache();
  const result = await callAppsScript("POST", { action: "updateCatatan" }, { id, ...data });
  if (result.success) {
    return result.data as Record<string, string>;
  }
  throw new Error(result.error || "Gagal mengupdate catatan");
}

export async function deleteCatatan(id: string): Promise<boolean> {
  clearCache();
  const result = await callAppsScript("POST", { action: "deleteCatatan" }, { id });
  if (result.success) {
    return true;
  }
  throw new Error(result.error || "Gagal menghapus catatan");
}

// ============================================
// IURAN
// ============================================

export async function getAllIuran(tenantId?: string): Promise<Record<string, unknown>[]> {
  const result = await callAppsScript("GET", { action: "getIuran", tenantId: tenantId || "" }, {}, true);
  if (result.success) {
    return (result.data as Record<string, unknown>[]) || [];
  }
  throw new Error(result.error || "Gagal memuat iuran");
}

export async function getIuranBySantri(tenantId: string, santriId: string): Promise<Record<string, unknown>[]> {
  const result = await callAppsScript("GET", {
    action: "getIuran",
    tenantId,
    santriId,
  });
  if (result.success) {
    return (result.data as Record<string, unknown>[]) || [];
  }
  throw new Error(result.error || "Gagal memuat iuran");
}

export async function getIuranStats(tenantId?: string): Promise<{
  totalTagihan: number;
  totalPembayaran: number;
  totalTunggakan: number;
}> {
  const result = await callAppsScript("GET", { action: "getIuranStats", tenantId: tenantId || "" }, {}, true);
  if (result.success) {
    return result.data as {
      totalTagihan: number;
      totalPembayaran: number;
      totalTunggakan: number;
    };
  }
  throw new Error(result.error || "Gagal memuat statistik iuran");
}

export async function createIuran(data: Record<string, unknown>): Promise<Record<string, string>> {
  clearCache();
  const result = await callAppsScript("POST", { action: "createIuran" }, data);
  if (result.success) {
    return result.data as Record<string, string>;
  }
  throw new Error(result.error || "Gagal menambah iuran");
}

export async function updateIuran(id: string, data: Record<string, unknown>): Promise<Record<string, string>> {
  clearCache();
  const result = await callAppsScript("POST", { action: "updateIuran" }, { id, ...data });
  if (result.success) {
    return result.data as Record<string, string>;
  }
  throw new Error(result.error || "Gagal mengupdate iuran");
}

export async function deleteIuran(id: string): Promise<boolean> {
  clearCache();
  const result = await callAppsScript("POST", { action: "deleteIuran" }, { id });
  if (result.success) {
    return true;
  }
  throw new Error(result.error || "Gagal menghapus iuran");
}

// ============================================
// PENGUMUMAN
// ============================================

export async function getAllPengumuman(tenantId?: string): Promise<Record<string, string>[]> {
  const result = await callAppsScript("GET", { action: "getPengumuman", tenantId: tenantId || "" }, {}, true);
  if (result.success) {
    return (result.data as Record<string, string>[]) || [];
  }
  throw new Error(result.error || "Gagal memuat pengumuman");
}

export async function getActivePengumuman(tenantId?: string): Promise<Record<string, string>[]> {
  const result = await callAppsScript("GET", {
    action: "getPengumuman",
    tenantId: tenantId || "",
    active: "true",
  });
  if (result.success) {
    return (result.data as Record<string, string>[]) || [];
  }
  throw new Error(result.error || "Gagal memuat pengumuman");
}

export async function createPengumuman(data: Record<string, unknown>): Promise<Record<string, string>> {
  clearCache();
  const result = await callAppsScript("POST", { action: "createPengumuman" }, data);
  if (result.success) {
    return result.data as Record<string, string>;
  }
  throw new Error(result.error || "Gagal menambah pengumuman");
}

export async function updatePengumuman(id: string, data: Record<string, unknown>): Promise<Record<string, string>> {
  clearCache();
  const result = await callAppsScript("POST", { action: "updatePengumuman" }, { id, ...data });
  if (result.success) {
    return result.data as Record<string, string>;
  }
  throw new Error(result.error || "Gagal mengupdate pengumuman");
}

export async function deletePengumuman(id: string): Promise<boolean> {
  clearCache();
  const result = await callAppsScript("POST", { action: "deletePengumuman" }, { id });
  if (result.success) {
    return true;
  }
  throw new Error(result.error || "Gagal menghapus pengumuman");
}

// ============================================
// CONFIG
// ============================================

export async function getConfig(): Promise<Record<string, string>> {
  const result = await callAppsScript("GET", { action: "getConfig" }, {}, true);
  if (result.success) {
    return result.data as Record<string, string>;
  }
  throw new Error(result.error || "Gagal memuat config");
}

// ============================================
// INITIALIZE
// ============================================

export async function initializeSheets(): Promise<string> {
  const result = await callAppsScript("POST", { action: "initialize" });
  if (result.success) {
    return result.data as string;
  }
  throw new Error(result.error || "Gagal initialize sheets");
}
