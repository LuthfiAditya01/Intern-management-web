"use client";
import React, { useState } from "react";
import Papa from "papaparse";
import { faL } from "@fortawesome/free-solid-svg-icons";

const SertifikatPage = () => {
  const [filters, setFilters] = useState({
    kelas: "",
    program: "",
    kompetensi: "",
    instansi: "",
    search: "",
  });

  const [data, setData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [lamaMagang, setLamaMagang] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);

const filteredData = data.filter((item) => {
  return (
    (!filters.kelas || item.kelas?.toLowerCase() === filters.kelas.toLowerCase()) &&
    (!filters.program || item.program?.toLowerCase() === filters.program.toLowerCase()) &&
    (!filters.kompetensi || item.kompetensi?.toLowerCase() === filters.kompetensi.toLowerCase()) &&
    (!filters.instansi || item.instansi?.toLowerCase() === filters.instansi.toLowerCase()) &&
    (!filters.search ||
      item.nama?.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.nis?.toLowerCase().includes(filters.search.toLowerCase()))
  );
});

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };



  const hitungLamaMagang = (mulai, selesai) => {
    if (!mulai || !selesai) return;
    const start = new Date(mulai);
    const end = new Date(selesai);
    const selisihHari = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    const bulan = Math.floor(selisihHari / 30);
    const hari = selisihHari % 30;

    let lama = "";
    if (bulan > 0) lama += `${bulan} bulan `;
    if (hari > 0) lama += `${hari} hari`;

    setLamaMagang(lama.trim());
  };



  const toggleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map((item) => item.id));
    }
  };

  const handlePrint = (selected) => {
    const printedData = data.filter((d) => selected.includes(d.id));
    console.log("🔍 Data yang dicetak:", printedData);
    alert("Mencetak " + printedData.length + " data.");
  };

  const handleDownloadExcel = () => {
    const selectedData = data.filter((d) => selectedIds.includes(d.id));
    const csv = selectedData
      .map((row) =>
        [
          row.nis,
          row.nama,
          row.tempatLahir,
          row.tanggalLahir,
          row.kelas,
          row.program,
          row.kompetensi,
          row.sekolah,
          row.instansi,
        ].join(",")
      )
      .join("\n");

    const blob = new Blob(
      [
        "NIS,Nama,Tempat Lahir,Tanggal Lahir,Kelas,Program,Kompetensi,Sekolah,Instansi\n" +
          csv,
      ],
      { type: "text/csv" }
    );

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sertifikat.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const importedData = results.data
            .filter(row => Object.values(row).some(val => val && val.trim() !== ""))
            .map((row, index) => ({
              id: data.length + index + 1,
              nis: row?.["NIS/NPM"] || "",
              nama: row?.["Nama"] || "",
              tempatLahir: row?.["Tempat Lahir"] || "",
              tanggalLahir: row?.["Tanggal Lahir"] || "",
              kelas: row?.["Kelas/Semester"] || "",
              program: row?.["Program Keahlian"] || "",
              kompetensi: row?.["Kompetensi Keahlian"] || "",
              sekolah: row?.["Sekolah/Perguruan Tinggi"] || "",
              instansi: row["Nama Instansi"],
              alamat: row["Alamat Instansi"],
              tanggalMulai: row["Tanggal Mulai"],
              tanggalSelesai: row["Tanggal Selesai"],
              lamaMagang: row["Lama Magang"],
          }));
          setData([...data, ...importedData]);
        } catch (error) {
          alert("❌ Gagal import data. Pastikan format CSV sesuai.");
          console.error(error);
        }
      },
      error: (error) => {
        alert("❌ Gagal membaca file CSV.");
        console.error("Parse error:", error);
      },
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Cetak Sertifikat</h1>
        <div className="space-x-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow cursor-pointer"
            onClick={() => setShowAddForm(true)}
          >
            Add Data
          </button>
          <button 
            onClick={() => setShowImportModal(true)}
            className="bg-gray-400 text-white px-4 py-2 rounded shadow"
          >
            Import Data
          </button>
        </div>
      </div>

      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowImportModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">
              IMPORT DATA SERTIFIKAT
            </h2>
            <div className="text-center mb-4">
              <a
                href="/sertifikat/format-data-sertifikat.xlsx"
                download  
                className="text-blue-600 underline text-sm"
              >
                Download Format Upload
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  handleImport(e);
                  setShowImportModal(false);
                }}
                className="border p-2 rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowImportModal(false)}
                >
                  Close
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => setShowImportModal(false)}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      <div className="bg-green-500 text-white p-4 rounded-t font-semibold">
        Data Sertifikat
      </div>

      <div className="bg-white p-4 border rounded-b shadow">
        {/* Filter */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <select className="border p-2 rounded" value={filters.kelas}onChange={(e) => setFilters({ ...filters, kelas: e.target.value })}>
            <option value="">Kelas</option>
            <option value="12">12</option>
            <option value="Semester 4">Semester 4</option>
            <option value="Semester 5">Semester 5</option>
            <option value="Semester 6">Semester 6</option>
          </select>
          <select className="border p-2 rounded" value={filters.program}onChange={(e) => setFilters({ ...filters, program: e.target.value })}>
            <option value="">Program Keahlian</option>
            <option value="TKJ">TKJ</option>
          </select>
          <select className="border p-2 rounded" value={filters.kompetensi}onChange={(e) => setFilters({ ...filters, kompetensi: e.target.value })}>
            <option value="">Kompetensi Keahlian</option>
            <option value="RPL">RPL</option>
          </select>
          {/* <select className="border p-2 rounded" value={filters.instansi}onChange={(e) => setFilters({ ...filters, instansi: e.target.value })}>
            <option value="">Nama Instansi</option>
            <option value="BPS">Badan Pusat Statistik Kota Bandar Lampung</option>
          </select> */}
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className="bg-gray-300 px-3 py-1 rounded"
            onClick={() => handlePrint(selectedIds)}
          >
            Print All Selected
          </button>
          <button
            className="bg-gray-300 px-3 py-1 rounded"
            onClick={() => handlePrint(selectedIds.slice(0, 1))}
          >
            Print Hal 1 Selected
          </button>
          <button
            className="bg-gray-300 px-3 py-1 rounded"
            onClick={() => handlePrint(selectedIds.slice(1))}
          >
            Print Hal 2 Selected
          </button>
          <button
            className="bg-yellow-400 px-3 py-1 rounded"
            onClick={handleDownloadExcel}
          >
            Download Excel
          </button>
        </div>

        {/* Pagination & Search */}
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm">
            Show
            <select className="border ml-1 p-1 text-sm">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            entries
          </label>
          <input
            type="text"
            placeholder="Search"
            className="border p-1 text-sm rounded"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
        <table className="min-w-[1800px] border text-sm">
            <thead className="bg-gray-200 text-left">
            <tr>
                <th className="p-2"><input type="checkbox" onChange={toggleAll} checked={selectedIds.length === data.length && data.length > 0} /></th>
                <th className="p-2">No</th>
                <th className="p-2">NIS</th>
                <th className="p-2">Nama</th>
                <th className="p-2">Tempat Lahir</th>
                <th className="p-2">Tanggal Lahir</th>
                <th className="p-2">Kelas</th>
                <th className="p-2">Program Keahlian</th>
                <th className="p-2">Kompetensi Keahlian</th>
                <th className="p-2">Sekolah Asal</th>
                <th className="p-2">Nama Instansi</th>
                <th className="p-2">Alamat Instansi</th>
                <th className="p-2">Tanggal Mulai</th>
                <th className="p-2">Tanggal Selesai</th>
                <th className="p-2">Lama Magang</th>
            </tr>
            </thead>
            <tbody>
            {filteredData.map((item, index) => (
                <tr key={index} className="border-t">
                <td className="p-2">
                    <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleCheckbox(item.id)}
                    />
                </td>
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{item.nis}</td>
                <td className="p-2">{item.nama}</td>
                <td className="p-2">{item.tempatLahir}</td>
                <td className="p-2">{item.tanggalLahir}</td>
                <td className="p-2">{item.kelas}</td>
                <td className="p-2">{item.program}</td>
                <td className="p-2">{item.kompetensi}</td>
                <td className="p-2">{item.sekolah}</td>
                <td className="p-2">{item.instansi}</td>
                <td className="p-2">{item.alamatInstansi}</td>
                <td className="p-2">{item.tanggalMulai}</td>
                <td className="p-2">{item.tanggalSelesai}</td>
                <td className="p-2">{item.lamaMagang}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
      </div>

      {/* Form Tambah Data Manual */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg p-6">
            {/* Tombol Close (X) */}
            <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl font-bold"
                aria-label="Close"
            >
                ×
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center">Tambah Data Siswa</h2>

            <form
                onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const newEntry = {
                    id: data.length + 1,
                    nis: form.nis.value,
                    nama: form.nama.value,
                    tempatLahir: form.tempatLahir.value,
                    tanggalLahir: form.tanggalLahir.value,
                    kelas: form.kelas.value,
                    program: form.program.value,
                    kompetensi: form.kompetensi.value,
                    sekolah: form.sekolah.value,
                    instansi: form.instansi.value,
                    alamatInstansi: form.alamatInstansi.value,
                    tanggalMulai: form.tanggalMulai.value,
                    tanggalSelesai: form.tanggalSelesai.value,
                    lamaMagang: lamaMagang,
                };
                setData([...data, newEntry]);
                setShowAddForm(false);
                }}
            >
                <div className="grid grid-cols-1 gap-4 mb-6">
                    <div className="space-y-1">
                        <label htmlFor="nis" className="block text-sm font-medium text-gray-700">NIS/NPM</label>
                        <input 
                            id="nis"
                            name="nis" 
                            type="text"
                            placeholder="Masukkan NIS/NPM" 
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                            required 
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama</label>
                        <input 
                            id="nama"
                            name="nama" 
                            type="text"
                            placeholder="Masukkan nama lengkap" 
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                            required 
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label htmlFor="tempatLahir" className="block text-sm font-medium text-gray-700">Tempat Lahir</label>
                        <input 
                            id="tempatLahir"
                            name="tempatLahir" 
                            type="text"
                            placeholder="Masukkan tempat lahir" 
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label htmlFor="tanggalLahir" className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                        <input 
                            id="tanggalLahir"
                            name="tanggalLahir" 
                            type="date" 
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-600" 
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label htmlFor="kelas" className="block text-sm font-medium text-gray-700">Kelas</label>
                        <select 
                            id="kelas"
                            name="kelas" 
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white cursor-pointer"
                        >
                            <option value="">--- Pilih Kelas ---</option>
                            <option value="12">12</option>
                            <option value="Semester 4">Semester 4</option>
                            <option value="Semester 5">Semester 5</option>
                            <option value="Semester 6">Semester 6</option>
                        </select>
                    </div>
                    
                    <div className="space-y-1">
                        <label htmlFor="program" className="block text-sm font-medium text-gray-700">Program Keahlian</label>
                        <select 
                            id="program"
                            name="program" 
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white cursor-pointer"
                        >
                            <option value="">--- Pilih Program Keahlian ---</option>
                            <option value="RPL">Rekayasa Perangkat Lunak</option>
                            <option value="TKJ">Teknik Komputer dan Jaringan</option>
                            <option value="MM">Multimedia</option>
                            <option value="AKL">Akuntansi dan Keuangan Lembaga</option>
                            <option value="OTKP">Otomatisasi dan Tata Kelola Perkantoran</option>
                            <option value="BDP">Bisnis Daring dan Pemasaran</option>
                        </select>
                    </div>
                    
                    <div className="space-y-1">
                        <label htmlFor="kompetensi" className="block text-sm font-medium text-gray-700">Kompetensi Keahlian</label>
                        <select 
                            id="kompetensi"
                            name="kompetensi" 
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white cursor-pointer"
                        >
                            <option value="">--- Pilih Kompetensi Keahlian ---</option>
                            <option value="pemrograman">Pemrograman</option>
                            <option value="jaringan">Jaringan Komputer</option>
                            <option value="desain">Desain Grafis</option>
                            <option value="akuntansi">Akuntansi</option>
                            <option value="administrasi">Administrasi Perkantoran</option>
                            <option value="pemasaran">Pemasaran Digital</option>
                        </select>
                    </div>
                    
                    <div className="space-y-1">
                        <label htmlFor="sekolah" className="block text-sm font-medium text-gray-700">Sekolah/Perguruan Tinggi</label>
                        <input 
                            id="sekolah"
                            name="sekolah" 
                            type="text"
                            placeholder="Masukkan nama sekolah/perguruan tinggi" 
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label htmlFor="instansi" className="block text-sm font-medium text-gray-700">Nama Instansi</label>
                        <input 
                            id="instansi"
                            name="instansi" 
                            type="text"
                            placeholder="Masukkan nama Instansi" 
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label htmlFor="alamatInstansi" className="block text-sm font-medium text-gray-700">Alamat Instansi</label>
                        <textarea 
                            id="alamatInstansi"
                            name="alamatInstansi" 
                            placeholder="Masukkan alamat lengkap Instansi" 
                            rows="3"
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                        ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label htmlFor="tanggalMulai" className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
                            <input 
                                id="tanggalMulai"
                                name="tanggalMulai" 
                                type="date" 
                                value={tanggalMulai}
                                onChange={(e) => {
                                setTanggalMulai(e.target.value);
                              }}
                                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-600" 
                            />
                        </div>
                        
                        <div className="space-y-1">
                            <label htmlFor="tanggalSelesai" className="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
                            <input 
                                id="tanggalSelesai"
                                name="tanggalSelesai" 
                                type="date" 
                                value={tanggalSelesai}
                                  onChange={(e) => {
                                    setTanggalSelesai(e.target.value);
                                    hitungLamaMagang(tanggalMulai, e.target.value);
                                  }}
                                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-600" 
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <label htmlFor="lamaMagang" className="block text-sm font-medium text-gray-700">Lama Magang/PKL</label>
                        <input 
                            id="lamaMagang"
                            name="lamaMagang" 
                            type="text"
                            value={lamaMagang}
                            readOnly
                            placeholder="Contoh: 3 bulan atau 90 hari" 
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded shadow">
                    Simpan
                </button>
                <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded shadow"
                >
                    Batal
                </button>
                </div>
            </form>
            </div>
        </div>
        )}
    </div>
  );
};

export default SertifikatPage;