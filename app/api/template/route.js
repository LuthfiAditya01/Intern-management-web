// app/api/template/route.js
import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Template from "../../../models/Template";

let templates = [
  {
    id: 1,
    nama: "MAGANG/KP/PKL",
    status: "DEFAULT",
    imageUrl: "/uploads/ornamen.png",
    elements: [
      {
        id: 1,
        label: "Judul",
        value: "SERTIFIKAT",
        top: 47,
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
        top: 80,
        left: 50,
        fontSize: 15,
        textAlign: "center",
        transform: "translateX(-50%)",
      },
      {
        id: 3,
        label: "Sub Judul",
        value: "diberikan kepada:",
        top: 122,
        left: 50,
        fontSize: 13,
        textAlign: "center",
        transform: "translateX(-50%)",
      },
      {
        id: 4,
        label: "Nama Peserta",
        value: "Nama Peserta",
        top: 145,
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
        top: 194,
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
        top: 277,
        left: 50,
        fontSize: 13,
        textAlign: "center",
        transform: "translateX(-50%)",
      },
      {
        id: 7,
        label: "Jabatan",
        value: "Kepala Badan Pusat Statistik Kota Bandar Lampung",
        top: 312,
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
        top: 410,
        left: 50,
        fontSize: 13,
        fontWeight: "bold",
        textAlign: "center",
        transform: "translateX(-50%)",
      },
    ],
  },
];

export async function GET() {
  return NextResponse.json(templates);
}

export async function POST(request) {
  const template = await request.json();

  const adjustedTemplate = {
    ...template,
    elements: template.elements.map((el) => ({
      ...el,
      top: el.top + 20,
    })),
  };

  templates = templates.map((t) =>
    t.id === template.id ? adjustedTemplate : t
  );
  return NextResponse.json(adjustedTemplate);
}
