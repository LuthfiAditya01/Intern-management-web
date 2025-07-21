"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./../app/firebase/config";
import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

export default function DaftarHadirTable() {
  const [data, setData] = useState({ absensi: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [nullLength, setNullLength] = useState(false);
  // const [daftarHadir, setDaftarHadir] = useState(null);
  // setLoading(true);
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const token = await user.getIdTokenResult();
        console.log(token);
        setUserId(token.claims.user_id);
        setRole(token.claims.role);
        console.log("Ini adalah hasil dari token ", token);
      }
    });

    {
      /* 
      {
    "claims": {
        "iss": "https://securetoken.google.com/user-auth-bps",
        "aud": "user-auth-bps",
        "auth_time": 1752749854,
        "user_id": "sRUfilsuJIXeOo8ovYcnqXz8fWL2",
        "sub": "sRUfilsuJIXeOo8ovYcnqXz8fWL2",
        "iat": 1752760585,
        "exp": 1752764185,
        "email": "adit@gmail.com",
        "email_verified": false,
        "firebase": {
            "identities": {
                "email": [
                    "adit@gmail.com"
                ]
            },
            "sign_in_provider": "password"
        }
    },
    "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImE4ZGY2MmQzYTBhNDRlM2RmY2RjYWZjNmRhMTM4Mzc3NDU5ZjliMDEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdXNlci1hdXRoLWJwcyIsImF1ZCI6InVzZXItYXV0aC1icHMiLCJhdXRoX3RpbWUiOjE3NTI3NDk4NTQsInVzZXJfaWQiOiJzUlVmaWxzdUpJWGVPbzhvdlljbnFYejhmV0wyIiwic3ViIjoic1JVZmlsc3VKSVhlT284b3ZZY25xWHo4ZldMMiIsImlhdCI6MTc1Mjc2MDU4NSwiZXhwIjoxNzUyNzY0MTg1LCJlbWFpbCI6ImFkaXRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFkaXRAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.T1qZakpz8oFKv7tk-lLKlnqiU-DcUx4ucsckqmTipMrlx_foQIg5ry0tYDyb609LJTEb00djv4fSU4pIcMbfQgoY8RdU0ygrv9XHJveHI-mR9gkGmAPuF4F19YvySAOb21E2-edgfGkL7vc7iLg1zdYaUPanwV5dcezgeC4Cour0pBcjoqCwoGwJZLyoSwCY4k2s-UO38dpSRtIecqIeUJRaxML4OIIIZzgAvqaW03Xekd3L8J1SegacO1Xy8420cRbRERfJX5nNDZYIbUoflprY6lw1J2Q20Ou67o63kQUk5yR1Vbd4S-Mscbk7Qz2mKrmgOokcOwPwFb9DXdGOGw",
    "authTime": "Thu, 17 Jul 2025 10:57:34 GMT",
    "issuedAtTime": "Thu, 17 Jul 2025 13:56:25 GMT",
    "expirationTime": "Thu, 17 Jul 2025 14:56:25 GMT",
    "signInProvider": "password",
    "signInSecondFactor": null
}
      */
    }

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId || role === null) return; // early guard

    const fetchAll = async () => {
      try {
        const url = "/api/absen";
        const config = role === "admin" ? {} : { params: { userId } };

        console.log(role === "admin" ? "Fetching semua data (admin)…" : `Fetching data untuk user ${userId}…`);

        const response = await axios.get(url, config);
        setData(response.data.absensi?.length ? response.data : setNullLength(true));
      } catch (err) {
        console.error("Fetch error:", err);
        // Bisa tambahin UI toast/error banner di sini
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [userId, role]);

  // // Dummy data untuk daftar hadir
  // const daftarHadirData = [
  //   {
  //     tanggal: "01/06/2023",
  //     waktuPengisian: "08:00",
  //     latitude: "-6.175392",
  //     longitude: "106.827153",
  //     jarakDariPusat: "5 meter",
  //     keteranganMasuk: "Tepat Waktu",
  //     kegiatan: "Meeting dengan Tim IT",
  //   },
  //   {
  //     tanggal: "02/06/2023",
  //     waktuPengisian: "07:45",
  //     latitude: "-6.175401",
  //     longitude: "106.827160",
  //     jarakDariPusat: "7 meter",
  //     keteranganMasuk: "Tepat Waktu",
  //     kegiatan: "Pengembangan Aplikasi Mobile",
  //   },
  //   {
  //     tanggal: "05/06/2023",
  //     waktuPengisian: "08:15",
  //     latitude: "-6.175385",
  //     longitude: "106.827148",
  //     jarakDariPusat: "10 meter",
  //     keteranganMasuk: "Terlambat",
  //     kegiatan: "Maintenance Database",
  //   },
  //   {
  //     tanggal: "06/06/2023",
  //     waktuPengisian: "07:50",
  //     latitude: "-6.175390",
  //     longitude: "106.827155",
  //     jarakDariPusat: "4 meter",
  //     keteranganMasuk: "Tepat Waktu",
  //     kegiatan: "Pengujian Sistem",
  //   },
  //   {
  //     tanggal: "07/06/2023",
  //     waktuPengisian: "08:05",
  //     latitude: "-6.175395",
  //     longitude: "106.827150",
  //     jarakDariPusat: "8 meter",
  //     keteranganMasuk: "Tepat Waktu",
  //     kegiatan: "Pembuatan Laporan Mingguan",
  //   },
  // ];
  {
    /*
      longitude : -5.4282987
      latitude : 105.2734644,21
        return (
    <div className="w-full overflow-x-auto">
      {!data.absensi ? (
        const [isLoading, setIsLoading] = useState(true);

      */
  }
  return (
    <div className="w-full overflow-x-auto">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      ) : nullLength ? (
        <div className="flex justify-center items-center min-h-screen">
          <h1>Anda belum memiliki riwayat daftar hadir sama sekali</h1>
        </div>
      ) : (
        <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nama</th>
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
            {data.absensi.map((item, index) => {
              const absenDate = new Date(item.absenDate);
              const date = absenDate.getDate();
              const month = absenDate.getMonth();
              const monthStr = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
              const year = absenDate.getFullYear();
              const hours = absenDate.getHours().toString().padStart(2, '0');
              const minute = absenDate.getMinutes().toString().padStart(2, '0');
              return (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 whitespace-break-spaces text-sm text-gray-900">{`${date} ${monthStr[month]} ${year}`}</td>
                  <td className="px-6 py-4 whitespace-break-spaces text-sm text-gray-900">{"Ini adalah tempat untuk nama"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${hours}:${minute}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.latCordinate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.longCordinate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jarakDariPusat}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.keteranganMasuk}</td>
                  <td className="px-6 py-4 whitespace-break-spaces text-sm text-gray-900">{item.messageText}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
