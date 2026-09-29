// ============================================
// TPQ DIGITAL - GOOGLE APPS SCRIPT
// Kode ini untuk di-paste di Google Apps Script
// ============================================

// ============================================
// KONFIGURASI
// ============================================

// Nama sheet yang digunakan
const SHEET_NAMES = {
  CONFIG: "Config",
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
  Santri: [
    "ID_Santri",
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
  Guru: ["ID_Guru", "Nama", "No_WA", "Email", "Status", "Created_At"],
  Kelas: ["ID_Kelas", "Nama_Kelas", "ID_Guru", "Hari", "Jam", "Status"],
  Absensi: [
    "ID_Absensi",
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
    "ID_Santri",
    "Tanggal",
    "ID_Guru",
    "Catatan",
    "Tampil_Ke_Wali",
    "Created_At",
  ],
  Iuran: [
    "ID_Iuran",
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
      // SANTRI
      case "getStudents":
        return getStudents();
      case "getStudentById":
        return getStudentById(e.parameter.id);
      case "getStudentByToken":
        return getStudentByToken(e.parameter.token);

      // GURU
      case "getTeachers":
        return getTeachers();

      // KELAS
      case "getClasses":
        return getClasses();

      // ABSENSI
      case "getAttendance":
        return getAttendance(e.parameter.kelasId, e.parameter.tanggal);
      case "getAttendanceBySantri":
        return getAttendanceBySantri(e.parameter.santriId);

      // PROGRESS
      case "getProgress":
        return getProgress(e.parameter.santriId);

      // HAFALAN
      case "getHafalan":
        return getHafalan(e.parameter.santriId);

      // CATATAN
      case "getCatatan":
        return getCatatan(e.parameter.santriId, e.parameter.forWali);

      // IURAN
      case "getIuran":
        return getIuran(e.parameter.santriId);
      case "getIuranStats":
        return getIuranStats();

      // PENGUMUMAN
      case "getPengumuman":
        return getPengumuman(e.parameter.active);

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
// SANTRI FUNCTIONS
// ============================================

function getStudents() {
  const sheet = getSheet(SHEET_NAMES.SANTRI);
  const data = sheetToJSON(sheet);
  return jsonResponse({ success: true, data: data });
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

  // Status adalah kolom ke-9 (index 8)
  sheet.getRange(rowIndex, 9).setValue("Nonaktif");
  return jsonResponse({ success: true });
}

// ============================================
// GURU FUNCTIONS
// ============================================

function getTeachers() {
  const sheet = getSheet(SHEET_NAMES.GURU);
  const data = sheetToJSON(sheet);
  return jsonResponse({ success: true, data: data });
}

function createTeacher(data) {
  const sheet = getSheet(SHEET_NAMES.GURU);
  const headers = HEADERS[SHEET_NAMES.GURU];

  const id = generateId("GURU");
  const now = new Date().toISOString();

  const row = [
    id,
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

function getClasses() {
  const sheet = getSheet(SHEET_NAMES.KELAS);
  const data = sheetToJSON(sheet);
  return jsonResponse({ success: true, data: data });
}

function createClass(data) {
  const sheet = getSheet(SHEET_NAMES.KELAS);
  const headers = HEADERS[SHEET_NAMES.KELAS];

  const id = generateId("KELAS");

  const row = [
    id,
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

function getAttendance(kelasId, tanggal) {
  const sheet = getSheet(SHEET_NAMES.ABSENSI);
  const data = sheetToJSON(sheet);

  const filtered = data.filter(
    (a) => a.ID_Kelas === kelasId && a.Tanggal === tanggal
  );

  return jsonResponse({ success: true, data: filtered });
}

function getAttendanceBySantri(santriId) {
  const sheet = getSheet(SHEET_NAMES.ABSENSI);
  const data = sheetToJSON(sheet);

  const filtered = data.filter((a) => a.ID_Santri === santriId);

  // Hitung statistik
  const stats = {
    hadir: filtered.filter((a) => a.Status === "Hadir").length,
    izin: filtered.filter((a) => a.Status === "Izin").length,
    sakit: filtered.filter((a) => a.Status === "Sakit").length,
    alpa: filtered.filter((a) => a.Status === "Alpa").length,
    total: filtered.length,
    persentase:
      filtered.length > 0
        ? Math.round(
            (filtered.filter((a) => a.Status === "Hadir").length /
              filtered.length) *
              100
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
    // Cek apakah sudah ada
    const data = sheetToJSON(sheet);
    const existing = data.find(
      (a) =>
        a.ID_Santri === absensi.ID_Santri &&
        a.ID_Kelas === absensi.ID_Kelas &&
        a.Tanggal === absensi.Tanggal
    );

    if (existing) {
      // Update
      const rowIndex = findRowIndex(sheet, 0, existing.ID_Absensi);
      const row = [
        existing.ID_Absensi,
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
      // Create new
      const id = generateId("ABS");
      const row = [
        id,
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

function getProgress(santriId) {
  const sheet = getSheet(SHEET_NAMES.PROGRESS);
  const data = sheetToJSON(sheet);

  if (santriId) {
    const filtered = data.filter((p) => p.ID_Santri === santriId);
    return jsonResponse({ success: true, data: filtered });
  }

  return jsonResponse({ success: true, data: data });
}

function createProgress(data) {
  const sheet = getSheet(SHEET_NAMES.PROGRESS);
  const headers = HEADERS[SHEET_NAMES.PROGRESS];

  const id = generateId("PROG");
  const now = new Date().toISOString();

  const row = [
    id,
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

function getHafalan(santriId) {
  const sheet = getSheet(SHEET_NAMES.HAFALAN);
  const data = sheetToJSON(sheet);

  if (santriId) {
    const filtered = data.filter((h) => h.ID_Santri === santriId);
    return jsonResponse({ success: true, data: filtered });
  }

  return jsonResponse({ success: true, data: data });
}

function createHafalan(data) {
  const sheet = getSheet(SHEET_NAMES.HAFALAN);
  const headers = HEADERS[SHEET_NAMES.HAFALAN];

  const id = generateId("HAF");
  const now = new Date().toISOString();

  const row = [
    id,
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

function getCatatan(santriId, forWali) {
  const sheet = getSheet(SHEET_NAMES.CATATAN);
  const data = sheetToJSON(sheet);

  let filtered = data;

  if (santriId) {
    filtered = filtered.filter((c) => c.ID_Santri === santriId);
  }

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

function getIuran(santriId) {
  const sheet = getSheet(SHEET_NAMES.IURAN);
  const data = sheetToJSON(sheet);

  if (santriId) {
    const filtered = data.filter((i) => i.ID_Santri === santriId);
    return jsonResponse({ success: true, data: filtered });
  }

  return jsonResponse({ success: true, data: data });
}

function getIuranStats() {
  const sheet = getSheet(SHEET_NAMES.IURAN);
  const data = sheetToJSON(sheet);

  const totalTagihan = data.reduce((sum, i) => sum + (Number(i.Nominal) || 0), 0);
  const totalPembayaran = data
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

function getPengumuman(active) {
  const sheet = getSheet(SHEET_NAMES.PENGUMUMAN);
  const data = sheetToJSON(sheet);

  if (active === "true") {
    const filtered = data.filter((p) => p.Status === "Aktif");
    return jsonResponse({ success: true, data: filtered });
  }

  return jsonResponse({ success: true, data: data });
}

function createPengumuman(data) {
  const sheet = getSheet(SHEET_NAMES.PENGUMUMAN);
  const headers = HEADERS[SHEET_NAMES.PENGUMUMAN];

  const id = generateId("PENG");
  const now = new Date().toISOString();

  const row = [
    id,
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
