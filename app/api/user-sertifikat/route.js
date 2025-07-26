import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { nama, nis, idMagang, tanggalMulai, tanggalSelesai, lamaMagang } = body;

    const user = await User.findOne({ nis });

    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
    }

    await User.updateOne(
      { nis },
      {
        $push: {
          sertifikatMagang: {
            idMagang,
            nama,
            tanggalMulai,
            tanggalSelesai,
            lamaMagang,
            ditambahkanPada: new Date(),
          },
        },
      }
    );

    return NextResponse.json({ message: "Berhasil ditambahkan ke akun user" }, { status: 200 });
  } catch (error) {
    console.error("❌ Gagal menambahkan ke akun user:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
