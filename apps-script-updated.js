// ============================================
// TPQ DIGITAL - GOOGLE APPS SCRIPT (UPDATED)
// Kode ini untuk di-paste di Google Apps Script
// ============================================

// ============================================
// KONFIGURASI
// ============================================

// Nama sheet yang digunakan
const SHEET_NAMES = {
  CONFIG: "Config",
  TENANTS: "Tenants",
  SUBSCRIPTIONS: "Subscriptions",
  PAYMENTS: "Payments",
  SANTRI: "Santri",
  GURU: "Guru",
  KELAS: "Kelas",
  ABSENSI: "Absensi",
  PROGRESS: "Progress",
  HAFALAN: "Hafalan",
  CATATAN: "Catatan",
  IURAN: "Iuran",
  PENGUMUMAN: "Pengumuman",
};

// Headers untuk setiap sheet
const HEADERS = {
  Config: ["key", "value"],
  Tenants: [
    "Tenant_ID",
    "Nama_TPQ",
    "Nama_Penanggung_Jawab",
    "Email",
    "Password_Hash",
    "Alamat",
    "Paket",
    "Status",
    "Max_Santri",
    "Created_At",
    "Updated_At",
  ],
  Subscriptions: [
    "Subscription_ID",
    "Tenant_ID",
    "Paket",
    "Harga",
    "Mulai_Berlaku",
    "Expired_At",
    "Status",
    "Created_At",
  ],
  Payments: [
    "Payment_ID",
    "Tenant_ID",
    "Subscription_ID",
    "Jumlah",
    "Metode",
    "Bukti_Transfer",
    "Status",
    "Verified_By",
    "Verified_At",
    "Created_At",
  ],
  Santri: [
    "ID_Santri",
    "Tenant_ID",
    "NIS",
    "Nama",
    "Jenis_Kelamin",
    "Tanggal_Lahir",
    "Nama_Wali",
    "No_WA",
    "ID_Kelas",
    "Status",
    "Access_Token",
    "Created_At",
    "Updated_At",
  ],
  Guru: ["ID_Guru", "Tenant_ID", "Nama", "No_WA", "Email", "Status", "Created_At"],
  Kelas: ["ID_Kelas", "Tenant_ID", "Nama_Kelas", "ID_Guru", "Hari", "Jam", "Status"],
  Absensi: [
    "ID_Absensi",
    "Tenant_ID",
    "Tanggal",
    "ID_Santri",
    "ID_Kelas",
    "Status",
    "ID_Guru",
    "Catatan",
    "Created_At",
  ],
  Progress: [
    "ID_Progress",
    "Tenant_ID",
    "Tanggal",
    "ID_Santri",
    "Kategori",
    "Materi",
    "Status",
    "Catatan",
    "ID_Guru",
    "Created_At",
  ],
  Hafalan: [
    "ID_Hafalan",
    "Tenant_ID",
    "ID_Santri",
    "Tanggal",
    "Surah",
    "Status",
    "Catatan",
    "ID_Guru",
    "Created_At",
  ],
  Catatan: [
    "ID_Catatan",
    "Tenant_ID",
    "ID_Santri",
    "Tanggal",
    "ID_Guru",
    "Catatan",
    "Tampil_Ke_Wali",
    "Created_At",
  ],
  Iuran: [
    "ID_Iuran",
    "Tenant_ID",
    "ID_Santri",
    "Bulan",
    "Jenis",
    "Nominal",
    "Status",
    "Tanggal_Bayar",
    "Catatan",
    "Created_At",
  ],
  Pengumuman: [
    "ID_Pengumuman",
    "Tenant_ID",
    "Judul",
    "Isi",
    "Tanggal_Publish",
    "Tanggal_Expired",
    "Status",
    "Created_By",
    "Created_At",
  ],
};

// ============================================
// INITIALIZATION
// ============================================

// Fungsi ini dipanggil saat pertama kali setup
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Buat sheet jika belum ada
  Object.values(SHEET_NAMES).forEach((sheetName) => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    // Setup headers
    const headers = HEADERS[sheetName];
    if (headers && headers.length > 0) {
      const headerRow = sheet.getRange(1, 1, 1, headers.length);
      headerRow.setValues([headers]);
      headerRow.setFontWeight("bold");
      headerRow.setBackground("#4285f4");
      headerRow.setFontColor("#ffffff");
    }
  });

  // Setup Config default
  const configSheet = ss.getSheetByName(SHEET_NAMES.CONFIG);
  if (configSheet.getLastRow() === 0) {
    configSheet.appendRow(["nama_tpq", "TPQ Al-Hidayah"]);
    configSheet.appendRow(["alamat", "Jl. Contoh No. 123"]);
    configSheet.appendRow(["logo_url", ""]);
    configSheet.appendRow(["tahun_ajaran", "2024/2025"]);
  }

  return "Sheets initialized successfully!";
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(sheetName);
}

function sheetToJSON(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length === 0) return [];

  const headers = data[0];
  const rows = data.slice(1);

  return rows.map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || "";
    });
    return obj;
  });
}

function jsonToRow(headers, obj) {
  return headers.map((header) => {
    const value = obj[header];
    if (value === undefined || value === null) return "";
    return value;
  });
}

function generateId(prefix) {
  return prefix + "-" + new Date().getTime() + "-" + Math.random().toString(36).substr(2, 9);
}

function findRowIndex(sheet, idColumn, id) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][idColumn] === id) {
      return i + 1; // +1 karena index 0 adalah header
    }
  }
  return -1;
}

// ============================================
// DO GET - Handle GET requests
// ============================================

function doGet(e) {
  const action = e.parameter.action;
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    switch (action) {
      // TENANTS
      case "getTenants":
        return getTenants();
      case "getTenantById":
        return getTenantById(e.parameter.tenantId);
      case "getTenantByEmail":
        return getTenantByEmail(e.parameter.email);

      // SUBSCRIPTIONS
      case "getSubscriptionByTenant":
        return getSubscriptionByTenant(e.parameter.tenantId);

      // PAYMENTS
      case "getPayments":
        return getPayments();
      case "getPaymentsByTenant":
        return getPaymentsByTenant(e.parameter.tenantId);

      // ADMIN STATS
      case "getAdminStats":
        return getAdminStats();

      // SANTRI
      case "getStudents":
        return getStudents(e.parameter.tenantId);
      case "getStudentById":
        return getStudentById(e.parameter.id);
      case "getStudentByToken":
        return getStudentByToken(e.parameter.token);

      // GURU
      case "getTeachers":
        return getTeachers(e.parameter.tenantId);

      // KELAS
      case "getClasses":
        return getClasses(e.parameter.tenantId);

      // ABSENSI
      case "getAttendance":
        return getAttendance(e.parameter.tenantId, e.parameter.kelasId, e.parameter.tanggal);
      case "getAttendanceBySantri":
        return getAttendanceBySantri(e.parameter.tenantId, e.parameter.santriId);

      // PROGRESS
      case "getProgress":
        return getProgress(e.parameter.tenantId, e.parameter.santriId);

      // HAFALAN
      case "getHafalan":
        return getHafalan(e.parameter.tenantId, e.parameter.santriId);

      // CATATAN
      case "getCatatan":
        return getCatatan(e.parameter.tenantId, e.parameter.santriId, e.parameter.forWali);

      // IURAN
      case "getIuran":
        return getIuran(e.parameter.tenantId, e.parameter.santriId);
      case "getIuranStats":
        return getIuranStats(e.parameter.tenantId);

      // PENGUMUMAN
      case "getPengumuman":
        return getPengumuman(e.parameter.tenantId, e.parameter.active);

      // CONFIG
      case "getConfig":
        return getConfig();

      default:
        return jsonResponse({ success: false, message: "Action tidak dikenal" });
    }
  } catch (error) {
    return jsonResponse({ success: false, message: error.toString() });
  }
}

// ============================================
// DO POST - Handle POST requests
// ============================================

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;

  try {
    switch (action) {
      // TENANTS
      case "createTenant":
        return createTenant(data);
      case "loginTenant":
        return loginTenant(data.email, data.password);
      case "updateTenantPlan":
        return updateTenantPlan(data.tenantId, data.paket);
      case "updateTenant":
        return updateTenantProfile(data.tenantId, data);

      // SUBSCRIPTIONS
      case "createSubscription":
        return createSubscription(data);

      // PAYMENTS
      case "createPayment":
        return createPayment(data);
      case "verifyPayment":
        return verifyPayment(data.paymentId, data.approved, data.verifiedBy);

      // SANTRI
      case "createStudent":
        return createStudent(data);
      case "updateStudent":
        return updateStudent(data.id, data.data);
      case "deactivateStudent":
        return deactivateStudent(data.id);

      // GURU
      case "createTeacher":
        return createTeacher(data);
      case "updateTeacher":
        return updateTeacher(data.id, data.data);

      // KELAS
      case "createClass":
        return createClass(data);
      case "updateClass":
        return updateClass(data.id, data.data);

      // ABSENSI
      case "saveAttendance":
        return saveAttendance(data.absensiList);

      // PROGRESS
      case "createProgress":
        return createProgress(data);
      case "updateProgress":
        return updateProgress(data.id, data.data);
      case "deleteProgress":
        return deleteProgress(data.id);

      // HAFALAN
      case "createHafalan":
        return createHafalan(data);
      case "updateHafalan":
        return updateHafalan(data.id, data.data);
      case "deleteHafalan":
        return deleteHafalan(data.id);

      // CATATAN
      case "createCatatan":
        return createCatatan(data);
      case "updateCatatan":
        return updateCatatan(data.id, data.data);
      case "deleteCatatan":
        return deleteCatatan(data.id);

      // IURAN
      case "createIuran":
        return createIuran(data);
      case "updateIuran":
        return updateIuran(data.id, data.data);
      case "deleteIuran":
        return deleteIuran(data.id);

      // PENGUMUMAN
      case "createPengumuman":
        return createPengumuman(data);
      case "updatePengumuman":
        return updatePengumuman(data.id, data.data);
      case "deletePengumuman":
        return deletePengumuman(data.id);

      // INIT
      case "initialize":
        return jsonResponse({ success: true, message: initializeSheets() });

      default:
        return jsonResponse({ success: false, message: "Action tidak dikenal" });
    }
  } catch (error) {
    return jsonResponse({ success: false, message: error.toString() });
  }
}

// ============================================
// TENANT FUNCTIONS
// ============================================

function getTenants() {
  const sheet = getSheet(SHEET_NAMES.TENANTS);
  const data = sheetToJSON(sheet);
  return jsonResponse({ success: true, data: data });
}

function getTenantById(tenantId) {
  const sheet = getSheet(SHEET_NAMES.TENANTS);
  const data = sheetToJSON(sheet);
  const tenant = data.find((t) => t.Tenant_ID === tenantId);
  return jsonResponse({ success: true, data: tenant || null });
}

function getTenantByEmail(email) {
  const sheet = getSheet(SHEET_NAMES.TENANTS);
  const data = sheetToJSON(sheet);
  const tenant = data.find((t) => t.Email === email);
  return jsonResponse({ success: true, data: tenant || null });
}

function createTenant(data) {
  const sheet = getSheet(SHEET_NAMES.TENANTS);
  const headers = HEADERS[SHEET_NAMES.TENANTS];

  // Cek email sudah terdaftar
  const existingData = sheetToJSON(sheet);
  if (existingData.find((t) => t.Email === data.email)) {
    return jsonResponse({ success: false, message: "Email sudah terdaftar" });
  }

  const id = generateId("TPQ");
  const now = new Date().toISOString();

  const row = [
    id,
    data.nama_tpq || "",
    data.nama_penanggung_jawab || "",
    data.email || "",
    data.password || "", // TODO: Hash password di client-side
    data.alamat || "",
    "free",
    "active",
    10,
    now,
    now,
  ];

  sheet.appendRow(row);

  // Buat subscription free
  const subSheet = getSheet(SHEET_NAMES.SUBSCRIPTIONS);
  const subHeaders = HEADERS[SHEET_NAMES.SUBSCRIPTIONS];
  const subRow = [
    generateId("SUB"),
    id,
    "free",
    0,
    now,
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    "active",
    now,
  ];
  subSheet.appendRow(subRow);

  return jsonResponse({
    success: true,
    data: { Tenant_ID: id, Nama_TPQ: data.nama_tpq, Paket: "free" },
  });
}

function loginTenant(email, password) {
  const sheet = getSheet(SHEET_NAMES.TENANTS);
  const data = sheetToJSON(sheet);
  const tenant = data.find((t) => t.Email === email && t.Password_Hash === password);

  if (tenant) {
    return jsonResponse({
      success: true,
      data: {
        Tenant_ID: tenant.Tenant_ID,
        Nama_TPQ: tenant.Nama_TPQ,
        Email: tenant.Email,
        Paket: tenant.Paket,
        Max_Santri: tenant.Max_Santri,
        Status: tenant.Status,
      },
    });
  }

  return jsonResponse({ success: false, message: "Email atau password salah" });
}

function updateTenantPlan(tenantId, paket) {
  const sheet = getSheet(SHEET_NAMES.TENANTS);
  const rowIndex = findRowIndex(sheet, 0, tenantId);

  if (rowIndex === -1) {
    return jsonResponse({ success: false, message: "Tenant tidak ditemukan" });
  }

  sheet.getRange(rowIndex, 7).setValue(paket); // Paket
  sheet.getRange(rowIndex, 9).setValue(paket === "pro" ? 100 : 10); // Max_Santri
  sheet.getRange(rowIndex, 11).setValue(new Date().toISOString()); // Updated_At

  return jsonResponse({ success: true });
}

function updateTenantProfile(tenantId, data) {
  const sheet = getSheet(SHEET_NAMES.TENANTS);
  const rowIndex = findRowIndex(sheet, 0, tenantId);

  if (rowIndex === -1) {
    return jsonResponse({ success: false, message: "Tenant tidak ditemukan" });
  }

  if (!data.Nama_TPQ || !data.Nama_Penanggung_Jawab || !data.Email || !data.Alamat) {
    return jsonResponse({ success: false, message: "Semua field wajib diisi" });
  }

  sheet.getRange(rowIndex, 2).setValue(data.Nama_TPQ); // Nama_TPQ
  sheet.getRange(rowIndex, 3).setValue(data.Nama_Penanggung_Jawab); // Nama_Penanggung_Jawab
  sheet.getRange(rowIndex, 4).setValue(data.Email); // Email
  sheet.getRange(rowIndex, 6).setValue(data.Alamat); // Alamat
  if (data.Status) {
    sheet.getRange(rowIndex, 8).setValue(data.Status); // Status
  }
  sheet.getRange(rowIndex, 11).setValue(new Date().toISOString()); // Updated_At

  const tenant = sheetToJSON(sheet).find((t) => t.Tenant_ID === tenantId);
  return jsonResponse({ success: true, data: tenant || null });
}

// ============================================
// SUBSCRIPTION FUNCTIONS
// ============================================

function getSubscriptionByTenant(tenantId) {
  const sheet = getSheet(SHEET_NAMES.SUBSCRIPTIONS);
  const data = sheetToJSON(sheet);
  const subscription = data.find((s) => s.Tenant_ID === tenantId && s.Status === "active");
  return jsonResponse({ success: true, data: subscription || null });
}

function createSubscription(data) {
  const sheet = getSheet(SHEET_NAMES.SUBSCRIPTIONS);
  const headers = HEADERS[SHEET_NAMES.SUBSCRIPTIONS];

  // Cancel existing active subscription
  const existingData = sheetToJSON(sheet);
  existingData.forEach((sub) => {
    if (sub.Tenant_ID === data.tenant_id && sub.Status === "active") {
      const rowIndex = findRowIndex(sheet, 0, sub.Subscription_ID);
      sheet.getRange(rowIndex, 7).setValue("cancelled");
    }
  });

  const now = new Date().toISOString();
  const row = [
    generateId("SUB"),
    data.tenant_id,
    data.paket,
    data.harga,
    now,
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    "active",
    now,
  ];

  sheet.appendRow(row);
  return jsonResponse({ success: true, data: { Subscription_ID: row[0] } });
}

// ============================================
// PAYMENT FUNCTIONS
// ============================================

function getPayments() {
  const sheet = getSheet(SHEET_NAMES.PAYMENTS);
  const data = sheetToJSON(sheet);
  return jsonResponse({ success: true, data: data });
}

function getPaymentsByTenant(tenantId) {
  const sheet = getSheet(SHEET_NAMES.PAYMENTS);
  const data = sheetToJSON(sheet);
  const filtered = data.filter((p) => p.Tenant_ID === tenantId);
  return jsonResponse({ success: true, data: filtered });
}

function createPayment(data) {
  const sheet = getSheet(SHEET_NAMES.PAYMENTS);
  const headers = HEADERS[SHEET_NAMES.PAYMENTS];
  const now = new Date().toISOString();

  const row = [
    generateId("PAY"),
    data.tenant_id,
    data.subscription_id,
    data.jumlah,
    "transfer_bank",
    data.bukti_transfer || "",
    "pending",
    "",
    "",
    now,
  ];

  sheet.appendRow(row);
  return jsonResponse({ success: true, data: { Payment_ID: row[0] } });
}

function verifyPayment(paymentId, approved, verifiedBy) {
  const sheet = getSheet(SHEET_NAMES.PAYMENTS);
  const rowIndex = findRowIndex(sheet, 0, paymentId);

  if (rowIndex === -1) {
    return jsonResponse({ success: false, message: "Payment tidak ditemukan" });
  }

  const now = new Date().toISOString();
  sheet.getRange(rowIndex, 7).setValue(approved ? "approved" : "rejected");
  sheet.getRange(rowIndex, 8).setValue(verifiedBy);
  sheet.getRange(rowIndex, 9).setValue(now);

  // Jika approved, update tenant plan
  if (approved) {
    const data = sheetToJSON(sheet);
    const payment = data.find((p) => p.Payment_ID === paymentId);
    if (payment) {
      const subSheet = getSheet(SHEET_NAMES.SUBSCRIPTIONS);
      const subData = sheetToJSON(subSheet);
      const subscription = subData.find((s) => s.Subscription_ID === payment.Subscription_ID);
      if (subscription) {
        updateTenantPlan(payment.Tenant_ID, subscription.Paket);
      }
    }
  }

  return jsonResponse({ success: true });
}

// ============================================
// ADMIN STATS
// ============================================

function getAdminStats() {
  const tenantsSheet = getSheet(SHEET_NAMES.TENANTS);
  const paymentsSheet = getSheet(SHEET_NAMES.PAYMENTS);

  const tenants = sheetToJSON(tenantsSheet);
  const payments = sheetToJSON(paymentsSheet);

  return jsonResponse({
    success: true,
    data: {
      totalTenants: tenants.length,
      activeTenants: tenants.filter((t) => t.Status === "active").length,
      pendingPayments: payments.filter((p) => p.Status === "pending").length,
      proTenants: tenants.filter((t) => t.Paket === "pro").length,
    },
  });
}

// ============================================
// SANTRI FUNCTIONS
// ============================================

function getStudents(tenantId) {
  const sheet = getSheet(SHEET_NAMES.SANTRI);
  const data = sheetToJSON(sheet);
  const filtered = tenantId ? data.filter((s) => s.Tenant_ID === tenantId) : data;
  return jsonResponse({ success: true, data: filtered });
}

function getStudentById(id) {
  const sheet = getSheet(SHEET_NAMES.SANTRI);
  const data = sheetToJSON(sheet);
  const student = data.find((s) => s.ID_Santri === id);
  return jsonResponse({ success: true, data: student || null });
}

function getStudentByToken(token) {
  const sheet = getSheet(SHEET_NAMES.SANTRI);
  const data = sheetToJSON(sheet);
  const student = data.find((s) => s.Access_Token === token);
  return jsonResponse({ success: true, data: student || null });
}

function createStudent(data) {
  const sheet = getSheet(SHEET_NAMES.SANTRI);
  const headers = HEADERS[SHEET_NAMES.SANTRI];

  const id = generateId("SANTRI");
  const token = generateId("token");
  const now = new Date().toISOString();

  const row = [
    id,
    data.tenant_id || "",
    data.NIS || "",
    data.Nama || "",
    data.Jenis_Kelamin || "L",
    data.Tanggal_Lahir || "",
    data.Nama_Wali || "",
    data.No_WA || "",
    data.ID_Kelas || "",
    data.Status || "Aktif",
    token,
    now,
    now,
  ];

  sheet.appendRow(row);
  return jsonResponse({ success: true, data: { ID_Santri: id, Access_Token: token } });
}

function updateStudent(id, data) {
  const sheet = getSheet(SHEET_NAMES.SANTRI);
  const headers = HEADERS[SHEET_NAMES.SANTRI];
  const rowIndex = findRowIndex(sheet, 0, id);

  if (rowIndex === -1) {
    return jsonResponse({ success: false, message: "Santri tidak ditemukan" });
  }

  const row = jsonToRow(headers, { ...data, Updated_At: new Date().toISOString() });
  sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);

  return jsonResponse({ success: true, data: { ID_Santri: id } });
}

function deactivateStudent(id) {
  const sheet = getSheet(SHEET_NAMES.SANTRI);
  const rowIndex = findRowIndex(sheet, 0, id);

  if (rowIndex === -1) {
    return jsonResponse({ success: false, message: "Santri tidak ditemukan" });
  }

  sheet.getRange(rowIndex, 10).setValue("Nonaktif");
  return jsonResponse({ success: true });
}

// ============================================
// GURU FUNCTIONS
// ============================================

function getTeachers(tenantId) {
  const sheet = getSheet(SHEET_NAMES.GURU);
  const data = sheetToJSON(sheet);
  const filtered = tenantId ? data.filter((g) => g.Tenant_ID === tenantId) : data;
  return jsonResponse({ success: true, data: filtered });
}

function createTeacher(data) {
  const sheet = getSheet(SHEET_NAMES.GURU);
  const headers = HEADERS[SHEET_NAMES.GURU];

  const id = generateId("GURU");
  const now = new Date().toISOString();

  const row = [
    id,
    data.tenant_id || "",
    data.Nama || "",
    data.No_WA || "",
    data.Email || "",
    data.Status || "Aktif",
    now,
  ];

  sheet.appendRow(row);
  return jsonResponse({ success: true, data: { ID_Guru: id } });
}

function updateTeacher(id, data) {
  const sheet = getSheet(SHEET_NAMES.GURU);
  const headers = HEADERS[SHEET_NAMES.GURU];
  const rowIndex = findRowIndex(sheet, 0, id);

  if (rowIndex === -1) {
    return jsonResponse({ success: false, message: "Guru tidak ditemukan" });
  }

  const row = jsonToRow(headers, data);
  sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);

  return jsonResponse({ success: true, data: { ID_Guru: id } });
}

// ============================================
// KELAS FUNCTIONS
// ============================================

function getClasses(tenantId) {
  const sheet = getSheet(SHEET_NAMES.KELAS);
  const data = sheetToJSON(sheet);
  const filtered = tenantId ? data.filter((k) => k.Tenant_ID === tenantId) : data;
  return jsonResponse({ success: true, data: filtered });
}

function createClass(data) {
  const sheet = getSheet(SHEET_NAMES.KELAS);
  const headers = HEADERS[SHEET_NAMES.KELAS];

  const id = generateId("KELAS");

  const row = [
    id,
    data.tenant_id || "",
    data.Nama_Kelas || "",
    data.ID_Guru || "",
    data.Hari || "",
    data.Jam || "",
    data.Status || "Aktif",
  ];

  sheet.appendRow(row);
  return jsonResponse({ success: true, data: { ID_Kelas: id } });
}

function updateClass(id, data) {
  const sheet = getSheet(SHEET_NAMES.KELAS);
  const headers = HEADERS[SHEET_NAMES.KELAS];
  const rowIndex = findRowIndex(sheet, 0, id);

  if (rowIndex === -1) {
    return jsonResponse({ success: false, message: "Kelas tidak ditemukan" });
  }

  const row = jsonToRow(headers, data);
  sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);

  return jsonResponse({ success: true, data: { ID_Kelas: id } });
}

// ============================================
// ABSENSI FUNCTIONS
// ============================================

function getAttendance(tenantId, kelasId, tanggal) {
  const sheet = getSheet(SHEET_NAMES.ABSENSI);
  const data = sheetToJSON(sheet);

  const filtered = data.filter(
    (a) => a.Tenant_ID === tenantId && a.ID_Kelas === kelasId && a.Tanggal === tanggal
  );

  return jsonResponse({ success: true, data: filtered });
}

function getAttendanceBySantri(tenantId, santriId) {
  const sheet = getSheet(SHEET_NAMES.ABSENSI);
  const data = sheetToJSON(sheet);

  const filtered = data.filter((a) => a.Tenant_ID === tenantId && a.ID_Santri === santriId);

  const stats = {
    hadir: filtered.filter((a) => a.Status === "Hadir").length,
    izin: filtered.filter((a) => a.Status === "Izin").length,
    sakit: filtered.filter((a) => a.Status === "Sakit").length,
    alpa: filtered.filter((a) => a.Status === "Alpa").length,
    total: filtered.length,
    persentase:
      filtered.length > 0
        ? Math.round(
            (filtered.filter((a) => a.Status === "Hadir").length / filtered.length) * 100
          )
        : 0,
  };

  return jsonResponse({ success: true, data: stats });
}

function saveAttendance(absensiList) {
  const sheet = getSheet(SHEET_NAMES.ABSENSI);
  const headers = HEADERS[SHEET_NAMES.ABSENSI];
  const now = new Date().toISOString();

  absensiList.forEach((absensi) => {
    const data = sheetToJSON(sheet);
    const existing = data.find(
      (a) =>
        a.Tenant_ID === absensi.tenant_id &&
        a.ID_Santri === absensi.ID_Santri &&
        a.ID_Kelas === absensi.ID_Kelas &&
        a.Tanggal === absensi.Tanggal
    );

    if (existing) {
      const rowIndex = findRowIndex(sheet, 0, existing.ID_Absensi);
      const row = [
        existing.ID_Absensi,
        existing.Tenant_ID,
        absensi.Tanggal,
        absensi.ID_Santri,
        absensi.ID_Kelas,
        absensi.Status,
        absensi.ID_Guru,
        absensi.Catatan || "",
        existing.Created_At,
      ];
      sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
    } else {
      const id = generateId("ABS");
      const row = [
        id,
        absensi.tenant_id,
        absensi.Tanggal,
        absensi.ID_Santri,
        absensi.ID_Kelas,
        absensi.Status,
        absensi.ID_Guru,
        absensi.Catatan || "",
        now,
      ];
      sheet.appendRow(row);
    }
  });

  return jsonResponse({ success: true, message: "Absensi berhasil disimpan" });
}

// ============================================
// PROGRESS FUNCTIONS
// ============================================

function getProgress(tenantId, santriId) {
  const sheet = getSheet(SHEET_NAMES.PROGRESS);
  const data = sheetToJSON(sheet);

  let filtered = data;
  if (tenantId) filtered = filtered.filter((p) => p.Tenant_ID === tenantId);
  if (santriId) filtered = filtered.filter((p) => p.ID_Santri === santriId);

  return jsonResponse({ success: true, data: filtered });
}

function createProgress(data) {
  const sheet = getSheet(SHEET_NAMES.PROGRESS);
  const headers = HEADERS[SHEET_NAMES.PROGRESS];

  const id = generateId("PROG");
  const now = new Date().toISOString();

  const row = [
    id,
    data.tenant_id || "",
    data.Tanggal || now,
    data.ID_Santri || "",
    data.Kategori || "",
    data.Materi || "",
    data.Status || "",
    data.Catatan || "",
    data.ID_Guru || "",
    now,
  ];

  sheet.appendRow(row);
  return jsonResponse({ success: true, data: { ID_Progress: id } });
}

function updateProgress(id, data) {
  const sheet = getSheet(SHEET_NAMES.PROGRESS);
  const headers = HEADERS[SHEET_NAMES.PROGRESS];
  const rowIndex = findRowIndex(sheet, 0, id);

  if (rowIndex === -1) {
    return jsonResponse({ success: false, message: "Progress tidak ditemukan" });
  }

  const row = jsonToRow(headers, data);
  sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);

  return jsonResponse({ success: true, data: { ID_Progress: id } });
}

function deleteProgress(id) {
  const sheet = getSheet(SHEET_NAMES.PROGRESS);
  const rowIndex = findRowIndex(sheet, 0, id);

  if (rowIndex === -1) {
    return jsonResponse({ success: false, message: "Progress tidak ditemukan" });
  }

  sheet.deleteRow(rowIndex);
  return jsonResponse({ success: true });
}

// ============================================
// HAFALAN FUNCTIONS
// ============================================

function getHafalan(tenantId, santriId) {
  const sheet = getSheet(SHEET_NAMES.HAFALAN);
  const data = sheetToJSON(sheet);

  let filtered = data;
  if (tenantId) filtered = filtered.filter((h) => h.Tenant_ID === tenantId);
  if (santriId) filtered = filtered.filter((h) => h.ID_Santri === santriId);

  return jsonResponse({ success: true, data: filtered });
}

function createHafalan(data) {
  const sheet = getSheet(SHEET_NAMES.HAFALAN);
  const headers = HEADERS[SHEET_NAMES.HAFALAN];

  const id = generateId("HAF");
  const now = new Date().toISOString();

  const row = [
    id,
    data.tenant_id || "",
    data.ID_Santri || "",
    data.Tanggal || now,
    data.Surah || "",
    data.Status || "",
    data.Catatan || "",
    data.ID_Guru || "",
    now,
  ];

  sheet.appendRow(row);
  return jsonResponse({ success: true, data: { ID_Hafalan: id } });
}

function updateHafalan(id, data) {
  const sheet = getSheet(SHEET_NAMES.HAFALAN);
  const headers = HEADERS[SHEET_NAMES.HAFALAN];
  const rowIndex = findRowIndex(sheet, 0, id);

  if (rowIndex === -1) {
    return jsonResponse({ success: false, message: "Hafalan tidak ditemukan" });
  }

  const row = jsonToRow(headers, data);
  sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);

  return jsonResponse({ success: true, data: { ID_Hafalan: id } });
}

function deleteHafalan(id) {
  const sheet = getSheet(SHEET_NAMES.HAFALAN);
  const rowIndex = findRowIndex(sheet, 0, id);

  if (rowIndex === -1) {
    return jsonResponse({ success: false, message: "Hafalan tidak ditemukan" });
  }

  sheet.deleteRow(rowIndex);
  return jsonResponse({ success: true });
}

// ============================================
// CATATAN FUNCTIONS
// ============================================

function getCatatan(tenantId, santriId, forWali) {
  const sheet = getSheet(SHEET_NAMES.CATATAN);
  const data = sheetToJSON(sheet);

  let filtered = data;
  if (tenantId) filtered = filtered.filter((c) => c.Tenant_ID === tenantId);
  if (santriId) filtered = filtered.filter((c) => c.ID_Santri === santriId);
  if (forWali === "true") {
    filtered = filtered.filter((c) => c.Tampil_Ke_Wali === true || c.Tampil_Ke_Wali === "true");
  }

  return jsonResponse({ success: true, data: filtered });
}

function createCatatan(data) {
  const sheet = getSheet(SHEET_NAMES.CATATAN);
  const headers = HEADERS[SHEET_NAMES.CATATAN];

  const id = generateId("CAT");
  const now = new Date().toISOString();

  const row = [
    id,
    data.tenant_id || "",
    data.ID_Santri || "",
    data.Tanggal || now,
    data.ID_Guru || "",
    data.Catatan || "",
    data.Tampil_Ke_Wali || false,
    now,
  ];

  sheet.appendRow(row);
  return jsonResponse({ success: true, data: { ID_Catatan: id } });
}

function updateCatatan(id, data) {
  const sheet = getSheet(SHEET_NAMES.CATATAN);
  const headers = HEADERS[SHEET_NAMES.CATATAN];
  const rowIndex = findRowIndex(sheet, 0, id);

  if (rowIndex === -1) {
    return jsonResponse({ success: false, message: "Catatan tidak ditemukan" });
  }

  const row = jsonToRow(headers, data);
  sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);

  return jsonResponse({ success: true, data: { ID_Catatan: id } });
}

function deleteCatatan(id) {
  const sheet = getSheet(SHEET_NAMES.CATATAN);
  const rowIndex = findRowIndex(sheet, 0, id);

  if (rowIndex === -1) {
    return jsonResponse({ success: false, message: "Catatan tidak ditemukan" });
  }

  sheet.deleteRow(rowIndex);
  return jsonResponse({ success: true });
}

// ============================================
// IURAN FUNCTIONS
// ============================================

function getIuran(tenantId, santriId) {
  const sheet = getSheet(SHEET_NAMES.IURAN);
  const data = sheetToJSON(sheet);

  let filtered = data;
  if (tenantId) filtered = filtered.filter((i) => i.Tenant_ID === tenantId);
  if (santriId) filtered = filtered.filter((i) => i.ID_Santri === santriId);

  return jsonResponse({ success: true, data: filtered });
}

function getIuranStats(tenantId) {
  const sheet = getSheet(SHEET_NAMES.IURAN);
  const data = sheetToJSON(sheet);

  const filtered = tenantId ? data.filter((i) => i.Tenant_ID === tenantId) : data;

  const totalTagihan = filtered.reduce((sum, i) => sum + (Number(i.Nominal) || 0), 0);
  const totalPembayaran = filtered
    .filter((i) => i.Status === "Lunas")
    .reduce((sum, i) => sum + (Number(i.Nominal) || 0), 0);
  const totalTunggakan = totalTagihan - totalPembayaran;

  return jsonResponse({
    success: true,
    data: { totalTagihan, totalPembayaran, totalTunggakan },
  });
}

function createIuran(data) {
  const sheet = getSheet(SHEET_NAMES.IURAN);
  const headers = HEADERS[SHEET_NAMES.IURAN];

  const id = generateId("IUR");
  const now = new Date().toISOString();

  const row = [
    id,
    data.tenant_id || "",
    data.ID_Santri || "",
    data.Bulan || "",
    data.Jenis || "",
    data.Nominal || 0,
    data.Status || "Belum Bayar",
    data.Tanggal_Bayar || "",
    data.Catatan || "",
    now,
  ];

  sheet.appendRow(row);
  return jsonResponse({ success: true, data: { ID_Iuran: id } });
}

function updateIuran(id, data) {
  const sheet = getSheet(SHEET_NAMES.IURAN);
  const headers = HEADERS[SHEET_NAMES.IURAN];
  const rowIndex = findRowIndex(sheet, 0, id);

  if (rowIndex === -1) {
    return jsonResponse({ success: false, message: "Iuran tidak ditemukan" });
  }

  const row = jsonToRow(headers, data);
  sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);

  return jsonResponse({ success: true, data: { ID_Iuran: id } });
}

function deleteIuran(id) {
  const sheet = getSheet(SHEET_NAMES.IURAN);
  const rowIndex = findRowIndex(sheet, 0, id);

  if (rowIndex === -1) {
    return jsonResponse({ success: false, message: "Iuran tidak ditemukan" });
  }

  sheet.deleteRow(rowIndex);
  return jsonResponse({ success: true });
}

// ============================================
// PENGUMUMAN FUNCTIONS
// ============================================

function getPengumuman(tenantId, active) {
  const sheet = getSheet(SHEET_NAMES.PENGUMUMAN);
  const data = sheetToJSON(sheet);

  let filtered = data;
  if (tenantId) filtered = filtered.filter((p) => p.Tenant_ID === tenantId);
  if (active === "true") filtered = filtered.filter((p) => p.Status === "Aktif");

  return jsonResponse({ success: true, data: filtered });
}

function createPengumuman(data) {
  const sheet = getSheet(SHEET_NAMES.PENGUMUMAN);
  const headers = HEADERS[SHEET_NAMES.PENGUMUMAN];

  const id = generateId("PENG");
  const now = new Date().toISOString();

  const row = [
    id,
    data.tenant_id || "",
    data.Judul || "",
    data.Isi || "",
    data.Tanggal_Publish || "",
    data.Tanggal_Expired || "",
    data.Status || "Aktif",
    data.Created_By || "Admin",
    now,
  ];

  sheet.appendRow(row);
  return jsonResponse({ success: true, data: { ID_Pengumuman: id } });
}

function updatePengumuman(id, data) {
  const sheet = getSheet(SHEET_NAMES.PENGUMUMAN);
  const headers = HEADERS[SHEET_NAMES.PENGUMUMAN];
  const rowIndex = findRowIndex(sheet, 0, id);

  if (rowIndex === -1) {
    return jsonResponse({ success: false, message: "Pengumuman tidak ditemukan" });
  }

  const row = jsonToRow(headers, data);
  sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);

  return jsonResponse({ success: true, data: { ID_Pengumuman: id } });
}

function deletePengumuman(id) {
  const sheet = getSheet(SHEET_NAMES.PENGUMUMAN);
  const rowIndex = findRowIndex(sheet, 0, id);

  if (rowIndex === -1) {
    return jsonResponse({ success: false, message: "Pengumuman tidak ditemukan" });
  }

  sheet.deleteRow(rowIndex);
  return jsonResponse({ success: true });
}

// ============================================
// CONFIG FUNCTIONS
// ============================================

function getConfig() {
  const sheet = getSheet(SHEET_NAMES.CONFIG);
  const data = sheetToJSON(sheet);

  const config = {};
  data.forEach((row) => {
    config[row.key] = row.value;
  });

  return jsonResponse({ success: true, data: config });
}

// ============================================
// HELPER - JSON Response
// ============================================

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
