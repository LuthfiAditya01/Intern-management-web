"use client";
import { useState, useEffect, useRef } from "react";
import PreviewSertifikat from "@/components/PreviewSertifikat";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useReactToPrint } from "react-to-print";

// Import styles module
import styles from "./sertifikatSaya.module.css";
// Import global print styles
import "./print.css";

export default function SertifikatSaya() {
  const [sertifikat, setSertifikat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [userInternData, setUserInternData] = useState(null);
  const sertifikatRef = useRef(null);

  // Fungsi untuk mendownload sertifikat sebagai gambar JPG
  // const handleDownloadImage = async () => {
  //   if (!sertifikatRef.current) {
  //     alert('Tidak dapat mengunduh sertifikat. Silakan coba lagi.');
  //     return;
  //   }

  //   try {
  //     setDownloading(true);

  //     // Tunggu semua gambar termuat dengan sempurna
  //     const images = sertifikatRef.current.querySelectorAll('img');
  //     const imagePromises = Array.from(images).map(img => {
  //       return new Promise((resolve) => {
  //         if (img.complete && img.naturalWidth !== 0) {
  //           resolve();
  //         } else {
  //           img.onload = resolve;
  //           img.onerror = resolve; // Tetap resolve meskipun ada error
  //         }
  //       });
  //     });

  //     await Promise.all(imagePromises);

  //     // Tunggu sebentar untuk memastikan render selesai
  //     await new Promise(resolve => setTimeout(resolve, 1000));

  //     // Buat canvas dari elemen sertifikat
  //     const canvas = await html2canvas(sertifikatRef.current, {
  //       scale: 3, // Tingkatkan kualitas (resolusi 3x untuk hasil lebih crisp)
  //       useCORS: true, // Izinkan gambar cross-origin
  //       allowTaint: true,
  //       backgroundColor: '#ffffff', // Set background putih agar tidak transparan
  //       logging: false,
  //       foreignObjectRendering: true, // Untuk render yang lebih baik
  //       imageTimeout: 15000, // Timeout untuk loading gambar
  //       removeContainer: true,
  //     });

  //     // Konversi canvas ke blob/URL data dengan kualitas maksimal
  //     const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

  //     // Buat elemen <a> untuk download
  //     const link = document.createElement('a');
  //     link.download = `Sertifikat_${userInternData?.nama || 'Peserta'}_BPS.jpg`;
  //     link.href = dataUrl;
  //     link.click();

  //   } catch (error) {
  //     console.error("Error saat mengunduh sertifikat:", error);
  //     alert('Gagal mengunduh sertifikat. Silakan coba lagi.');
  //   } finally {
  //     setDownloading(false);
  //   }
  // };

  // Konfigurasi untuk mencetak hanya bagian sertifikat (sebagai alternatif)
  const handlePrint = useReactToPrint({
    contentRef: sertifikatRef,
    documentTitle: `Sertifikat_${userInternData?.nama || "Peserta"}_BPS`,
    pageStyle: `
      @page {
        size: landscape;
        margin: 0;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        html {
          zoom: 160%;
          -ms-zoom: 160%;
          -webkit-zoom: 160%;
        }
        @-moz-document url-prefix() {
          body {
            transform: scale(1.6);
            transform-origin: top left;
          }
        }
      }
    `,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        if (sertifikat && sertifikatRef.current) {
          resolve();
        } else {
          console.error("Tidak ada sertifikat yang dapat dicetak");
        }
      });
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Tunggu hingga auth state siap
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            // Dapatkan data intern berdasarkan user.uid
            const res = await fetch("/api/intern");
            const data = await res.json();

            // Cari data intern yang cocok dengan user saat ini
            const myInternData = data.interns.find(
              (intern) => intern.userId === user.uid
            );

            if (myInternData && myInternData.isSertifikatVerified) {
              setUserInternData(myInternData);
              // Dapatkan template untuk sertifikat
              await generateCertificate(myInternData);
            } else {
              console.log(
                "Sertifikat belum diverifikasi atau data tidak ditemukan"
              );
            }
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fungsi untuk generate sertifikat dari template
  const generateCertificate = async (internData) => {
    try {
      const res = await fetch("/api/template");
      const templates = await res.json();

      if (Array.isArray(templates) && templates.length > 0) {
        // Ambil template DEFAULT
        const defaultTemplate = templates.find(t => t.status === "DEFAULT") || templates[0];
        
        // Format tanggal untuk tampilan sertifikat (contoh: 01 Januari 2025)
        const formatTanggalIndonesia = (dateStr) => {
          if (!dateStr) return "-";
          const date = new Date(dateStr);
          const options = { day: "numeric", month: "long", year: "numeric" };
          return date.toLocaleDateString("id-ID", options);
        };

        const tanggalMulaiFormatted = formatTanggalIndonesia(
          internData.tanggalMulai
        );
        const tanggalSelesaiFormatted = formatTanggalIndonesia(
          internData.tanggalSelesai
        );

        // Tanggal saat ini untuk "Bandar Lampung, tanggal saat ini"
        const today = new Date();
        const tanggalSaatIni = formatTanggalIndonesia(today);

        // Hitung lama magang dalam bulan atau hari
        const lamaMagang = calculateDuration(
          internData.tanggalMulai,
          internData.tanggalSelesai
        );

        // Customize template dengan data intern
        const customizedTemplate = {
          ...defaultTemplate,
          elements: defaultTemplate.elements.map((el) => {
            // Customize fields based on the element ID and label
            if (el.label === "Nama Peserta") {
              return { ...el, value: internData.nama };
            } else if (el.id === 5 && el.label === "Deskripsi") {
              return {
                ...el,
                value: `atas partisipasinya dalam kegiatan Magang/KP/PKL di lingkungan BPS Kota Bandar Lampung periode ${tanggalMulaiFormatted} sampai ${tanggalSelesaiFormatted}`,
              };
            } else if (el.id === 6 && el.label === "Tanggal") {
              return { ...el, value: `Bandar Lampung, ${tanggalSaatIni}` };
            } else if (
              el.label === "Tanggal Mulai" ||
              el.label.includes("mulai")
            ) {
              return { ...el, value: tanggalMulaiFormatted };
            } else if (
              el.label === "Tanggal Selesai" ||
              el.label.includes("selesai")
            ) {
              return { ...el, value: tanggalSelesaiFormatted };
            } else if (
              el.label === "Lama Magang" ||
              el.label.includes("lama")
            ) {
              return { ...el, value: lamaMagang };
            } else if (el.label === "Program Studi" || el.label === "Prodi") {
              return { ...el, value: internData.prodi };
            } else if (
              el.label === "Sekolah" ||
              el.label === "Perguruan Tinggi" ||
              el.label.includes("kampus")
            ) {
              return { ...el, value: internData.kampus };
            }
            return el;
          }),
        };

        setSertifikat(customizedTemplate);
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
    }
  };

  // Helper function untuk menghitung durasi magang
  const calculateDuration = (start, end) => {
    if (!start || !end) return "-";

    const startDate = new Date(start);
    const endDate = new Date(end);

    // Hitung selisih dalam hari
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 30) {
      const months = Math.floor(diffDays / 30);
      return `${months} bulan`;
    } else {
      return `${diffDays} hari`;
    }
  };

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
          <p className="text-gray-600 mb-4">
            {userInternData
              ? userInternData.isSertifikatVerified
                ? "Sedang memuat sertifikat..."
                : "Sertifikat Anda belum diverifikasi oleh admin."
              : "Data magang Anda tidak ditemukan."}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Sertifikat Magang
          </h1>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors"
          >
            Kembali
          </button>
        </div>

        <div className="mb-6">
          <div
            ref={sertifikatRef}
            className={`print-container ${styles.printWrapper}`}
            style={{ margin: "0 auto" }}
          >
            <PreviewSertifikat template={sertifikat} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handlePrint}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11V3m0 8a4 4 0 100 8 4 4 0 000-8z"
              />
            </svg>
            Download PDF
          </button>

          {userInternData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4 sm:mt-0">
              <p className="text-green-700">
                <span className="font-semibold">Status: </span>
                Terverifikasi ✓
              </p>
              <p className="text-sm text-green-600 mt-1">
                Sertifikat ini telah diverifikasi oleh admin BPS
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
