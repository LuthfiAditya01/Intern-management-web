"use client";
import React, { useState, useEffect } from "react";
import PreviewSertifikat from "../../components/PreviewSertifikat";

export default function TemplatePage() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showEditElement, setShowEditElement] = useState(false);

  // Update elemen-elemen template dengan posisi centered
  useEffect(() => {
    const defaultTemplate = {
      id: 1,
      nama: "MAGANG/KP/PKL",
      status: "DEFAULT",
      imageUrl: "/uploads/ornamen.png",
      elements: [
        {
          id: 1,
          label: "Judul",
          value: "SERTIFIKAT",
          top: 25,
          left: 50, // Ubah ke 50% untuk center
          fontSize: 25,
          fontWeight: "bold",
          textAlign: "center",
          transform: "translateX(-50%)", // Untuk perfect centering
        },
        {
          id: 2,
          label: "Nomor",
          value: "NO: 0001/BPS/1871/KPG/2025",
          top: 58,
          left: 50,
          fontSize: 15,
          textAlign: "center",
          transform: "translateX(-50%)",
        },
        {
          id: 3,
          label: "Sub Judul",
          value: "diberikan kepada:",
          top: 100,
          left: 50,
          fontSize: 13,
          textAlign: "center",
          transform: "translateX(-50%)",
        },
        {
          id: 4,
          label: "Nama Peserta",
          value: "Nama Peserta",
          top: 123,
          left: 50,
          fontSize: 28,
          fontFamily: "Great Vibes, cursive",
          textAlign: "center",
          transform: "translateX(-50%)",
        },
        {
          id: 5,
          label: "Deskripsi",
          value:
            "atas partisipasinya dalam kegiatan Magang/KP/PKL di lingkungan BPS Kota Bandar Lampung periode 16 Juni sampai 01 Agustus 2025",
          top: 172,
          left: 50,
          fontSize: 13,
          maxWidth: 500, // Perlebar maxWidth
          textAlign: "center",
          transform: "translateX(-50%)",
        },
        {
          id: 6,
          label: "Tanggal",
          value: "Bandar Lampung, 05 Agustus 2025",
          top: 255,
          left: 50,
          fontSize: 13,
          textAlign: "center",
          transform: "translateX(-50%)",
        },
        {
          id: 7,
          label: "Jabatan",
          value: "Kepala Badan Pusat Statistik Kota Bandar Lampung",
          top: 290,
          left: 50,
          fontSize: 13,
          fontWeight: "bold",
          maxWidth: 300,
          textAlign: "center",
          transform: "translateX(-50%)",
        },
        {
          id: 8,
          label: "Nama Penandatangan",
          value: "Dr. Hady Suryono, M.Si",
          top: 388,
          left: 50,
          fontSize: 13,
          fontWeight: "bold",
          textAlign: "center",
          transform: "translateX(-50%)",
        },
      ],
    };

    setTemplates([defaultTemplate]);
  }, []);

  const handleSetDefault = (id) => {
    setTemplates((prevTemplates) =>
      prevTemplates.map((template) =>
        template.id === id
          ? { ...template, status: "DEFAULT" }
          : { ...template, status: "NON" }
      )
    );
  };

  const handleOpenEditElement = (template) => {
    setSelectedTemplate(template);
    setShowEditElement(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedTemplate),
      });

      if (!res.ok) throw new Error("Failed to save template");

      setTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template.id === selectedTemplate.id ? selectedTemplate : template
        )
      );
      setShowEditElement(false);
    } catch (error) {
      console.error("Error saving template:", error);
      alert("Gagal menyimpan template");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Template Sertifikat</h1>

      <div className="bg-green-600 text-white px-4 py-2 rounded-t">
        Data Template
      </div>

      <div className="overflow-x-auto border">
        <table className="w-full table-auto text-sm">
          <thead className="bg-green-200 text-left">
            <tr>
              <th className="px-4 py-2">NO</th>
              <th className="px-4 py-2">TEMPLATE</th>
              <th className="px-4 py-2">STATUS</th>
              <th className="px-4 py-2">NAMA TEMPLATE</th>
              <th className="px-4 py-2">PROCESS</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{template.id}</td>
                <td className="px-4 py-2">
                  {template.imageUrl ? (
                    <img
                      src={template.imageUrl}
                      alt="Template"
                      className="w-40 border"
                    />
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td className="px-4 py-2 font-bold text-green-600">
                  {template.status}
                </td>
                <td className="px-4 py-2">{template.nama}</td>
                <td className="px-4 py-2 space-x-2">
                  {/* <button
                    className="bg-purple-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleSetDefault(template.id)}
                  >
                    ATUR DEFAULT
                  </button> */}
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleOpenEditElement(template)}
                  >
                    ELEMENT
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-2 text-sm text-gray-600">
          Total : {templates.length}, Row (1 - {templates.length})
        </div>
      </div>

      {/* Modal Edit Element */}
      {showEditElement && selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center overflow-auto p-3">
          <div className="bg-white w-full max-w-[1400px] h-[90vh] p-6 rounded shadow-lg flex gap-3 overflow-auto">
            {/* Preview kiri */}
            <div className="w-1/2 flex items-center justify-center">
              <PreviewSertifikat template={selectedTemplate} />
            </div>

            {/* Form element */}
            <div className="w-1/2">
              <h2 className="text-xl font-bold mb-4">EDIT ELEMENT</h2>
              <form onSubmit={handleSubmit}>
                {selectedTemplate.elements
                  .filter((el) =>
                    ["Nomor", "Tanggal", "Jabatan", "Nama Penandatangan"].includes(
                      el.label
                    )
                  )
                  .map((el, index) => (
                    <div key={el.id} className="mb-3">
                      <label className="text-sm">{el.label}</label>
                      <input
                        type="text"
                        value={el.value}
                        onChange={(e) => {
                          const updated = [...selectedTemplate.elements];
                          const targetIdx = updated.findIndex((x) => x.id === el.id);
                          updated[targetIdx].value = e.target.value;
                          setSelectedTemplate({
                            ...selectedTemplate,
                            elements: updated,
                          });
                        }}
                        className="w-full border px-3 py-2 rounded"
                      />
                    </div>
                  ))}

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditElement(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
