import { NextResponse } from "next/server";
import { connectPostgreSQL } from "@/libs/postgresql";
import { Izin, User } from "@/models/index.js";
import { Op } from 'sequelize';

export async function POST(request) {
  try {
    await connectPostgreSQL();
    let waktuIzin;
    const { userId, keteranganIzin, messageIzin, linkBukti } = await request.json();

    try {
      const waktuResponse = await fetch("http://worldtimeapi.org/api/timezone/Asia/Jakarta");
      const waktuData = await waktuResponse.json();
      waktuIzin = new Date(waktuData.datetime);
    } catch (error) {
      waktuIzin = new Date();
    }

    if (!userId || !keteranganIzin || !messageIzin) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const izin = await Izin.create({
      userId,
      izinDate: waktuIzin,
      keteranganIzin,
      messageIzin,
      linkBukti,
    });

    return NextResponse.json({
      message: "Izin berhasil disimpan",
      izin,
      redirectUrl: "/dashboard",
    }, { status: 201 });
  } catch (error) {
    console.error("Error menyimpan izin:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat menyimpan izin" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectPostgreSQL();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const date = searchParams.get("date");

    let whereClause = {};
    if (userId) {
      whereClause.userId = userId;
    }
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      whereClause.izinDate = { [Op.gte]: startDate, [Op.lt]: endDate };
    }

    // Ambil izin dan join ke User untuk nama
    const izinData = await Izin.findAll({
      where: whereClause,
      order: [['izinDate', 'DESC']],
      include: [{
        model: User,
        as: 'izinUser',
        attributes: ['username', 'email'],
        required: false,
      }],
    });

    // Format hasil agar ada nama
    const izinWithNames = izinData.map((izin) => {
      const izinObj = izin.toJSON();
      izinObj.nama = izinObj.izinUser?.username || "Nama tidak Ditemukan";
      return izinObj;
    });

    return NextResponse.json({ izin: izinWithNames }, { status: 200 });
  } catch (error) {
    console.error("Error mengambil data izin:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data izin" }, { status: 500 });
  }
}
