import DaftarHadirTable from "./DaftarHadirTable";
export default function HistoriDaftarHadir() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🔄 Riwayat Pengisian Daftar Hadir</h1>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <DaftarHadirTable />
          </div>
        </div>
      </div>
    </div>
  );
}
