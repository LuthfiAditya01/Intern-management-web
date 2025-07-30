"use client";
import React, { useState, useEffect } from "react";
import PreviewSertifikat from "../../components/PreviewSertifikat";
import NavbarGeneral from "@/components/NavbarGeneral";

export default function TemplatePage() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showEditElement, setShowEditElement] = useState(false);

  // Fetch templates dari MongoDB
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch("/api/template");
        const data = await res.json();
        setTemplates(data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchTemplates();
  }, []);

  const handleSetDefault = (id) => {
    setTemplates((prevTemplates) =>
      prevTemplates.map((template) =>
        template._id === id
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedTemplate),
      });

      if (!res.ok) throw new Error("Failed to save template");

      const updatedTemplate = await res.json();
      
      setTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template._id === updatedTemplate._id ? updatedTemplate : template
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
      <NavbarGeneral
        title="Template Sertifikat Peserta Magang"
        subTitle="Atur elemen dalam template sertifikat yang akan digunakan untuk peserta magang"
      />

      <div className="bg-white rounded-xl shadow-lg border md:max-w-7xl mx-auto border-gray-100 p-2.5 md:p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold mb-4">Template Sertifikat</h1>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-t">
              Data Template
            </div>

            <div className="overflow-x-auto border">
              <table className="w-full table-auto text-sm">
                <thead className="bg-blue-200 text-left">
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
                  <tr key={template._id} className="border-t">
                    <td className="px-4 py-2">{index + 1}</td>
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
                    <td className="px-4 py-2 font-bold text-blue-600">
                      {template.status}
                    </td>
                    <td className="px-4 py-2">{template.nama}</td>
                    <td className="px-4 py-2 space-x-2">
                      {/* <button
                        className="bg-purple-500 text-white px-2 py-1 rounded text-xs"
                        onClick={() => handleSetDefault(template._id)}
                      >
                        ATUR DEFAULT
                      </button> */}
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs cursor-pointer"
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
          </div>
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
                    [
                      "Nomor",
                      "Tanggal",
                      "Jabatan",
                      "Nama Penandatangan",
                    ].includes(el.label)
                  )
                  .map((el, index) => (
                    <div key={el.id} className="mb-3">
                      <label className="text-sm">{el.label}</label>
                      <input
                        type="text"
                        value={el.value}
                        onChange={(e) => {
                          const updated = [...selectedTemplate.elements];
                          const targetIdx = updated.findIndex(
                            (x) => x.id === el.id
                          );
                          updated[targetIdx].value = e.target.value;
                          setSelectedTemplate({
                            ...selectedTemplate,
                            elements: updated,
                          });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.preventDefault();
                        }}
                        className="w-full border px-3 py-2 rounded"
                      />
                    </div>
                  ))}

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditElement(false)}
                    className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
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
