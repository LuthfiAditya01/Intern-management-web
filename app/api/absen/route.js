import { NextResponse } from "next/server";
import { connectPostgreSQL } from "@/libs/postgresql";
import { DaftarHadir, User } from "@/models/index.js";
import { Op } from 'sequelize';

export async function POST(request) {
  try {
    await connectPostgreSQL();
    let waktuAbsen;
    // 1. Terima firebaseUid, bukan userId
    const { userId: firebaseUid, longCordinate, latCordinate, keteranganMasuk, messageText } = await request.json();

    try {
      const waktuResponse = await fetch("http://worldtimeapi.org/api/timezone/Asia/Jakarta");
      const waktuData = await waktuResponse.json();
      waktuAbsen = new Date(waktuData.datetime);
    } catch (error) {
      waktuAbsen = new Date();
    }

    if (!firebaseUid || !longCordinate || !latCordinate || !keteranganMasuk || !messageText) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }
    
    // 2. Cari pengguna di database berdasarkan firebaseUid
    const user = await User.findOne({ where: { firebaseUid: firebaseUid } });
    if (!user) {
        return NextResponse.json({ error: "Pengguna tidak ditemukan di database" }, { status: 404 });
    }

    // 3. Gunakan user.id (UUID) saat membuat record absen
    const absen = await DaftarHadir.create({
      userId: user.id,
      absenDate: waktuAbsen,
      longCordinate,
      latCordinate,
      keteranganMasuk,
      messageText,
    });

    return NextResponse.json({
      message: "Absen berhasil disimpan",
      absen,
      redirectUrl: "/dashboard",
    }, { status: 201 });
  } catch (error) {
    console.error("Error menyimpan absen:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat menyimpan absen" }, { status: 500 });
  }
}

export async function GET(request) {
    try {
        await connectPostgreSQL();
        const { searchParams } = new URL(request.url);
        const firebaseUid = searchParams.get('userId');
        const date = searchParams.get('date');

        if (!firebaseUid) {
            return NextResponse.json({ message: "userId diperlukan" }, { status: 400 });
        }

        const user = await User.findOne({ where: { firebaseUid: firebaseUid } });

        if (!user) {
            return NextResponse.json({ absensi: [] });
        }
        
        const whereClause = {
            userId: user.id 
        };
        
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1);

            whereClause.absenDate = {
                [Op.gte]: startDate,
                [Op.lt]: endDate,
            };
        }

        const absenData = await DaftarHadir.findAll({
            where: whereClause,
            order: [['absenDate', 'DESC']],
        });
        
        return NextResponse.json({ absensi: absenData });

    } catch (error) {
        console.error("Error mengambil data absen:", error);
        return NextResponse.json({ message: "Gagal mengambil data absen", error: error.message }, { status: 500 });
    }
}