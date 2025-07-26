"use client";
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { faL } from "@fortawesome/free-solid-svg-icons";
import PreviewSertifikat from "../../components/PreviewSertifikat";
import NavbarGeneral from "@/components/NavbarGeneral";

const SertifikatPage = () => {
  const [filters, setFilters] = useState({
    kelas: "",
    jurusan: "",
    search: "",
  });

  const [data, setData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [lamaMagang, setLamaMagang] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editTanggalMulai, setEditTanggalMulai] = useState("");
  const [editTanggalSelesai, setEditTanggalSelesai] = useState("");
  const [editLamaMagang, setEditLamaMagang] = useState("");
  const [templates, setTemplates] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch("/api/template");
        const data = await res.json();
        console.log("✅ Templates berhasil dimuat:", data); // 👈 tambahkan ini
        setTemplates(data);
      } catch (err) {
        console.error("❌ Gagal fetch template:", err);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    if (editData) {
      setEditTanggalMulai(editData.tanggalMulai || "");
      setEditTanggalSelesai(editData.tanggalSelesai || "");
      hitungEditLamaMagang(editData.tanggalMulai, editData.tanggalSelesai);
    }
  }, [editData]);

  useEffect(() => {
    if (editTanggalMulai && editTanggalSelesai) {
      hitungEditLamaMagang(editTanggalMulai, editTanggalSelesai);
    }
  }, [editTanggalMulai, editTanggalSelesai]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleEditClick = (item) => {
    setEditData(item);
    setShowEditModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const filteredData = data.filter((item) => {
    const searchTerm = filters.search?.toLowerCase();

    const matchesDropdowns =
      (!filters.kelas ||
        item.kelas?.toLowerCase() === filters.kelas.toLowerCase()) &&
      (!filters.jurusan ||
        item.jurusan?.toLowerCase() === filters.jurusan.toLowerCase());
      (!filters.sekolah ||
        item.sekolah?.toLowerCase() === filters.sekolah.toLowerCase());

    const matchesSearch =
      !searchTerm ||
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm)
      );

    return matchesDropdowns && matchesSearch;
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

  function hitungEditLamaMagang(tglMulai, tglSelesai) {
    if (!tglMulai || !tglSelesai) return;

    const mulai = new Date(tglMulai);
    const selesai = new Date(tglSelesai);
    const selisihHari = Math.ceil((selesai - mulai) / (1000 * 60 * 60 * 24));

    if (selisihHari < 0) {
      setEditLamaMagang("Tanggal tidak valid");
      return;
    }

    // Menggunakan logika yang sama dengan form tambah data
    const bulan = Math.floor(selisihHari / 30);
    const hari = selisihHari % 30;

    let lama = "";
    if (bulan > 0) lama += `${bulan} bulan `;
    if (hari > 0) lama += `${hari} hari`;

    setEditLamaMagang(lama.trim());
  }

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
          row.kelas,
          row.jurusan,
          row.sekolah,
        ].join(",")
      )
      .join("\n");

    const blob = new Blob(
      [
        "NIS,Nama,Kelas,Jurusan,Sekolah\n" +
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

  const handleCetakMagang = async (item) => {
    try {
      const res = await fetch("/api/template");
      const templates = await res.json();

      const selectedTemplate = templates.find(
        (t) => t.nama === "MAGANG/KP/PKL" && t.status === "DEFAULT"
      );

      if (!selectedTemplate) {
        console.error("Available templates:", templates);
        alert("Template MAGANG/KP/PKL tidak ditemukan");
        return;
      }

      // Format tanggal ke format Indonesia
      const formatTanggal = (dateStr) => {
        if (!dateStr) return "";
        try {
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) {
            throw new Error("Invalid date");
          }
          return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        } catch (error) {
          console.error("Error formatting date:", dateStr, error);
          return dateStr; // Return original string if parsing fails
        }
      };

      // Log data untuk debugging
      console.log("Tanggal Mulai:", item.tanggalMulai);
      console.log("Tanggal Selesai:", item.tanggalSelesai);

      // Isi template dengan data siswa
      const filledTemplate = {
        ...selectedTemplate,
        elements: selectedTemplate.elements.map((el) => {
          switch (el.label) {
            case "Nama Peserta":
              return { ...el, value: item.nama };
            case "Deskripsi":
              return {
                ...el,
                value: `atas partisipasinya dalam kegiatan Magang/KP/PKL di lingkungan BPS Kota Bandar Lampung periode ${formatTanggal(
                  item.tanggalMulai
                )} sampai ${formatTanggal(item.tanggalSelesai)}`,
              };
            case "Tanggal":
              return {
                ...el,
                value: `Bandar Lampung, ${formatTanggal(new Date())}`,
              };
            default:
              return el;
          }
        }),
      };

      setPreviewData(filledTemplate);
      setShowPreview(true);
    } catch (error) {
      console.error("Error getting template:", error);
      alert("Gagal mengambil template");
    }
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
            .filter((row) =>
              Object.values(row).some((val) => val && val.trim() !== "")
            )
            .map((row, index) => {
              // Format tanggal dari CSV ke format ISO
              const formatDate = (dateStr) => {
                if (!dateStr) return "";
                const [day, month, year] = dateStr.split("/");
                return `${year}-${month.padStart(2, "0")}-${day.padStart(
                  2,
                  "0"
                )}`;
              };

              return {
                id: data.length + index + 1,
                nis: row?.["NIS/NPM"] || "",
                nama: row?.["Nama"] || "",
                kelas: row?.["Kelas/Semester"] || "",
                jurusan: row?.["Jurusan"] || "",
                sekolah: row?.["Sekolah/Perguruan Tinggi"] || "",
                tanggalMulai: formatDate(row["Tanggal Mulai"]),
                tanggalSelesai: formatDate(row["Tanggal Selesai"]),
                lamaMagang: row["Lama Magang"] || "",
              };
            });
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

  const handleTambahKeAkun = async (item) => {
  try {
    const res = await fetch("/api/user-sertifikat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nama: item.nama,
        nis: item.nis,
        idMagang: item.id, // kalau pakai ID
        tanggalMulai: item.tanggalMulai,
        tanggalSelesai: item.tanggalSelesai,
        lamaMagang: item.lamaMagang,
      }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal");

    alert(`✔️ ${item.nama} berhasil ditambahkan ke akun user.`);
  } catch (error) {
    console.error("❌ Error:", error);
    alert("Gagal menambahkan ke akun.");
  }
};


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <NavbarGeneral
        title="Cetak Sertifikat Peserta Magang"
        subTitle="Pilih peserta magang yang sudah bisa mendapatkan sertifikat"
      />
      <div className="bg-white rounded-xl shadow-lg border md:max-w-7xl mx-auto border-gray-100 p-2.5 md:p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex justify-between items-center w-full mb-4">
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
                className="bg-gray-400 text-white px-4 py-2 rounded shadow cursor-pointer"
              >
                Import Data
              </button>
            </div>
          </div>
        </div>
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
              <button
                onClick={() => setShowImportModal(false)}
                className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold cursor-pointer"
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
                    className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer"
                    onClick={() => setShowImportModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                    onClick={() => setShowImportModal(false)}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-500 text-white p-4 rounded-t font-semibold">
          Data Sertifikat
        </div>

        <div className="bg-white p-4 border rounded-b shadow">
          {/* Filter */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <select
              className="border p-2 rounded"
              value={filters.kelas}
              onChange={(e) =>
                setFilters({ ...filters, kelas: e.target.value })
              }
            >
              <option value="">Kelas</option>
              <option value="12">12</option>
              <option value="Semester 4">Semester 4</option>
              <option value="Semester 5">Semester 5</option>
              <option value="Semester 6">Semester 6</option>
            </select>
            <select
              className="border p-2 rounded"
              value={filters.jurusan}
              onChange={(e) =>
                setFilters({ ...filters, jurusan: e.target.value })
              }
            >
              <option value="">Jurusan</option>
              <option value="TKJ">TKJ</option>
            </select>
            <select
              className="border p-2 rounded"
              value={filters.sekolah}
              onChange={(e) =>
                setFilters({ ...filters, sekolah: e.target.value })
              }
            >
              <option value="">Sekolah/Perguruan Tinggi</option>
              <option value="UNILA">Universitas Lampung</option>
            </select>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              className="bg-yellow-400 px-3 py-1 rounded cursor-pointer"
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
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          {/* Tabel Data */}
          <div className="overflow-x-auto">
            <table className="min-w-[2000px] border text-sm">
              <thead className="bg-gray-200 text-left">
                <tr>
                  <th className="p-2">
                    <input
                      type="checkbox"
                      onChange={toggleAll}
                      checked={
                        selectedIds.length === data.length && data.length > 0
                      }
                    />
                  </th>
                  <th className="p-2">No</th>
                  <th className="p-2">NIS/NPM</th>
                  <th className="p-2">Nama</th>
                  <th className="p-2">Kelas</th>
                  <th className="p-2">Jurusan</th>
                  <th className="p-2">Sekolah/Perguruan Tinggi</th>
                  <th className="p-2">Tanggal Mulai</th>
                  <th className="p-2">Tanggal Selesai</th>
                  <th className="p-2">Lama Magang</th>
                  <th className="p-2">Process</th>
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
                    <td className="p-2">{item.kelas}</td>
                    <td className="p-2">{item.jurusan}</td>
                    <td className="p-2">{item.sekolah}</td>
                    <td className="p-2">{item.tanggalMulai}</td>
                    <td className="p-2">{item.tanggalSelesai}</td>
                    <td className="p-2">{item.lamaMagang}</td>

                    <td className="p-2">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleCetakMagang(item)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs cursor-pointer"
                        >
                          MAGANG/KP/PKL
                        </button>

                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded text-sm cursor-pointer"
                          onClick={() => handleEditClick(item)}
                        >
                          EDIT
                        </button>
                        <button
                          className="bg-red-600 text-white px-2 py-1 rounded text-sm cursor-pointer"
                          onClick={() => handleDeleteClick(item.id)}
                        >
                          HAPUS
                        </button>

                        <button
                          className="bg-purple-600 text-white px-2 py-1 rounded text-sm cursor-pointer"
                          onClick={() => handleTambahKeAkun(item)}
                        >
                          Tambahkan ke Akun
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showPreview && previewData && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-md max-w-[1000px] w-full">
              <h2 className="text-xl font-semibold mb-4">Preview Sertifikat</h2>
              <PreviewSertifikat template={previewData} />
              <div className="text-right mt-4">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer"
                  onClick={() => setShowPreview(false)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

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

              <h2 className="text-xl font-semibold mb-4 text-center">
                Tambah Data Siswa
              </h2>

              {/* Form Tambah Data Siswa*/}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const newEntry = {
                    id: data.length + 1,
                    nis: form.nis.value,
                    nama: form.nama.value,
                    kelas: form.kelas.value,
                    jurusan: form.jurusan.value,
                    sekolah: form.sekolah.value,
                    tanggalMulai: form.tanggalMulai.value,
                    tanggalSelesai: form.tanggalSelesai.value,
                    lamaMagang: lamaMagang,
                  };
                  setData([...data, newEntry]);
                  setShowAddForm(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              >
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="space-y-1">
                    <label
                      htmlFor="nis"
                      className="block text-sm font-medium text-gray-700"
                    >
                      NIS/NPM
                    </label>
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
                    <label
                      htmlFor="nama"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nama
                    </label>
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
                    <label
                      htmlFor="kelas"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Kelas
                    </label>
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
                    <label
                      htmlFor="jurusan"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Jurusan
                    </label>
                    <select
                      id="jurusan"
                      name="jurusan"
                      className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white cursor-pointer"
                    >
                      <option value="">--- Pilih Jurusan ---</option>
                      <option value="RPL">Rekayasa Perangkat Lunak</option>
                      <option value="TKJ">Teknik Komputer dan Jaringan</option>
                      <option value="MM">Multimedia</option>
                      <option value="AKL">
                        Akuntansi dan Keuangan Lembaga
                      </option>
                      <option value="OTKP">
                        Otomatisasi dan Tata Kelola Perkantoran
                      </option>
                      <option value="BDP">Bisnis Daring dan Pemasaran</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="sekolah"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Sekolah/Perguruan Tinggi
                    </label>
                    <input
                      id="sekolah"
                      name="sekolah"
                      type="text"
                      placeholder="Masukkan nama sekolah/perguruan tinggi"
                      className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label
                        htmlFor="tanggalMulai"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Tanggal Mulai
                      </label>
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
                      <label
                        htmlFor="tanggalSelesai"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Tanggal Selesai
                      </label>
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
                    <label
                      htmlFor="lamaMagang"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Lama Magang/PKL
                    </label>
                    <input
                      id="lamaMagang"
                      name="lamaMagang"
                      type="text"
                      value={lamaMagang}
                      readOnly
                      // placeholder="Contoh: 3 bulan atau 90 hari"
                      className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded shadow cursor-pointer"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded shadow cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg p-6">
              {/* Tombol Close (X) */}
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl font-bold cursor-pointer"
                aria-label="Close"
              >
                ×
              </button>

              <h2 className="text-xl font-semibold mb-4 text-center">
                Edit Data
              </h2>

              {/* FORM EDIT DATA  */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const updated = {
                    ...editData,
                    nis: form.nis.value,
                    nama: form.nama.value,
                    kelas: form.kelas.value,
                    jurusan: form.jurusan.value,
                    sekolah: form.sekolah.value,
                    tanggalMulai: editTanggalMulai,
                    tanggalSelesai: editTanggalSelesai,
                    lamaMagang: editLamaMagang,
                  };

                  setData(data.map((d) => (d.id === updated.id ? updated : d)));
                  setShowEditModal(false);
                }}
              >
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="space-y-1">
                    <label
                      htmlFor="nis"
                      className="block text-sm font-medium text-gray-700"
                    >
                      NIS/NPM
                    </label>
                    <input
                      defaultValue={editData.nis}
                      id="nis"
                      name="nis"
                      type="text"
                      placeholder="Masukkan NIS/NPM"
                      required
                      className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="nama"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nama
                    </label>
                    <input
                      defaultValue={editData.nama}
                      id="nama"
                      name="nama"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      required
                      className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="kelas"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Kelas
                    </label>
                    <select
                      defaultValue={editData.kelas}
                      id="kelas"
                      name="kelas"
                      type="text"
                      className="w-full border border-gray-300 p-3 rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">--- Pilih Kelas ---</option>
                      <option value="12">12</option>
                      <option value="Semester 4">Semester 4</option>
                      <option value="Semester 5">Semester 5</option>
                      <option value="Semester 6">Semester 6</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="jurusan"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Jurusan
                    </label>
                    <select
                      defaultValue={editData.jurusan}
                      id="jurusan"
                      name="jurusan"
                      type="text"
                      className="w-full border border-gray-300 p-3 rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">--- Pilih Jurusan ---</option>
                      <option value="RPL">Rekayasa Perangkat Lunak</option>
                      <option value="TKJ">Teknik Komputer dan Jaringan</option>
                      <option value="MM">Multimedia</option>
                      <option value="AKL">
                        Akuntansi dan Keuangan Lembaga
                      </option>
                      <option value="OTKP">
                        Otomatisasi dan Tata Kelola Perkantoran
                      </option>
                      <option value="BDP">Bisnis Daring dan Pemasaran</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="sekolah"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Sekolah
                    </label>
                    <input
                      defaultValue={editData.sekolah}
                      id="sekolah"
                      name="sekolah"
                      type="text"
                      className="w-full border border-gray-300 p-3 rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label
                        htmlFor="tanggalMulai"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Tanggal Mulai
                      </label>
                      <input
                        id="tanggalMulai"
                        name="tanggalMulai"
                        type="date"
                        value={editTanggalMulai}
                        onChange={(e) => {
                          setEditTanggalMulai(e.target.value);
                          hitungEditLamaMagang(
                            e.target.value,
                            editTanggalSelesai
                          );
                        }}
                        className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="tanggalSelesai"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Tanggal Selesai
                      </label>
                      <input
                        id="tanggalSelesai"
                        name="tanggalSelesai"
                        type="date"
                        value={editTanggalSelesai}
                        onChange={(e) => {
                          setEditTanggalSelesai(e.target.value);
                          hitungEditLamaMagang(
                            editTanggalMulai,
                            e.target.value
                          );
                        }}
                        className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-600"
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <label
                      htmlFor="lamaMagang"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Lama Magang
                    </label>
                    <input
                      id="lamaMagang"
                      name="lamaMagang"
                      type="text"
                      value={editLamaMagang}
                      readOnly
                      className="w-full border border-gray-300 p-3 rounded-md bg-gray-100 text-gray-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="px-4 py-1 border rounded cursor-pointer"
                    onClick={() => setShowEditModal(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-1 rounded cursor-pointer"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full">
              <p>Yakin ingin menghapus data ini?</p>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowDeleteModal(false)} className="cursor-pointer">Batal</button>
                <button
                  onClick={() => {
                    setData(data.filter((d) => d.id !== deleteId));
                    setShowDeleteModal(false);
                  }}
                  className="bg-red-600 text-white px-4 py-1 rounded cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SertifikatPage;
