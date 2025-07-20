'use client';
import React, { useState } from 'react';
// import SertifikatPreview from "@/component   s/SertifikatPreview";
import PreviewSertifikat from "../../components/PreviewSertifikat";

export default function TemplatePage() {
  const [showModal, setShowModal] = useState(false);
  const [showEditElement, setShowEditElement] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({
    namaTemplate: '',
    elemen: '',
    bgDepan: null,
    bgBelakang: null,
  });

    const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const imageUrl = formData.bgDepan ? URL.createObjectURL(formData.bgDepan) : '';

    const newTemplate = {
      id: templates.length + 1,
      nama: formData.namaTemplate,
      elemen: formData.elemen,
      status: templates.length === 0 ? 'DEFAULT' : 'NON',
      imageUrl,
      elements: [
        {
          id: 1,
          label: "Judul",
          value: "Sertifikat",
          top: 25,
          left: 28,
          fontSize: 25,
          fontWeight: "bold",
        },
        {
          id: 2,
          label: "Nomor",
          value: "NO: 0001/BPS/1871/KPG/2025",
          top: 58,
          left: 33,
          fontSize: 15,
        },
        {
          id: 3,
          label: "Sub Judul",
          value: "Diberikan Kepada:",
          top: 100,
          left: 28,
          fontSize: 13,
        },
        {
          id: 4,
          label: "Nama Peserta",
          value: "Zainab Aqilah",
          top: 125,
          left: 33,
          fontSize: 28,
          fontFamily: "Great Vibes, cursive", // font dekoratif, bisa diganti
        },
        {
          id: 5,
          label: "deskripsi",
          value:
            "Telah menyelesaikan Magang/KP/PKL di Badan Pusat Statistik Kota Bandar Lampung 40 (Empat Puluh) Hari Kerja dari tanggal\n16 Juni hingga 01 Agustus 2025",
          top: 172,
          left: 28,
          fontSize: 13,
          maxWidth: 380,
        },
        {
          id: 6,
          label: "Tanggal",
          value: "Bandar Lampung, 05 Agustus 2025",
          top: 255,
          left: 28,
          fontSize: 13,
        },
        {
          id: 7,
          label: "Penandatangan",
          value: "KEPALA BADAN PUSAT STATISTIK KOTA BANDAR LAMPUNG",
          top: 290,
          left: 28,
          fontSize: 13,
          maxWidth: 200,
        },
        {
          id: 8,
          label: "Tertanda",
          value: "Dr. Hady Suryono, M.Si",
          top: 388,
          left: 28,
          fontSize: 13,
          fontWeight:"bold",
        }
      ],
    };

    setTemplates([...templates, newTemplate]);
    setFormData({
      namaTemplate: '',
      elemen: '',
      bgDepan: null,
      bgBelakang: null,
    });
    setShowModal(false);
  };

  const handleOpenEditElement = (template) => {
    setSelectedTemplate(template);
    setShowEditElement(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Template Sertifikat</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
        >
          <span className="text-lg mr-2">＋</span>Add Data
        </button>
      </div>

      <div className="bg-green-600 text-white px-4 py-2 rounded-t">Data Template</div>

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
                    <img src={template.imageUrl} alt="Template" className="w-40 border" />
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td className="px-4 py-2 font-bold text-green-600">{template.status}</td>
                <td className="px-4 py-2">{template.nama}</td>
                <td className="px-4 py-2 space-x-2">
                  <button className="bg-purple-500 text-white px-2 py-1 rounded text-xs">
                    ATUR DEFAULT
                  </button>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleOpenEditElement(template)}
                  >
                    ELEMENT
                  </button>
                  <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                    EDIT TEMPLATE
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
            {templates.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  Belum ada data template
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="p-2 text-sm text-gray-600">
          Total : {templates.length}, Row (1 - {templates.length})
        </div>
      </div>

      {/* Modal Add Data */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Tambah Template Sertifikat</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block mb-1 text-sm">Nama Template</label>
                <input
                  type="text"
                  name="namaTemplate"
                  value={formData.namaTemplate}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Contoh: Template Tiga"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1 text-sm">Elemen</label>
                <input
                  type="text"
                  name="elemen"
                  value={formData.elemen}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Contoh: Nama, Tanggal"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1 text-sm">Upload Background Depan</label>
                <input
                  type="file"
                  name="bgDepan"
                  onChange={handleChange}
                  className="w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm">Upload Background Belakang</label>
                <input
                  type="file"
                  name="bgBelakang"
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
      )}

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
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    
                    // Update data template yang diedit ke dalam array templates
                    setTemplates((prevTemplates) =>
                      prevTemplates.map((template) =>
                        template.id === selectedTemplate.id ? selectedTemplate : template
                      )
                    );

                    setShowEditElement(false);
                  }}
                >

                {/* <div className="mb-3">
                  <label className="text-sm">Nama Element</label>
                  <input
                    type="text"
                    value={selectedTemplate.nama}
                    onChange={(e) =>
                      setSelectedTemplate({ ...selectedTemplate, nama: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div> */}

                {selectedTemplate.elements.map((el, index) => (
                  <div key={el.id} className="mb-3">
                    <label className="text-sm">{el.label}</label>
                    <input
                      type="text"
                      value={el.value}
                      onChange={(e) => {
                        const updated = [...selectedTemplate.elements];
                        updated[index].value = e.target.value;
                        setSelectedTemplate({ ...selectedTemplate, elements: updated });
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
