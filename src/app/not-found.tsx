export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-600 mb-6">Maaf, halaman yang Anda cari tidak ditemukan.</p>
        <a
          href="/"
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
