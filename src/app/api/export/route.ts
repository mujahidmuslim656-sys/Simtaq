import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import * as sheets from "@/services/googleSheets";
import { isTenantAuthenticated, getTenantId, unauthorizedResponse } from "@/lib/auth";

// GET - Export data as Excel
export async function GET(request: NextRequest) {
  if (!isTenantAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const tenantId = getTenantId(request);
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month"); // e.g., "Januari"
  const year = searchParams.get("year"); // e.g., "2024"
  const modules = searchParams.get("modules")?.split(",") || [];

  try {
    // Fetch all data
    const [santri, guru, kelas, absensi, progress, hafalan, catatan, iuran, pengumuman] =
      await Promise.all([
        sheets.getAllSantri(tenantId || undefined),
        sheets.getAllGuru(tenantId || undefined),
        sheets.getAllKelas(tenantId || undefined),
        sheets.getAbsensiByKelasAndTanggal(tenantId || "", "", ""),
        sheets.getAllProgress(),
        sheets.getAllHafalan(tenantId || undefined),
        sheets.getAllCatatan(),
        sheets.getAllIuran(tenantId || undefined),
        sheets.getAllPengumuman(tenantId || undefined),
      ]);

    // Filter by month/year if specified
    const filterByDate = (data: Record<string, unknown>[], dateField: string) => {
      if (!month || !year) return data;
      return data.filter((item) => {
        const date = item[dateField] as string;
        if (!date) return false;
        const d = new Date(date);
        const monthNames = [
          "Januari", "Februari", "Maret", "April", "Mei", "Juni",
          "Juli", "Agustus", "September", "Oktober", "November", "Desember",
        ];
        return d.getMonth() === monthNames.indexOf(month) && d.getFullYear() === parseInt(year);
      });
    };

    const filterByMonth = (data: Record<string, unknown>[]) => {
      if (!month) return data;
      return data.filter((item) => {
        const itemMonth = item.Bulan as string;
        return itemMonth?.toLowerCase().includes(month.toLowerCase());
      });
    };

    // Build workbook
    const wb = XLSX.utils.book_new();

    if (modules.includes("santri")) {
      const ws = XLSX.utils.json_to_sheet(santri);
      XLSX.utils.book_append_sheet(wb, ws, "Santri");
    }
    if (modules.includes("guru")) {
      const ws = XLSX.utils.json_to_sheet(guru);
      XLSX.utils.book_append_sheet(wb, ws, "Guru");
    }
    if (modules.includes("kelas")) {
      const ws = XLSX.utils.json_to_sheet(kelas);
      XLSX.utils.book_append_sheet(wb, ws, "Kelas");
    }
    if (modules.includes("absensi")) {
      const filtered = filterByDate(absensi, "Tanggal");
      const ws = XLSX.utils.json_to_sheet(filtered);
      XLSX.utils.book_append_sheet(wb, ws, "Absensi");
    }
    if (modules.includes("progress")) {
      const filtered = filterByDate(progress, "Tanggal");
      const ws = XLSX.utils.json_to_sheet(filtered);
      XLSX.utils.book_append_sheet(wb, ws, "Progress");
    }
    if (modules.includes("hafalan")) {
      const filtered = filterByDate(hafalan, "Tanggal");
      const ws = XLSX.utils.json_to_sheet(filtered);
      XLSX.utils.book_append_sheet(wb, ws, "Hafalan");
    }
    if (modules.includes("catatan")) {
      const filtered = filterByDate(catatan, "Tanggal");
      const ws = XLSX.utils.json_to_sheet(filtered);
      XLSX.utils.book_append_sheet(wb, ws, "Catatan");
    }
    if (modules.includes("iuran")) {
      const filtered = filterByMonth(iuran);
      const ws = XLSX.utils.json_to_sheet(filtered);
      XLSX.utils.book_append_sheet(wb, ws, "Iuran");
    }
    if (modules.includes("pengumuman")) {
      const filtered = filterByDate(pengumuman, "Tanggal_Publish");
      const ws = XLSX.utils.json_to_sheet(filtered);
      XLSX.utils.book_append_sheet(wb, ws, "Pengumuman");
    }

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Get tenant name for filename
    const tenantName = request.cookies.get("tenant_name")?.value || "TPQ";
    const filename = `${tenantName.replace(/\s+/g, "_")}_${month || "Semua"}_${year || "Semua"}.xlsx`;

    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengekspor data" },
      { status: 500 }
    );
  }
}
