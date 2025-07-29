import { NextResponse } from "next/server";
import { connectPostgreSQL } from "../../../libs/postgresql.js";
import { Intern, Quota } from "../../../models/index.js";
import { Op } from 'sequelize';

export async function GET() {
    try {
        await connectPostgreSQL();
        const now = new Date();
        const currentYear = now.getFullYear(); // 2025
        const currentMonth = now.getMonth() + 1; // 7 (karena getMonth() 0-11)

        // 1. Dapatkan tanggal awal dan akhir bulan ini
        const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
        const endOfMonth = new Date(currentYear, currentMonth, 0); // Trik JS: hari ke-0 bulan berikutnya adalah hari terakhir bulan ini

        // 2. Cari kuota yang ditetapkan untuk bulan ini
        const kuotaBulanIni = await Quota.findOne({
            where: { bulan: currentMonth, tahun: currentYear }
        });
        const kuotaMaksimal = kuotaBulanIni ? kuotaBulanIni.jumlahKuota : 0;

        // 3. Hitung jumlah intern yang aktif di bulan ini
        const jumlahSekarang = await Intern.count({
            where: {
                status: 'aktif',
                tanggalMulai: { [Op.lte]: endOfMonth },
                tanggalSelesai: { [Op.gte]: startOfMonth }
            }
        });

        // 4. Kirim hasilnya
        return NextResponse.json({
            kuotaMaksimal,
            jumlahSekarang,
            sisaKuota: kuotaMaksimal - jumlahSekarang
        });

    } catch (error) {
        console.error("GET status-kuota error:", error);
        return NextResponse.json(
            { message: 'Server Error', error: error.message },
            { status: 500 }
        );
    }
}