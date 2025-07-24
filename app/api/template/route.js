// app/api/template/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Template from '../../../models/Template';

let templates = [{
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
        value: "Nama Peserta",
        top: 125,
        left: 33,
        fontSize: 28,
        fontFamily: "Great Vibes, cursive",
      },
      {
        id: 5,
        label: "Deskripsi",
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
        label: "Jabatan",
        value: "KEPALA BADAN PUSAT STATISTIK KOTA BANDAR LAMPUNG",
        top: 290,
        left: 28,
        fontSize: 13,
        maxWidth: 200,
      },
      {
        id: 8,
        label: "Nama Penandatangan",
        value: "Dr. Hady Suryono, M.Si",
        top: 388,
        left: 28,
        fontSize: 13,
        fontWeight: "bold",
      },
    ],
  }
];

export async function GET() {
return NextResponse.json(templates);
}

export async function POST(request) {
  const template = await request.json();
  templates = templates.map(t => 
    t.id === template.id ? template : t
  );
  return NextResponse.json(template);
}
