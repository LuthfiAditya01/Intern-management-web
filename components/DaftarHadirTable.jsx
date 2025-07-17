"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

export default function DaftarHadirTable() {
  const [data, setData] = useState(null);
  // const [daftarHadir, setDaftarHadir] = useState(null);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       setUser(user);
  //       const token = await user.getIdTokenResult();
  //       const admin = token.claims.role === "admin";
  //       setIsAdmin(admin);
  //       if (token.claims.role === "admin") {
  //         console.log("👑 Ini admin");
  //       } else {
  //         console.log("🙅‍♂️ Bukan admin");
  //       }
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/absen");
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error mengambil data daftar hadir : ", error);
      }
    };

    fetchData(); // jangan lupa dipanggil!
  }, []);

  // Dummy data untuk daftar hadir
  const daftarHadirData = [
    {
      tanggal: "01/06/2023",
      waktuPengisian: "08:00",
      latitude: "-6.175392",
      longitude: "106.827153",
      jarakDariPusat: "5 meter",
      keteranganMasuk: "Tepat Waktu",
      kegiatan: "Meeting dengan Tim IT",
    },
    {
      tanggal: "02/06/2023",
      waktuPengisian: "07:45",
      latitude: "-6.175401",
      longitude: "106.827160",
      jarakDariPusat: "7 meter",
      keteranganMasuk: "Tepat Waktu",
      kegiatan: "Pengembangan Aplikasi Mobile",
    },
    {
      tanggal: "05/06/2023",
      waktuPengisian: "08:15",
      latitude: "-6.175385",
      longitude: "106.827148",
      jarakDariPusat: "10 meter",
      keteranganMasuk: "Terlambat",
      kegiatan: "Maintenance Database",
    },
    {
      tanggal: "06/06/2023",
      waktuPengisian: "07:50",
      latitude: "-6.175390",
      longitude: "106.827155",
      jarakDariPusat: "4 meter",
      keteranganMasuk: "Tepat Waktu",
      kegiatan: "Pengujian Sistem",
    },
    {
      tanggal: "07/06/2023",
      waktuPengisian: "08:05",
      latitude: "-6.175395",
      longitude: "106.827150",
      jarakDariPusat: "8 meter",
      keteranganMasuk: "Tepat Waktu",
      kegiatan: "Pembuatan Laporan Mingguan",
    },
  ];
  {
    /*
      longitude : -5.4282987
      latitude : 105.2734644,21
      */
  }
  return (
    <div className="w-full">
      {data.length === 0 ? (
        <p>Waduh, datanya gaada:D</p>
      ) : (
        <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Waktu Pengisian</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Titik Latitude</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Titik Longitude</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Jarak dari Titik Pusat</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Keterangan Masuk</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Kegiatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {daftarHadirData.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tanggal}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.waktuPengisian}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.latitude}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.longitude}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jarakDariPusat}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.keteranganMasuk}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kegiatan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
