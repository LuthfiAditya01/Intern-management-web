"use client";
import { useState, useEffect } from "react";
import PreviewSertifikat from "@/components/PreviewSertifikat";

export default function SertifikatSaya() {
  const [sertifikat, setSertifikat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSertifikat = async () => {
      try {
        // Get user NIM first
        const userRes = await fetch("/api/me");
        const userData = await userRes.json();

        if (userData.nim) {
          // Then get certificate
          const res = await fetch(`/api/user-sertifikat?nim=${userData.nim}`);
          const data = await res.json();

          if (data.hasCertificate) {
            setSertifikat(data.certificate);
          }
        }
      } catch (error) {
        console.error("Error fetching certificate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSertifikat();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!sertifikat) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Sertifikat Belum Tersedia
          </h2>
          <p className="text-gray-600">
            Silakan hubungi admin untuk informasi lebih lanjut.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Sertifikat Magang</h1>
        <div className="mb-6">
          <PreviewSertifikat template={sertifikat} />
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}